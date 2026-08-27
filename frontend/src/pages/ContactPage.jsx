import React from 'react';
import ContactForm from '../components/forms/ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

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

function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Contact Our Desk</h1>
        <p className="text-slate-500 text-sm">
          Have a question about book collection centers, contest evaluations, or community drives? Reach out to us.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Contact Info Sidebar */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-lg">
          <div>
            <h3 className="text-lg font-bold">Direct Channels</h3>
            <p className="text-xs text-slate-400 mt-1">We respond to inquiries within 24–48 hours.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block font-medium">Email Address</span>
                <a href="mailto:roshansafha@gmail.com" className="text-white hover:text-emerald-400 transition font-bold">roshansafha@gmail.com</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block font-medium">Phone / WhatsApp</span>
                <a href="tel:+923005966967" className="text-white hover:text-emerald-400 transition font-bold">+92 300 5966967</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block font-medium">Headquarters</span>
                <span className="text-white font-medium">Muzaffarabad, Azad Jammu & Kashmir, Pakistan</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block font-medium">Operating Hours</span>
                <span className="text-white font-medium">Mon – Sat: 9:00 AM – 5:00 PM PKT</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-800 hover:bg-emerald-600 rounded-xl transition text-slate-300 hover:text-white">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-800 hover:bg-emerald-600 rounded-xl transition text-slate-300 hover:text-white">
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Send a General Inquiry</h2>
          <ContactForm />
        </div>

      </div>

    </div>
  );
}

export default ContactPage;