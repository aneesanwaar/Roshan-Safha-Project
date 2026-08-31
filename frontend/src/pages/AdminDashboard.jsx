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
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  Copy, 
  Save, 
  Globe, 
  PhoneCall, 
  Compass, 
  UserPlus, 
  Printer, 
  SlidersHorizontal, 
  UploadCloud
} from 'lucide-react';
import { api } from '../services/api';

function AdminDashboard() {
  const [currentSection, setCurrentSection] = useState('submissions');
  const [subTab, setSubTab] = useState('essays'); // essays | donations | volunteers | collabs | events | messages
  const [cmsPageTab, setCmsPageTab] = useState('home'); // home | about | programs | getInvolved | contact
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [activeAdmin] = useState({
    name: 'Anees Anwaar',
    email: 'admin@roshansafha.org',
    role: 'Super Admin'
  });

  // State Stores loaded from api.js
  const [submissions, setSubmissions] = useState(api.getSubmissions());
  const [announcements, setAnnouncements] = useState(api.getAnnouncements());
  const [contestConfig, setContestConfig] = useState(api.getContestConfig());
  const [winnersArchive, setWinnersArchive] = useState(api.getWinners());
  const [galleryAlbums, setGalleryAlbums] = useState(api.getAlbums());
  const [galleryPhotos, setGalleryPhotos] = useState(api.getGallery());
  const [cmsContent, setCmsContent] = useState(api.getCMS());
  const [pagesMenu, setPagesMenu] = useState(api.getPagesMenu());
  const [teamMembers, setTeamMembers] = useState(api.getTeamMembers());

  // Filter States
  const [announcementFilter, setAnnouncementFilter] = useState('All');

  // Gallery Upload Modal State
  const [isAddingPhotos, setIsAddingPhotos] = useState(false);
  const [uploadMode, setUploadMode] = useState('device'); // 'device' | 'url'
  const [selectedAlbum, setSelectedAlbum] = useState('Book Restoration Hub');
  const [newAlbumInput, setNewAlbumInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [urlInputText, setUrlInputText] = useState('');
  const [urlCaptionText, setUrlCaptionText] = useState('');

  // Announcement Modal State
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(null);
  const [postForm, setPostForm] = useState({ title: '', category: 'General', status: 'Published', publishDate: '2026-08-31', excerpt: '', content: '' });

  // Winner Modal State
  const [isAddingWinner, setIsAddingWinner] = useState(false);
  const [winnerForm, setWinnerForm] = useState({ editionYear: '2026', category: 'Senior', placement: '🥇 1st Place / Gold', studentName: '', institution: '', essayTitle: '', awardPrizes: '' });

  // User Modal State
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'Content Editor' });

  // Time-Series Historical Analytics Data
  const timeSeriesData = [
    { month: 'Mar 2026', label: 'Mar', books: 15, participation: 8 },
    { month: 'Apr 2026', label: 'Apr', books: 28, participation: 14 },
    { month: 'May 2026', label: 'May', books: 42, participation: 25 },
    { month: 'Jun 2026', label: 'Jun', books: 65, participation: 40 },
    { month: 'Jul 2026', label: 'Jul', books: 90, participation: 75 },
    { month: 'Aug 2026', label: 'Aug', books: 130, participation: 110 }
  ];

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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Device File Upload Handlers
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

  const handleSaveGalleryUpload = (e) => {
    e.preventDefault();
    if (uploadMode === 'device') {
      if (!selectedFiles.length) {
        showToast('Please choose at least one image.');
        return;
      }
      const uploadPromises = selectedFiles.map((item) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              album: selectedAlbum,
              caption: item.caption || 'Roshan Safha Gallery Photo',
              imageUrl: reader.result,
              date: new Date().toISOString().slice(0, 10)
            });
          };
          reader.readAsDataURL(item.file);
        });
      });

      Promise.all(uploadPromises).then((photosToAdd) => {
        api.addPhotosToGallery(photosToAdd);
        setGalleryPhotos(api.getGallery());
        setIsAddingPhotos(false);
        setSelectedFiles([]);
        showToast(`Uploaded ${photosToAdd.length} image(s) to "${selectedAlbum}"!`);
      });
    } else {
      const urls = urlInputText.split('\n').map((u) => u.trim()).filter((u) => u.length > 0);
      if (!urls.length) {
        showToast('Please enter at least one URL.');
        return;
      }
      const photosToAdd = urls.map((url) => ({
        album: selectedAlbum,
        caption: urlCaptionText || 'Roshan Safha Photo',
        imageUrl: url,
        date: new Date().toISOString().slice(0, 10)
      }));
      api.addPhotosToGallery(photosToAdd);
      setGalleryPhotos(api.getGallery());
      setIsAddingPhotos(false);
      setUrlInputText('');
      setUrlCaptionText('');
      showToast(`Added ${photosToAdd.length} image(s)!`);
    }
  };

  const handleCreateNewAlbum = () => {
    if (!newAlbumInput.trim()) return;
    const updated = api.createAlbum(newAlbumInput.trim());
    setGalleryAlbums(updated);
    setSelectedAlbum(newAlbumInput.trim());
    setNewAlbumInput('');
    showToast(`Created album "${newAlbumInput.trim()}"`);
  };

  // Export Engines
  const exportToCSV = (collectionName, dataList) => {
    if (!dataList?.length) return showToast('No records to export.');
    const headers = Object.keys(dataList[0]).join(',');
    const rows = dataList.map((obj) => Object.values(obj).map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(`data:text/csv;charset=utf-8,${headers}\n${rows}`);
    link.download = `RoshanSafha_${collectionName}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast(`Exported ${collectionName} to CSV.`);
  };

  const exportToExcel = (collectionName, dataList) => {
    if (!dataList?.length) return showToast('No records to export.');
    const headers = Object.keys(dataList[0]);
    const tableHtml = `<html><head><meta charset="utf-8"/></head><body><table border="1"><thead><tr style="background:#E8A94A;color:#000;">${headers.map((h) => `<th>${h.toUpperCase()}</th>`).join('')}</tr></thead><tbody>${dataList.map((r) => `<tr>${headers.map((h) => `<td>${r[h] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' }));
    link.download = `RoshanSafha_${collectionName}_${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    showToast(`Exported ${collectionName} to Excel.`);
  };

  const exportToPDF = (collectionName, dataList) => {
    if (!dataList?.length) return showToast('No records to export.');
    const headers = Object.keys(dataList[0]);
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>${collectionName} Report</title><style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:8px;font-size:11px}th{background:#f8fafc}</style></head><body><h2>Roshan Safha — ${collectionName} Report</h2><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${dataList.map((r) => `<tr>${headers.map((h) => `<td>${r[h] ?? '—'}</td>`).join('')}</tr>`).join('')}</tbody></table><script>window.onload=()=>window.print()</script></body></html>`);
    win.document.close();
    showToast(`Prepared PDF Report.`);
  };

  const navItems = [
    { id: 'submissions', label: 'Form Submissions & Export', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'analytics', label: 'AI Trend Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'announcements', label: 'Announcements & Blog', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'contests', label: 'Contests & Winners', icon: <Trophy className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery & Media Library', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'cms', label: 'Page Content CMS', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu & Page Management', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'roles', label: 'Team Roles & Permissions', icon: <ShieldCheck className="w-4 h-4" /> }
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
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-950 text-[#E8A94A] border border-[#E8A94A]/40 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#E8A94A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentSection === item.id
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
          <button className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/30 rounded-xl transition cursor-pointer">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
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
            Live Sync Active
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* 1. FORM SUBMISSIONS & EXPORT */}
          {currentSection === 'submissions' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl">
                  {[
                    { id: 'essays', label: 'Essays', icon: <FileText className="w-3.5 h-3.5" />, count: submissions.essays.length },
                    { id: 'donations', label: 'Donations', icon: <BookOpen className="w-3.5 h-3.5" />, count: submissions.donations.length },
                    { id: 'volunteers', label: 'Volunteers', icon: <Users className="w-3.5 h-3.5" />, count: submissions.volunteers.length },
                    { id: 'collabs', label: 'Partnerships', icon: <Handshake className="w-3.5 h-3.5" />, count: submissions.collaborations.length },
                    { id: 'events', label: 'Events', icon: <Calendar className="w-3.5 h-3.5" />, count: submissions.events.length },
                    { id: 'messages', label: 'Messages', icon: <Mail className="w-3.5 h-3.5" />, count: submissions.contacts.length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSubTab(tab.id);
                        setSearchQuery('');
                      }}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        subTab === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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

                  {(() => {
                    const dataMap = {
                      essays: submissions.essays,
                      donations: submissions.donations,
                      volunteers: submissions.volunteers,
                      collabs: submissions.collaborations,
                      events: submissions.events,
                      messages: submissions.contacts
                    };
                    const currentDataset = dataMap[subTab];

                    return (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => exportToCSV(subTab.toUpperCase(), currentDataset)}
                          className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-300" /> CSV
                        </button>
                        <button
                          onClick={() => exportToExcel(subTab.toUpperCase(), currentDataset)}
                          className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" /> Excel
                        </button>
                        <button
                          onClick={() => exportToPDF(subTab.toUpperCase(), currentDataset)}
                          className="flex items-center gap-1 bg-rose-700 hover:bg-rose-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-rose-200" /> PDF
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Data Tables */}
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
                          <th className="p-4">Document</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {submissions.essays
                          .filter((e) => e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || e.essayTitle.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-bold text-slate-900">{item.studentName}<span className="text-[10px] text-slate-400 font-normal block">{item.email} • {item.phone}</span></td>
                              <td className="p-4"><span className="font-semibold text-slate-800">{item.category}</span><span className="text-slate-400 text-[10px] block">Age: {item.age}</span></td>
                              <td className="p-4 font-medium text-slate-900 max-w-xs truncate">{item.essayTitle}</td>
                              <td className="p-4">{item.institutionName}</td>
                              <td className="p-4">
                                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline">
                                  <FileText className="w-3.5 h-3.5" /> View File <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>
                              <td className="p-4">
                                <select
                                  value={item.status}
                                  onChange={(e) => {
                                    const updated = api.updateEssayStatus(item._id, e.target.value);
                                    setSubmissions(updated);
                                    showToast(`Status updated to ${e.target.value}`);
                                  }}
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
                          <th className="p-4">Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {submissions.donations
                          .filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.city.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-bold text-slate-900">{item.name}<span className="text-[10px] text-slate-400 font-normal block">{item.phone} • {item.email}</span></td>
                              <td className="p-4 font-medium">{item.city}</td>
                              <td className="p-4 font-extrabold text-emerald-600">{item.numberOfBooks} books</td>
                              <td className="p-4 max-w-xs truncate">{item.bookTypes}</td>
                              <td className="p-4"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">{item.dropoffMethod}</span></td>
                              <td className="p-4 text-slate-500 max-w-xs truncate">{item.message}</td>
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
                          <th className="p-4">Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {submissions.volunteers.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-900">{item.name}<span className="text-[10px] text-slate-400 font-normal block">{item.email} • {item.phone}</span></td>
                            <td className="p-4">{item.city} (Age {item.age})</td>
                            <td className="p-4 font-semibold text-emerald-800">{item.skills}</td>
                            <td className="p-4">{item.availability}</td>
                            <td className="p-4 text-slate-500 max-w-xs truncate">{item.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {subTab === 'collabs' && (
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
                        {submissions.collaborations.map((item) => (
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
                        {submissions.events.map((item) => (
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

                {subTab === 'messages' && (
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
                        {submissions.contacts.map((item) => (
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

          {/* 2. AI TREND ANALYTICS */}
          {currentSection === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-md space-y-3">
                <div className="inline-flex items-center gap-2 bg-[#E8A94A]/20 text-[#E8A94A] border border-[#E8A94A]/30 text-[10px] font-extrabold px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Time-Series Linear Regression Modeling</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Donation Volume & Youth Participation Intelligence
                </h2>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  First-order ordinary least-squares regression applied to 6-month historical data points to project intake trajectory.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-400">Intake Velocity (Slope)</span>
                  <div className="text-2xl font-black text-slate-900">+{bookModel.slope} <span className="text-xs font-bold text-slate-400">books/mo</span></div>
                  <p className="text-[11px] text-emerald-700 font-bold">{bookModel.trend} • {bookModel.growthRate}% 6-month surge</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-400">September 2026 Forecast</span>
                  <div className="text-2xl font-black text-[#E8A94A]">~{bookModel.forecastNext} Books</div>
                  <p className="text-[11px] text-slate-500">Pledge intake trajectory ($y = {bookModel.slope}x + {bookModel.intercept}$).</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-400">Participant Momentum</span>
                  <div className="text-2xl font-black text-slate-900">+{participationModel.slope} <span className="text-xs font-bold text-slate-400">entries/mo</span></div>
                  <p className="text-[11px] text-blue-700 font-bold">~{participationModel.forecastNext} projected next entries</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-400">Seasonal Peak Window</span>
                  <div className="text-2xl font-black text-slate-900">July – August</div>
                  <p className="text-[11px] text-slate-500">Summer workshops drive a 3.4x spike over spring levels.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Time-Series Trajectory</h3>
                    <p className="text-xs text-slate-500">Comparing physical book pledges vs. student contest entries.</p>
                  </div>
                  <div className="flex items-center gap-5 text-xs font-bold">
                    <div className="flex items-center gap-1.5 text-emerald-800"><span className="w-3 h-3 rounded-full bg-emerald-600"></span> Book Donations</div>
                    <div className="flex items-center gap-1.5 text-[#E8A94A]"><span className="w-3 h-3 rounded-full bg-[#E8A94A]"></span> Contest Registrations</div>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64 bg-slate-50/60 rounded-2xl border border-slate-100">
                    {[0, 40, 80, 120, 160].map((val) => (
                      <g key={val}>
                        <line x1={padX} y1={getY(val)} x2={chartWidth - padX} y2={getY(val)} stroke="#e2e8f0" strokeDasharray="3 3" />
                        <text x={padX - 10} y={getY(val) + 4} textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="600">{val}</text>
                      </g>
                    ))}
                    <path d={bookPath} fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
                    {timeSeriesData.map((d, i) => (
                      <circle key={'d' + i} cx={getX(i)} cy={getY(d.books)} r="5" fill="#059669" stroke="#fff" strokeWidth="2" />
                    ))}
                    <path d={partPath} fill="none" stroke="#E8A94A" strokeWidth="3.5" strokeLinecap="round" />
                    {timeSeriesData.map((d, i) => (
                      <circle key={'p' + i} cx={getX(i)} cy={getY(d.participation)} r="5" fill="#E8A94A" stroke="#fff" strokeWidth="2" />
                    ))}
                    {timeSeriesData.map((d, i) => (
                      <text key={'l' + i} x={getX(i)} y={chartHeight - 10} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="700">{d.month}</text>
                    ))}
                  </svg>
                </div>
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

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl w-full sm:w-auto">
                  {['All', 'Contest', 'Workshop', 'Book Drive', 'General'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setAnnouncementFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        announcementFilter === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E8A94A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {announcements
                  .filter((p) => (announcementFilter === 'All' || p.category === announcementFilter) && p.title.toLowerCase().includes(searchQuery.toLowerCase()))
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
                              const updated = api.deleteAnnouncement(post._id);
                              setAnnouncements(updated);
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

              {/* Announcement Modal */}
              {(isCreatingPost || isEditingPost) && (
                <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900">{isCreatingPost ? 'New Post' : 'Edit Post'}</h3>
                      <button onClick={() => { setIsCreatingPost(false); setIsEditingPost(null); }} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (isCreatingPost) {
                        api.createAnnouncement({ ...postForm, author: activeAdmin.name });
                        setAnnouncements(api.getAnnouncements());
                        showToast('Post created!');
                      } else {
                        api.updateAnnouncement(isEditingPost._id, postForm);
                        setAnnouncements(api.getAnnouncements());
                        showToast('Post updated!');
                      }
                      setIsCreatingPost(false);
                      setIsEditingPost(null);
                    }} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Post Title *</label>
                        <input type="text" required value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                          <select value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                            <option value="General">General</option>
                            <option value="Contest">Contest</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Book Drive">Book Drive</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                          <select value={postForm.status} onChange={(e) => setPostForm({ ...postForm, status: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                            <option value="Published">Published</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Publish Date</label>
                          <input type="date" value={postForm.publishDate} onChange={(e) => setPostForm({ ...postForm, publishDate: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Excerpt Summary</label>
                        <input type="text" value={postForm.excerpt} onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Content Body *</label>
                        <textarea rows="4" required value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"></textarea>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => { setIsCreatingPost(false); setIsEditingPost(null); }} className="px-4 py-2 text-xs font-bold text-slate-600">Cancel</button>
                        <button type="submit" className="bg-[#E8A94A] text-slate-950 font-bold px-5 py-2 rounded-xl text-xs">Save Announcement</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. CONTESTS & WINNERS */}
          {currentSection === 'contests' && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Edition {contestConfig.editionYear} Rules & Settings</h3>
                    <p className="text-xs text-slate-500">Configure prompt themes, limits, and submission cutoff dates.</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full">{contestConfig.status}</span>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  api.updateContestConfig(contestConfig);
                  showToast('Contest configuration saved!');
                }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Junior Theme (Under 16)</label>
                    <input type="text" value={contestConfig.juniorTheme} onChange={(e) => setContestConfig({ ...contestConfig, juniorTheme: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Junior Word Limit</label>
                    <input type="text" value={contestConfig.juniorWordLimit} onChange={(e) => setContestConfig({ ...contestConfig, juniorWordLimit: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Senior Theme (16+ / College)</label>
                    <input type="text" value={contestConfig.seniorTheme} onChange={(e) => setContestConfig({ ...contestConfig, seniorTheme: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Senior Word Limit</label>
                    <input type="text" value={contestConfig.seniorWordLimit} onChange={(e) => setContestConfig({ ...contestConfig, seniorWordLimit: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button type="submit" className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs">Save Contest Rules</button>
                  </div>
                </form>
              </div>

              {/* Winners Archive */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">Hall of Fame & Laureates</h3>
                  <button onClick={() => { setIsAddingWinner(true); }} className="flex items-center gap-1.5 bg-[#E8A94A] text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold">
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
                        <button onClick={() => { if (window.confirm('Delete winner?')) { api.deleteWinner(w._id); setWinnersArchive(api.getWinners()); showToast('Winner removed.'); } }} className="text-xs text-rose-600 font-bold">Delete</button>
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
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      api.createWinner(winnerForm);
                      setWinnersArchive(api.getWinners());
                      setIsAddingWinner(false);
                      showToast('Winner added!');
                    }} className="space-y-3">
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
                  <p className="text-xs text-slate-500">Upload photos from computer/mobile, manage albums, captions, and copy asset URLs.</p>
                </div>

                <button
                  onClick={() => {
                    setIsAddingPhotos(true);
                    setSelectedFiles([]);
                  }}
                  className="flex items-center gap-2 bg-[#E8A94A] hover:bg-[#d99839] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Photos from Device
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {galleryPhotos.map((photo) => (
                  <div key={photo._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                    <img src={photo.imageUrl} alt={photo.caption} className="w-full h-44 object-cover" />
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-extrabold text-[#E8A94A]">{photo.album}</span>
                      <p className="text-xs text-slate-700 font-medium line-clamp-2">{photo.caption}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <button onClick={() => { navigator.clipboard.writeText(photo.imageUrl); showToast('Image URL copied!'); }} className="text-[11px] font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1">
                          <Copy className="w-3 h-3" /> Copy URL
                        </button>
                        <button onClick={() => { if (window.confirm('Delete photo?')) { api.deletePhoto(photo._id); setGalleryPhotos(api.getGallery()); showToast('Photo removed.'); } }} className="text-rose-600 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Modal (Device + URL) */}
              {isAddingPhotos && (
                <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Upload Photos & Media Assets</h3>
                        <p className="text-xs text-slate-500">Choose images from your device or paste online links.</p>
                      </div>
                      <button onClick={() => setIsAddingPhotos(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Target Album</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select value={selectedAlbum} onChange={(e) => setSelectedAlbum(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800">
                          {galleryAlbums.map((alb) => (<option key={alb} value={alb}>{alb}</option>))}
                        </select>
                        <div className="flex gap-1">
                          <input type="text" placeholder="+ New Album..." value={newAlbumInput} onChange={(e) => setNewAlbumInput(e.target.value)} className="w-full text-xs bg-slate-50 border rounded-xl p-2" />
                          <button type="button" onClick={handleCreateNewAlbum} className="bg-slate-900 text-white px-3 py-1 rounded-xl text-xs font-bold shrink-0">Add</button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                      <button type="button" onClick={() => setUploadMode('device')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${uploadMode === 'device' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}>
                        📁 From Computer / Mobile
                      </button>
                      <button type="button" onClick={() => setUploadMode('url')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${uploadMode === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}>
                        🔗 Image URLs
                      </button>
                    </div>

                    <form onSubmit={handleSaveGalleryUpload} className="space-y-4">
                      {uploadMode === 'device' ? (
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 rounded-2xl p-6 text-center space-y-2 transition">
                            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                            <p className="text-xs font-bold text-slate-700">Click below to browse photos from your device</p>
                            <input type="file" multiple accept="image/*" id="device-picker-admin" onChange={handleDeviceFilesSelect} className="hidden" />
                            <label htmlFor="device-picker-admin" className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                              Select Images
                            </label>
                          </div>

                          {selectedFiles.length > 0 && (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {selectedFiles.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                                  <img src={item.previewUrl} alt="prev" className="w-10 h-10 rounded-lg object-cover" />
                                  <input type="text" value={item.caption} onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedFiles(selectedFiles.map((f, i) => i === idx ? { ...f, caption: val } : f));
                                  }} className="flex-1 text-xs bg-white border p-1.5 rounded-lg" />
                                  <button type="button" onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))} className="text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea rows="3" required placeholder="https://images.unsplash.com/..." value={urlInputText} onChange={(e) => setUrlInputText(e.target.value)} className="w-full text-xs bg-slate-50 border rounded-xl p-2.5"></textarea>
                          <input type="text" placeholder="Caption" value={urlCaptionText} onChange={(e) => setUrlCaptionText(e.target.value)} className="w-full text-xs bg-slate-50 border rounded-xl p-2.5" />
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button type="button" onClick={() => setIsAddingPhotos(false)} className="px-4 py-2 text-xs font-bold text-slate-600">Cancel</button>
                        <button type="submit" className="bg-[#E8A94A] text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs">Save Photos</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. PAGE CONTENT CMS */}
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
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        cmsPageTab === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
                {cmsPageTab === 'home' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Hero Main Headline</label>
                    <input type="text" value={cmsContent.home.heroHeadline} onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, heroHeadline: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                    
                    <label className="block text-xs font-bold text-slate-700">Hero Mission Subtext</label>
                    <textarea rows="3" value={cmsContent.home.heroSubtext} onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, heroSubtext: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl"></textarea>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Books Restored</label>
                        <input type="text" value={cmsContent.home.impactBooks} onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, impactBooks: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl font-bold text-emerald-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Students Reached</label>
                        <input type="text" value={cmsContent.home.impactStudents} onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, impactStudents: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl font-bold text-amber-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Partner Schools</label>
                        <input type="text" value={cmsContent.home.impactSchools} onChange={(e) => setCmsContent({ ...cmsContent, home: { ...cmsContent.home, impactSchools: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl font-bold text-slate-900" />
                      </div>
                    </div>
                  </div>
                )}

                {cmsPageTab === 'about' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">About Hero Title</label>
                    <input type="text" value={cmsContent.about.heroTitle} onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, heroTitle: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                    <label className="block text-xs font-bold text-slate-700">Mission Narrative</label>
                    <textarea rows="3" value={cmsContent.about.missionBody} onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, missionBody: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl"></textarea>
                    <label className="block text-xs font-bold text-slate-700">Vision Statement</label>
                    <input type="text" value={cmsContent.about.visionStatement} onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, visionStatement: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                  </div>
                )}

                {cmsPageTab === 'programs' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Book Donation Program Heading</label>
                    <input type="text" value={cmsContent.programs.donationHeading} onChange={(e) => setCmsContent({ ...cmsContent, programs: { ...cmsContent.programs, donationHeading: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                    <label className="block text-xs font-bold text-slate-700">Acceptance Guidelines</label>
                    <textarea rows="3" value={cmsContent.programs.donationRules} onChange={(e) => setCmsContent({ ...cmsContent, programs: { ...cmsContent.programs, donationRules: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl"></textarea>
                  </div>
                )}

                {cmsPageTab === 'getInvolved' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Volunteer Pitch</label>
                    <textarea rows="3" value={cmsContent.getInvolved.volunteerPitch} onChange={(e) => setCmsContent({ ...cmsContent, getInvolved: { ...cmsContent.getInvolved, volunteerPitch: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl"></textarea>
                    <label className="block text-xs font-bold text-slate-700">Institutional Collaboration</label>
                    <textarea rows="3" value={cmsContent.getInvolved.partnerPitch} onChange={(e) => setCmsContent({ ...cmsContent, getInvolved: { ...cmsContent.getInvolved, partnerPitch: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl"></textarea>
                  </div>
                )}

                {cmsPageTab === 'contact' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Hub Physical Address</label>
                    <input type="text" value={cmsContent.contact.hubAddress} onChange={(e) => setCmsContent({ ...cmsContent, contact: { ...cmsContent.contact, hubAddress: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                    <label className="block text-xs font-bold text-slate-700">Official WhatsApp</label>
                    <input type="text" value={cmsContent.contact.whatsapp} onChange={(e) => setCmsContent({ ...cmsContent, contact: { ...cmsContent.contact, whatsapp: e.target.value } })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button onClick={() => { api.updateCMS(cmsContent); showToast(`Saved ${cmsPageTab.toUpperCase()} content!`); }} className="bg-[#E8A94A] text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Page Content
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
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-900">{item.name}</td>
                        <td className="p-4 font-mono text-slate-500">{item.path}</td>
                        <td className="p-4">{item.isNavHeader ? 'Navbar Link' : 'Sub-menu'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              const updated = api.updatePageMenuItem(item.id, { isVisible: !item.isVisible });
                              setPagesMenu(updated);
                              showToast(`Toggled visibility for ${item.name}`);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                              item.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
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
                <button onClick={() => setIsAddingUser(true)} className="flex items-center gap-1.5 bg-[#E8A94A] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold">
                  <UserPlus className="w-4 h-4" /> Invite Member
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
                        <td className="p-4">{member.permissions.join(', ')}</td>
                        <td className="p-4 text-right">
                          {member.role !== 'Super Admin' ? (
                            <button onClick={() => { api.deleteTeamMember(member._id); setTeamMembers(api.getTeamMembers()); showToast(`Removed ${member.name}`); }} className="text-rose-600 font-bold text-xs">Remove</button>
                          ) : (
                            <span className="text-slate-400 text-xs">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isAddingUser && (
                <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      api.createTeamMember(newUserForm);
                      setTeamMembers(api.getTeamMembers());
                      setIsAddingUser(false);
                      showToast(`Invitation sent to ${newUserForm.email}!`);
                    }} className="space-y-3">
                      <input type="text" placeholder="Full Name" required value={newUserForm.name} onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                      <input type="email" placeholder="Email Address" required value={newUserForm.email} onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl" />
                      <select value={newUserForm.role} onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })} className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl">
                        <option value="Super Admin">Super Admin</option>
                        <option value="Content Editor">Content Editor</option>
                        <option value="Volunteer Coordinator">Volunteer Coordinator</option>
                      </select>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsAddingUser(false)} className="px-3 py-1.5 text-xs text-slate-600 font-bold">Cancel</button>
                        <button type="submit" className="bg-[#E8A94A] text-slate-950 px-4 py-2 text-xs font-bold rounded-xl">Send Invite</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;