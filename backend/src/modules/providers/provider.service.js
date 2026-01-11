import { withTransaction } from '../../config/database.js';
import { AppError } from '../../utils/appError.js';
import {
  findProviderByUserId,
  listProviderServices,
  insertService,
  findServiceById,
  listServiceAvailability,
  deleteAvailabilityByService,
  insertAvailability,
  listActiveCategories
} from './provider.repository.js';

const priceUnits = ['per_hour', 'per_job', 'per_day'];

const getProviderOrThrow = async (userId, trx) => {
  const provider = await findProviderByUserId(userId, trx);
  if (!provider) {
    throw new AppError('Provider profile not found. Complete onboarding before continuing.', 400, 'PROVIDER_PROFILE_MISSING');
  }
  return provider;
};

export const getProviderCategories = async (userId) => {
  await getProviderOrThrow(userId);
  return listActiveCategories();
};

export const getProviderServices = async (userId) => {
  const provider = await getProviderOrThrow(userId);
  const services = await listProviderServices(provider.id);
  return services.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    categoryId: service.categoryId,
    categoryName: service.categoryName,
    basePrice: Number(service.basePrice),
    priceUnit: service.priceUnit,
    serviceRadiusKm: service.serviceRadiusKm,
    avgDurationMinutes: service.avgDurationMinutes,
    isActive: !!service.isActive,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt
  }));
};

export const createProviderService = async (userId, payload) => {
  return withTransaction(async (trx) => {
    const provider = await getProviderOrThrow(userId, trx);

    const categories = await listActiveCategories(trx);
    const category = categories.find((cat) => cat.id === payload.categoryId);
    if (!category) {
      throw new AppError('Selected category is unavailable.', 404, 'CATEGORY_NOT_FOUND');
    }

    if (!priceUnits.includes(payload.priceUnit)) {
      throw new AppError('Unsupported price unit option.', 400, 'SERVICE_INVALID_PRICE_UNIT');
    }

    const serviceId = await insertService({
      provider_id: provider.id,
      category_id: payload.categoryId,
      title: payload.title,
      description: payload.description,
      base_price: payload.basePrice,
      price_unit: payload.priceUnit,
      service_radius_km: payload.serviceRadiusKm ?? null,
      avg_duration_minutes: payload.avgDurationMinutes ?? null,
      is_active: payload.isActive ?? false
    }, trx);

    const service = await findServiceById(serviceId, provider.id, trx);

    return {
      id: service.id,
      title: service.title,
      categoryId: service.category_id,
      description: service.description,
      basePrice: Number(service.base_price),
      priceUnit: service.price_unit,
      serviceRadiusKm: service.service_radius_km,
      avgDurationMinutes: service.avg_duration_minutes,
      isActive: !!service.is_active,
      createdAt: service.created_at
    };
  });
};

export const getServiceAvailability = async (userId, serviceId) => {
  return withTransaction(async (trx) => {
    const provider = await getProviderOrThrow(userId, trx);
    const service = await findServiceById(serviceId, provider.id, trx);
    if (!service) {
      throw new AppError('Service not found.', 404, 'SERVICE_NOT_FOUND');
    }

    const availability = await listServiceAvailability(service.id, trx);
    return availability.map((slot) => ({
      id: slot.id,
      weekday: slot.weekday,
      startTime: slot.startTime?.slice(0, 5) || null,
      endTime: slot.endTime?.slice(0, 5) || null,
      isRecurring: slot.isRecurring,
      customDate: slot.customDate
    }));
  });
};

const toSqlTime = (time) => {
  if (!time) {
    return null;
  }
  return time.length === 5 ? `${time}:00` : time;
};

export const upsertServiceAvailability = async (userId, serviceId, availabilityPayload) => {
  return withTransaction(async (trx) => {
    const provider = await getProviderOrThrow(userId, trx);
    const service = await findServiceById(serviceId, provider.id, trx);
    if (!service) {
      throw new AppError('Service not found.', 404, 'SERVICE_NOT_FOUND');
    }

    await deleteAvailabilityByService(service.id, trx);

    if (availabilityPayload.length) {
      const rows = availabilityPayload.map((slot) => ({
        service_id: service.id,
        weekday: slot.weekday,
        start_time: toSqlTime(slot.startTime),
        end_time: toSqlTime(slot.endTime),
        is_recurring: slot.isRecurring ?? true,
        custom_date: slot.customDate || null
      }));
      await insertAvailability(rows, trx);
    }

    return { message: 'Availability updated successfully.' };
  });
};
