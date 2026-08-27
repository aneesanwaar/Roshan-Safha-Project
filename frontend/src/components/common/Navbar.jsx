import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Award, LayoutGrid, Bell, Shield } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-brand-600 text-white p-2 rounded-xl group-hover:bg-brand-700 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight block leading-none">Roshan Safha</span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Literacy & Youth Initiative</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link 
            to="/" 
            className={`transition ${isActive('/') ? 'text-brand-600 font-semibold' : 'hover:text-slate-900'}`}
          >
            Home
          </Link>
          <Link 
            to="/gallery" 
            className={`flex items-center gap-1.5 transition ${isActive('/gallery') ? 'text-brand-600 font-semibold' : 'hover:text-slate-900'}`}
          >
            <LayoutGrid className="w-4 h-4" /> Gallery
          </Link>
          <Link 
            to="/announcements" 
            className={`flex items-center gap-1.5 transition ${isActive('/announcements') ? 'text-brand-600 font-semibold' : 'hover:text-slate-900'}`}
          >
            <Bell className="w-4 h-4" /> News & Updates
          </Link>
          <Link 
            to="/forms" 
            className={`transition ${isActive('/forms') ? 'text-brand-600 font-semibold' : 'hover:text-slate-900'}`}
          >
            Portals & Forms
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            to="/forms?tab=essay" 
            className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-brand-100 transition shadow-sm"
          >
            <Award className="w-4 h-4 text-brand-600" />
            Essay Contest
          </Link>
          <Link 
            to="/admin" 
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition"
            title="Admin Portal"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;