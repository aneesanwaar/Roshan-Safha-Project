import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Image as ImageIcon, Loader2, X, Calendar } from 'lucide-react';

function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await api.getGallery();
        setPhotos(data);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  // Exact categories required by Roshan Safha specification
  const categories = [
    'All',
    'Book Restoration',
    'Donation Events',
    'Contest Prize Distributions',
    'Workshops',
    'Volunteers in Action',
    'Children with Books',
    'Collaborations'
  ];

  const filteredPhotos = filter === 'All' 
    ? photos 
    : photos.filter(p => p.category?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Impact Archives
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Outreach & Activities Gallery
        </h1>
        <p className="text-slate-500 text-sm">
          A visual record of book restoration drives, distribution ceremonies, volunteer workshops, and community events across Azad Kashmir.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === cat
                ? 'bg-slate-900 text-white shadow-sm scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 gap-2 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Loading gallery moments...</span>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 space-y-2">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No photos in this category yet</h3>
          <p className="text-slate-400 text-xs">Images will appear as new drives and workshops are logged.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo._id}
              onClick={() => setSelectedPhoto(photo)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {photo.category || 'Outreach'}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {photo.title}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Click-to-Enlarge Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)} 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="max-h-[65vh] bg-slate-950 flex items-center justify-center">
              <img 
                src={selectedPhoto.imageUrl} 
                alt={selectedPhoto.title}
                className="max-h-[65vh] w-full object-contain"
              />
            </div>
            <div className="p-6 space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{selectedPhoto.category}</span>
              <h3 className="text-xl font-bold text-slate-900">{selectedPhoto.title}</h3>
              <p className="text-xs text-slate-400">Captured on {new Date(selectedPhoto.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default GalleryPage;