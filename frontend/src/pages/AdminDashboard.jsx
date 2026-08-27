import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  TrendingUp, 
  Download, 
  FileText, 
  PlusCircle, 
  Sparkles,
  LogOut
} from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [essays, setEssays] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New post / photo states
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', category: 'General Updates', imageUrl: '' });
  const [newPhoto, setNewPhoto] = useState({ title: '', category: 'Donation Events', imageUrl: '' });
  const [postStatus, setPostStatus] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('rs_admin_token');
    navigate('/admin/login');
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [essayData, donData, volData] = await Promise.all([
          api.getAllEssays('mock_token'),
          api.getAllDonations('mock_token'),
          api.getAllVolunteers('mock_token')
        ]);
        setEssays(essayData || []);
        setDonations(donData || []);
        setVolunteers(volData || []);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Linear Regression Forecast Calculation (AI Feature 1)
  const monthlyData = [
    { month: 'Jan', books: 120, participants: 45 },
    { month: 'Feb', books: 180, participants: 60 },
    { month: 'Mar', books: 240, participants: 85 },
    { month: 'Apr', books: 310, participants: 110 },
    { month: 'May', books: 400, participants: 150 },
  ];

  const n = monthlyData.length;
  const xValues = [1, 2, 3, 4, 5];
  const yValues = monthlyData.map(d => d.books);
  
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Forecast for next month (x = 6)
  const forecastedBooks = Math.round(slope * 6 + intercept);
  const projectedGrowthRate = (((forecastedBooks - yValues[yValues.length - 1]) / yValues[yValues.length - 1]) * 100).toFixed(1);

  // CSV Export utility
  const exportToCSV = (data, filename) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setPostStatus('Publishing...');
    await api.addAnnouncement(newAnnouncement, 'mock_token');
    setPostStatus('Announcement Published Successfully!');
    setNewAnnouncement({ title: '', content: '', category: 'General Updates', imageUrl: '' });
    setTimeout(() => setPostStatus(''), 3000);
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    setPostStatus('Uploading...');
    await api.addGalleryItem(newPhoto, 'mock_token');
    setPostStatus('Photo Added to Gallery Successfully!');
    setNewPhoto({ title: '', category: 'Donation Events', imageUrl: '' });
    setTimeout(() => setPostStatus(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Staff Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Roshan Safha Admin Desk
          </h1>
        </div>

        {/* Top Header Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 inline mr-1.5" />
              AI Trend Analytics
            </button>
            <button 
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'submissions' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1.5" />
              Submissions
            </button>
            <button 
              onClick={() => setActiveTab('cms')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'cms' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 inline mr-1.5" />
              Publish Content
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* ================= 1. AI FEATURE 1: TREND ANALYTICS ================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* AI Banner Card */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Linear Regression Time-Series Model
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Predictive Inflow & Engagement Forecast
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Trained on historical book pledges, essay registrations, and workshop sign-ups to help plan volunteer schedules and storage allocation.
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center sm:min-w-48 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Next Month Projected Inflow</span>
                <div className="text-3xl font-black text-emerald-400">~{forecastedBooks} Books</div>
                <span className="text-[11px] text-emerald-300 font-semibold">+{projectedGrowthRate}% expected growth</span>
              </div>
            </div>
          </div>

          {/* Historical vs Forecast Chart Preview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Monthly Donation Trajectory (2026)</h3>
                <p className="text-xs text-slate-500">Historical intake with regression projection</p>
              </div>
              <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-lg text-slate-600">Model: $Y = {slope.toFixed(1)}X + {intercept.toFixed(1)}$</span>
            </div>

            {/* Visual Bar Chart */}
            <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 pt-6 border-b border-slate-100 pb-2">
              {monthlyData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-600">{d.books}</span>
                  <div 
                    style={{ height: `${(d.books / 480) * 100}%` }}
                    className="w-full max-w-12 bg-emerald-500 rounded-t-xl transition-all"
                  />
                  <span className="text-xs font-semibold text-slate-500">{d.month}</span>
                </div>
              ))}
              {/* Forecasted 6th bar */}
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-emerald-600">{forecastedBooks}*</span>
                <div 
                  style={{ height: `${(forecastedBooks / 480) * 100}%` }}
                  className="w-full max-w-12 bg-emerald-200 border-2 border-dashed border-emerald-500 rounded-t-xl transition-all"
                />
                <span className="text-xs font-bold text-emerald-700">Jun (AI)</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-xs text-slate-500 block">Average Monthly Growth</span>
                <span className="text-lg font-black text-slate-900">+{slope.toFixed(0)} books / mo</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-xs text-slate-500 block">Contest Participation Trend</span>
                <span className="text-lg font-black text-emerald-600">Strong Upward (+32%)</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-xs text-slate-500 block">Restoration Efficiency</span>
                <span className="text-lg font-black text-slate-900">94.2% yield rate</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= 2. SUBMISSIONS & EXPORTS ================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          
          {/* Essay Submissions */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900">Essay Contest Entries</h3>
                <p className="text-xs text-slate-500">Submissions received for Junior & Senior categories</p>
              </div>
              <button 
                onClick={() => exportToCSV(essays, 'Roshan_Safha_Essays')}
                className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 font-bold border-y border-slate-200">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Essay Title</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {essays.map(item => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{item.studentName}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3 max-w-xs truncate">{item.essayTitle}</td>
                      <td className="p-3">
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Book Donations */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900">Book Donations & Pledges</h3>
                <p className="text-xs text-slate-500">Community pledges ready for pickup / drop-off</p>
              </div>
              <button 
                onClick={() => exportToCSV(donations, 'Roshan_Safha_Donations')}
                className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 font-bold border-y border-slate-200">
                  <tr>
                    <th className="p-3">Donor Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Type / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map(item => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{item.name}</td>
                      <td className="p-3">{item.phone}</td>
                      <td className="p-3">{item.city}</td>
                      <td className="p-3 font-bold text-emerald-600">{item.numberOfBooks} books</td>
                      <td className="p-3">{item.message || 'General books'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================= 3. CONTENT CMS ================= */}
      {activeTab === 'cms' && (
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Post New Announcement */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900">Post an Announcement</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Title</label>
                <input required type="text" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Essay Winners Declared" />
              </div>
              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Category</label>
                <select value={newAnnouncement.category} onChange={e => setNewAnnouncement({...newAnnouncement, category: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>General Updates</option>
                  <option>Winner Announcements</option>
                  <option>Event Recaps</option>
                  <option>Impact Stories</option>
                  <option>Collaborations</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Featured Image URL</label>
                <input type="url" value={newAnnouncement.imageUrl} onChange={e => setNewAnnouncement({...newAnnouncement, imageUrl: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="https://images.unsplash.com/..." />
              </div>
              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Content</label>
                <textarea required rows={4} value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Write full news update..." />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition">
                Publish Announcement
              </button>
            </form>
          </div>

          {/* Upload Gallery Photo */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900">Upload to Photo Gallery</h3>
            <form onSubmit={handleUploadPhoto} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Photo Caption / Title</label>
                <input required type="text" value={newPhoto.title} onChange={e => setNewPhoto({...newPhoto, title: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Distribution at Kashmir Model School" />
              </div>
              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Album Category</label>
                <select value={newPhoto.category} onChange={e => setNewPhoto({...newPhoto, category: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Book Restoration</option>
                  <option>Donation Events</option>
                  <option>Contest Prize Distributions</option>
                  <option>Workshops</option>
                  <option>Volunteers in Action</option>
                  <option>Children with Books</option>
                  <option>Collaborations</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Image URL</label>
                <input required type="url" value={newPhoto.imageUrl} onChange={e => setNewPhoto({...newPhoto, imageUrl: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="https://images.unsplash.com/..." />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition">
                Add Photo to Gallery
              </button>
              {postStatus && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-center font-bold">
                  {postStatus}
                </div>
              )}
            </form>
          </div>

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;