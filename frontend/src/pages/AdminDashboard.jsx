import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManageBooks from '../components/admin/ManageBooks';
import ManageBookRequests from '../components/admin/ManageBookRequests';
import AIAnalytics from "../components/admin/AIAnalytics";
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
  BookOpen,
  Users,
  Handshake,
  Calendar,
  Mail,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Clock,
  Copy,
  Save,
  PhoneCall,
  Compass,
  UserPlus,
  Printer,
  SlidersHorizontal,
  UploadCloud
} from 'lucide-react';

import {
  getAdminSubmissions,
  updateSubmissionStatus,
  getPageContent,
  updatePageContent,
  uploadCmsImage,
  getAdminWinners,
  createAdminWinner,
  deleteAdminWinner,
  getAdminMenuItems,
  updateAdminMenuItem,
  getAdminTeamUsers,
  exportAdminSubmissions,
  getAdminGalleryPhotos,
  uploadAdminGalleryPhoto,
  deleteAdminGalleryPhoto
} from '../services/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('analytics');
  const [subTab, setSubTab] = useState('essays');
  const [cmsPageTab, setCmsPageTab] = useState('contact');
  // Homepage CMS image management
  const [cmsImageUploading, setCmsImageUploading] = useState(null);
  const [cmsImageSaving, setCmsImageSaving] = useState(false);
  const [cmsImagePreviews, setCmsImagePreviews] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Load the administrator authenticated by the login page.
  const [activeAdmin] = useState(() => {
    try {
      const storedAdmin = localStorage.getItem('roshan_admin');

      if (!storedAdmin) {
        return null;
      }

      const parsedAdmin = JSON.parse(storedAdmin);

      if (
        !parsedAdmin ||
        typeof parsedAdmin !== 'object' ||
        typeof parsedAdmin.name !== 'string' ||
        typeof parsedAdmin.email !== 'string' ||
        typeof parsedAdmin.role !== 'string'
      ) {
        return null;
      }

      return {
        name: parsedAdmin.name,
        email: parsedAdmin.email,
        role: parsedAdmin.role,
      };
    } catch (error) {
      console.error('Failed to load administrator profile:', error);
      return null;
    }
  });

  // State Stores
  const [submissions, setSubmissions] = useState({
    essays: [],
    donations: [],
    volunteers: [],
    collaborations: [],
    events: [],
    contacts: []
  });

  const [announcements, setAnnouncements] = useState([
    {
      _id: 'ann-1',
      title: 'Roshan Safha Annual Essay Writing Contest 2026 Announced',
      category: 'Contest',
      status: 'Published',
      publishDate: '2026-08-31',
      excerpt: 'Open for high school and university students across Azad Kashmir.',
      content: 'Submissions are now open for both Junior and Senior categories.',
      author: 'Anees Anwaar'
    }
  ]);

  const [contestConfig, setContestConfig] = useState({
    editionYear: '2026',
    status: 'Active',

    // Junior Category
    juniorTheme: 'The Book That Changed My Perspective',
    juniorWordLimit: '1,000 words',
    juniorFormats: 'PDF, DOC, DOCX',
    juniorPrizes: 'Shields, Certificates & Book Hampers',
    juniorDeadline: '2026-10-30',

    // Senior Category
    seniorTheme: 'Digital Media vs. Physical Libraries in Modern Civic Literacy',
    seniorWordLimit: '2,500 words',
    seniorFormats: 'PDF, DOC, DOCX',
    seniorPrizes: 'Cash Award & Publication Feature',
    seniorDeadline: '2026-10-30'
  });

  const [winnersArchive, setWinnersArchive] = useState([]);
  const [galleryAlbums, setGalleryAlbums] = useState(['Book Restoration Hub', 'Annual Book Drives', 'Community Workshops']);
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  // Multi-Page Content CMS State
  const [cmsContent, setCmsContent] = useState({
    home: {
      heroHeadline: 'Spreading the Light of Literature & Knowledge',
      heroSubtext: 'Revitalizing physical book access, youth essays, and volunteer community libraries.',
      impactBooks: '1,450+',
      impactStudents: '3,200+',
      impactSchools: '24'
    },
    about: {
      heroTitle: 'Rooted in Local Literacy and Action',
      missionBody: 'To bridge book accessibility disparities across regional communities.',
      visionStatement: 'A sustainable network of restored community reading libraries.'
    },
    programs: {
      donationHeading: 'Book Drive & Circulation Cycle',
      donationRules: 'Accepting academic course books, fiction, history, and general reference volumes.'
    },
    getInvolved: {
      volunteerPitch: 'Join our local teams in sorting, binding, cataloging, and dispatching books.',
      partnerPitch: 'Collaborate with educational institutions to set up local drop boxes.'
    },
    contact: {
      hubAddress: 'Roshan Safha Reading Hub, Muzaffarabad, AJK',
      whatsapp: '+92 300 1234567',
      email: 'contact@roshansafha.org',
      deskHours: 'Monday – Saturday (10:00 AM – 5:00 PM)',
      deskNotice: 'Our regional coordination desk handles donor schedules, volunteer intake, and essay verifications.',
      urgencyNote: 'For urgent book collection inquiries, WhatsApp is the quickest channel for real-time drop-off routing.',
      formHeading: 'Send an Online Inquiry',
      formSubtext: 'All submissions are archived securely in the Admin Dashboard.'
    }
  });

  const [pagesMenu, setPagesMenu] = useState([
    { _id: 'p-1', name: 'Home', path: '/', isNavHeader: true, isVisible: true },
    { _id: 'p-2', name: 'About Us', path: '/about', isNavHeader: true, isVisible: true },
    { _id: 'p-3', name: 'Programs & Drives', path: '/programs', isNavHeader: true, isVisible: true },
    { _id: 'p-4', name: 'Digital Contest', path: '/contest', isNavHeader: true, isVisible: true },
    { _id: 'p-5', name: 'Gallery', path: '/gallery', isNavHeader: true, isVisible: true },
    { _id: 'p-6', name: 'Get Involved', path: '/get-involved', isNavHeader: true, isVisible: true },
    { _id: 'p-7', name: 'Contact', path: '/contact', isNavHeader: true, isVisible: true }
  ]);

  const [teamMembers, setTeamMembers] = useState([]);


  // Hydrate Data on Mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [
          essaysRes,
          donationsRes,
          volunteersRes,
          collabsRes,
          contactsRes,
          winnersRes,
          menuRes,
          usersRes,
          galleryRes,
          contestRes
        ] = await Promise.allSettled([
          getAdminSubmissions('essays'),
          getAdminSubmissions('donations'),
          getAdminSubmissions('volunteers'),
          getAdminSubmissions('collaborations'),
          getAdminSubmissions('contacts'),
          getAdminWinners(),
          getAdminMenuItems(),
          getAdminTeamUsers(),
          getAdminGalleryPhotos(),
          getPageContent('contest')
        ]);

        setSubmissions((prev) => ({
          ...prev,
          essays: essaysRes.status === 'fulfilled' && essaysRes.value?.data?.submissions ? essaysRes.value.data.submissions : prev.essays,
          donations: donationsRes.status === 'fulfilled' && donationsRes.value?.data?.submissions ? donationsRes.value.data.submissions : prev.donations,
          volunteers: volunteersRes.status === 'fulfilled' && volunteersRes.value?.data?.submissions ? volunteersRes.value.data.submissions : prev.volunteers,
          collaborations: collabsRes.status === 'fulfilled' && collabsRes.value?.data?.submissions ? collabsRes.value.data.submissions : prev.collaborations,
          contacts: contactsRes.status === 'fulfilled' && contactsRes.value?.data?.submissions ? contactsRes.value.data.submissions : prev.contacts
        }));

        if (winnersRes.status === 'fulfilled' && winnersRes.value?.data?.data) {
          setWinnersArchive(winnersRes.value.data.data);
        }
        if (menuRes.status === 'fulfilled' && menuRes.value?.data?.data?.length > 0) {
          setPagesMenu(menuRes.value.data.data);
        }
        if (usersRes.status === 'fulfilled' && usersRes.value?.data?.data) {
          setTeamMembers(usersRes.value.data.data);
        }
        if (galleryRes.status === 'fulfilled') {
          const list = galleryRes.value?.data?.data || galleryRes.value?.data || [];
          if (Array.isArray(list)) {
            setGalleryPhotos(list);
            const loadedAlbums = Array.from(new Set(list.map((p) => p.album).filter(Boolean)));
            if (loadedAlbums.length > 0) {
              setGalleryAlbums((prev) => Array.from(new Set([...prev, ...loadedAlbums])));
            }
          }
        }
        if (contestRes.status === 'fulfilled' && contestRes.value?.data?.content && Object.keys(contestRes.value.data.content).length > 0) {
          setContestConfig(contestRes.value.data.content);
        }
      } catch (err) {
        console.warn('Backend hydration notice: using current buffer.');
      }
    };

    fetchBackendData();
  }, []);




  // Load CMS Content on Tab Change
  useEffect(() => {
    const loadCMSPage = async () => {
      try {
        const res = await getPageContent(cmsPageTab);
        if (res.data?.success && res.data?.content && Object.keys(res.data.content).length > 0) {
          setCmsContent((prev) => ({
            ...prev,
            [cmsPageTab]: { ...prev[cmsPageTab], ...res.data.content }
          }));
        }
      } catch (err) {
        // retain state
      }
    };
    loadCMSPage();
  }, [cmsPageTab]);

  // Modals & Upload State
  const [announcementFilter, setAnnouncementFilter] = useState('All');
  const [isAddingPhotos, setIsAddingPhotos] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState('Book Restoration Hub');
  const [newAlbumInput, setNewAlbumInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(null);
  const [postForm, setPostForm] = useState({ title: '', category: 'General', status: 'Published', publishDate: '2026-08-31', excerpt: '', content: '' });

  const [isAddingWinner, setIsAddingWinner] = useState(false);
  const [winnerForm, setWinnerForm] = useState({ editionYear: '2026', category: 'Senior', placement: '🥇 1st Place / Gold', studentName: '', institution: '', essayTitle: '', awardPrizes: '' });

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'Content Editor' });


  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // End the current administrator session.
  const handleSignOut = () => {
    // Remove authentication data.
    localStorage.removeItem('roshan_token');
    localStorage.removeItem('roshan_admin');

    // Replace the current history entry so the Back button
    // does not return directly to the previous dashboard page.
    navigate('/admin/login', { replace: true });
  };

  // PDF Individual Essay Downloader
  const handleDownloadSingleEssay = async (item) => {
    if (!item.fileUrl || item.fileUrl === '#') {
      return showToast('No document attached to this entry.');
    }
    try {
      showToast(`Downloading ${item.studentName}'s essay...`);
      const response = await fetch(item.fileUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const cleanStudent = item.studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanTitle = item.essayTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
      link.download = `${cleanStudent}_${cleanTitle}_Essay.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      showToast(`Saved ${cleanStudent}_Essay.pdf`);
    } catch {
      window.open(item.fileUrl, '_blank');
    }
  };

  const handleDeviceFilesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newFilesData = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    }));
    setSelectedFiles((prev) => [...prev, ...newFilesData]);
  };

  // Cloudinary + MongoDB Live Gallery Upload
  const handleSaveGalleryUpload = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) return showToast('Please select an image first.');

    setIsUploading(true);
    showToast('Uploading to Cloudinary...');

    try {
      const newlyUploaded = [];
      for (const item of selectedFiles) {
        const formData = new FormData();
        formData.append('image', item.file);
        formData.append('title', item.caption || 'Roshan Safha Moment');
        formData.append('caption', item.caption || '');
        formData.append('album', selectedAlbum);
        formData.append('category', 'Event');

        const res = await uploadAdminGalleryPhoto(formData);
        if (res.data?.photo) {
          newlyUploaded.push(res.data.photo);
        }
      }

      setGalleryPhotos((prev) => [...newlyUploaded, ...prev]);
      setIsAddingPhotos(false);
      setSelectedFiles([]);
      showToast(`Successfully uploaded ${newlyUploaded.length} photo(s)!`);
    } catch (err) {
      console.error('Gallery upload failed:', err);
      showToast(err.response?.data?.error || 'Failed to upload photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Delete this photo from Cloudinary and database?')) return;
    try {
      await deleteAdminGalleryPhoto(photoId);
      setGalleryPhotos((prev) => prev.filter((p) => p._id !== photoId));
      showToast('Photo deleted successfully.');
    } catch (err) {
      showToast('Failed to delete photo.');
    }
  };

  const handleCreateNewAlbum = () => {
    if (!newAlbumInput.trim()) return;
    if (!galleryAlbums.includes(newAlbumInput.trim())) {
      setGalleryAlbums((prev) => [...prev, newAlbumInput.trim()]);
    }
    setSelectedAlbum(newAlbumInput.trim());
    setNewAlbumInput('');
    showToast(`Created album "${newAlbumInput.trim()}"`);
  };

  const handleStatusChange = async (type, id, newStatus) => {
    try {
      await updateSubmissionStatus(type, id, newStatus);

      // Update the dashboard only after the backend succeeds.
      setSubmissions((prev) => ({
        ...prev,
        [type]: prev[type].map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        ),
      }));

      showToast(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update submission status:", error);

      showToast("Failed to update status. Please try again.");
    }
  };
  const handleCmsImageUpload = async (slot, file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      showToast('Please select a JPG or PNG image.');
      return;
    }

    if (file.size > maxSize) {
      showToast('Image size must not exceed 5 MB.');
      return;
    }

    setCmsImageUploading(slot);

    try {
      const response = await uploadCmsImage(file);
      const uploaded = response.data?.data;

      if (!response.data?.success || !uploaded?.url || !uploaded?.publicId) {
        throw new Error('Invalid upload response.');
      }

      setCmsContent((prev) => ({
        ...prev,
        home: {
          ...prev.home,
          images: {
            ...(prev.home?.images || {}),
            [slot]: {
              url: uploaded.url,
              publicId: uploaded.publicId,
            },
          },
        },
      }));

      setCmsImagePreviews((prev) => ({
        ...prev,
        [slot]: uploaded.url,
      }));

      showToast('Image uploaded. Click Save Page Content to publish it.');
    } catch (error) {
      console.error('CMS image upload failed:', error);
      showToast(error.response?.data?.error || 'Image upload failed.');
    } finally {
      setCmsImageUploading(null);
    }
  };

  const handleSaveCMS = async () => {
    if (cmsImageUploading || cmsImageSaving) return;

    setCmsImageSaving(true);

    try {
      const response = await updatePageContent(
        cmsPageTab,
        cmsContent[cmsPageTab]
      );

      if (!response.data?.success) {
        throw new Error('CMS save was not confirmed.');
      }

      showToast(`${cmsPageTab.toUpperCase()} content saved successfully!`);
    } catch (error) {
      console.error('CMS save failed:', error);
      showToast(
        error.response?.data?.error ||
        'Failed to save page content. Your changes are not published.'
      );
    } finally {
      setCmsImageSaving(false);
    }
  };

  const handleSaveContestConfig = async (e) => {
    e.preventDefault();

    try {
      const response = await updatePageContent("contest", contestConfig);

      if (
        response?.data?.success !== true ||
        response?.data?.data?.page !== "contest"
      ) {
        throw new Error("Contest configuration save was not confirmed.");
      }

      showToast("Contest configuration & rules saved!");
    } catch (error) {
      console.error("Failed to save contest configuration:", error);

      showToast("Failed to save contest configuration & rules.");
    }
  };
  const handleAddWinnerSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createAdminWinner(winnerForm);

      if (!res.data?.success || !res.data?.data) {
        throw new Error("Backend did not confirm winner creation.");
      }

      // Add the winner only after successful database creation.
      setWinnersArchive((prev) => [res.data.data, ...prev]);

      setIsAddingWinner(false);
      showToast("Winner recorded successfully!");
    } catch (error) {
      console.error("Failed to create winner:", error);
      showToast("Failed to record winner. Please try again.");
    }
  };

  const handleDeleteWinner = async (id) => {
    if (!window.confirm("Delete winner entry?")) return;

    try {
      const res = await deleteAdminWinner(id);

      if (!res.data?.success) {
        throw new Error("Backend did not confirm winner deletion.");
      }

      // Remove the winner only after successful database deletion.
      setWinnersArchive((prev) =>
        prev.filter((w) => w._id !== id)
      );

      showToast("Winner removed.");
    } catch (error) {
      console.error("Failed to delete winner:", error);
      showToast("Failed to remove winner. Please try again.");
    }
  };

  const handleToggleMenuVisibility = async (item) => {
    const updatedVisible = !item.isVisible;

    try {
      const response = await updateAdminMenuItem(item._id, {
        isVisible: updatedVisible,
      });

      if (
        response?.data?.success !== true ||
        response?.data?.data?.isVisible !== updatedVisible
      ) {
        throw new Error("Menu visibility update was not confirmed.");
      }

      setPagesMenu((prev) =>
        prev.map((m) =>
          m._id === item._id
            ? { ...m, isVisible: updatedVisible }
            : m
        )
      );

      showToast(
        `${item.name} is now ${updatedVisible ? "visible" : "hidden"}`
      );
    } catch (error) {
      console.error("Failed to update menu visibility:", error);

      showToast(`Failed to update visibility for ${item.name}`);
    }
  };

  const navItems = [
    { id: 'analytics', label: 'AI Trend Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'submissions', label: 'Form Submissions & Export', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'books', label: 'Manage Books', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'bookRequests', label: 'Book Requests', icon: <FileText className="w-4 h-4" /> },
    { id: 'announcements', label: 'Announcements & Blog', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'contests', label: 'Contests & Winners', icon: <Trophy className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery & Media Library', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'cms', label: 'Page Content CMS', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu & Page Management', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'roles', label: 'Team Roles & Permissions', icon: <ShieldCheck className="w-4 h-4" /> }
  ];


  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-950 text-[#E8A94A] border border-[#E8A94A]/40 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#E8A94A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-slate-900 text-slate-200 flex flex-col justify-between border-r border-slate-800 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {activeAdmin?.name?.trim()?.charAt(0)?.toUpperCase() || 'A'}
            </div>

            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {activeAdmin?.name || 'Administrator'}
              </p>

              <p
                className="text-[10px] text-slate-400 truncate mt-0.5"
                title={activeAdmin?.email || ''}
              >
                {activeAdmin?.email || 'No profile loaded'}
              </p>

              <span className="inline-block text-[9px] font-bold bg-[#E8A94A]/20 text-[#E8A94A] px-2 py-0.5 rounded-md mt-1 capitalize">
                {activeAdmin?.role || 'Admin'}
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-3">Management Console</span>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${currentSection === item.id
                  ? 'bg-[#E8A94A] text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/30 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
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

          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Database Sync
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* BOOK INVENTORY MANAGEMENT */}
          {currentSection === 'books' && <ManageBooks />}
          {currentSection === 'bookRequests' && <ManageBookRequests />}

          {currentSection === "analytics" && (
            <AIAnalytics />
          )}

          {/* 2. FORM SUBMISSIONS & EXPORT */}
          {currentSection === 'submissions' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl">
                  {[
                    { id: 'essays', label: 'Essays', icon: <FileText className="w-3.5 h-3.5" />, count: submissions.essays?.length || 0 },
                    { id: 'donations', label: 'Donations', icon: <BookOpen className="w-3.5 h-3.5" />, count: submissions.donations?.length || 0 },
                    { id: 'volunteers', label: 'Volunteers', icon: <Users className="w-3.5 h-3.5" />, count: submissions.volunteers?.length || 0 },
                    { id: 'collaborations', label: 'Partnerships', icon: <Handshake className="w-3.5 h-3.5" />, count: submissions.collaborations?.length || 0 },
                    { id: 'events', label: 'Events', icon: <Calendar className="w-3.5 h-3.5" />, count: submissions.events?.length || 0 },
                    { id: 'contacts', label: 'Messages', icon: <Mail className="w-3.5 h-3.5" />, count: submissions.contacts?.length || 0 }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSubTab(tab.id);
                        setSearchQuery('');
                      }}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${subTab === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200/80 text-slate-700">{tab.count}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={`Search ${subTab}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => exportAdminSubmissions(subTab, 'csv')}
                      className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-300" /> CSV
                    </button>
                    <button
                      onClick={() => exportAdminSubmissions(subTab, 'excel')}
                      className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" /> Excel
                    </button>
                    <button
                      onClick={() => exportAdminSubmissions(subTab, 'pdf')}
                      className="flex items-center gap-1 bg-rose-700 hover:bg-rose-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-rose-200" /> PDF
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                {subTab === 'essays' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-4">Student</th>
                          <th className="p-4">Category & Age</th>
                          <th className="p-4">Essay Title</th>
                          <th className="p-4">Institution</th>
                          <th className="p-4">Essay Document</th>
                          <th className="p-4">Evaluation Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(submissions.essays || [])
                          .filter((e) => e.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) || e.essayTitle?.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-bold text-slate-900">
                                {item.studentName}
                                <span className="text-[10px] text-slate-400 font-normal block">{item.email} • {item.phone}</span>
                              </td>
                              <td className="p-4">
                                <span className="font-semibold text-slate-800">{item.category}</span>
                                <span className="text-slate-400 text-[10px] block">Age: {item.age}</span>
                              </td>
                              <td className="p-4 font-medium text-slate-900 max-w-xs truncate">{item.essayTitle}</td>
                              <td className="p-4">{item.institutionName}</td>
                              <td className="p-4">
                                {item.fileUrl && item.fileUrl !== '#' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadSingleEssay(item)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 transition shadow-2xs cursor-pointer active:scale-95"
                                  >
                                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Download PDF</span>
                                  </button>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">No file attached</span>
                                )}
                              </td>
                              <td className="p-4">
                                <select
                                  value={item.status}
                                  onChange={(e) => handleStatusChange('essays', item._id, e.target.value)}
                                  className="text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-none"
                                >
                                  <option value="Pending">⏳ Pending</option>
                                  <option value="Reviewed">🔍 Reviewed</option>
                                  <option value="Winner">🏆 Winner</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {subTab === 'donations' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-4">Donor</th>
                          <th className="p-4">City</th>
                          <th className="p-4">Quantity</th>
                          <th className="p-4">Book Types</th>
                          <th className="p-4">Method</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(submissions.donations || [])
                          .filter((d) => d.name?.toLowerCase().includes(searchQuery.toLowerCase()) || d.city?.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-bold text-slate-900">{item.name}<span className="text-[10px] text-slate-400 font-normal block">{item.phone} • {item.email}</span></td>
                              <td className="p-4 font-medium">{item.city}</td>
                              <td className="p-4 font-extrabold text-emerald-600">{item.numberOfBooks} books</td>
                              <td className="p-4 max-w-xs truncate">{item.bookTypes}</td>
                              <td className="p-4"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">{item.dropoffMethod}</span></td>
                              <td className="p-4">
                                <select
                                  value={item.status || 'Pledged'}
                                  onChange={(e) => handleStatusChange('donations', item._id, e.target.value)}
                                  className="text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-none"
                                >
                                  <option value="Pledged">📦 Pledged</option>
                                  <option value="Collected">✅ Collected</option>
                                  <option value="Distributed">📚 Distributed</option>
                                  <option value="Cancelled">❌ Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {subTab === 'volunteers' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-4">Volunteer</th>
                          <th className="p-4">City & Age</th>
                          <th className="p-4">Skills</th>
                          <th className="p-4">Availability</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(submissions.volunteers || []).map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-900">{item.name}<span className="text-[10px] text-slate-400 font-normal block">{item.email} • {item.phone}</span></td>
                            <td className="p-4">{item.city} (Age {item.age})</td>
                            <td className="p-4 font-semibold text-emerald-800">{item.skills}</td>
                            <td className="p-4">{item.availability}</td>
                            <td className="p-4">
                              <select
                                value={item.status || 'Pending'}
                                onChange={(e) => handleStatusChange('volunteers', item._id, e.target.value)}
                                className="text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-none"
                              >
                                <option value="Pending">⏳ Pending</option>
                                <option value="Active">🟢 Active</option>
                                <option value="Archived">⚪ Archived</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {subTab === 'collaborations' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-4">Representative</th>
                          <th className="p-4">Organization</th>
                          <th className="p-4">Collab Type</th>
                          <th className="p-4">Proposal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(submissions.collaborations || []).map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-900">{item.name}<span className="text-[10px] text-slate-400 font-normal block">{item.email} • {item.phone}</span></td>
                            <td className="p-4 font-bold text-slate-800">{item.organization}</td>
                            <td className="p-4 text-indigo-700 font-semibold">{item.collabType}</td>
                            <td className="p-4 text-slate-600 max-w-md">{item.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {subTab === 'events' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-4">Attendee</th>
                          <th className="p-4">Event Name</th>
                          <th className="p-4">Attendees Count</th>
                          <th className="p-4">Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(submissions.events || []).map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-900">{item.name}<span className="text-[10px] text-slate-400 font-normal block">{item.email} • {item.phone}</span></td>
                            <td className="p-4 font-bold text-teal-800">{item.eventName}</td>
                            <td className="p-4 font-extrabold text-slate-900">{item.attendees}</td>
                            <td className="p-4 text-slate-500 max-w-xs truncate">{item.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {subTab === 'contacts' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-4">Sender</th>
                          <th className="p-4">Subject</th>
                          <th className="p-4">Message Body</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(submissions.contacts || []).map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-900">{item.name}<span className="text-[10px] text-slate-400 font-normal block">{item.email}</span></td>
                            <td className="p-4 font-semibold text-slate-800">{item.subject}</td>
                            <td className="p-4 text-slate-600 max-w-md">{item.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. ANNOUNCEMENTS & BLOG */}
          {currentSection === 'announcements' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Announcements & News Posts</h3>
                  <p className="text-xs text-slate-500">Create, edit, schedule, and publish posts.</p>
                </div>
                <button
                  onClick={() => {
                    setIsCreatingPost(true);
                    setIsEditingPost(null);
                    setPostForm({ title: '', category: 'General', status: 'Published', publishDate: '2026-08-31', excerpt: '', content: '' });
                  }}
                  className="flex items-center gap-2 bg-[#E8A94A] hover:bg-[#d99839] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> New Announcement
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {announcements
                  .filter((p) => (announcementFilter === 'All' || p.category === announcementFilter) && p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((post) => (
                    <div key={post._id} className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">{post.category}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.status} • {post.publishDate}
                          </span>
                          <span className="text-[10px] text-slate-400">By {post.author}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">{post.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{post.excerpt || post.content}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setIsEditingPost(post);
                            setPostForm(post);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this announcement?')) {
                              setAnnouncements((prev) => prev.filter((p) => p._id !== post._id));
                              showToast('Announcement deleted.');
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 4. CONTESTS & WINNERS */}
          {currentSection === 'contests' && (
            <div className="space-y-8">
              {/* // Contest Rules & Settings  */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Edition {contestConfig.editionYear} Rules & Settings
                    </h3>

                    <p className="text-xs text-slate-500">
                      Manage essay themes, word limits, accepted formats, prizes,
                      and submission deadlines.
                    </p>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full">
                    {contestConfig.status}
                  </span>
                </div>

                <form onSubmit={handleSaveContestConfig} className="space-y-8">

                  {/* Junior Category */}
                  <div className="space-y-4">

                    <h4 className="text-sm font-bold text-emerald-800 border-b border-emerald-100 pb-2">
                      Junior Category (Under 16)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Junior Essay Theme / Title
                        </label>

                        <input
                          type="text"
                          required
                          value={contestConfig.juniorTheme ?? ""}
                          onChange={(e) =>
                            setContestConfig((prev) => ({
                              ...prev,
                              juniorTheme: e.target.value,
                            }))
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Junior Word Limit
                        </label>

                        <input
                          type="text"
                          required
                          placeholder="e.g. 1,500 words"
                          value={contestConfig.juniorWordLimit ?? ""}
                          onChange={(e) =>
                            setContestConfig((prev) => ({
                              ...prev,
                              juniorWordLimit: e.target.value,
                            }))
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Junior Accepted Formats
                        </label>

                        <input
                          type="text"
                          required
                          placeholder="e.g. PDF, DOC, DOCX"
                          value={contestConfig.juniorFormats ?? ""}
                          onChange={(e) =>
                            setContestConfig((prev) => ({
                              ...prev,
                              juniorFormats: e.target.value,
                            }))
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Junior Prizes
                        </label>

                        <input
                          type="text"
                          required
                          placeholder="e.g. Shields, Certificates & Book Hampers"
                          value={contestConfig.juniorPrizes ?? ""}
                          onChange={(e) =>
                            setContestConfig((prev) => ({
                              ...prev,
                              juniorPrizes: e.target.value,
                            }))
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Junior Submission Deadline
                        </label>

                        <input
                          type="date"
                          required
                          value={contestConfig.juniorDeadline ?? ""}
                          onChange={(e) =>
                            setContestConfig((prev) => ({
                              ...prev,
                              juniorDeadline: e.target.value,
                            }))
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Senior Category */}
                  <div className="space-y-4">

                    <h4 className="text-sm font-bold text-blue-800 border-b border-blue-100 pb-2">
                      Senior Category (16+ / University)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Senior Essay Theme / Title
                        </label>

                        <input
                          type="text"
                          required
                          value={contestConfig.seniorTheme ?? ""}
                          onChange={(e) =>
                            setContestConfig((prev) => ({
                              ...prev,
                              seniorTheme: e.target.value,
                            }))
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Senior Word Limit
                        </label>

                        <input
                          type="text"
                          required
                          placeholder="e.g. 2,700 words"
                          value={contestConfig.seniorWordLimit ?? ""}
                          onChange={(e) =>
                            setContestConfig((prev) => ({
                              ...prev,
                              seniorWordLimit: e.target.value,
                            }))
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Senior Accepted Formats
                        </label>

                        <input
                          type="text"
                          required
                          placeholder="e.g. PDF, DOC, DOCX"
                          value={contestConfig.seniorFormats ?? ""}
                          onChange={(e) =>
                            setContestConfig((prev) => ({
                              ...prev,
                              seniorFormats: e.target.value,
                            }))
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Senior Prizes
                        </label>

                        <input
                          type="text"
                          required
                          placeholder="e.g. Cash Award & Publication Feature"
                          value={contestConfig.seniorPrizes ?? ""}
                          onChange={(e) =>
                            setContestConfig((prev) => ({
                              ...prev,
                              seniorPrizes: e.target.value,
                            }))
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Senior Submission Deadline
                        </label>

                        <input
                          type="date"
                          required
                          value={contestConfig.seniorDeadline ?? ""}
                          onChange={(e) =>
                            setContestConfig((prev) => ({
                              ...prev,
                              seniorDeadline: e.target.value,
                            }))
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors"
                    >
                      Save Contest Rules
                    </button>
                  </div>

                </form>
              </div>
              {/* Winners Archive */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">Hall of Fame & Laureates</h3>
                  <button onClick={() => setIsAddingWinner(true)} className="flex items-center gap-1.5 bg-[#E8A94A] text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold">
                    <Plus className="w-4 h-4" /> Add Winner
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {winnersArchive.map((w) => (
                    <div key={w._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Edition {w.editionYear} • {w.placement}</span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{w.studentName}</h4>
                        <p className="text-[11px] text-slate-500">{w.institution} ({w.category})</p>
                        <p className="text-xs text-slate-700 italic mt-1">"{w.essayTitle}"</p>
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/60">
                        <button onClick={() => handleDeleteWinner(w._id)} className="text-xs text-rose-600 font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Winner Form Modal */}
              {isAddingWinner && (
                <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Add Winner Record</h3>
                    <form onSubmit={handleAddWinnerSubmit} className="space-y-3">
                      <input type="text" placeholder="Student Name" required value={winnerForm.studentName} onChange={(e) => setWinnerForm({ ...winnerForm, studentName: e.target.value })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                      <input type="text" placeholder="Institution / College" required value={winnerForm.institution} onChange={(e) => setWinnerForm({ ...winnerForm, institution: e.target.value })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                      <input type="text" placeholder="Winning Essay Title" required value={winnerForm.essayTitle} onChange={(e) => setWinnerForm({ ...winnerForm, essayTitle: e.target.value })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                      <input type="text" placeholder="Prize (e.g. Rs. 15,000 + Shield)" value={winnerForm.awardPrizes} onChange={(e) => setWinnerForm({ ...winnerForm, awardPrizes: e.target.value })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsAddingWinner(false)} className="px-3 py-1.5 text-xs text-slate-600 font-bold">Cancel</button>
                        <button type="submit" className="bg-[#E8A94A] text-slate-950 px-4 py-2 text-xs font-bold rounded-xl">Save Winner</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. GALLERY & MEDIA ASSETS */}
          {currentSection === 'gallery' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Gallery Photos & Media Assets</h3>
                  <p className="text-xs text-slate-500">Live storage backed by Cloudinary CDN & MongoDB.</p>
                </div>

                <button
                  onClick={() => {
                    setIsAddingPhotos(true);
                    setSelectedFiles([]);
                  }}
                  className="flex items-center gap-2 bg-[#E8A94A] hover:bg-[#d99839] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" /> Upload Photos from Device
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {galleryPhotos.map((photo) => (
                  <div key={photo._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                    <img src={photo.imageUrl} alt={photo.caption || photo.title} className="w-full h-44 object-cover" />
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-extrabold text-[#E8A94A]">{photo.album || 'General'}</span>
                      <p className="text-xs text-slate-700 font-medium line-clamp-2">{photo.caption || photo.title}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(photo.imageUrl);
                            showToast('Cloudinary URL copied!');
                          }}
                          className="text-[11px] font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy URL
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo._id)}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Modal */}
              {isAddingPhotos && (
                <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Upload Photos to Cloudinary</h3>
                        <p className="text-xs text-slate-500">Stored dynamically in Cloudinary CDN and MongoDB.</p>
                      </div>
                      <button
                        onClick={() => !isUploading && setIsAddingPhotos(false)}
                        disabled={isUploading}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Target Album</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select
                          value={selectedAlbum}
                          onChange={(e) => setSelectedAlbum(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800"
                        >
                          {galleryAlbums.map((alb) => (<option key={alb} value={alb}>{alb}</option>))}
                        </select>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="+ New Album..."
                            value={newAlbumInput}
                            onChange={(e) => setNewAlbumInput(e.target.value)}
                            className="w-full text-xs bg-slate-50 border rounded-xl p-2"
                          />
                          <button
                            type="button"
                            onClick={handleCreateNewAlbum}
                            className="bg-slate-900 text-white px-3 py-1 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSaveGalleryUpload} className="space-y-4">
                      <div className="border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 rounded-2xl p-6 text-center space-y-2 transition">
                        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-bold text-slate-700">Click below to browse photos from your computer or phone</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          id="device-picker-admin"
                          onChange={handleDeviceFilesSelect}
                          className="hidden"
                        />
                        <label
                          htmlFor="device-picker-admin"
                          className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                        >
                          Select Images
                        </label>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {selectedFiles.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                              <img src={item.previewUrl} alt="prev" className="w-10 h-10 rounded-lg object-cover" />
                              <input
                                type="text"
                                value={item.caption}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSelectedFiles(selectedFiles.map((f, i) => i === idx ? { ...f, caption: val } : f));
                                }}
                                className="flex-1 text-xs bg-white border p-1.5 rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                                className="text-rose-500 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsAddingPhotos(false)}
                          disabled={isUploading}
                          className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isUploading || selectedFiles.length === 0}
                          className="bg-[#E8A94A] hover:bg-[#d99839] disabled:opacity-50 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs cursor-pointer flex items-center gap-2"
                        >
                          {isUploading ? (
                            <>
                              <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
                              Uploading...
                            </>
                          ) : (
                            'Upload to Cloudinary'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. PAGE CONTENT CMS (COMPLETE MULTI-PAGE CONTROLS) */}
          {currentSection === 'cms' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Multi-Page Content Editor</h3>
                  <p className="text-xs text-slate-500">Live edits for Homepage, About, Programs, Get Involved, and Contact.</p>
                </div>
                <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl">
                  {[
                    { id: 'home', label: 'Homepage', icon: <LayoutTemplate className="w-3.5 h-3.5" /> },
                    { id: 'about', label: 'About Us', icon: <Compass className="w-3.5 h-3.5" /> },
                    { id: 'programs', label: 'Programs', icon: <BookOpen className="w-3.5 h-3.5" /> },
                    { id: 'getInvolved', label: 'Get Involved', icon: <Users className="w-3.5 h-3.5" /> },
                    { id: 'contact', label: 'Contact', icon: <PhoneCall className="w-3.5 h-3.5" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCmsPageTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${cmsPageTab === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">

                {/* Homepage Tab */}
                {cmsPageTab === 'home' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Hero Main Headline</label>
                    <input type="text" value={cmsContent.home?.heroHeadline || ''} onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, heroHeadline: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />

                    <label className="block text-xs font-bold text-slate-700">Hero Mission Subtext</label>
                    <textarea rows="3" value={cmsContent.home?.heroSubtext || ''} onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, heroSubtext: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl"></textarea>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Books Restored</label>
                        <input type="text" value={cmsContent.home?.impactBooks || ''} onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, impactBooks: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl font-bold text-emerald-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Students Reached</label>
                        <input type="text" value={cmsContent.home?.impactStudents || ''} onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, impactStudents: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl font-bold text-amber-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Partner Schools</label>
                        <input type="text" value={cmsContent.home?.impactSchools || ''} onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, impactSchools: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl font-bold text-slate-900" />
                      </div>
                    </div>
                    {/* Homepage Image Management */}
                    <div className="mt-8 pt-7 border-t border-slate-200 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <ImageIcon className="w-5 h-5 text-emerald-700" />
                            <h3 className="text-lg font-black text-slate-900">
                              Homepage Image Library
                            </h3>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                            Manage the five featured images displayed on your homepage.
                            Uploading stores an image in Cloudinary. Click
                            <strong> Save Page Content </strong>
                            afterward to publish your changes.
                          </p>
                        </div>

                        <span className="self-start text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                          Upload → Preview → Publish
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {[
                          {
                            slot: 'hero',
                            title: 'Hero Banner',
                            description: 'Main visual at the top of the homepage.',
                          },
                          {
                            slot: 'books',
                            title: 'Book Restoration',
                            description: 'Image for the book restoration program.',
                          },
                          {
                            slot: 'essays',
                            title: 'Essay Program',
                            description: 'Image for student essays and competitions.',
                          },
                          {
                            slot: 'summer',
                            title: 'SDG Summer Circle',
                            description: 'Image for the summer learning program.',
                          },
                          {
                            slot: 'story',
                            title: 'Our Story',
                            description: 'Image supporting the organization story.',
                          },
                        ].map(({ slot, title, description }) => {
                          const imageUrl =
                            cmsImagePreviews[slot] ||
                            cmsContent.home?.images?.[slot]?.url ||
                            null;

                          const uploading = cmsImageUploading === slot;

                          return (
                            <div
                              key={slot}
                              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="relative aspect-video bg-slate-100">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={`${title} preview`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                                    <ImageIcon className="w-9 h-9" />
                                    <span className="text-xs font-medium">
                                      Using homepage fallback image
                                    </span>
                                  </div>
                                )}

                                {uploading && (
                                  <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center gap-3 text-white">
                                    <span className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs font-bold">
                                      Uploading image...
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="p-4 space-y-3">
                                <div>
                                  <h4 className="text-sm font-black text-slate-900">
                                    {title}
                                  </h4>

                                  <p className="text-xs text-slate-500 mt-1">
                                    {description}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${imageUrl
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                                      }`}
                                  >
                                    {imageUrl ? 'Cloudinary image' : 'Local fallback'}
                                  </span>

                                  <span className="text-[10px] text-slate-400">
                                    JPG / PNG · Max 5 MB
                                  </span>
                                </div>

                                <label
                                  className={`flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2.5 text-xs font-bold transition ${uploading || cmsImageUploading || cmsImageSaving
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer'
                                    }`}
                                >
                                  <UploadCloud className="w-4 h-4" />

                                  {uploading ? 'Uploading...' : imageUrl ? 'Replace Image' : 'Upload Image'}

                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                    className="hidden"
                                    disabled={Boolean(cmsImageUploading) || cmsImageSaving}
                                    onChange={async (event) => {
                                      const file = event.target.files?.[0];

                                      if (file) {
                                        await handleCmsImageUpload(slot, file);
                                      }

                                      event.target.value = '';
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <p className="text-xs text-amber-950 leading-relaxed">
                          <strong>Publishing reminder:</strong> Uploading an image does
                          not immediately update your public homepage. After uploading,
                          click <strong>Save Page Content</strong> below to publish it.
                          Until then, the public website continues using its previously
                          saved images.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* About Us Tab */}
                {cmsPageTab === 'about' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">About Hero Title</label>
                    <input type="text" value={cmsContent.about?.heroTitle || ''} onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, heroTitle: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                    <label className="block text-xs font-bold text-slate-700">Mission Narrative</label>
                    <textarea rows="3" value={cmsContent.about?.missionBody || ''} onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, missionBody: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl"></textarea>
                    <label className="block text-xs font-bold text-slate-700">Vision Statement</label>
                    <input type="text" value={cmsContent.about?.visionStatement || ''} onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, visionStatement: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                  </div>
                )}

                {/* Programs Tab */}
                {cmsPageTab === 'programs' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Book Donation Program Heading</label>
                    <input type="text" value={cmsContent.programs?.donationHeading || ''} onChange={(e) => setCmsContent({ ...cmsContent, programs: { ...cmsContent.programs, donationHeading: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                    <label className="block text-xs font-bold text-slate-700">Acceptance Guidelines</label>
                    <textarea rows="3" value={cmsContent.programs?.donationRules || ''} onChange={(e) => setCmsContent({ ...cmsContent, programs: { ...cmsContent.programs, donationRules: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl"></textarea>
                  </div>
                )}

                {/* Get Involved Tab */}
                {cmsPageTab === 'getInvolved' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Volunteer Pitch</label>
                    <textarea rows="3" value={cmsContent.getInvolved?.volunteerPitch || ''} onChange={(e) => setCmsContent({ ...cmsContent, getInvolved: { ...cmsContent.getInvolved, volunteerPitch: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl"></textarea>
                    <label className="block text-xs font-bold text-slate-700">Institutional Collaboration Pitch</label>
                    <textarea rows="3" value={cmsContent.getInvolved?.partnerPitch || ''} onChange={(e) => setCmsContent({ ...cmsContent, getInvolved: { ...cmsContent.getInvolved, partnerPitch: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl"></textarea>
                  </div>
                )}

                {/* Contact Tab (Comprehensive Controls) */}
                {cmsPageTab === 'contact' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Hub Physical Address</label>
                        <input
                          type="text"
                          value={cmsContent.contact?.hubAddress || ''}
                          onChange={(e) =>
                            setCmsContent({
                              ...cmsContent,
                              contact: { ...cmsContent.contact, hubAddress: e.target.value }
                            })
                          }
                          className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Official WhatsApp Helpline</label>
                        <input
                          type="text"
                          value={cmsContent.contact?.whatsapp || ''}
                          onChange={(e) =>
                            setCmsContent({
                              ...cmsContent,
                              contact: { ...cmsContent.contact, whatsapp: e.target.value }
                            })
                          }
                          className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Inquiries</label>
                        <input
                          type="email"
                          value={cmsContent.contact?.email || ''}
                          onChange={(e) =>
                            setCmsContent({
                              ...cmsContent,
                              contact: { ...cmsContent.contact, email: e.target.value }
                            })
                          }
                          className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Desk Operating Hours</label>
                        <input
                          type="text"
                          value={cmsContent.contact?.deskHours || ''}
                          onChange={(e) =>
                            setCmsContent({
                              ...cmsContent,
                              contact: { ...cmsContent.contact, deskHours: e.target.value }
                            })
                          }
                          className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Desk Overview Narrative</label>
                      <textarea
                        rows="2"
                        value={cmsContent.contact?.deskNotice || ''}
                        onChange={(e) =>
                          setCmsContent({
                            ...cmsContent,
                            contact: { ...cmsContent.contact, deskNotice: e.target.value }
                          })
                        }
                        className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Note (Bottom Card)</label>
                      <input
                        type="text"
                        value={cmsContent.contact?.urgencyNote || ''}
                        onChange={(e) =>
                          setCmsContent({
                            ...cmsContent,
                            contact: { ...cmsContent.contact, urgencyNote: e.target.value }
                          })
                        }
                        className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Form Title</label>
                        <input
                          type="text"
                          value={cmsContent.contact?.formHeading || ''}
                          onChange={(e) =>
                            setCmsContent({
                              ...cmsContent,
                              contact: { ...cmsContent.contact, formHeading: e.target.value }
                            })
                          }
                          className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Form Subtitle</label>
                        <input
                          type="text"
                          value={cmsContent.contact?.formSubtext || ''}
                          onChange={(e) =>
                            setCmsContent({
                              ...cmsContent,
                              contact: { ...cmsContent.contact, formSubtext: e.target.value }
                            })
                          }
                          className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSaveCMS}
                    disabled={cmsImageSaving || Boolean(cmsImageUploading)}
                    className="bg-[#E8A94A] hover:bg-[#d99839] disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm transition"
                  >
                    {cmsImageSaving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Page Content
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. MENU & PAGE MANAGEMENT */}
          {currentSection === 'menu' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Basic Menu & Page Management</h3>
                  <p className="text-xs text-slate-500">Toggle public navigation items and adjust visibility.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Page Title</th>
                      <th className="p-4">Routing Path</th>
                      <th className="p-4">Header Navigation</th>
                      <th className="p-4 text-right">Visibility Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagesMenu.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-900">{item.name}</td>
                        <td className="p-4 font-mono text-slate-500">{item.path}</td>
                        <td className="p-4">{item.isNavHeader ? 'Navbar Link' : 'Sub-menu'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleMenuVisibility(item)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${item.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                              }`}
                          >
                            {item.isVisible ? 'Visible (Active)' : 'Hidden'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. TEAM ROLES & ACCESS CONTROL */}
          {currentSection === 'roles' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">User Roles & Access Control</h3>
                  <p className="text-xs text-slate-500">Manage multiple team member roles and permissions.</p>
                </div>
                <button
                  type="button"
                  disabled
                  title="Team invitations will be available after role-based access controls are implemented."
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed"
                >
                  <UserPlus className="w-4 h-4" />
                  Invitations unavailable
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Member</th>
                      <th className="p-4">Role Tier</th>
                      <th className="p-4">Permissions</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teamMembers.map((member) => (
                      <tr key={member._id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-900">{member.name}<span className="text-[10px] text-slate-400 font-normal block">{member.email}</span></td>
                        <td className="p-4"><span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200">{member.role}</span></td>
                        <td className="p-4">{member.permissions?.join(', ') || 'Standard Access'}</td>
                        <td className="p-4 text-right">
                          <span
                            className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500"
                            title="Team account management will be enabled after role-based permissions are implemented."
                          >
                            Management disabled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;