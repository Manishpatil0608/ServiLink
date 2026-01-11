import { db } from '../../config/database.js';

export const storeRefreshToken = async (payload, trx = db) => {
  const record = {
    user_id: payload.userId,
    token_hash: payload.tokenHash,
    expires_at: payload.expiresAt,
    created_at: db.fn.now(),
    updated_at: db.fn.now()
  };
  await trx('refresh_tokens').insert(record);
};

export const findRefreshToken = async (tokenHash, trx = db) => {
  return trx('refresh_tokens')
    .select('*')
    .where({ token_hash: tokenHash })
    .andWhere(function () {
      this.whereNull('revoked_at').orWhere('revoked_at', '>', db.fn.now());
    })
    .first();
};

export const revokeRefreshToken = async (tokenHash, reason = 'logout', trx = db) => {
  await trx('refresh_tokens')
    .where({ token_hash: tokenHash })
    .update({ revoked_at: db.fn.now(), revoked_reason: reason, updated_at: db.fn.now() });
};

export const revokeUserRefreshTokens = async (userId, trx = db) => {
  await trx('refresh_tokens')
    .where({ user_id: userId })
    .whereNull('revoked_at')
    .update({ revoked_at: db.fn.now(), revoked_reason: 'rotation', updated_at: db.fn.now() });
};

export const createPasswordResetToken = async ({ userId, tokenHash, expiresAt }, trx = db) => {
  await trx('password_reset_tokens').insert({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt,
    created_at: db.fn.now(),
    updated_at: db.fn.now()
  });
};

export const findPasswordResetToken = async (tokenHash, trx = db) => {
  return trx('password_reset_tokens')
    .select('*')
    .where({ token_hash: tokenHash })
    .first();
};

export const markPasswordResetTokenUsed = async (tokenHash, trx = db) => {
  await trx('password_reset_tokens')
    .where({ token_hash: tokenHash })
    .update({ used_at: db.fn.now(), updated_at: db.fn.now() });
};

export const deleteExistingResetTokens = async (userId, trx = db) => {
  await trx('password_reset_tokens')
    .where({ user_id: userId })
    .whereNull('used_at')
    .delete();
};
