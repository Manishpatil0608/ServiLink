import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const code = err.code || 'UNEXPECTED_ERROR';

  if (statusCode >= 500) {
    logger.error({ err, path: req.path, method: req.method, code }, err.message);
  } else {
    logger.warn({ err, path: req.path, method: req.method, code }, err.message);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message,
      details: err.details || null
    }
  });
};
