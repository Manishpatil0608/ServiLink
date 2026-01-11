import httpClient from './httpClient.js';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const persistTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const loginRequest = async (payload) => {
  const body = payload.identifier
    ? payload
    : { identifier: payload.email || payload.phone, password: payload.password };
  const { data } = await httpClient.post('/auth/login', body);
  if (data?.data) {
    persistTokens(data.data);
  }
  return data.data;
};

export const registerRequest = async (payload) => {
  const { data } = await httpClient.post('/auth/register', payload);
  if (data?.data) {
    persistTokens(data.data);
  }
  return data.data;
};

export const googleLoginRequest = async (credential) => {
  const { data } = await httpClient.post('/auth/google', { credential });
  if (data?.data) {
    persistTokens(data.data);
  }
  return data.data;
};

export const requestPasswordReset = async (identifier) => {
  const { data } = await httpClient.post('/auth/password/forgot', { identifier });
  return data.data;
};

export const submitPasswordReset = async (payload) => {
  const { data } = await httpClient.post('/auth/password/reset', payload);
  return data.data;
};

export const refreshTokenRequest = async () => {
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }
  const { data } = await httpClient.post('/auth/refresh', { refreshToken });
  if (data?.data) {
    persistTokens(data.data);
  }
  return data.data;
};

export const logoutRequest = async () => {
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  if (refreshToken) {
    try {
      await httpClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      // swallow logout errors to avoid disrupting ux
    }
  }
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getProfile = async () => {
  const { data } = await httpClient.get('/users/me');
  return data.data;
};
