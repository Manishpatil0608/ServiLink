import { withTransaction } from '../../config/database.js';
import { AppError } from '../../utils/appError.js';
import { findServiceById } from '../services/service.repository.js';
import { findProviderByUserId } from '../providers/provider.repository.js';
import {
  insertBooking,
  findBlockingBooking,
  generateUniqueBookingCode,
  listCustomerBookings,
  listProviderBookings,
  findBookingForCustomer,
  findBookingForProvider
} from './booking.repository.js';

const BOOKING_STATUS = Object.freeze([
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'refunded'
]);

const sanitizePagination = ({ page = 1, pageSize = 10 }) => {
  const limit = Math.min(Math.max(Number(pageSize) || 10, 1), 50);
  const currentPage = Math.max(Number(page) || 1, 1);
  const offset = (currentPage - 1) * limit;
  return { limit, offset, currentPage };
};

const normalizeMoney = (value) => {
  const numeric = Number(value ?? 0);
  if (Number.isNaN(numeric)) {
    return 0;
  }
  return Number.parseFloat(numeric.toFixed(2));
};

const toIsoString = (value) => {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const parseNullableNumber = (value) => (value === null || value === undefined ? null : Number(value));

const parseOptionalCoordinate = (value) => {
  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

const normalizeBookingRow = (row) => {
  if (!row) {
    return null;
  }

  const service = {
    id: row.serviceId,
    title: row.serviceTitle,
    description: row.serviceDescription,
    priceUnit: row.priceUnit,
    avgDurationMinutes: row.avgDurationMinutes !== null ? Number(row.avgDurationMinutes) : null,
    categoryName: row.categoryName
  };

  const provider = {
    id: row.providerId,
    businessName: row.providerBusinessName,
    ratingAverage: parseNullableNumber(row.providerRatingAverage),
    totalReviews: Number(row.providerTotalReviews ?? 0)
  };

  const customer = row.customerEmail || row.customerFirstName || row.customerLastName || row.customerPhone
    ? {
        email: row.customerEmail,
        phone: row.customerPhone,
        firstName: row.customerFirstName,
        lastName: row.customerLastName
      }
    : null;

  return {
    id: row.id,
    bookingCode: row.bookingCode,
    customerId: row.customerId,
    providerId: row.providerId,
    serviceId: row.serviceId,
    status: row.status,
    paymentStatus: row.paymentStatus,
    cancellationReason: row.cancellationReason,
    scheduledStart: toIsoString(row.scheduledStart),
    scheduledEnd: toIsoString(row.scheduledEnd),
    subtotal: normalizeMoney(row.subtotal),
    tax: normalizeMoney(row.tax),
    totalAmount: normalizeMoney(row.totalAmount),
    address: {
      line1: row.addressLine1,
      line2: row.addressLine2,
      city: row.city,
      state: row.state,
      country: row.country,
      postalCode: row.postalCode,
      latitude: parseOptionalCoordinate(row.latitude),
      longitude: parseOptionalCoordinate(row.longitude)
    },
    service,
    provider,
    customer,
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt)
  };
};

const validateSchedule = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new AppError('Invalid schedule. Please provide ISO date strings.', 400);
  }

  if (startDate >= endDate) {
    throw new AppError('Scheduled end must be after start.', 400);
  }

  const now = new Date();
  if (startDate <= now) {
    throw new AppError('Scheduled start must be in the future.', 400);
  }

  return { startDate, endDate };
};

const getProviderContext = async (userId) => {
  const provider = await findProviderByUserId(userId);
  if (!provider) {
    throw new AppError('Provider profile not found. Complete onboarding before continuing.', 400, 'PROVIDER_PROFILE_MISSING');
  }
  return provider;
};

export const createBooking = async (customerId, payload) => {
  const {
    serviceId,
    scheduledStart,
    scheduledEnd,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    postalCode,
    latitude,
    longitude
  } = payload;

  const { startDate, endDate } = validateSchedule(scheduledStart, scheduledEnd);

  const service = await findServiceById(serviceId);
  if (!service) {
    throw new AppError('Selected service is not available.', 404);
  }

  return withTransaction(async (trx) => {
    const blockingBooking = await findBlockingBooking(service.providerId, startDate, endDate, trx);
    if (blockingBooking) {
      throw new AppError('Provider is not available for the selected schedule.', 409);
    }

    const bookingCode = await generateUniqueBookingCode(trx);

    const subtotal = normalizeMoney(service.basePrice);
    const taxRate = Number(service.taxRate ?? 0) > 0 ? Number(service.taxRate) : 0;
    const tax = normalizeMoney(taxRate ? subtotal * taxRate : 0);
    const totalAmount = normalizeMoney(subtotal + tax);

    const bookingPayload = {
      booking_code: bookingCode,
      customer_id: customerId,
      provider_id: service.providerId,
      service_id: service.id,
      scheduled_start: startDate,
      scheduled_end: endDate,
      status: 'pending',
      payment_status: 'pending',
      subtotal,
      tax,
      total_amount: totalAmount,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state,
      country,
      postal_code: postalCode,
      lat: latitude,
      lng: longitude
    };

    const bookingId = await insertBooking(bookingPayload, trx);

    const row = await findBookingForCustomer(bookingId, customerId, trx);
    return normalizeBookingRow(row);
  });
};

export const getCustomerBookings = async (customerId, filters = {}) => {
  const pagination = sanitizePagination(filters);
  const status = filters.status;
  if (status && !BOOKING_STATUS.includes(status)) {
    throw new AppError('Unsupported booking status filter.', 400);
  }

  const { data, total } = await listCustomerBookings(customerId, { ...pagination, status });
  return {
    data: data.map(normalizeBookingRow),
    meta: {
      total,
      page: pagination.currentPage,
      pageSize: pagination.limit,
      totalPages: Math.max(Math.ceil(total / pagination.limit) || 1, 1)
    }
  };
};

export const getProviderBookings = async (userId, filters = {}) => {
  const pagination = sanitizePagination(filters);
  const status = filters.status;
  if (status && !BOOKING_STATUS.includes(status)) {
    throw new AppError('Unsupported booking status filter.', 400);
  }

  const provider = await getProviderContext(userId);

  const { data, total } = await listProviderBookings(provider.id, { ...pagination, status });
  return {
    data: data.map(normalizeBookingRow),
    meta: {
      total,
      page: pagination.currentPage,
      pageSize: pagination.limit,
      totalPages: Math.max(Math.ceil(total / pagination.limit) || 1, 1)
    }
  };
};

export const getCustomerBookingById = async (bookingId, customerId) => {
  const booking = await findBookingForCustomer(bookingId, customerId);
  if (!booking) {
    throw new AppError('Booking not found.', 404);
  }
  return normalizeBookingRow(booking);
};

export const getProviderBookingById = async (bookingId, userId) => {
  const provider = await getProviderContext(userId);
  const booking = await findBookingForProvider(bookingId, provider.id);
  if (!booking) {
    throw new AppError('Booking not found.', 404);
  }
  return normalizeBookingRow(booking);
};
