import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, BookOpen } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { getPublicMenuItems } from "../../services/api";

const DEFAULT_NAV_ITEMS = [
  { _id: 'p-1', name: 'Home', path: '/', isVisible: true },
  { _id: 'p-2', name: 'About Us', path: '/about', isVisible: true },
  { _id: 'p-3', name: 'Programs', path: '/programs', isVisible: true, isDropdown: true },
  { _id: 'p-4', name: 'Gallery', path: '/gallery', isVisible: true },
  { _id: 'p-5', name: 'Announcements', path: '/announcements', isVisible: true },
  { _id: 'p-6', name: 'Get Involved', path: '/get-involved', isVisible: true },
  { _id: 'p-7', name: 'Contact Us', path: '/contact', isVisible: true }
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navItems, setNavItems] = useState(DEFAULT_NAV_ITEMS);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Hydrate live menu items from MongoDB
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getPublicMenuItems();
        const serverItems = res.data?.data || res.data || [];
        if (Array.isArray(serverItems) && serverItems.length > 0) {
          // Merge server items with default structure to preserve routes & icons
          const activeMap = new Map(serverItems.map((item) => [item.path || item.name, item.isVisible]));
          
          setNavItems((prev) =>
            prev.map((item) => {
              const serverVisible = activeMap.get(item.path) ?? activeMap.get(item.name);
              return serverVisible !== undefined ? { ...item, isVisible: serverVisible } : item;
            })
          );
        }
      } catch {
        // Retain default active items on network fallback
      }
    };

    fetchMenu();
  }, [location.pathname]);

  // Only render active/visible items
  const visibleNavItems = navItems.filter((item) => item.isVisible !== false);

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
          {visibleNavItems.map((item) => {
            if (item.isDropdown) {
              return (
                <div key={item._id} className="relative" onMouseLeave={() => setDropdownOpen(false)}>
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
              );
            }

            return (
              <Link 
                key={item._id}
                to={item.path} 
                className={`transition py-1 border-b-2 ${
                  isActive(item.path) 
                    ? 'border-[#E8A94A] text-slate-900 font-bold' 
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Action CTA Button */}
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
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-3 text-sm font-semibold text-slate-700 animate-in slide-in-from-top-2">
          {visibleNavItems.map((item) => {
            if (item.isDropdown) {
              return (
                <div key={item._id} className="pl-3 border-l-2 border-[#E8A94A] space-y-2 py-1 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block text-xs">Programs:</span>
                  <Link to="/programs/donate-books" onClick={() => setMobileOpen(false)} className="block">🎁 Donate Books (Donor Portal)</Link>
                  <Link to="/programs/book-catalog" onClick={() => setMobileOpen(false)} className="block">📚 Available Books Catalog</Link>
                  <Link to="/programs/essays" onClick={() => setMobileOpen(false)} className="block">✍️ Essay Contests</Link>
                  <Link to="/programs/summer-circle" onClick={() => setMobileOpen(false)} className="block">🌱 SDGs Summer Circle</Link>
                </div>
              );
            }

            return (
              <Link 
                key={item._id} 
                to={item.path} 
                onClick={() => setMobileOpen(false)} 
                className="block py-1 hover:text-[#E8A94A]"
              >
                {item.name}
              </Link>
            );
          })}
          
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