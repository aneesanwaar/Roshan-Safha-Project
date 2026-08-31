// Centralized Frontend API & Mock Database Layer
// When Node.js/Express is running, these switch seamlessly to fetch('/api/...')

const DB_KEYS = {
  CMS: 'rs_cms_content_v1',
  ANNOUNCEMENTS: 'rs_announcements_v1',
  CONTESTS: 'rs_contests_v1',
  WINNERS: 'rs_winners_v1',
  GALLERY: 'rs_gallery_v1',
  ALBUMS: 'rs_albums_v1',
  SUBMISSIONS: 'rs_submissions_v1',
  PAGES_MENU: 'rs_pages_menu_v1',
  TEAM: 'rs_team_members_v1',
  LOGS: 'rs_audit_logs_v1'
};

// Initial Seed Data (Matches all User Requirements)
const INITIAL_CMS = {
  home: {
    heroBadge: "Empowering Youth & Literacy in Azad Kashmir",
    heroHeadline: "Second Chances for Everyone & Everything.",
    heroSubtext: "Roshan Safha is dedicated to restoring books, igniting creative minds through essay competitions, and driving community literacy across Muzaffarabad and beyond.",
    impactBooks: "1,450+",
    impactStudents: "3,800+",
    impactSchools: "52+",
    featuredContestTitle: "Annual Youth Essay Competition 2026",
    featuredContestDeadline: "October 30, 2026"
  },
  about: {
    heroTitle: "Our Mission & Journey in Kashmir",
    missionHeading: "Bridging the Literacy Gap with Restored Books",
    missionBody: "Founded with a belief that no student in Azad Kashmir should abandon their academic aspirations due to unaffordable syllabus textbooks.",
    visionStatement: "To establish zero-cost textbook lending circles and community libraries in every district of Azad Kashmir.",
    pillar1: "Environmental Stewardship & Textbook Rebinding",
    pillar2: "Free Accessible Curriculum Sets for High Schoolers",
    pillar3: "Youth Creative Writing & Literary Circle Initiatives"
  },
  programs: {
    donationHeading: "Textbook Recycling & Lending Hub",
    donationRules: "We accept Matric (9th-10th), FSc Pre-Med/Pre-Eng, ICS, and general literature in readable condition.",
    summerCircleTitle: "SDGs Summer Circle 2026",
    summerCircleDesc: "Interactive reading clubs focusing on climate action, youth leadership, and community reading circles."
  },
  getInvolved: {
    volunteerPitch: "Join our grassroots team in Muzaffarabad as a book binder, cataloger, workshop mentor, or event coordinator.",
    volunteerCommitment: "Flexible schedules (2-4 hours on weekends).",
    partnerPitch: "We collaborate with schools, colleges, and NGOs to host district-wide collection drives and essay circles."
  },
  contact: {
    hubAddress: "Roshan Safha Hub, Near University Ground, Muzaffarabad, Azad Kashmir",
    phone: "+92 300 1234567",
    whatsapp: "+92 300 1234567",
    email: "info@roshansafha.org",
    visitingHours: "Monday – Saturday: 10:00 AM – 5:00 PM (Closed Sundays)"
  }
};

const INITIAL_ANNOUNCEMENTS = [
  {
    _id: "ann_101",
    title: "Annual Youth Essay Competition 2026 Launched",
    category: "Contest",
    status: "Published",
    publishDate: "2026-08-15",
    author: "Anees Anwaar",
    excerpt: "Submissions are officially open across Azad Kashmir for Junior and Senior categories.",
    content: "We are excited to kick off our 2026 flagship essay contest encouraging critical thinking and youth literary participation. Prizes include books, trophies, and cash awards."
  },
  {
    _id: "ann_102",
    title: "SDGs Summer Circle Cohort B Registrations Open",
    category: "Workshop",
    status: "Published",
    publishDate: "2026-08-22",
    author: "Anees Anwaar",
    excerpt: "Interactive climate literacy and SDG awareness circle starting in Muzaffarabad.",
    content: "Join our youth circle exploring United Nations Sustainable Development Goals through reading clubs and community projects."
  },
  {
    _id: "ann_103",
    title: "Fall Semester High School Book Drive in Rawalakot",
    category: "Book Drive",
    status: "Scheduled",
    publishDate: "2026-09-10",
    author: "Anees Anwaar",
    excerpt: "Volunteer teams setting up collection points across regional colleges.",
    content: "Temporary desks will collect curriculum textbooks to supply rural high school libraries before midterm exams."
  }
];

const INITIAL_CONTEST = {
  editionYear: "2026",
  status: "Open for Submissions",
  deadline: "2026-10-30",
  juniorTheme: "The Book That Changed My Perspective",
  juniorWordLimit: "500 – 800 words",
  seniorTheme: "Sustainable Literacy in the AI Century",
  seniorWordLimit: "1,000 – 1,500 words",
  prizes: "Rs. 25,000 in Cash Prizes, Custom Shields & Merit Certificates"
};

const INITIAL_WINNERS = [
  {
    _id: "win_1",
    editionYear: "2025",
    category: "Senior",
    placement: "🥇 1st Place / Gold",
    studentName: "Fatima Noor",
    institution: "Degree College Rawalakot",
    essayTitle: "Rebuilding Communities Through Accessible Knowledge",
    awardPrizes: "Rs. 15,000 Cash + Shield & Certificate"
  },
  {
    _id: "win_2",
    editionYear: "2025",
    category: "Junior",
    placement: "🥈 Runner Up / Silver",
    studentName: "Hamza Tariq",
    institution: "Army Public School Muzaffarabad",
    essayTitle: "My Journey in the World of Urdu Novels",
    awardPrizes: "Book Hamper + Certificate"
  }
];

const INITIAL_ALBUMS = [
  "Book Restoration Hub",
  "SDGs Summer Circle 2026",
  "Essay Award Ceremonies",
  "Community Libraries"
];

const INITIAL_GALLERY = [
  {
    _id: "gal_1",
    album: "Book Restoration Hub",
    caption: "Volunteers rebinding damaged matric science textbooks at the Muzaffarabad center.",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop",
    date: "2026-08-18"
  },
  {
    _id: "gal_2",
    album: "SDGs Summer Circle 2026",
    caption: "Youth cohort exploring climate literacy and sustainable community reading models.",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop",
    date: "2026-08-22"
  },
  {
    _id: "gal_3",
    album: "Essay Award Ceremonies",
    caption: "Annual prize distribution honoring junior and senior essay contest laureates.",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop",
    date: "2026-07-29"
  }
];

const INITIAL_PAGES_MENU = [
  { id: 'home', name: 'Home', path: '/', isVisible: true, isNavHeader: true },
  { id: 'about', name: 'About Us', path: '/about', isVisible: true, isNavHeader: true },
  { id: 'donate', name: 'Donate Books', path: '/programs/donate-books', isVisible: true, isNavHeader: true },
  { id: 'catalog', name: 'Book Catalog', path: '/programs/book-catalog', isVisible: true, isNavHeader: true },
  { id: 'essays', name: 'Essay Contests', path: '/programs/essays', isVisible: true, isNavHeader: true },
  { id: 'summer-circle', name: 'Summer Circle', path: '/programs/summer-circle', isVisible: true, isNavHeader: true },
  { id: 'gallery', name: 'Gallery', path: '/gallery', isVisible: true, isNavHeader: true },
  { id: 'announcements', name: 'Announcements', path: '/announcements', isVisible: true, isNavHeader: true },
  { id: 'get-involved', name: 'Get Involved', path: '/get-involved', isVisible: true, isNavHeader: true },
  { id: 'contact', name: 'Contact', path: '/contact', isVisible: true, isNavHeader: true }
];

const INITIAL_TEAM = [
  {
    _id: 'usr_1',
    name: 'Anees Anwaar',
    email: 'admin@roshansafha.org',
    role: 'Super Admin',
    status: 'Active',
    lastActive: 'Just Now',
    permissions: ['All Modules', 'Export CSV/Excel/PDF', 'User Roles', 'CMS Live Edit']
  },
  {
    _id: 'usr_2',
    name: 'Hamza Sheikh',
    email: 'hamza@roshansafha.org',
    role: 'Content Editor',
    status: 'Active',
    lastActive: '3 hours ago',
    permissions: ['Announcements', 'Gallery Uploads', 'CMS Pages']
  },
  {
    _id: 'usr_3',
    name: 'Ayesha Tariq',
    email: 'ayesha@roshansafha.org',
    role: 'Volunteer Coordinator',
    status: 'Active',
    lastActive: 'Yesterday',
    permissions: ['Submissions Review', 'Volunteer Rosters', 'Event RSVPs']
  }
];

const INITIAL_SUBMISSIONS = {
  essays: [
    { _id: 'ess_101', studentName: 'Maryam Tariq', age: 15, institutionName: 'APS Muzaffarabad', category: 'Junior', email: 'maryam@example.com', phone: '03125554433', essayTitle: 'The Power of Books in Challenging Environments', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Winner', createdAt: '2026-08-20' },
    { _id: 'ess_102', studentName: 'Zaid Abbasi', age: 19, institutionName: 'University of AJK', category: 'Senior', email: 'zaid@example.com', phone: '03457788990', essayTitle: 'Sustainable Literacy & AI in Kashmir', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Pending', createdAt: '2026-08-26' }
  ],
  donations: [
    { _id: 'don_201', name: 'Ahmad Raza', email: 'ahmad@example.com', phone: '03001234567', city: 'Muzaffarabad', numberOfBooks: 15, bookTypes: 'Matric Science & Math', dropoffMethod: 'Drop-off', message: 'Delivering books Saturday morning.', createdAt: '2026-08-22' },
    { _id: 'don_202', name: 'Khadija Bibi', email: 'khadija@example.com', phone: '03339876543', city: 'Rawalakot', numberOfBooks: 30, bookTypes: 'FSc Pre-Engineering', dropoffMethod: 'Courier', message: 'Shipped via courier to main hub.', createdAt: '2026-08-25' }
  ],
  volunteers: [
    { _id: 'vol_301', name: 'Bilal Ahmed', age: 21, email: 'bilal@example.com', phone: '03017788999', city: 'Muzaffarabad', skills: 'Book Binding, Sorting & Cataloging', availability: 'Weekends (10 AM - 4 PM)', message: 'Excited to volunteer for book repairs.', createdAt: '2026-08-24' }
  ],
  collaborations: [
    { _id: 'col_401', name: 'Dr. Rashid Khan', organization: 'AJK Youth Development Society', email: 'rashid@ajkyouth.org', phone: '03009988776', collabType: 'School / College Partnership', message: 'Interested in sponsoring regional book collection drives.', createdAt: '2026-08-27' }
  ],
  events: [
    { _id: 'eve_501', name: 'Farooq Lone', email: 'farooq@example.com', phone: '03005544332', eventName: 'SDGs Summer Circle 2026', attendees: 2, message: 'Registering two students for workshop.', createdAt: '2026-08-28' }
  ],
  contacts: [
    { _id: 'con_601', name: 'Sana Mir', email: 'sana@example.com', subject: 'Book Hub Timings', message: 'What time is the hub open on Sundays?', createdAt: '2026-08-29' }
  ]
};

// Storage Helpers
const getStore = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setStore = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event('rs_data_synced'));
  } catch (e) {
    console.error('Storage error', e);
  }
};

// API Services Export
export const api = {
  // 1. CMS API
  getCMS: () => getStore(DB_KEYS.CMS, INITIAL_CMS),
  updateCMS: (data) => {
    setStore(DB_KEYS.CMS, data);
    return data;
  },

  // 2. Announcements & Blog API
  getAnnouncements: () => getStore(DB_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),
  createAnnouncement: (post) => {
    const current = api.getAnnouncements();
    const newPost = { _id: `ann_${Date.now()}`, ...post };
    const updated = [newPost, ...current];
    setStore(DB_KEYS.ANNOUNCEMENTS, updated);
    return newPost;
  },
  updateAnnouncement: (id, postData) => {
    const current = api.getAnnouncements();
    const updated = current.map((p) => (p._id === id ? { ...p, ...postData } : p));
    setStore(DB_KEYS.ANNOUNCEMENTS, updated);
    return updated;
  },
  deleteAnnouncement: (id) => {
    const current = api.getAnnouncements();
    const updated = current.filter((p) => p._id !== id);
    setStore(DB_KEYS.ANNOUNCEMENTS, updated);
    return updated;
  },

  // 3. Contests & Winners API
  getContestConfig: () => getStore(DB_KEYS.CONTESTS, INITIAL_CONTEST),
  updateContestConfig: (config) => {
    setStore(DB_KEYS.CONTESTS, config);
    return config;
  },
  getWinners: () => getStore(DB_KEYS.WINNERS, INITIAL_WINNERS),
  createWinner: (winner) => {
    const current = api.getWinners();
    const newWin = { _id: `win_${Date.now()}`, ...winner };
    const updated = [newWin, ...current];
    setStore(DB_KEYS.WINNERS, updated);
    return newWin;
  },
  updateWinner: (id, winnerData) => {
    const current = api.getWinners();
    const updated = current.map((w) => (w._id === id ? { ...w, ...winnerData } : w));
    setStore(DB_KEYS.WINNERS, updated);
    return updated;
  },
  deleteWinner: (id) => {
    const current = api.getWinners();
    const updated = current.filter((w) => w._id !== id);
    setStore(DB_KEYS.WINNERS, updated);
    return updated;
  },

  // 4. Gallery & Media API
  getAlbums: () => getStore(DB_KEYS.ALBUMS, INITIAL_ALBUMS),
  createAlbum: (albumName) => {
    const current = api.getAlbums();
    if (!current.includes(albumName)) {
      const updated = [...current, albumName];
      setStore(DB_KEYS.ALBUMS, updated);
      return updated;
    }
    return current;
  },
  getGallery: () => getStore(DB_KEYS.GALLERY, INITIAL_GALLERY),
  addPhotosToGallery: (photosArray) => {
    const current = api.getGallery();
    const newEntries = photosArray.map((p, i) => ({
      _id: `gal_${Date.now()}_${i}`,
      ...p
    }));
    const updated = [...newEntries, ...current];
    setStore(DB_KEYS.GALLERY, updated);
    return updated;
  },
  deletePhoto: (id) => {
    const current = api.getGallery();
    const updated = current.filter((p) => p._id !== id);
    setStore(DB_KEYS.GALLERY, updated);
    return updated;
  },

  // 5. Form Submissions API
  getSubmissions: () => getStore(DB_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS),
  updateEssayStatus: (id, status) => {
    const current = api.getSubmissions();
    const updatedEssays = current.essays.map((e) => (e._id === id ? { ...e, status } : e));
    const updated = { ...current, essays: updatedEssays };
    setStore(DB_KEYS.SUBMISSIONS, updated);
    return updated;
  },

  // 6. Page & Menu Management API
  getPagesMenu: () => getStore(DB_KEYS.PAGES_MENU, INITIAL_PAGES_MENU),
  updatePageMenuItem: (id, updates) => {
    const current = api.getPagesMenu();
    const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setStore(DB_KEYS.PAGES_MENU, updated);
    return updated;
  },

  // 7. Team Roles & Members API
  getTeamMembers: () => getStore(DB_KEYS.TEAM, INITIAL_TEAM),
  createTeamMember: (member) => {
    const current = api.getTeamMembers();
    const permMap = {
      'Super Admin': ['All Modules', 'Export CSV/Excel/PDF', 'User Roles', 'CMS Live Edit'],
      'Content Editor': ['Announcements', 'Gallery Uploads', 'CMS Pages'],
      'Volunteer Coordinator': ['Submissions Review', 'Volunteer Rosters', 'Event RSVPs']
    };
    const newMember = {
      _id: `usr_${Date.now()}`,
      status: 'Active',
      lastActive: 'Invitation Sent',
      permissions: permMap[member.role] || ['Submissions Review'],
      ...member
    };
    const updated = [...current, newMember];
    setStore(DB_KEYS.TEAM, updated);
    return newMember;
  },
  deleteTeamMember: (id) => {
    const current = api.getTeamMembers();
    const updated = current.filter((m) => m._id !== id);
    setStore(DB_KEYS.TEAM, updated);
    return updated;
  }
};