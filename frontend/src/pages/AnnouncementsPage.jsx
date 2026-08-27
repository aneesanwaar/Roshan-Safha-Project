import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bell, Calendar, Sparkles, Loader2, Search } from 'lucide-react';

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error("Failed to load announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categories = [
    'All',
    'Winner Announcements',
    'Event Recaps',
    'Impact Stories',
    'Collaborations',
    'General Updates'
  ];

  const filtered = announcements.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Official Press & Updates
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">News & Announcements</h1>
        <p className="text-slate-500 text-sm">
          Stay informed about contest guidelines, winner ceremonies, partner alliances, and donation drives.
        </p>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news by keyword..."
            className="w-full bg-slate-50 pl-10 pr-4 py-2.5 rounded-xl text-xs border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                selectedCategory === c
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 gap-2 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Fetching updates...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 space-y-2">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No announcements match your search</h3>
          <p className="text-slate-400 text-xs">Try clearing the search box or switching categories.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((item) => (
            <article 
              key={item._id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-3">
                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {new Date(item.createdAt).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                  Official
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {item.title}
              </h2>

              {item.imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </article>
          ))}
        </div>
      )}

    </div>
  );
}

export default AnnouncementsPage;