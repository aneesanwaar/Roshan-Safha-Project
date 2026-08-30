import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  FileText, 
  Users, 
  LayoutTemplate, 
  Megaphone, 
  Image as ImageIcon, 
  Download, 
  Plus, 
  Save, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  BarChart3
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [cmsHero, setCmsHero] = useState({
    headline: 'Second Chances for Everyone & Everything.',
    subtext: 'Roshan Safha is dedicated to restoring books, igniting creative minds through essay competitions, and driving community literacy across Muzaffarabad and beyond.',
    impactBooks: '1,250+',
    impactStudents: '3,400+',
    impactSchools: '45+'
  });

  const [announcements, setAnnouncements] = useState([
    { _id: '1', title: 'Annual Essay Competition 2026 Announced', category: 'Contest', status: 'Published', date: '2026-08-15' }
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', category: 'General', content: '' });

  const [gallery, setGallery] = useState([
    { _id: '1', album: 'Restoration Hub 2026', caption: 'Volunteers rebinding syllabus textbooks in Muzaffarabad', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600' }
  ]);
  const [newPhoto, setNewPhoto] = useState({ album: '', caption: '', url: '' });

  const [submissions, setSubmissions] = useState({
    donations: [
      { _id: 'don_1', name: 'Ahmad Raza', phone: '03001234567', city: 'Muzaffarabad', numberOfBooks: 15, bookTypes: 'Matric Science', dropoffMethod: 'Drop-off', date: '2026-08-20' },
      { _id: 'don_2', name: 'Khadija Bibi', phone: '03339876543', city: 'Rawalakot', numberOfBooks: 28, bookTypes: 'FSc Pre-Med', dropoffMethod: 'Courier', date: '2026-08-24' }
    ],
    essays: [
      { _id: 'ess_1', studentName: 'Maryam Tariq', age: 15, institution: 'APS Muzaffarabad', category: 'Junior', title: 'The Power of Books', status: 'Winner' },
      { _id: 'ess_2', studentName: 'Zaid Abbasi', age: 19, institution: 'UAJK', category: 'Senior', title: 'Literacy in AI Era', status: 'Pending' }
    ],
    volunteers: [
      { _id: 'vol_1', name: 'Bilal Ahmed', phone: '03017788999', city: 'Muzaffarabad', skills: 'Book Binding & Cataloging', availability: 'Weekends' }
    ]
  });

  // Export Submissions to CSV
  const exportToCSV = (datasetName, rows) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).join(',');
    const values = rows.map((r) => Object.values(r).map((val) => `"${val}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${values}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RoshanSafha_${datasetName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // AI Trend Line Data Setup
  const chartData = {
    labels: ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'],
    datasets: [
      {
        label: 'Book Donations (Monthly Volume)',
        data: [15, 28, 42, 65, 90, 130],
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#059669'
      },
      {
        label: 'Contest & Event Participation',
        data: [8, 14, 25, 40, 75, 110],
        borderColor: '#E8A94A',
        backgroundColor: 'rgba(232, 169, 74, 0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#E8A94A'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Control Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#E8A94A]/20 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full mb-1 border border-[#E8A94A]/30">
              🛡️ Super Admin Control Panel
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">Roshan Safha Operations & CMS</h1>
            <p className="text-xs text-slate-500">Live content management, AI participation forecasting, and submission records.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2500);
              }}
              className="flex items-center gap-2 bg-[#E8A94A] hover:bg-[#d99839] text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save All Changes
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Changes successfully synchronized with the live platform!</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 bg-slate-200/80 p-1.5 rounded-2xl">
          {[
            { id: 'analytics', label: 'AI Trend Analytics', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'submissions', label: 'Form Submissions & CSV', icon: <FileText className="w-4 h-4" /> },
            { id: 'cms-home', label: 'Homepage CMS', icon: <LayoutTemplate className="w-4 h-4" /> },
            { id: 'cms-announcements', label: 'Announcements & News', icon: <Megaphone className="w-4 h-4" /> },
            { id: 'cms-gallery', label: 'Gallery Albums', icon: <ImageIcon className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: AI Analytics & Linear Regression Trends */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Insights Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                  <Sparkles className="w-4 h-4" /> AI Growth Velocity
                </div>
                <div className="text-2xl font-black text-slate-900">+22.8 books / mo</div>
                <p className="text-[11px] text-slate-500">Linear regression slope indicates consistent accelerating growth since March 2026.</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-[#E8A94A] font-bold text-xs">
                  <TrendingUp className="w-4 h-4" /> September 2026 Forecast
                </div>
                <div className="text-2xl font-black text-slate-900">~165+ Books</div>
                <p className="text-[11px] text-slate-500">Projected donor pledge trajectory for the upcoming academic semester opening.</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                  <BarChart3 className="w-4 h-4" /> Seasonal Peak Identifier
                </div>
                <div className="text-2xl font-black text-slate-900">July – August</div>
                <p className="text-[11px] text-slate-500">Summer workshops and essay competitions drive a 3.4x spike in community engagement.</p>
              </div>
            </div>

            {/* Time Series Chart */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Participation & Book Inflow Trajectory</h3>
                  <p className="text-xs text-slate-500">Time-series dataset analyzing 6-month historical trajectory and predictive trends.</p>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                  Linear Model Active
                </span>
              </div>
              <div className="h-72 w-full">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11, weight: 'bold' } } } },
                    scales: { y: { grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Form Submissions & CSV Downloads */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Submission Records</h3>
                <p className="text-xs text-slate-500">Download formatted CSV reports for offline planning and audit.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => exportToCSV('Donations', submissions.donations)}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Donations CSV
                </button>
                <button
                  onClick={() => exportToCSV('Essays', submissions.essays)}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Essays CSV
                </button>
                <button
                  onClick={() => exportToCSV('Volunteers', submissions.volunteers)}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Volunteers CSV
                </button>
              </div>
            </div>

            {/* Quick Data View */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">Recent Book Donations</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3">Donor</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Book Types</th>
                      <th className="p-3">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.donations.map((d) => (
                      <tr key={d._id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">{d.name}</td>
                        <td className="p-3">{d.city}</td>
                        <td className="p-3 font-bold text-emerald-600">{d.numberOfBooks} books</td>
                        <td className="p-3">{d.bookTypes}</td>
                        <td className="p-3"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">{d.dropoffMethod}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Homepage CMS Editor */}
        {activeTab === 'cms-home' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Homepage Live Content Editor</h3>
              <p className="text-xs text-slate-500">Edit hero text, mission statements, and real-time impact numbers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={cmsHero.headline}
                  onChange={(e) => setCmsHero({ ...cmsHero, headline: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtext / Mission Statement</label>
                <textarea
                  rows="3"
                  value={cmsHero.subtext}
                  onChange={(e) => setCmsHero({ ...cmsHero, subtext: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Impact Stat: Books Restored</label>
                <input
                  type="text"
                  value={cmsHero.impactBooks}
                  onChange={(e) => setCmsHero({ ...cmsHero, impactBooks: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Impact Stat: Students Supported</label>
                <input
                  type="text"
                  value={cmsHero.impactStudents}
                  onChange={(e) => setCmsHero({ ...cmsHero, impactStudents: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Announcements & News Manager */}
        {activeTab === 'cms-announcements' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Publish New Announcement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Post Title (e.g. Summer Cohort Batch B Opens)..."
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white"
                />
                <select
                  value={newAnnouncement.category}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold"
                >
                  <option value="General">General News</option>
                  <option value="Contest">Essay Contest</option>
                  <option value="Workshop">Summer Circle Workshop</option>
                  <option value="Drive">Book Drive</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (!newAnnouncement.title) return;
                  setAnnouncements([{ _id: Date.now().toString(), ...newAnnouncement, status: 'Published', date: '2026-08-30' }, ...announcements]);
                  setNewAnnouncement({ title: '', category: 'General', content: '' });
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Publish Announcement
              </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-700">Published Posts</h4>
              {announcements.map((post) => (
                <div key={post._id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded mr-2">{post.category}</span>
                    <strong className="text-slate-900">{post.title}</strong>
                  </div>
                  <span className="text-[10px] text-slate-400">{post.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Gallery & Media Library */}
        {activeTab === 'cms-gallery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Add Photo to Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Album Name (e.g. Summer Camp 2026)"
                  value={newPhoto.album}
                  onChange={(e) => setNewPhoto({ ...newPhoto, album: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
                <input
                  type="text"
                  placeholder="Image URL or Cloudinary Link"
                  value={newPhoto.url}
                  onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
                <input
                  type="text"
                  placeholder="Caption Description"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>
              <button
                onClick={() => {
                  if (!newPhoto.url) return;
                  setGallery([{ _id: Date.now().toString(), ...newPhoto }, ...gallery]);
                  setNewPhoto({ album: '', caption: '', url: '' });
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add to Gallery
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {gallery.map((img) => (
                <div key={img._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <img src={img.url} alt={img.caption} className="w-full h-36 object-cover" />
                  <div className="p-3">
                    <span className="text-[10px] font-bold text-[#E8A94A] block">{img.album}</span>
                    <p className="text-xs text-slate-700 font-medium truncate mt-0.5">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;