import { AppError } from '../../utils/appError.js';
import { findAvailabilityByServiceId, findServiceById, findServices, countServices, listActiveCategories } from './service.repository.js';

const parseNumber = (value) => (value === null || value === undefined ? null : Number(value));

const normalizeServiceRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  basePrice: parseNumber(row.basePrice),
  priceUnit: row.priceUnit,
  serviceRadiusKm: parseNumber(row.serviceRadiusKm),
  avgDurationMinutes: row.avgDurationMinutes !== null ? Number(row.avgDurationMinutes) : null,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  category: {
    id: row.categoryId,
    name: row.categoryName,
    slug: row.categorySlug,
    description: row.categoryDescription
  },
  provider: {
    id: row.providerId,
    name: row.providerName,
    ratingAverage: parseNumber(row.providerRatingAverage),
    totalReviews: Number(row.providerTotalReviews ?? 0),
    email: row.providerEmail,
    phone: row.providerPhone,
    firstName: row.providerFirstName,
    lastName: row.providerLastName,
    avatarUrl: row.providerAvatarUrl
  }
});

const normalizeAvailability = (rows) => rows
  .filter((row) => row.isAvailable !== false)
  .map((row) => ({
    id: row.id,
    weekday: row.weekday,
    startTime: row.startTime?.slice(0, 5) ?? null,
    endTime: row.endTime?.slice(0, 5) ?? null,
    isRecurring: row.isRecurring,
    customDate: row.customDate
  }));

export const getServices = async ({ categoryId, categorySlug, search, page, pageSize }) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const [rows, total] = await Promise.all([
    findServices({ categoryId, categorySlug, search, limit, offset }),
    countServices({ categoryId, categorySlug, search })
  ]);

  const data = rows.map(normalizeServiceRow);
  const meta = {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize) || 1
  };

  return { data, meta };
};

export const getServiceDetail = async (serviceId) => {
  const row = await findServiceById(serviceId);
  if (!row) {
    throw new AppError('Service not found', 404, 'SERVICE_NOT_FOUND');
  }

  const availabilityRows = await findAvailabilityByServiceId(serviceId);
  const service = normalizeServiceRow(row);

  return {
    ...service,
    availability: normalizeAvailability(availabilityRows)
  };
};

export const getCategories = async () => {
  return listActiveCategories();
};
