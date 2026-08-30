import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  FileSpreadsheet, 
  Megaphone, 
  Trophy, 
  Image as ImageIcon, 
  LayoutTemplate, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Download, 
  FileText, 
  ExternalLink, 
  BookOpen, 
  Users, 
  Handshake, 
  Calendar, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  CalendarDays, 
  Info,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Award,
  Medal,
  Copy,
  Layers,
  Save,
  Globe,
  HelpCircle,
  PhoneCall,
  Compass,
  UserPlus,
  Lock,
  Activity,
  UserCheck
} from 'lucide-react';

function AdminDashboard() {
  const [currentSection, setCurrentSection] = useState('roles'); // Defaulting to roles to review Step 8
  const [subTab, setSubTab] = useState('essays');
  const [cmsPageTab, setCmsPageTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Active Admin Profile
  const [activeAdmin] = useState({
    name: 'Anees Anwaar',
    email: 'admin@roshansafha.org',
    role: 'Super Admin'
  });

  // Time-Series Historical Dataset for AI Linear Regression
  const timeSeriesData = [
    { month: 'Mar 2026', label: 'Mar', books: 15, participation: 8 },
    { month: 'Apr 2026', label: 'Apr', books: 28, participation: 14 },
    { month: 'May 2026', label: 'May', books: 42, participation: 25 },
    { month: 'Jun 2026', label: 'Jun', books: 65, participation: 40 },
    { month: 'Jul 2026', label: 'Jul', books: 90, participation: 75 },
    { month: 'Aug 2026', label: 'Aug', books: 130, participation: 110 }
  ];

  // Mathematical Linear Regression Engine
  const linearRegression = (dataArray, key) => {
    const n = dataArray.length;
    if (n === 0) return { slope: 0, intercept: 0, forecastNext: 0, growthRate: 0, trend: 'Stable' };

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
      const y = dataArray[i][key];
      sumX += i;
      sumY += y;
      sumXY += i * y;
      sumXX += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
    const intercept = (sumY - slope * sumX) / n;
    const forecastNext = Math.round(slope * n + intercept);
    const growthRate = Math.round(((dataArray[n - 1][key] - dataArray[0][key]) / dataArray[0][key]) * 100);

    return {
      slope: parseFloat(slope.toFixed(2)),
      intercept: parseFloat(intercept.toFixed(2)),
      forecastNext: Math.max(0, forecastNext),
      growthRate,
      trend: slope > 5 ? 'High Acceleration' : slope > 0 ? 'Steady Growth' : 'Decline'
    };
  };

  const bookModel = useMemo(() => linearRegression(timeSeriesData, 'books'), [timeSeriesData]);
  const participationModel = useMemo(() => linearRegression(timeSeriesData, 'participation'), [timeSeriesData]);

  // Submissions Store
  const [submissions, setSubmissions] = useState({
    essays: [
      { _id: 'ess_101', studentName: 'Maryam Tariq', age: 15, institutionName: 'APS Muzaffarabad', category: 'Junior', email: 'maryam@example.com', phone: '03125554433', essayTitle: 'The Power of Books in Challenging Environments', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Winner' },
      { _id: 'ess_102', studentName: 'Zaid Abbasi', age: 19, institutionName: 'University of AJK', category: 'Senior', email: 'zaid@example.com', phone: '03457788990', essayTitle: 'Sustainable Literacy & AI in Kashmir', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Pending' }
    ],
    donations: [
      { _id: 'don_201', name: 'Ahmad Raza', email: 'ahmad@example.com', phone: '03001234567', city: 'Muzaffarabad', numberOfBooks: 15, bookTypes: 'Matric Science & Math', dropoffMethod: 'Drop-off', message: 'Dropping off at center.' },
      { _id: 'don_202', name: 'Khadija Bibi', email: 'khadija@example.com', phone: '03339876543', city: 'Rawalakot', numberOfBooks: 30, bookTypes: 'FSc Pre-Engineering', dropoffMethod: 'Courier', message: 'Shipped via courier.' }
    ],
    volunteers: [
      { _id: 'vol_301', name: 'Bilal Ahmed', age: 21, email: 'bilal@example.com', phone: '03017788999', city: 'Muzaffarabad', skills: 'Book Binding, Sorting', availability: 'Weekends (10 AM - 4 PM)', message: 'Ready to volunteer.' }
    ],
    collaborations: [
      { _id: 'col_401', name: 'Dr. Rashid Khan', organization: 'AJK Youth Foundation', email: 'rashid@ajkyouth.org', phone: '03009988776', collabType: 'School / College Partnership', message: 'Book drive sponsorship.' }
    ],
    events: [
      { _id: 'eve_501', name: 'Farooq Lone', email: 'farooq@example.com', phone: '03005544332', eventName: 'SDGs Summer Circle 2026', attendees: 2, message: 'Attending workshop.' }
    ],
    contacts: [
      { _id: 'con_601', name: 'Sana Mir', email: 'sana@example.com', subject: 'Hub Timings', message: 'When is the center open on weekends?' }
    ]
  });

  // Announcements Store
  const [announcements, setAnnouncements] = useState([
    { _id: 'ann_1', title: 'Annual Youth Essay Competition 2026 Launched', category: 'Contest', status: 'Published', publishDate: '2026-08-15', author: 'Anees Anwaar', excerpt: 'Submissions are officially open across Azad Kashmir.', content: 'Full details on topics and prizes...' }
  ]);
  const [announcementFilter, setAnnouncementFilter] = useState('All');
  const [isEditingPost, setIsEditingPost] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postFormData, setPostFormData] = useState({ title: '', category: 'General', status: 'Published', publishDate: '2026-08-30', excerpt: '', content: '' });

  // Contests Store
  const [activeContestConfig, setActiveContestConfig] = useState({
    editionYear: '2026',
    status: 'Open for Submissions',
    deadline: '2026-10-30',
    juniorTheme: 'The Book That Changed My Perspective',
    juniorWordLimit: '500 – 800 words',
    seniorTheme: 'Sustainable Literacy in the AI Century',
    seniorWordLimit: '1,000 – 1,500 words',
    prizes: 'Shields, Certificates, Cash Awards & Book Hampers'
  });

  const [winnersArchive, setWinnersArchive] = useState([
    { _id: 'win_1', editionYear: '2025', category: 'Senior', placement: '1st Place / Gold', studentName: 'Fatima Noor', institution: 'Degree College Rawalakot', essayTitle: 'Rebuilding Communities Through Accessible Knowledge', awardPrizes: 'Rs. 15,000 Cash + Shield' }
  ]);
  const [isAddingWinner, setIsAddingWinner] = useState(false);
  const [winnerFormData, setWinnerFormData] = useState({ editionYear: '2026', category: 'Senior', placement: '1st Place / Gold', studentName: '', institution: '', essayTitle: '', awardPrizes: '' });

  // Gallery Store
  const [galleryAlbums, setGalleryAlbums] = useState(['All Albums', 'Book Restoration Hub', 'SDGs Summer Circle 2026', 'Essay Award Ceremony', 'Community Libraries']);
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState('All Albums');
  const [galleryPhotos, setGalleryPhotos] = useState([
    { _id: 'gal_1', album: 'Book Restoration Hub', caption: 'Volunteers rebinding textbooks in Muzaffarabad center.', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop', date: '2026-08-18' }
  ]);
  const [isAddingPhotos, setIsAddingPhotos] = useState(false);
  const [photoFormData, setPhotoFormData] = useState({ album: 'Book Restoration Hub', caption: '', imageUrls: '', date: '2026-08-30' });

  // Multi-Page CMS Store
  const [cmsContent, setCmsContent] = useState({
    home: {
      badge: 'Empowering Youth & Literacy in Azad Kashmir',
      headline: 'Second Chances for Everyone & Everything.',
      subtext: 'Roshan Safha is dedicated to restoring books, igniting creative minds through essay competitions, and driving community literacy across Muzaffarabad and beyond.',
      statBooks: '1,450+',
      statStudents: '3,800+',
      statSchools: '52+'
    },
    about: {
      missionHeading: 'Bridging the Literacy Gap with Second-Hand Books',
      missionBody: 'Founded with a belief that no student in Azad Kashmir should abandon their academic aspirations due to unaffordable syllabus textbooks.',
      visionStatement: 'To establish zero-cost textbook lending circles in every district of AJK.',
      coreValues: 'Environmental Stewardship, Accessible Education, Youth Empowerment'
    },
    programs: {
      summerCircleHeadline: 'SDGs Summer Circle 2026',
      summerCircleDescription: 'Interactive reading clubs focused on climate action, youth leadership, and sustainable community building.',
      bookDonationGuidelines: 'We accept Matric (9th-10th), FSc (11th-12th), O/A Levels, and general literature in readable condition.'
    },
    getInvolved: {
      volunteerCallout: 'Join our grassroots team in Muzaffarabad as a book binder, cataloger, or workshop mentor.',
      collabCallout: 'We partner with colleges, youth clubs, and NGOs to run targeted community book drives.'
    },
    contact: {
      hubAddress: 'Roshan Safha Hub, Near University Ground, Muzaffarabad, Azad Kashmir',
      phoneWhatsApp: '+92 300 1234567',
      officialEmail: 'info@roshansafha.org',
      visitingHours: 'Monday – Saturday: 10:00 AM – 5:00 PM'
    }
  });

  // STEP 8: Team User Roles & Permissions Store
  const [teamMembers, setTeamMembers] = useState([
    {
      _id: 'usr_1',
      name: 'Anees Anwaar',
      email: 'admin@roshansafha.org',
      role: 'Super Admin',
      status: 'Active',
      lastActive: 'Just Now',
      permissions: ['All Modules', 'Export CSV', 'Manage Roles', 'CMS Live Edit']
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
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 'log_1', user: 'Anees Anwaar', action: 'Published announcement: Annual Youth Essay Competition 2026', timestamp: '2026-08-30 11:20 AM' },
    { id: 'log_2', user: 'Anees Anwaar', action: 'Exported ESSAYS dataset to CSV', timestamp: '2026-08-30 09:45 AM' },
    { id: 'log_3', user: 'Hamza Sheikh', action: 'Uploaded 3 photos to Book Restoration Hub album', timestamp: '2026-08-29 04:15 PM' }
  ]);

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'Content Editor',
    temporaryPassword: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const recordAudit = (actionText) => {
    const newLog = {
      id: `log_${Date.now()}`,
      user: activeAdmin.name,
      action: actionText,
      timestamp: '2026-08-30 02:45 PM'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      showToast('Please provide member name and email.');
      return;
    }

    const permMap = {
      'Super Admin': ['All Modules', 'Export CSV', 'Manage Roles', 'CMS Live Edit'],
      'Content Editor': ['Announcements', 'Gallery Uploads', 'CMS Pages'],
      'Volunteer Coordinator': ['Submissions Review', 'Volunteer Rosters', 'Event RSVPs']
    };

    const newMember = {
      _id: `usr_${Date.now()}`,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: 'Active',
      lastActive: 'Invitation Sent',
      permissions: permMap[newUserForm.role] || ['Submissions Review']
    };

    setTeamMembers([...teamMembers, newMember]);
    recordAudit(`Invited team member ${newMember.name} as ${newMember.role}`);
    setIsAddingUser(false);
    setNewUserForm({ name: '', email: '', role: 'Content Editor', temporaryPassword: '' });
    showToast(`Access invitation sent to ${newMember.email}!`);
  };

  const handleRemoveUser = (id, name) => {
    if (id === 'usr_1') {
      showToast('Cannot revoke primary Super Admin access.');
      return;
    }
    if (window.confirm(`Revoke administrative access for ${name}?`)) {
      setTeamMembers(teamMembers.filter((m) => m._id !== id));
      recordAudit(`Revoked administrative access for ${name}`);
      showToast(`User ${name} removed.`);
    }
  };

  const exportToCSV = (collectionName, dataList) => {
    if (!dataList || !dataList.length) {
      showToast('No records available to export.');
      return;
    }
    const headers = Object.keys(dataList[0]).join(',');
    const rows = dataList.map((obj) => Object.values(obj).map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RoshanSafha_${collectionName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    recordAudit(`Exported ${collectionName} records to CSV`);
    showToast(`Exported ${collectionName} records to CSV.`);
  };

  const navItems = [
    { id: 'submissions', label: 'Form Submissions & Export', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'analytics', label: 'AI Trend Analytics', icon: <TrendingUp className="w-4 h-4" />, badge: 'ML Linear Model' },
    { id: 'announcements', label: 'Announcements & Blog', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'contests', label: 'Contests & Winners', icon: <Trophy className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery & Media Library', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'cms', label: 'Page Content CMS', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'roles', label: 'Team Roles & Audit Log', icon: <ShieldCheck className="w-4 h-4" />, badge: `${teamMembers.length} Members` }
  ];

  // SVG Chart Geometry
  const chartWidth = 720;
  const chartHeight = 240;
  const padX = 45;
  const padY = 35;
  const maxScaleVal = 160;

  const getX = (i) => padX + (i * (chartWidth - 2 * padX)) / (timeSeriesData.length - 1);
  const getY = (val) => chartHeight - padY - (val / maxScaleVal) * (chartHeight - 2 * padY);

  const bookPath = timeSeriesData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.books)}`).join(' ');
  const partPath = timeSeriesData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.participation)}`).join(' ');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-950 text-[#E8A94A] border border-[#E8A94A]/40 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#E8A94A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-slate-900 text-slate-200 flex flex-col justify-between border-r border-slate-800 transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E8A94A] flex items-center justify-center text-slate-950 font-black text-base shadow-sm">
                RS
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white tracking-tight">Roshan Safha</h2>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Admin Control</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {activeAdmin.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{activeAdmin.name}</p>
              <span className="inline-block text-[9px] font-bold bg-[#E8A94A]/20 text-[#E8A94A] px-2 py-0.5 rounded-md mt-0.5">
                {activeAdmin.role}
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-3">Main Modules</span>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentSection === item.id
                    ? 'bg-[#E8A94A] text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                    currentSection === item.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/30 rounded-xl transition cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 capitalize">
                {navItems.find((n) => n.id === currentSection)?.label}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">Roshan Safha Automated Operations System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
        </header>

        {/* Dynamic Section View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* MODULE 7: TEAM USER ROLES & AUDIT LOG (STEP 8) */}
          {currentSection === 'roles' && (
            <div className="space-y-8">
              
              {/* Header & Add User Action */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#E8A94A]/20 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E8A94A]" /> Access Control Matrix
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Team Roles & Administrator Accounts</h3>
                  <p className="text-xs text-slate-500">Configure permission tiers, invite team moderators, and audit operational activity.</p>
                </div>

                <button
                  onClick={() => setIsAddingUser(true)}
                  className="flex items-center gap-2 bg-[#E8A94A] hover:bg-[#d99839] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-xs transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Team Member
                </button>
              </div>

              {/* Team Members List */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">Active Authorized Accounts</h4>
                  <p className="text-xs text-slate-500">Team members with secure backend console access.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-4">Member Name</th>
                        <th className="p-4">Role Tier</th>
                        <th className="p-4">Module Permissions</th>
                        <th className="p-4">Status & Last Login</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teamMembers.map((member) => (
                        <tr key={member._id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">{member.name}</span>
                                <span className="text-[10px] text-slate-400">{member.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${
                              member.role === 'Super Admin' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                              member.role === 'Content Editor' ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            }`}>
                              {member.role}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {member.permissions.map((perm, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-700 text-[9px] font-semibold px-2 py-0.5 rounded">
                                  {perm}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span>{member.status}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">{member.lastActive}</span>
                          </td>

                          <td className="p-4 text-right">
                            {member.role !== 'Super Admin' ? (
                              <button
                                onClick={() => handleRemoveUser(member._id, member.name)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Revoke access"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">Protected</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activity Audit Trail */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-slate-700" />
                      Security Audit Trail
                    </h4>
                    <p className="text-xs text-slate-500">Log of recent administrator actions and database exports.</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Live Stream</span>
                </div>

                <div className="space-y-2.5">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.user}:</span>
                        <span className="text-slate-600">{log.action}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* INVITE MEMBER MODAL */}
              {isAddingUser && (
                <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 relative animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
                        <p className="text-xs text-slate-500">Grant administrative dashboard credentials.</p>
                      </div>
                      <button onClick={() => setIsAddingUser(false)} className="p-1 text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateUser} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Zainab Ahmed"
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="member@roshansafha.org"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Role & Privilege Tier *</label>
                        <select
                          value={newUserForm.role}
                          onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                        >
                          <option value="Super Admin">Super Admin (Full Access & User Management)</option>
                          <option value="Content Editor">Content Editor (Announcements, Gallery & CMS)</option>
                          <option value="Volunteer Coordinator">Volunteer Coordinator (Submissions & RSVPs)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingUser(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#E8A94A] hover:bg-[#d99839] text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-sm transition"
                        >
                          Send Invitation
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* MODULE 6: MULTI-PAGE CMS (STEP 7) */}
          {currentSection === 'cms' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Multi-Page Content Management</h3>
                  <p className="text-xs text-slate-500">Edit headlines, mission statements, and impact counters.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                  {['home', 'about', 'programs', 'get-involved', 'contact'].map((tab) => (
                    <button key={tab} onClick={() => setCmsPageTab(tab)} className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${cmsPageTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}>
                      {tab.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
                <label className="block text-xs font-bold text-slate-700">Hero Main Headline</label>
                <input
                  type="text"
                  value={cmsContent.home.headline}
                  onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, headline: e.target.value } })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
                <button onClick={() => showToast('Changes saved!')} className="bg-[#E8A94A] text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save CMS Changes
                </button>
              </div>
            </div>
          )}

          {/* MODULE 5: GALLERY & MEDIA LIBRARY (STEP 6) */}
          {currentSection === 'gallery' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">Gallery & Media Assets</h3>
                <span className="text-xs text-slate-500">{galleryPhotos.length} photos</span>
              </div>
            </div>
          )}

          {/* MODULE 4: CONTESTS & WINNERS (STEP 5) */}
          {currentSection === 'contests' && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Edition {activeContestConfig.editionYear} Rules & Parameters</h3>
                <p className="text-xs text-slate-500">Junior: {activeContestConfig.juniorTheme} | Senior: {activeContestConfig.seniorTheme}</p>
              </div>
            </div>
          )}

          {/* MODULE 3: ANNOUNCEMENTS & BLOG (STEP 4) */}
          {currentSection === 'announcements' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">Announcements & News Posts</h3>
                <button onClick={() => setIsCreatingPost(true)} className="bg-[#E8A94A] text-slate-950 px-4 py-2 rounded-xl text-xs font-bold">New Post</button>
              </div>
            </div>
          )}

          {/* MODULE 2: AI TREND ANALYTICS (STEP 3) */}
          {currentSection === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-400">Intake Velocity</span>
                  <div className="text-2xl font-black text-slate-900">+{bookModel.slope} books/mo</div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-400">September Forecast</span>
                  <div className="text-2xl font-black text-[#E8A94A]">~{bookModel.forecastNext} Books</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-6">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64 bg-slate-50/60 rounded-2xl border border-slate-100">
                  <path d={bookPath} fill="none" stroke="#059669" strokeWidth="3.5" />
                  <path d={partPath} fill="none" stroke="#E8A94A" strokeWidth="3.5" />
                </svg>
              </div>
            </div>
          )}

          {/* MODULE 1: FORM SUBMISSIONS (STEP 2) */}
          {currentSection === 'submissions' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">Submissions Hub</h3>
                <button onClick={() => exportToCSV('Essays', submissions.essays)} className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold">Export CSV</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;