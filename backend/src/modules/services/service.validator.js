import { Joi, Segments } from '../../middleware/validate.js';

export const listServicesValidator = {
  [Segments.QUERY]: Joi.object({
    categoryId: Joi.number().integer().positive().optional(),
    categorySlug: Joi.string().max(150).optional(),
    search: Joi.string().max(191).optional().allow(''),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(50).default(10)
  })
};

export const serviceParamsValidator = {
  [Segments.PARAMS]: Joi.object({
    serviceId: Joi.number().integer().positive().required()
  })
};
