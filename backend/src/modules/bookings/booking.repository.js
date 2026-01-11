import crypto from 'crypto';
import { db } from '../../config/database.js';

const baseSelectColumns = [
  'b.id',
  'b.booking_code as bookingCode',
  'b.customer_id as customerId',
  'b.provider_id as providerId',
  'b.service_id as serviceId',
  'b.address_line1 as addressLine1',
  'b.address_line2 as addressLine2',
  'b.city',
  'b.state',
  'b.country',
  'b.postal_code as postalCode',
  'b.lat as latitude',
  'b.lng as longitude',
  'b.scheduled_start as scheduledStart',
  'b.scheduled_end as scheduledEnd',
  'b.status',
  'b.payment_status as paymentStatus',
  'b.subtotal',
  'b.tax',
  'b.total_amount as totalAmount',
  'b.cancellation_reason as cancellationReason',
  'b.created_at as createdAt',
  'b.updated_at as updatedAt',
  's.title as serviceTitle',
  's.description as serviceDescription',
  's.price_unit as priceUnit',
  's.avg_duration_minutes as avgDurationMinutes',
  'sp.business_name as providerBusinessName',
  'sp.rating_average as providerRatingAverage',
  'sp.total_reviews as providerTotalReviews',
  'c.name as categoryName'
];

const buildBaseQuery = (trx = db) => {
  return trx('bookings as b')
    .join('services as s', 'b.service_id', 's.id')
    .join('service_providers as sp', 'b.provider_id', 'sp.id')
    .join('categories as c', 's.category_id', 'c.id');
};

export const generateUniqueBookingCode = async (trx = db) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const generate = () => Array.from({ length: 10 }, () => alphabet[crypto.randomInt(alphabet.length)]).join('');

  let attempt = 0;
  while (attempt < 10) {
    const code = generate();
    const exists = await trx('bookings').where({ booking_code: code }).first();
    if (!exists) {
      return code;
    }
    attempt += 1;
  }
  throw new Error('Unable to generate unique booking code');
};

export const insertBooking = async (payload, trx = db) => {
  const [bookingId] = await trx('bookings').insert(payload);
  return bookingId;
};

export const findBlockingBooking = async (providerId, scheduledStart, scheduledEnd, trx = db) => {
  return trx('bookings')
    .where('provider_id', providerId)
    .whereIn('status', ['pending', 'confirmed', 'in_progress'])
    .andWhere((builder) => {
      builder
        .where('scheduled_start', '<', scheduledEnd)
        .andWhere('scheduled_end', '>', scheduledStart);
    })
    .first();
};

export const listCustomerBookings = async (customerId, filters, trx = db) => {
  const { status, limit, offset } = filters;
  const query = buildBaseQuery(trx)
    .clone()
    .where('b.customer_id', customerId)
    .orderBy('b.created_at', 'desc');

  if (status) {
    query.andWhere('b.status', status);
  }

  const data = await query
    .clone()
    .select(baseSelectColumns)
    .limit(limit)
    .offset(offset);

  const countQuery = buildBaseQuery(trx)
    .clone()
    .clearSelect()
    .where('b.customer_id', customerId);

  if (status) {
    countQuery.andWhere('b.status', status);
  }

  const totalResult = await countQuery.count({ total: 'b.id' }).first();

  return { data, total: Number(totalResult?.total ?? 0) };
};

export const listProviderBookings = async (providerId, filters, trx = db) => {
  const { status, limit, offset } = filters;
  const query = buildBaseQuery(trx)
    .clone()
    .join('users as cu', 'b.customer_id', 'cu.id')
    .leftJoin('user_profiles as cup', 'cup.user_id', 'cu.id')
    .where('b.provider_id', providerId)
    .orderBy('b.created_at', 'desc');

  if (status) {
    query.andWhere('b.status', status);
  }

  const data = await query
    .clone()
    .select([
      ...baseSelectColumns,
      'cu.email as customerEmail',
      'cu.phone as customerPhone',
      'cup.first_name as customerFirstName',
      'cup.last_name as customerLastName'
    ])
    .limit(limit)
    .offset(offset);

  const countQuery = buildBaseQuery(trx)
    .clone()
    .where('b.provider_id', providerId);

  if (status) {
    countQuery.andWhere('b.status', status);
  }

  const totalResult = await countQuery.count({ total: 'b.id' }).first();

  return { data, total: Number(totalResult?.total ?? 0) };
};

export const findBookingForCustomer = async (bookingId, customerId, trx = db) => {
  return buildBaseQuery(trx)
    .clone()
    .where('b.id', bookingId)
    .andWhere('b.customer_id', customerId)
    .select(baseSelectColumns)
    .first();
};

export const findBookingForProvider = async (bookingId, providerId, trx = db) => {
  return buildBaseQuery(trx)
    .clone()
    .join('users as cu', 'b.customer_id', 'cu.id')
    .leftJoin('user_profiles as cup', 'cup.user_id', 'cu.id')
    .where('b.id', bookingId)
    .andWhere('b.provider_id', providerId)
    .select([
      ...baseSelectColumns,
      'cu.email as customerEmail',
      'cu.phone as customerPhone',
      'cup.first_name as customerFirstName',
      'cup.last_name as customerLastName'
    ])
    .first();
};
