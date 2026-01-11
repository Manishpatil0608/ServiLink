import httpClient from './httpClient.js';

export const fetchServiceCategories = async () => {
  const response = await httpClient.get('/services/categories');
  return response.data.data ?? [];
};

export const fetchServices = async (params = {}) => {
  const response = await httpClient.get('/services', { params });
  return response.data;
};

export const fetchServiceDetail = async (serviceId) => {
  const response = await httpClient.get(`/services/${serviceId}`);
  return response.data.data;
};
