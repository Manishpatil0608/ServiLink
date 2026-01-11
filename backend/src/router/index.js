import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import providerRoutes from '../modules/providers/provider.routes.js';
import serviceRoutes from '../modules/services/service.routes.js';
import bookingRoutes from '../modules/bookings/booking.routes.js';
import paymentRoutes from '../modules/payments/payment.routes.js';
import supportRoutes from '../modules/support/support.routes.js';
import notificationRoutes from '../modules/notifications/notification.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/providers', providerRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/support', supportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
