import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { listServicesValidator, serviceParamsValidator } from './service.validator.js';
import { getServiceController, listCategoriesController, listServicesController } from './service.controller.js';

const router = Router();

router.get('/categories', listCategoriesController);
router.get('/', validate(listServicesValidator), listServicesController);
router.get('/:serviceId', validate(serviceParamsValidator), getServiceController);

export default router;
