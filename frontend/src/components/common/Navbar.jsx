import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, BookOpen } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { getPublicMenuItems } from '../../services/api';

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

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getPublicMenuItems();
        const serverItems = res.data?.data || res.data || [];
        if (Array.isArray(serverItems) && serverItems.length > 0) {
          const activeMap = new Map(serverItems.map((item) => [item.path || item.name, item.isVisible]));
          setNavItems((prev) =>
            prev.map((item) => {
              const serverVisible = activeMap.get(item.path) ?? activeMap.get(item.name);
              return serverVisible !== undefined ? { ...item, isVisible: serverVisible } : item;
            })
          );
        }
      } catch {
        // Safe fallback
      }
    };
    fetchMenu();
  }, [location.pathname]);

  const visibleNavItems = navItems.filter((item) => item.isVisible !== false);

  return (
    <header className="sticky top-0 z-50 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 select-none py-1 group shrink-0"
          aria-label="Roshan Safha Home"
        >
          <img 
            src={logoImg} 
            alt="Roshan Safha Logo" 
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            className="h-12 sm:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-stone-100/90 p-1.5 rounded-full border border-stone-200/80">
          {visibleNavItems.map((item) => {
            if (item.isDropdown) {
              return (
                <div key={item._id} className="relative" onMouseLeave={() => setDropdownOpen(false)}>
                  <button 
                    onMouseEnter={() => setDropdownOpen(true)}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 rounded-full transition cursor-pointer"
                  >
                    <span>Programs</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-emerald-700' : 'text-stone-400'}`} />
                  </button>

                  {dropdownOpen && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-72 bg-white border border-stone-200 rounded-2xl shadow-xl p-2.5 space-y-1 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <Link 
                        to="/programs/donate-books" 
                        onClick={() => setDropdownOpen(false)} 
                        className="group flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-emerald-50 transition"
                      >
                        <span className="text-base">🎁</span>
                        <div>
                          <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">Donate Books</p>
                          <p className="text-[10px] text-stone-500">Pledge physical curriculum or library volumes</p>
                        </div>
                      </Link>

                      <Link 
                        to="/programs/book-catalog" 
                        onClick={() => setDropdownOpen(false)} 
                        className="group flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-amber-50 transition"
                      >
                        <span className="text-base">📚</span>
                        <div>
                          <p className="text-xs font-bold text-stone-900 group-hover:text-amber-800">Available Books Catalog</p>
                          <p className="text-[10px] text-stone-500">Search free restored volumes by category</p>
                        </div>
                      </Link>

                      <Link 
                        to="/programs/essays" 
                        onClick={() => setDropdownOpen(false)} 
                        className="group flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-stone-50 transition"
                      >
                        <span className="text-base">✍️</span>
                        <div>
                          <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">Annual Essay Contests</p>
                          <p className="text-[10px] text-stone-500">Guidelines, themes, and past laureates</p>
                        </div>
                      </Link>

                      <Link 
                        to="/programs/summer-circle" 
                        onClick={() => setDropdownOpen(false)} 
                        className="group flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-stone-50 transition"
                      >
                        <span className="text-base">🌱</span>
                        <div>
                          <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">SDGs Summer Circle</p>
                          <p className="text-[10px] text-stone-500">Youth environmental & literacy workshops</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            const active = isActive(item.path);

            return (
              <Link 
                key={item._id}
                to={item.path} 
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition duration-150 ${
                  active 
                    ? 'bg-white text-emerald-800 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-950 hover:bg-white/60'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Link 
            to="/programs/donate-books" 
            className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Donate Books</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-xl transition cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-5 space-y-3 text-sm font-semibold text-stone-700">
          {visibleNavItems.map((item) => {
            if (item.isDropdown) {
              return (
                <div key={item._id} className="pl-3 border-l-2 border-emerald-600 space-y-2 py-1 text-xs text-stone-600">
                  <span className="font-bold text-stone-900 block text-xs">Programs:</span>
                  <Link to="/programs/donate-books" onClick={() => setMobileOpen(false)} className="block py-1">🎁 Donate Books</Link>
                  <Link to="/programs/book-catalog" onClick={() => setMobileOpen(false)} className="block py-1">📚 Available Catalog</Link>
                  <Link to="/programs/essays" onClick={() => setMobileOpen(false)} className="block py-1">✍️ Essay Contests</Link>
                  <Link to="/programs/summer-circle" onClick={() => setMobileOpen(false)} className="block py-1">🌱 SDGs Summer Circle</Link>
                </div>
              );
            }

            return (
              <Link 
                key={item._id} 
                to={item.path} 
                onClick={() => setMobileOpen(false)} 
                className={`block py-1.5 font-bold transition ${
                  isActive(item.path) ? 'text-emerald-800 font-black' : 'hover:text-stone-950'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-stone-100">
            <Link 
              to="/programs/donate-books" 
              onClick={() => setMobileOpen(false)} 
              className="flex items-center justify-center gap-2 bg-emerald-800 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-xs w-full"
            >
              <BookOpen className="w-4 h-4" />
              <span>Donate Books</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;