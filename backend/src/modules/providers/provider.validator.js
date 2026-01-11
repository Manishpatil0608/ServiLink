import { Joi, Segments } from '../../middleware/validate.js';

const priceUnits = ['per_hour', 'per_job', 'per_day'];

const timePattern = /^\d{2}:\d{2}$/;

export const createServiceValidator = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(4).max(191).required(),
    categoryId: Joi.number().integer().positive().required(),
    description: Joi.string().min(20).max(5000).required(),
    basePrice: Joi.number().precision(2).min(0).required(),
    priceUnit: Joi.string().valid(...priceUnits).required(),
    serviceRadiusKm: Joi.number().integer().min(1).max(500).optional(),
    avgDurationMinutes: Joi.number().integer().min(15).max(1440).optional(),
    isActive: Joi.boolean().optional()
  })
};

export const serviceParamsValidator = {
  [Segments.PARAMS]: Joi.object({
    serviceId: Joi.number().integer().positive().required()
  })
};

export const upsertAvailabilityValidator = {
  [Segments.PARAMS]: serviceParamsValidator[Segments.PARAMS],
  [Segments.BODY]: Joi.object({
    availability: Joi.array().max(28).items(
      Joi.object({
        weekday: Joi.number().integer().min(0).max(6).required(),
        startTime: Joi.string().pattern(timePattern).required(),
        endTime: Joi.string().pattern(timePattern).required(),
        isRecurring: Joi.boolean().optional(),
        customDate: Joi.string().isoDate().allow(null).optional()
      }).custom((value, helpers) => {
        if (value.startTime >= value.endTime) {
          return helpers.message('End time must be after start time');
        }
        return value;
      }, 'time order validation')
    ).required()
  })
};
