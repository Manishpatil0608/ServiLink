import axios from 'axios';
import { refreshTokenRequest } from './authService.js';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

const httpClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000
});

httpClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshPromise = refreshPromise || refreshTokenRequest();
        const data = await refreshPromise;
        refreshPromise = null;
        if (data?.accessToken) {
          window.localStorage.setItem('access_token', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return httpClient(originalRequest);
        }
      } catch (refreshError) {
        refreshPromise = null;
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('refresh_token');
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
