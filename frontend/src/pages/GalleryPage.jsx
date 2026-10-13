import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Filter, Sparkles, X, ZoomIn } from 'lucide-react';
import { getPublicGalleryPhotos } from '../services/api';

function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState(['All']);
  const [selectedAlbum, setSelectedAlbum] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await getPublicGalleryPhotos();
        const data = res.data?.data || res.data || [];
        
        if (Array.isArray(data)) {
          setPhotos(data);
          // Extract unique album names dynamically from the uploaded photos
          const uniqueAlbums = Array.from(
            new Set(data.map((p) => p.album).filter(Boolean))
          );
          setAlbums(['All', ...uniqueAlbums]);
        }
      } catch (err) {
        console.error('Failed to load gallery photos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredPhotos = selectedAlbum === 'All' 
    ? photos 
    : photos.filter((p) => p.album === selectedAlbum);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A94A]/15 text-[#E8A94A] border border-[#E8A94A]/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Moments in Motion</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Roshan Safha Visual Archive
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Snapshots of community book drives, youth workshops, library revitalization, and volunteer initiatives across Azad Jammu and Kashmir.
          </p>
        </div>

        {/* Dynamic Album Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setSelectedAlbum(album)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                selectedAlbum === album
                  ? 'bg-slate-900 text-[#E8A94A] scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {album}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500">Loading visual moments...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPhotos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto space-y-3">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No photos found</h3>
            <p className="text-xs text-slate-500">
              There are currently no photos uploaded in this album. Check back soon!
            </p>
          </div>
        )}

        {/* Live Photo Grid */}
        {!loading && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo._id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Hover Overlay */}
                <div 
                  className="relative h-56 overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => setLightboxImage(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                  {photo.album && (
                    <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/70 backdrop-blur-xs text-[#E8A94A] px-2.5 py-1 rounded-lg">
                      {photo.album}
                    </span>
                  )}
                </div>

                {/* Caption / Details */}
                <div className="p-4 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {photo.title || 'Roshan Safha Moment'}
                  </h4>
                  {photo.caption && (
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div 
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setLightboxImage(null)}
          >
            <div 
              className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="max-h-[75vh] bg-slate-950 flex items-center justify-center">
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.caption || lightboxImage.title}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              <div className="p-5 bg-white space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E8A94A] bg-[#E8A94A]/10 px-2.5 py-0.5 rounded-md">
                  {lightboxImage.album || 'General'}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {lightboxImage.title}
                </h3>
                {lightboxImage.caption && (
                  <p className="text-xs text-slate-600">
                    {lightboxImage.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default GalleryPage;