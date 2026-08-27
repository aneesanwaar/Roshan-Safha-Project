import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="bg-brand-600 p-1.5 rounded-lg text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            Roshan Safha
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fostering literacy, youth empowerment, and literary passion across communities through structured educational programs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-slate-200 tracking-wider mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/gallery" className="hover:text-white transition">Gallery & Impact</Link></li>
            <li><Link to="/announcements" className="hover:text-white transition">Announcements</Link></li>
            <li><Link to="/forms?tab=essay" className="hover:text-white transition">Essay Contest 2026</Link></li>
          </ul>
        </div>

        {/* Intake Portals */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-slate-200 tracking-wider mb-3">Programs</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/forms?tab=donations" className="hover:text-white transition">Book Donations</Link></li>
            <li><Link to="/forms?tab=volunteers" className="hover:text-white transition">Volunteer Registration</Link></li>
            <li><Link to="/forms?tab=collab" className="hover:text-white transition">Institutional Partnerships</Link></li>
            <li><Link to="/forms?tab=contact" className="hover:text-white transition">General Inquiries</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-slate-200 tracking-wider mb-3">Contact Desk</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-500 shrink-0" /> roshansafha@org</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-500 shrink-0" /> +92 300 0000000</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-500 shrink-0" /> Muzaffarabad / AJK, Pakistan</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
        <span>© 2026 Roshan Safha. Built with</span>
        <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
        <span>for community literacy.</span>
      </div>
    </footer>
  );
}

export default Footer;