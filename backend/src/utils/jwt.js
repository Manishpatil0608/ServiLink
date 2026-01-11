import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

export const signAccessToken = (payload) => {
  return jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessTtl });
};

export const signRefreshToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const verifyRefreshToken = (token) => {
  return Boolean(token) && token.length === 64;
};
