import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Award } from 'lucide-react';
import logoImg from '../../assets/logo.png';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Bilingual Brand Logo & Titles */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logoImg} 
            alt="Roshan Safha Logo" 
            className="h-12 w-auto object-contain rounded-xl shadow-xs transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col justify-center">
            {/* English Title */}
            <span 
              className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-wide leading-none"
              style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
            >
              Roshan Safha
            </span>
            {/* Urdu Title */}
            <span 
              className="text-sm sm:text-base font-semibold text-emerald-800 leading-tight mt-0.5"
              style={{ fontFamily: "'Noto Nastaliq Urdu', 'Segoe UI', Tahoma, sans-serif" }}
              dir="rtl"
            >
              روشن صفحہ
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <Link to="/" className={`transition ${isActive('/') ? 'text-brand-600' : 'hover:text-slate-900'}`}>
            Home
          </Link>
          <Link to="/about" className={`transition ${isActive('/about') ? 'text-brand-600' : 'hover:text-slate-900'}`}>
            About Us
          </Link>

          {/* Programs Dropdown */}
          <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
            <button 
              onMouseEnter={() => setDropdownOpen(true)}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 hover:text-slate-900 transition py-2"
            >
              Programs <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {dropdownOpen && (
              <div 
                className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 px-2 space-y-1 animate-in fade-in slide-in-from-top-2"
              >
                <Link 
                  to="/programs/donations" 
                  onClick={() => setDropdownOpen(false)} 
                  className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition"
                >
                  📚 Book Donations & Available Catalog
                </Link>
                <Link 
                  to="/programs/essays" 
                  onClick={() => setDropdownOpen(false)} 
                  className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition"
                >
                  ✍️ Annual Essay Contests & Archive
                </Link>
                <Link 
                  to="/programs/summer-circle" 
                  onClick={() => setDropdownOpen(false)} 
                  className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition"
                >
                  🌱 SDGs-Based Summer Circle & Events
                </Link>
              </div>
            )}
          </div>

          <Link to="/gallery" className={`transition ${isActive('/gallery') ? 'text-brand-600' : 'hover:text-slate-900'}`}>
            Gallery
          </Link>
          <Link to="/announcements" className={`transition ${isActive('/announcements') ? 'text-brand-600' : 'hover:text-slate-900'}`}>
            Announcements
          </Link>
          <Link to="/get-involved" className={`transition ${isActive('/get-involved') ? 'text-brand-600' : 'hover:text-slate-900'}`}>
            Get Involved
          </Link>
          <Link to="/contact" className={`transition ${isActive('/contact') ? 'text-brand-600' : 'hover:text-slate-900'}`}>
            Contact Us
          </Link>
        </nav>

        {/* Action CTA */}
        <div className="hidden lg:flex items-center">
          <Link 
            to="/programs/essays" 
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Award className="w-4 h-4" />
            Contest 2026
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-3 text-sm font-medium text-slate-700">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-1">Home</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-1">About Us</Link>
          <div className="pl-3 border-l-2 border-brand-200 space-y-2 py-1 text-xs text-slate-600">
            <Link to="/programs/donations" onClick={() => setMobileOpen(false)} className="block">Book Donations & Catalog</Link>
            <Link to="/programs/essays" onClick={() => setMobileOpen(false)} className="block">Essay Contests</Link>
            <Link to="/programs/summer-circle" onClick={() => setMobileOpen(false)} className="block">SDGs Summer Circle</Link>
          </div>
          <Link to="/gallery" onClick={() => setMobileOpen(false)} className="block py-1">Gallery</Link>
          <Link to="/announcements" onClick={() => setMobileOpen(false)} className="block py-1">Announcements</Link>
          <Link to="/get-involved" onClick={() => setMobileOpen(false)} className="block py-1">Get Involved</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-1">Contact Us</Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;