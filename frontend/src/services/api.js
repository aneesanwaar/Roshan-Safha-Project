import axios from 'axios';

export { API, API as api };

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically for admin calls if present in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('roshan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------------------------------------------------------------
// 1. Public Ingestion Endpoints
// -------------------------------------------------------------
export const submitDonation = (data) => API.post('/donations', data);

export const submitEssay = (formData) =>
  API.post('/essays', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const submitVolunteer = (data) => API.post('/volunteers', data);
export const submitCollaboration = (data) => API.post('/collaborations', data);
export const submitContact = (data) => API.post('/contact', data);

// -------------------------------------------------------------
// 2. Public Catalog & Chatbot
// -------------------------------------------------------------
export const fetchPublicBooks = (params) => API.get('/books', { params });
export const sendChatMessage = (message) => API.post('/chat', { message });

// -------------------------------------------------------------
// 3. Admin Authentication & Dashboard Endpoints
// -------------------------------------------------------------
export const loginAdmin = (credentials) => API.post('/auth/login', credentials);
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminSubmissions = (type, search = '', page = 1) =>
  API.get('/admin/submissions', { params: { type, search, page } });
export const updateSubmissionStatus = (type, id, status) =>
  API.patch(`/admin/submissions/${type}/${id}/status`, { status });
export const getAdminAnalyticsTrends = () => API.get('/admin/analytics/trends');

// CMS Endpoints
export const getPageContent = (page) => API.get(`/admin/cms/${page}`);
export const updatePageContent = (page, content) => API.put(`/admin/cms/${page}`, { content });

// Admin Book Inventory Endpoints
export const createAdminBook = (data) => API.post('/books', data);
export const updateAdminBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteAdminBook = (id) => API.delete(`/books/${id}`);

export default API;