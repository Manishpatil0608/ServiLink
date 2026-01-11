import { db } from '../../config/database.js';

export const findProviderByUserId = async (userId, trx = db) => {
  return trx('service_providers').select('*').where({ user_id: userId }).first();
};

export const listProviderServices = async (providerId, trx = db) => {
  return trx('services')
    .select([
      'services.id',
      'services.title',
      'services.description',
      'services.category_id as categoryId',
      'services.base_price as basePrice',
      'services.price_unit as priceUnit',
      'services.service_radius_km as serviceRadiusKm',
      'services.avg_duration_minutes as avgDurationMinutes',
      'services.is_active as isActive',
      'services.created_at as createdAt',
      'services.updated_at as updatedAt',
      'categories.name as categoryName'
    ])
    .leftJoin('categories', 'categories.id', 'services.category_id')
    .where('services.provider_id', providerId)
    .orderBy('services.created_at', 'desc');
};

export const insertService = async (payload, trx = db) => {
  const [serviceId] = await trx('services').insert(payload);
  return serviceId;
};

export const findServiceById = async (serviceId, providerId, trx = db) => {
  return trx('services')
    .select('*')
    .where({ id: serviceId, provider_id: providerId })
    .first();
};

export const listServiceAvailability = async (serviceId, trx = db) => {
  return trx('availability')
    .select([
      'id',
      'weekday',
      'start_time as startTime',
      'end_time as endTime',
      'is_recurring as isRecurring',
      'custom_date as customDate'
    ])
    .where({ service_id: serviceId })
    .orderBy([{ column: 'weekday', order: 'asc' }, { column: 'start_time', order: 'asc' }]);
};

export const deleteAvailabilityByService = async (serviceId, trx = db) => {
  await trx('availability').where({ service_id: serviceId }).delete();
};

export const insertAvailability = async (rows, trx = db) => {
  if (!rows.length) {
    return;
  }
  await trx('availability').insert(rows);
};

export const listActiveCategories = async (trx = db) => {
  return trx('categories')
    .select(['id', 'name', 'slug', 'description'])
    .where({ is_active: true })
    .orderBy('name', 'asc');
};
