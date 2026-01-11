import { sendSuccess } from '../../utils/response.js';
import {
  getProviderCategories,
  getProviderServices,
  createProviderService,
  getServiceAvailability,
  upsertServiceAvailability
} from './provider.service.js';

export const listCategoriesController = async (req, res, next) => {
  try {
    const categories = await getProviderCategories(req.user.sub);
    return sendSuccess(res, categories);
  } catch (error) {
    return next(error);
  }
};

export const listServicesController = async (req, res, next) => {
  try {
    const services = await getProviderServices(req.user.sub);
    return sendSuccess(res, services);
  } catch (error) {
    return next(error);
  }
};

export const createServiceController = async (req, res, next) => {
  try {
    const service = await createProviderService(req.user.sub, req.body);
    return sendSuccess(res, service, null, 201);
  } catch (error) {
    return next(error);
  }
};

export const getAvailabilityController = async (req, res, next) => {
  try {
    const availability = await getServiceAvailability(req.user.sub, Number(req.params.serviceId));
    return sendSuccess(res, availability);
  } catch (error) {
    return next(error);
  }
};

export const upsertAvailabilityController = async (req, res, next) => {
  try {
    const result = await upsertServiceAvailability(
      req.user.sub,
      Number(req.params.serviceId),
      req.body.availability
    );
    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
};
