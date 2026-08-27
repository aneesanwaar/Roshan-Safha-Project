import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import logoImg from '../../assets/logo.png';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column with Clean Crisp Logo Badge */}
        <div className="space-y-4 md:col-span-1">
          <Link 
            to="/" 
            className="inline-flex items-center bg-white/95 hover:bg-white px-3.5 py-2 rounded-2xl shadow-sm border border-slate-700/50 transition-transform hover:scale-102 group mb-1"
          >
            <img 
              src={logoImg} 
              alt="Roshan Safha Logo" 
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </Link>

          <p className="text-xs text-slate-300 italic leading-relaxed">
            “Roshan Safha-because second chances are for everyone and everything.”
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl transition text-slate-400"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl transition text-slate-400"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-200 tracking-wider mb-4">Site Navigation</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us (Our Story & SDGs)</Link></li>
            <li><Link to="/gallery" className="hover:text-white transition">Photo Gallery & Restoration</Link></li>
            <li><Link to="/announcements" className="hover:text-white transition">Announcements & News</Link></li>
            <li><Link to="/get-involved" className="hover:text-white transition">Get Involved (Volunteer / Partner)</Link></li>
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-200 tracking-wider mb-4">Core Programs</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/programs/donations" className="hover:text-white transition">Book Donations & Catalog</Link></li>
            <li><Link to="/programs/essays" className="hover:text-white transition">Annual Essay Contests</Link></li>
            <li><Link to="/programs/summer-circle" className="hover:text-white transition">SDGs Summer Circle</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-200 tracking-wider mb-4">Contact Details</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <a href="mailto:roshansafha@gmail.com" className="hover:text-white transition">roshansafha@gmail.com</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <a href="tel:+923005966967" className="hover:text-white transition">+92 300 5966967</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Muzaffarabad, Azad Jammu & Kashmir, Pakistan</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-2">
        <span>Copyright © 2025 Roshan Safha. All rights reserved.</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for community empowerment.
        </span>
      </div>
    </footer>
  );
}

export default Footer;