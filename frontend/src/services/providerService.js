import httpClient from './httpClient.js';

export const fetchProviderCategories = async () => {
  const { data } = await httpClient.get('/providers/categories');
  return data.data;
};

export const fetchProviderServices = async () => {
  const { data } = await httpClient.get('/providers/services');
  return data.data;
};

export const createProviderService = async (payload) => {
  const { data } = await httpClient.post('/providers/services', payload);
  return data.data;
};

export const fetchServiceAvailability = async (serviceId) => {
  const { data } = await httpClient.get(`/providers/services/${serviceId}/availability`);
  return data.data;
};

export const updateServiceAvailability = async (serviceId, availability) => {
  const { data } = await httpClient.put(`/providers/services/${serviceId}/availability`, { availability });
  return data.data;
};
