import { sendSuccess } from '../../utils/response.js';
import { getCategories, getServiceDetail, getServices } from './service.service.js';

export const listServicesController = async (req, res, next) => {
  try {
    const { data, meta } = await getServices(req.query);
    return sendSuccess(res, data, meta);
  } catch (error) {
    return next(error);
  }
};

export const getServiceController = async (req, res, next) => {
  try {
    const service = await getServiceDetail(Number(req.params.serviceId));
    return sendSuccess(res, service);
  } catch (error) {
    return next(error);
  }
};

export const listCategoriesController = async (req, res, next) => {
  try {
    const categories = await getCategories();
    return sendSuccess(res, categories);
  } catch (error) {
    return next(error);
  }
};
