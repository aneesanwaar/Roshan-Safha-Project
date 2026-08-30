import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, BookOpen } from 'lucide-react';
import logoImg from '../../assets/logo.png';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center select-none py-1 group shrink-0"
          aria-label="Roshan Safha Home"
        >
          <img 
            src={logoImg} 
            alt="Roshan Safha Logo" 
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            className="h-12 sm:h-15 w-auto object-contain select-none pointer-events-none transition-transform duration-200 group-hover:scale-102"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-700">
          <Link 
            to="/" 
            className={`transition py-1 border-b-2 ${
              isActive('/') 
                ? 'border-[#E8A94A] text-slate-900 font-bold' 
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Home
          </Link>
          
          <Link 
            to="/about" 
            className={`transition py-1 border-b-2 ${
              isActive('/about') 
                ? 'border-[#E8A94A] text-slate-900 font-bold' 
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            About Us
          </Link>

          {/* Programs Dropdown */}
          <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
            <button 
              onMouseEnter={() => setDropdownOpen(true)}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 hover:text-slate-900 transition py-2 cursor-pointer"
            >
              Programs <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 px-2 space-y-1 animate-in fade-in slide-in-from-top-2"
              >
                <Link 
                  to="/programs/donate-books" 
                  onClick={() => setDropdownOpen(false)} 
                  className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition"
                >
                  🎁 Donate Books (Donor Portal)
                </Link>
                <Link 
                  to="/programs/book-catalog" 
                  onClick={() => setDropdownOpen(false)} 
                  className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition"
                >
                  📚 Available Books Catalog
                </Link>
                <Link 
                  to="/programs/essays" 
                  onClick={() => setDropdownOpen(false)} 
                  className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition"
                >
                  ✍️ Annual Essay Contests & Archive
                </Link>
                <Link 
                  to="/programs/summer-circle" 
                  onClick={() => setDropdownOpen(false)} 
                  className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition"
                >
                  🌱 SDGs Summer Circle
                </Link>
              </div>
            )}
          </div>

          <Link 
            to="/gallery" 
            className={`transition py-1 border-b-2 ${
              isActive('/gallery') 
                ? 'border-[#E8A94A] text-slate-900 font-bold' 
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Gallery
          </Link>

          <Link 
            to="/announcements" 
            className={`transition py-1 border-b-2 ${
              isActive('/announcements') 
                ? 'border-[#E8A94A] text-slate-900 font-bold' 
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Announcements
          </Link>

          <Link 
            to="/get-involved" 
            className={`transition py-1 border-b-2 ${
              isActive('/get-involved') 
                ? 'border-[#E8A94A] text-slate-900 font-bold' 
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Get Involved
          </Link>

          <Link 
            to="/contact" 
            className={`transition py-1 border-b-2 ${
              isActive('/contact') 
                ? 'border-[#E8A94A] text-slate-900 font-bold' 
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Action CTA Button with #E8A94A brand color */}
        <div className="hidden lg:flex items-center">
          <Link 
            to="/programs/donate-books" 
            className="flex items-center gap-2 bg-[#E8A94A] hover:bg-[#d99839] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-all hover:shadow-md active:scale-95 border border-amber-500/30"
          >
            <BookOpen className="w-4 h-4 text-slate-950" />
            Donate Books
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-3 text-sm font-semibold text-slate-700">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-1">Home</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-1">About Us</Link>
          <div className="pl-3 border-l-2 border-[#E8A94A] space-y-2 py-1 text-xs text-slate-600">
            <Link to="/programs/donate-books" onClick={() => setMobileOpen(false)} className="block">🎁 Donate Books (Donor Portal)</Link>
            <Link to="/programs/book-catalog" onClick={() => setMobileOpen(false)} className="block">📚 Available Books Catalog</Link>
            <Link to="/programs/essays" onClick={() => setMobileOpen(false)} className="block">✍️ Essay Contests</Link>
            <Link to="/programs/summer-circle" onClick={() => setMobileOpen(false)} className="block">🌱 SDGs Summer Circle</Link>
          </div>
          <Link to="/gallery" onClick={() => setMobileOpen(false)} className="block py-1">Gallery</Link>
          <Link to="/announcements" onClick={() => setMobileOpen(false)} className="block py-1">Announcements</Link>
          <Link to="/get-involved" onClick={() => setMobileOpen(false)} className="block py-1">Get Involved</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-1">Contact Us</Link>
          
          <div className="pt-2">
            <Link 
              to="/programs/donate-books" 
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#E8A94A] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-extrabold w-full"
            >
              <BookOpen className="w-4 h-4" />
              Donate Books
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;