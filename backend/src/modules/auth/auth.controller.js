import { register, login, refreshSession, logout, loginWithGoogle, requestPasswordReset, resetPassword } from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';

export const registerController = async (req, res, next) => {
  try {
    const result = await register(req.body);
    return sendSuccess(res, result, null, 201);
  } catch (error) {
    return next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await login(req.body);
    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const result = await refreshSession(req.body);
    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    await logout(req.body);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const googleLoginController = async (req, res, next) => {
  try {
    const result = await loginWithGoogle(req.body);
    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
};

export const requestPasswordResetController = async (req, res, next) => {
  try {
    const result = await requestPasswordReset(req.body);
    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const result = await resetPassword(req.body);
    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
};
