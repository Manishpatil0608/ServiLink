import { Joi, Segments } from '../../middleware/validate.js';

export const registerValidator = {
  [Segments.BODY]: Joi.object({
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9+-]{8,20}$/).required(),
    password: Joi.string().min(8).max(64).required(),
    role: Joi.string().valid('customer', 'provider', 'service_admin', 'super_admin').required(),
    avatarUrl: Joi.string().uri().optional(),
    businessName: Joi.when('role', {
      is: 'provider',
      then: Joi.string().max(191).required(),
      otherwise: Joi.string().max(191).optional()
    }),
    department: Joi.when('role', {
      is: 'service_admin',
      then: Joi.string().min(2).max(191).required(),
      otherwise: Joi.string().max(191).allow('', null).optional()
    }),
    adminNotes: Joi.when('role', {
      is: 'super_admin',
      then: Joi.string().min(4).max(255).required(),
      otherwise: Joi.string().max(255).allow('', null).optional()
    })
  })
};

export const loginValidator = {
  [Segments.BODY]: Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required()
  })
};

export const refreshValidator = {
  [Segments.BODY]: Joi.object({
    refreshToken: Joi.string().length(64).required()
  })
};

export const logoutValidator = {
  [Segments.BODY]: Joi.object({
    refreshToken: Joi.string().length(64).required()
  })
};

export const googleLoginValidator = {
  [Segments.BODY]: Joi.object({
    credential: Joi.string().min(10).required()
  })
};

export const forgotPasswordValidator = {
  [Segments.BODY]: Joi.object({
    identifier: Joi.string().required()
  })
};

export const resetPasswordValidator = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().length(64).required(),
    password: Joi.string().min(8).max(64).required()
  })
};
