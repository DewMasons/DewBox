import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:4000', // Updated to match backend port
});

// Helper to ensure no double slashes in endpoint
function cleanUrl(url: string) {
  return url.replace(/([^:]\/)\/+/, '$1');
}

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  // Auth
  login: async (mobile: string, password: string) => {
    // Backend expects mobile, not email
    const response = await api.post(cleanUrl('/auth/login'), { mobile, password });
    return response.data;
  },
  register: async (registerData: any) => {
    try {
      const response = await api.post(cleanUrl('/auth/register'), registerData);
      // Store JWT token after successful registration
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      // Log full error for debugging
      if (error.response) {
        console.error('Registration error:', error.response.data);
        throw error.response.data;
      } else {
        console.error('Registration error:', error);
        throw error;
      }
    }
  },
  checkAuth: async () => {
    const response = await api.get(cleanUrl('/auth/check'));
    return response.data;
  },

  // User
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data: any) => api.patch('/users/profile', data),
  getSubscriber: () => api.get('/users/subscriber'), // New API call for subscriber info

  // Transactions
  getTransactions: () => api.get('/users/transactions'),
  createTransaction: (data: any) => api.post('/users/transactions', data),
  contribute: (data: any) => api.post('/users/transactions/contribute', data),

  // Banks
  getBanks: () => api.get(cleanUrl('/banks')),
  // Add verifyBankAccount if backend supports it
};

export const checkAuth = apiService.checkAuth;
export const login = apiService.login;
export const register = apiService.register;

export default apiService;