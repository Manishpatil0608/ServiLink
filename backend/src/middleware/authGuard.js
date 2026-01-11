import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

export const authGuard = (roles = []) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return next(new AppError('Authentication token missing', 401, 'AUTH_TOKEN_MISSING'));
    }

    try {
      const payload = jwt.verify(token, env.jwt.accessSecret);
      req.user = payload;

      if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
        throw new AppError('Forbidden', 403, 'AUTH_FORBIDDEN');
      }

      return next();
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError('Invalid or expired token', 401, 'AUTH_INVALID_TOKEN'));
    }
  };
};
