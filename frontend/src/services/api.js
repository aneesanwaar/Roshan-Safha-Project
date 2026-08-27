import { 
  initialEssays, 
  initialGallery, 
  initialAnnouncements, 
  initialAvailableBooks 
} from './mockData';

const USE_MOCK = true;
const API_BASE = "http://localhost:5000/api";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Data In-Memory State
let mockEssays = [...(initialEssays || [])];
let mockGallery = [...(initialGallery || [])];
let mockAnnouncements = [...(initialAnnouncements || [])];
let mockBooks = [...(initialAvailableBooks || [])];

let mockDonations = [
  {
    _id: "don_01",
    name: "Tariq Mehmood",
    email: "tariq@example.com",
    phone: "0300-5551234",
    city: "Muzaffarabad",
    numberOfBooks: 25,
    dropoffMethod: "Drop-off",
    message: "Science and English textbooks for grades 9-10",
    createdAt: "2026-08-15T10:00:00.000Z"
  }
];

let mockVolunteers = [
  {
    _id: "vol_01",
    name: "Zainab Bibi",
    age: 21,
    email: "zainab@example.com",
    phone: "0312-3344556",
    city: "Muzaffarabad",
    skills: "Book Repairing, Event Logistics",
    availability: "Weekends",
    createdAt: "2026-08-16T12:00:00.000Z"
  }
];

let mockBookRequests = [
  {
    _id: "req_01",
    studentName: "Hamza Abbasi",
    school: "Govt High School No. 1",
    phone: "0345-6789012",
    city: "Muzaffarabad",
    bookTitle: "Punjab Textbook Board Mathematics (Class 9)",
    createdAt: "2026-08-18T14:30:00.000Z"
  }
];

export const api = {
  // ==================== 1. ESSAY CONTESTS ====================
  submitEssay: async (formData) => {
    if (USE_MOCK) {
      await delay(800);
      const newEntry = {
        _id: `mock_essay_${Date.now()}`,
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

  // ==================== 2. AVAILABLE BOOKS & INVENTORY ====================
  getAvailableBooks: async () => {
    if (USE_MOCK) {
      await delay(300);
      return mockBooks;
    }
    const res = await fetch(`${API_BASE}/books`);
    return res.json();
  },

  submitBookRequest: async (data) => {
    if (USE_MOCK) {
      await delay(500);
      const newRequest = {
        _id: `mock_req_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString()
      };
      mockBookRequests.unshift(newRequest);
      return { success: true, message: `Your request for "${data.bookTitle}" has been queued for distribution!` };
    }
    const res = await fetch(`${API_BASE}/books/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // ==================== 3. BOOK DONATIONS & PLEDGES ====================
  submitDonation: async (data) => {
    if (USE_MOCK) {
      await delay(500);
      const newDonation = {
        _id: `mock_don_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString()
      };
      mockDonations.unshift(newDonation);
      return { success: true, message: "Thank you for pledging books to Roshan Safha!" };
    }
    const res = await fetch(`${API_BASE}/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getAllDonations: async (token) => {
    if (USE_MOCK) {
      await delay(300);
      return mockDonations;
    }
    const res = await fetch(`${API_BASE}/donations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // ==================== 4. VOLUNTEERS ====================
  submitVolunteer: async (data) => {
    if (USE_MOCK) {
      await delay(500);
      const newVolunteer = {
        _id: `mock_vol_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString()
      };
      mockVolunteers.unshift(newVolunteer);
      return { success: true, message: "Volunteer registration received! We will be in touch." };
    }
    const res = await fetch(`${API_BASE}/volunteers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getAllVolunteers: async (token) => {
    if (USE_MOCK) {
      await delay(300);
      return mockVolunteers;
    }
    const res = await fetch(`${API_BASE}/volunteers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // ==================== 5. EVENTS & WORKSHOPS ====================
  submitEvent: async (data) => {
    if (USE_MOCK) {
      await delay(400);
      return { success: true, message: "Registered for the workshop / event successfully." };
    }
    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // ==================== 6. COLLABORATIONS & CONTACT ====================
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

  // ==================== 7. GALLERY & ANNOUNCEMENTS ====================
  getGallery: async () => {
    if (USE_MOCK) {
      await delay(300);
      return mockGallery;
    }
    const res = await fetch(`${API_BASE}/gallery`);
    return res.json();
  },

  addGalleryItem: async (item, token) => {
    if (USE_MOCK) {
      await delay(400);
      const newItem = { _id: `mock_gal_${Date.now()}`, ...item, createdAt: new Date().toISOString() };
      mockGallery.unshift(newItem);
      return { success: true, item: newItem };
    }
    const res = await fetch(`${API_BASE}/gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(item)
    });
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

  addAnnouncement: async (post, token) => {
    if (USE_MOCK) {
      await delay(400);
      const newPost = { _id: `mock_ann_${Date.now()}`, ...post, createdAt: new Date().toISOString() };
      mockAnnouncements.unshift(newPost);
      return { success: true, post: newPost };
    }
    const res = await fetch(`${API_BASE}/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(post)
    });
    return res.json();
  }
};