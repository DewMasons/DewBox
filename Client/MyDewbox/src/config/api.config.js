const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    check: `${API_BASE_URL}/auth/check`,
  },
  users: {
    me: `${API_BASE_URL}/users/me`,
    profile: `${API_BASE_URL}/users/profile`,
    transactions: `${API_BASE_URL}/users/transactions`,
  },
  transactions: {
    contribute: `${API_BASE_URL}/users/transactions/contribute`,
    all: `${API_BASE_URL}/users/transactions`,
  },
  banks: {
    list: `${API_BASE_URL}/banks`,
  },
};

export const API_CONFIG = {
  API_BASE_URL,
  AUTH: {
    CHECK: '/auth/check',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
  },
  USERS: {
    LIST: '/users',
    PROFILE: '/users/profile',
  },
};

export const setupAxios = (axios) => {
  axios.defaults.baseURL = API_BASE_URL;
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};