import { Joi, Segments } from '../../middleware/validate.js';
import { SUPPORT_CATEGORIES, SUPPORT_PRIORITIES, SUPPORT_STATUSES } from './support.constants.js';

export const createTicketValidator = {
  [Segments.BODY]: Joi.object({
    subject: Joi.string().trim().min(8).max(191).required(),
    message: Joi.string().trim().min(10).required(),
    category: Joi.string().valid(...SUPPORT_CATEGORIES).required(),
    priority: Joi.string().valid(...SUPPORT_PRIORITIES).default('medium'),
    relatedBookingId: Joi.number().integer().positive().optional(),
    relatedProviderId: Joi.number().integer().positive().optional(),
    attachments: Joi.array().items(Joi.string().uri().max(500)).max(5).optional()
  })
};

export const listTicketsValidator = {
  [Segments.QUERY]: Joi.object({
    status: Joi.string().valid(...SUPPORT_STATUSES).optional(),
    category: Joi.string().valid(...SUPPORT_CATEGORIES).optional(),
    priority: Joi.string().valid(...SUPPORT_PRIORITIES).optional(),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(50).default(10)
  })
};

export const ticketParamsValidator = {
  [Segments.PARAMS]: Joi.object({
    ticketCode: Joi.string().alphanum().length(10).required()
  })
};

export const createMessageValidator = {
  [Segments.BODY]: Joi.object({
    message: Joi.string().trim().min(5).required(),
    attachments: Joi.array().items(Joi.string().uri().max(500)).max(5).optional()
  })
};
