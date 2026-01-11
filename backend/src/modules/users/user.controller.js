import { getCurrentUser } from './user.service.js';
import { sendSuccess } from '../../utils/response.js';

export const getMe = async (req, res, next) => {
  try {
    const result = await getCurrentUser(req.user.sub);
    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
};
