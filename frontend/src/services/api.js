import { initialEssays, initialGallery, initialAnnouncements } from './mockData';

const USE_MOCK = true;
const API_BASE = "http://localhost:5000/api";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

let mockEssays = [...(initialEssays || [])];
let mockGallery = [...(initialGallery || [])];
let mockAnnouncements = [...(initialAnnouncements || [])];

export const api = {
  submitEssay: async (formData) => {
    if (USE_MOCK) {
      await delay(800);
      const newEntry = {
        _id: `mock_${Date.now()}`,
        studentName: formData.get('studentName') || 'Anonymous',
        age: Number(formData.get('age')) || 16,
        institutionName: formData.get('institutionName') || '',
        category: formData.get('category') || 'Junior',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        essayTitle: formData.get('essayTitle') || '',
        status: 'Pending',
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/fl_attachment/mock_file.pdf',
        hasAgreed: true,
        createdAt: new Date().toISOString()
      };
      mockEssays.unshift(newEntry);
      return { success: true, message: "Essay submitted successfully! Good luck.", essay: newEntry };
    }
    const res = await fetch(`${API_BASE}/essays`, { method: "POST", body: formData });
    return res.json();
  },

  getAllEssays: async (token) => {
    if (USE_MOCK) {
      await delay(400);
      return mockEssays;
    }
    const res = await fetch(`${API_BASE}/essays`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  updateEssayStatus: async (id, status, token) => {
    if (USE_MOCK) {
      await delay(300);
      mockEssays = mockEssays.map(item => item._id === id ? { ...item, status } : item);
      return { success: true, message: `Status updated to ${status} successfully!` };
    }
    const res = await fetch(`${API_BASE}/essays/${id}/status`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  getGallery: async () => {
    if (USE_MOCK) {
      await delay(300);
      return mockGallery;
    }
    const res = await fetch(`${API_BASE}/gallery`);
    return res.json();
  },

  getAnnouncements: async () => {
    if (USE_MOCK) {
      await delay(300);
      return mockAnnouncements;
    }
    const res = await fetch(`${API_BASE}/announcements`);
    return res.json();
  },

  submitDonation: async (data) => {
    if (USE_MOCK) {
      await delay(500);
      return { success: true, message: "Thank you for pledging books to Roshan Safha!" };
    }
    const res = await fetch(`${API_BASE}/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  submitVolunteer: async (data) => {
    if (USE_MOCK) {
      await delay(500);
      return { success: true, message: "Volunteer registration received!" };
    }
    const res = await fetch(`${API_BASE}/volunteers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  submitContact: async (data) => {
    if (USE_MOCK) {
      await delay(400);
      return { success: true, message: "Message dispatched to admin." };
    }
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  submitEvent: async (data) => {
    if (USE_MOCK) {
      await delay(400);
      return { success: true, message: "Registered for the event successfully." };
    }
    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  submitCollaboration: async (data) => {
    if (USE_MOCK) {
      await delay(500);
      return { success: true, message: "Partnership proposal logged successfully." };
    }
    const res = await fetch(`${API_BASE}/collaborations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};