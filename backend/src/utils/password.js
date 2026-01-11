import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

export const hashPassword = async (plain) => {
  return bcrypt.hash(plain, env.bcrypt.saltRounds);
};

export const verifyPassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};
