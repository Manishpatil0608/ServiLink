import { sendSuccess } from '../../utils/response.js';
import {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  getCustomerBookingById,
  getProviderBookingById
} from './booking.service.js';

export const handleCreateBooking = async (req, res, next) => {
  try {
    const booking = await createBooking(req.user.sub, req.body);
    return sendSuccess(res, booking, null, 201);
  } catch (error) {
    return next(error);
  }
};

export const handleGetCustomerBookings = async (req, res, next) => {
  try {
    const { data, meta } = await getCustomerBookings(req.user.sub, req.query);
    return sendSuccess(res, data, meta);
  } catch (error) {
    return next(error);
  }
};

export const handleGetProviderBookings = async (req, res, next) => {
  try {
    const { data, meta } = await getProviderBookings(req.user.sub, req.query);
    return sendSuccess(res, data, meta);
  } catch (error) {
    return next(error);
  }
};

export const handleGetCustomerBookingById = async (req, res, next) => {
  try {
    const booking = await getCustomerBookingById(Number(req.params.bookingId), req.user.sub);
    return sendSuccess(res, booking);
  } catch (error) {
    return next(error);
  }
};

export const handleGetProviderBookingById = async (req, res, next) => {
  try {
    const booking = await getProviderBookingById(Number(req.params.bookingId), req.user.sub);
    return sendSuccess(res, booking);
  } catch (error) {
    return next(error);
  }
};
