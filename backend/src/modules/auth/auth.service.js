import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../../utils/appError.js';
import { withTransaction } from '../../config/database.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { durationToMs } from '../../utils/time.js';
import { storeRefreshToken, findRefreshToken, revokeRefreshToken, revokeUserRefreshTokens, createPasswordResetToken, findPasswordResetToken, markPasswordResetTokenUsed, deleteExistingResetTokens } from './auth.repository.js';
import { findByEmail, findByPhone, findById, createUser, createProfile, createWallet, ensureProviderRecord, ensureServiceAdminRecord, ensureSuperAdminRecord, updateLastLogin, updatePasswordHash } from '../users/user.repository.js';
import { env } from '../../config/env.js';
import { getCurrentUser } from '../users/user.service.js';
import { logger } from '../../utils/logger.js';

const allowedRegistrationRoles = ['customer', 'provider', 'service_admin', 'super_admin'];
let googleClient = env.google.clientId ? new OAuth2Client(env.google.clientId) : null;

const issueTokens = async (user) => {
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken();
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt = new Date(Date.now() + durationToMs(env.jwt.refreshTtl));
  await storeRefreshToken({ userId: user.id, tokenHash, expiresAt });
  return { accessToken, refreshToken };
};

export const register = async (payload) => {
  if (!allowedRegistrationRoles.includes(payload.role)) {
    throw new AppError('Unsupported registration role', 400, 'AUTH_INVALID_ROLE');
  }

  const existingByEmail = await findByEmail(payload.email);
  if (existingByEmail) {
    throw new AppError('Email already registered', 409, 'AUTH_EMAIL_EXISTS');
  }

  const existingByPhone = await findByPhone(payload.phone);
  if (existingByPhone) {
    throw new AppError('Phone already registered', 409, 'AUTH_PHONE_EXISTS');
  }

  const passwordHash = await hashPassword(payload.password);

  const userId = await withTransaction(async (trx) => {
    const newUserId = await createUser({
      email: payload.email,
      phone: payload.phone,
      password_hash: passwordHash,
      role: payload.role,
      status: 'active'
    }, trx);

    await createProfile({
      user_id: newUserId,
      first_name: payload.firstName,
      last_name: payload.lastName,
      avatar_url: payload.avatarUrl || null
    }, trx);

    await createWallet({ user_id: newUserId }, trx);

    switch (payload.role) {
      case 'provider':
        await ensureProviderRecord({
          user_id: newUserId,
          business_name: payload.businessName || `${payload.firstName} ${payload.lastName}`
        }, trx);
        break;
      case 'service_admin':
        await ensureServiceAdminRecord({
          user_id: newUserId,
          department: payload.department || null
        }, trx);
        break;
      case 'super_admin':
        await ensureSuperAdminRecord({
          user_id: newUserId,
          notes: payload.adminNotes || null
        }, trx);
        break;
      default:
        break;
    }

    return newUserId;
  });

  const user = await findById(userId);
  const tokens = await issueTokens(user);
  const profile = await getCurrentUser(userId);

  return { ...tokens, ...profile };
};

export const login = async ({ identifier, password }) => {
  const user = identifier.includes('@') ? await findByEmail(identifier) : await findByPhone(identifier);
  if (!user) {
    throw new AppError('Invalid credentials', 401, 'AUTH_INVALID_CREDENTIALS');
  }

  if (user.status !== 'active') {
    throw new AppError('Account is not active', 403, 'AUTH_INACTIVE');
  }

  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401, 'AUTH_INVALID_CREDENTIALS');
  }

  await updateLastLogin(user.id);
  await revokeUserRefreshTokens(user.id);
  const tokens = await issueTokens(user);
  const profile = await getCurrentUser(user.id);

  return { ...tokens, ...profile };
};

export const refreshSession = async ({ refreshToken }) => {
  if (!verifyRefreshToken(refreshToken)) {
    throw new AppError('Invalid refresh token', 401, 'AUTH_INVALID_REFRESH_TOKEN');
  }

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const savedToken = await findRefreshToken(tokenHash);
  if (!savedToken) {
    throw new AppError('Refresh token expired', 401, 'AUTH_REFRESH_NOT_FOUND');
  }

  if (new Date(savedToken.expires_at) <= new Date()) {
    await revokeRefreshToken(tokenHash, 'expired');
    throw new AppError('Refresh token expired', 401, 'AUTH_REFRESH_EXPIRED');
  }

  const fullUser = await findById(savedToken.user_id);
  if (!fullUser) {
    await revokeRefreshToken(tokenHash, 'user_missing');
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  await revokeRefreshToken(tokenHash, 'rotated');
  const tokens = await issueTokens(fullUser);
  const profile = await getCurrentUser(fullUser.id);

  return { ...tokens, ...profile };
};

export const logout = async ({ refreshToken }) => {
  if (!refreshToken) {
    return;
  }
  if (!verifyRefreshToken(refreshToken)) {
    return;
  }
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await revokeRefreshToken(tokenHash, 'logout');
};

export const requestPasswordReset = async ({ identifier }) => {
  if (!identifier) {
    throw new AppError('Identifier is required', 400, 'AUTH_RESET_IDENTIFIER_REQUIRED');
  }

  const trimmed = identifier.trim();
  const lookupValue = trimmed.includes('@') ? trimmed.toLowerCase() : trimmed;
  const user = trimmed.includes('@') ? await findByEmail(lookupValue) : await findByPhone(lookupValue);

  const genericResponse = { message: 'If that account exists, a reset link has been sent.' };

  if (!user || user.status !== 'active') {
    return genericResponse;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await withTransaction(async (trx) => {
    await deleteExistingResetTokens(user.id, trx);
    await createPasswordResetToken({ userId: user.id, tokenHash, expiresAt }, trx);
  });

  logger.info({ userId: user.id }, 'Password reset token issued');

  if (env.nodeEnv === 'development') {
    return { ...genericResponse, resetToken: rawToken };
  }

  return genericResponse;
};

export const resetPassword = async ({ token, password }) => {
  if (!token || !password) {
    throw new AppError('Token and password are required', 400, 'AUTH_RESET_INVALID_PAYLOAD');
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const storedToken = await findPasswordResetToken(tokenHash);

  if (!storedToken) {
    throw new AppError('Reset token is invalid or has expired', 400, 'AUTH_RESET_TOKEN_INVALID');
  }

  if (storedToken.used_at) {
    throw new AppError('Reset token is invalid or has expired', 400, 'AUTH_RESET_TOKEN_USED');
  }

  if (new Date(storedToken.expires_at) <= new Date()) {
    throw new AppError('Reset token is invalid or has expired', 400, 'AUTH_RESET_TOKEN_EXPIRED');
  }

  const passwordHash = await hashPassword(password);

  await withTransaction(async (trx) => {
    await updatePasswordHash(storedToken.user_id, passwordHash, trx);
    await markPasswordResetTokenUsed(tokenHash, trx);
    await revokeUserRefreshTokens(storedToken.user_id, trx);
  });

  logger.info({ userId: storedToken.user_id }, 'Password reset completed');

  return { message: 'Password updated successfully' };
};

export const loginWithGoogle = async ({ credential }) => {
  if (!credential) {
    throw new AppError('Missing Google credential', 400, 'AUTH_GOOGLE_MISSING_CREDENTIAL');
  }

  if (!env.google.clientId) {
    throw new AppError('Google sign-in is not configured', 503, 'AUTH_GOOGLE_DISABLED');
  }

  if (!googleClient) {
    googleClient = new OAuth2Client(env.google.clientId);
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: env.google.clientId });
    payload = ticket.getPayload();
  } catch (error) {
    throw new AppError('Invalid Google credential', 400, 'AUTH_GOOGLE_INVALID');
  }

  if (!payload?.email) {
    throw new AppError('Google account is missing email', 400, 'AUTH_GOOGLE_EMAIL_REQUIRED');
  }

  if (!payload.email_verified) {
    throw new AppError('Google account email is not verified', 403, 'AUTH_GOOGLE_EMAIL_NOT_VERIFIED');
  }

  const email = payload.email.toLowerCase();
  let user = await findByEmail(email);

  if (!user) {
    const randomSecret = crypto.randomBytes(32).toString('hex');
    const passwordHash = await hashPassword(randomSecret);
    const fallbackPhone = `G${(payload.sub || crypto.randomBytes(8).toString('hex')).slice(0, 19)}`;
    const firstName = payload.given_name || payload.name?.split(' ')?.[0] || 'Google';
    const lastName = payload.family_name || payload.name?.split(' ')?.slice(1)?.join(' ') || 'User';

    const userId = await withTransaction(async (trx) => {
      const newUserId = await createUser({
        email,
        phone: fallbackPhone,
        password_hash: passwordHash,
        role: 'customer',
        status: 'active'
      }, trx);

      await createProfile({
        user_id: newUserId,
        first_name: firstName,
        last_name: lastName,
        avatar_url: payload.picture || null
      }, trx);

      await createWallet({ user_id: newUserId }, trx);

      return newUserId;
    });

    user = await findById(userId);
  } else {
    if (user.status !== 'active') {
      throw new AppError('Account is not active', 403, 'AUTH_INACTIVE');
    }
    user = await findById(user.id);
  }

  await revokeUserRefreshTokens(user.id);
  const tokens = await issueTokens(user);
  const profile = await getCurrentUser(user.id);

  return { ...tokens, ...profile };
};
