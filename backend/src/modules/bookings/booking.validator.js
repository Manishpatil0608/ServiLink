import { Joi, Segments } from '../../middleware/validate.js';

const isoString = Joi.string().isoDate();

export const createBookingValidator = {
  [Segments.BODY]: Joi.object({
    serviceId: Joi.number().integer().positive().required(),
    scheduledStart: isoString.required(),
    scheduledEnd: isoString.required(),
    addressLine1: Joi.string().max(255).required(),
    addressLine2: Joi.string().max(255).allow(null, ''),
    city: Joi.string().max(120).required(),
    state: Joi.string().max(120).required(),
    country: Joi.string().max(120).required(),
    postalCode: Joi.string().max(30).required(),
    latitude: Joi.number().min(-90).max(90).allow(null),
    longitude: Joi.number().min(-180).max(180).allow(null)
  })
};

export const listBookingsValidator = {
  [Segments.QUERY]: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'),
    page: Joi.number().integer().positive().default(1),
    pageSize: Joi.number().integer().positive().max(50).default(10)
  })
};

export const bookingIdParamsValidator = {
  [Segments.PARAMS]: Joi.object({
    bookingId: Joi.number().integer().positive().required()
  })
};
