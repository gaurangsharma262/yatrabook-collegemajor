import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('yatrabook_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    // Handle 401 — auto logout
    if (error.response?.status === 401) {
      localStorage.removeItem('yatrabook_token');
      localStorage.removeItem('yatrabook_user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;

// ─── API Methods ───────────────────────────────────────────────

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Trains
export const trainAPI = {
  search: (params) => api.get('/trains/search', { params }),
  getById: (id) => api.get(`/trains/${id}`),
  checkAvailability: (id, classType) => api.get(`/trains/${id}/availability`, { params: { class: classType } }),
  getStations: () => api.get('/trains/stations'),
  getPopular: () => api.get('/trains/popular'),
};

// Flights
export const flightAPI = {
  search: (params) => api.get('/flights/search', { params }),
  getById: (id) => api.get(`/flights/${id}`),
  getAirports: () => api.get('/flights/airports'),
};

// Buses
export const busAPI = {
  search: (params) => api.get('/buses/search', { params }),
  getById: (id) => api.get(`/buses/${id}`),
  getOperators: () => api.get('/buses/operators'),
};

// Bookings
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }),
};

// User
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getRecentSearches: () => api.get('/users/recent-searches'),
  clearRecentSearches: () => api.delete('/users/recent-searches'),
};

// Recommendations
export const recommendAPI = {
  getCheapest: (from, to) => api.get('/recommend/cheapest', { params: { from, to } }),
  getFastest: (from, to) => api.get('/recommend/fastest', { params: { from, to } }),
  planMultiCity: (cities) => api.post('/recommend/multi-city', { cities }),
};
