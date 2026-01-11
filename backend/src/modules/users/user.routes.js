import { Router } from 'express';
import { authGuard } from '../../middleware/authGuard.js';
import { getMe } from './user.controller.js';

const router = Router();

router.get('/me', authGuard(['customer', 'provider', 'service_admin', 'category_admin', 'master_admin', 'super_admin']), getMe);

export default router;
