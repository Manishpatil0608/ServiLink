import { findById } from './user.repository.js';
import { db } from '../../config/database.js';
import { AppError } from '../../utils/appError.js';

export const getCurrentUser = async (userId) => {
  const user = await findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const wallet = await db('wallets').select('balance', 'updated_at').where('user_id', userId).first();

  return {
    user,
    wallet: wallet || { balance: 0, updated_at: null }
  };
};
