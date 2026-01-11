import { Router } from 'express';
import { authGuard } from '../../middleware/authGuard.js';
import { validate } from '../../middleware/validate.js';
import {
	handleCreateBooking,
	handleGetCustomerBookings,
	handleGetCustomerBookingById,
	handleGetProviderBookings,
	handleGetProviderBookingById
} from './booking.controller.js';
import {
	bookingIdParamsValidator,
	createBookingValidator,
	listBookingsValidator
} from './booking.validator.js';

const router = Router();

router.post('/', authGuard(['customer']), validate(createBookingValidator), handleCreateBooking);

router.get('/provider', authGuard(['provider']), validate(listBookingsValidator), handleGetProviderBookings);
router.get('/provider/:bookingId', authGuard(['provider']), validate(bookingIdParamsValidator), handleGetProviderBookingById);

router.get('/', authGuard(['customer']), validate(listBookingsValidator), handleGetCustomerBookings);
router.get('/:bookingId', authGuard(['customer']), validate(bookingIdParamsValidator), handleGetCustomerBookingById);

export default router;
