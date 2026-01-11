import { db } from '../../config/database.js';

const baseSelectColumns = [
  's.id',
  's.title',
  's.description',
  's.base_price as basePrice',
  's.tax_rate as taxRate',
  's.price_unit as priceUnit',
  's.service_radius_km as serviceRadiusKm',
  's.avg_duration_minutes as avgDurationMinutes',
  's.created_at as createdAt',
  's.updated_at as updatedAt',
  'c.id as categoryId',
  'c.name as categoryName',
  'c.slug as categorySlug',
  'c.description as categoryDescription',
  'sp.id as providerId',
  'sp.business_name as providerName',
  'sp.rating_average as providerRatingAverage',
  'sp.total_reviews as providerTotalReviews',
  'u.email as providerEmail',
  'u.phone as providerPhone',
  'up.first_name as providerFirstName',
  'up.last_name as providerLastName',
  'up.avatar_url as providerAvatarUrl'
];

const buildBaseQuery = (trx = db) => {
  return trx('services as s')
    .join('service_providers as sp', 's.provider_id', 'sp.id')
    .join('users as u', 'sp.user_id', 'u.id')
    .leftJoin('user_profiles as up', 'up.user_id', 'u.id')
    .join('categories as c', 's.category_id', 'c.id')
    .where('s.is_active', true)
    .andWhere('u.status', 'active');
};

export const findServices = async (filters, trx = db) => {
  const {
    categoryId,
    categorySlug,
    search,
    limit,
    offset
  } = filters;

  const query = buildBaseQuery(trx);

  if (categoryId) {
    query.andWhere('c.id', categoryId);
  }

  if (categorySlug) {
    query.andWhere('c.slug', categorySlug);
  }

  if (search) {
    query.andWhere((builder) => {
      builder
        .where('s.title', 'like', `%${search}%`)
        .orWhere('s.description', 'like', `%${search}%`)
        .orWhere('sp.business_name', 'like', `%${search}%`);
    });
  }

  const rows = await query
    .clone()
    .select(baseSelectColumns)
    .orderBy('s.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  return rows;
};

export const countServices = async (filters, trx = db) => {
  const { categoryId, categorySlug, search } = filters;
  const query = buildBaseQuery(trx);

  if (categoryId) {
    query.andWhere('c.id', categoryId);
  }

  if (categorySlug) {
    query.andWhere('c.slug', categorySlug);
  }

  if (search) {
    query.andWhere((builder) => {
      builder
        .where('s.title', 'like', `%${search}%`)
        .orWhere('s.description', 'like', `%${search}%`)
        .orWhere('sp.business_name', 'like', `%${search}%`);
    });
  }

  const result = await query.clone().clearSelect().count({ total: 's.id' }).first();
  return Number(result?.total ?? 0);
};

export const findServiceById = async (serviceId, trx = db) => {
  const row = await buildBaseQuery(trx)
    .clone()
    .select(baseSelectColumns)
    .where('s.id', serviceId)
    .first();

  return row;
};

export const findAvailabilityByServiceId = async (serviceId, trx = db) => {
  return trx('availability')
    .select([
      'id',
      'weekday',
      'start_time as startTime',
      'end_time as endTime',
      'is_recurring as isRecurring',
      'custom_date as customDate',
      'is_available as isAvailable'
    ])
    .where({ service_id: serviceId })
    .orderBy([{ column: 'weekday', order: 'asc' }, { column: 'start_time', order: 'asc' }]);
};

export const listActiveCategories = async (trx = db) => {
  return trx('categories')
    .select(['id', 'name', 'slug', 'description'])
    .where({ is_active: true })
    .orderBy('name', 'asc');
};
