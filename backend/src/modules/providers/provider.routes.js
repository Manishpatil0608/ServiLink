import { Router } from 'express';
import { authGuard } from '../../middleware/authGuard.js';
import { validate } from '../../middleware/validate.js';
import {
	createServiceValidator,
	serviceParamsValidator,
	upsertAvailabilityValidator
} from './provider.validator.js';
import {
	listCategoriesController,
	listServicesController,
	createServiceController,
	getAvailabilityController,
	upsertAvailabilityController
} from './provider.controller.js';

const router = Router();

router.get(
	'/categories',
	authGuard(['provider']),
	listCategoriesController
);

router.get(
	'/services',
	authGuard(['provider']),
	listServicesController
);

router.post(
	'/services',
	authGuard(['provider']),
	validate(createServiceValidator),
	createServiceController
);

router.get(
	'/services/:serviceId/availability',
	authGuard(['provider']),
	validate(serviceParamsValidator),
	getAvailabilityController
);

router.put(
	'/services/:serviceId/availability',
	authGuard(['provider']),
	validate(upsertAvailabilityValidator),
	upsertAvailabilityController
);

export default router;
