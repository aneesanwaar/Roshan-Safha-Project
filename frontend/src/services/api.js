import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token from localStorage
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
export const registerEvent = (data) => API.post('/events', data);

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

// -------------------------------------------------------------
// 4. Admin Gallery Management Endpoints
// -------------------------------------------------------------
export const getAdminGalleryPhotos = () => API.get('/gallery');

export const uploadAdminGalleryPhoto = (formData) =>
  API.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteAdminGalleryPhoto = (id) => API.delete(`/gallery/${id}`);
// Public Gallery fetch
export const getPublicGalleryPhotos = () => API.get('/gallery');

// CMS Endpoints
export const getPageContent = (page) => API.get(`/admin/cms/${page}`);
export const updatePageContent = (page, content) => API.put(`/admin/cms/${page}`, { content });

// Winners Endpoints
export const getAdminWinners = () => API.get('/admin/winners');
export const createAdminWinner = (data) => API.post('/admin/winners', data);
export const deleteAdminWinner = (id) => API.delete(`/admin/winners/${id}`);

// Menu Endpoints
export const getAdminMenuItems = () => API.get('/admin/menu');
export const updateAdminMenuItem = (id, data) => API.put(`/admin/menu/${id}`, data);

// Navigation Menu
export const getPublicMenuItems = () => API.get('/admin/menu');

// Public CMS content fetcher
export const getPublicPageContent = (page) => API.get(`/admin/cms/${page}`);

// Contact Form Submission
export const submitContactMessage = (data) => API.post('/contact', data);

// User & Role Management
export const getAdminTeamUsers = () => API.get('/admin/users');
export const deleteAdminTeamUser = (id) => API.delete(`/admin/users/${id}`);

// Export File Trigger
export const exportAdminSubmissions = async (type, format = 'excel') => {
  try {
    const response = await API.get(`/admin/submissions/export`, {
      params: { type, format },
      responseType: 'blob', // Critical: tells Axios to treat response as binary file
    });

    // Create a temporary link element to trigger the download
    const blob = new Blob([response.data], {
      type:
        format === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : format === 'pdf'
          ? 'application/pdf'
          : 'text/csv',
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `RoshanSafha_${type}_${new Date().toISOString().slice(0, 10)}.${
      format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'
    }`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Export download failed:', error);
    alert('Failed to download report. Check server logs.');
  }
};

export { API, API as api };
export default API;