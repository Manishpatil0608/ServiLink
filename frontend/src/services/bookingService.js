import httpClient from './httpClient.js';

export const createBookingRequest = async (payload) => {
  const { data } = await httpClient.post('/bookings', payload);
  return data.data;
};

export const fetchCustomerBookings = async (params = {}) => {
  const { data } = await httpClient.get('/bookings', { params });
  return {
    bookings: data.data ?? [],
    meta: data.meta ?? {}
  };
};

export const fetchCustomerBookingById = async (bookingId) => {
  const { data } = await httpClient.get(`/bookings/${bookingId}`);
  return data.data;
};

export const fetchProviderBookings = async (params = {}) => {
  const { data } = await httpClient.get('/bookings/provider', { params });
  return {
    bookings: data.data ?? [],
    meta: data.meta ?? {}
  };
};

export const fetchProviderBookingById = async (bookingId) => {
  const { data } = await httpClient.get(`/bookings/provider/${bookingId}`);
  return data.data;
};
