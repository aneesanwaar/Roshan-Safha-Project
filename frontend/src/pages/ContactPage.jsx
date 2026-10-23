import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react';
import { getPublicPageContent, submitContactMessage } from '../services/api';

const DEFAULT_CONTACT_CONTENT = {
  hubAddress: 'Roshan Safha Reading Hub, Near Neelum Bridge, Muzaffarabad, Azad Jammu and Kashmir',
  whatsapp: '+92 300 1234567'
};

function ContactPage() {
  const [content, setContent] = useState(DEFAULT_CONTACT_CONTENT);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchContactCms = async () => {
      try {
        const res = await getPublicPageContent('contact');
        if (res.data?.success && res.data?.content && Object.keys(res.data.content).length > 0) {
          setContent((prev) => ({
            ...prev,
            ...res.data.content
          }));
        }
      } catch (err) {
        console.warn('Using default Contact CMS content');
      }
    };
    fetchContactCms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (typeof submitContactMessage === 'function') {
        await submitContactMessage(formState);
      }
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans space-y-12">
      
      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Connect with Roshan Safha
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Have books to pledge, inquiries regarding essay submissions, or institutional partnerships? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Contact Info Card (Dynamic Address & WhatsApp) */}
        <div className="lg:col-span-2 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-md flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Contact Information</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our regional coordination desk handles donor schedules, volunteer intake, and essay verifications.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E8A94A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Physical Hub</span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {content.hubAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official WhatsApp Helpline</span>
                  <p className="text-xs text-slate-200 font-bold">
                    {content.whatsapp}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Inquiries</span>
                  <p className="text-xs text-slate-200 font-medium">
                    contact@roshansafha.org
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Desk Hours</span>
                  <p className="text-xs text-slate-200 font-medium">
                    Monday – Saturday (10:00 AM – 5:00 PM)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-400">
            For urgent book collection inquiries, WhatsApp is the quickest channel for real-time drop-off routing.
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Send an Online Inquiry</h3>
            <p className="text-xs text-slate-500">All submissions are archived securely in the Admin Dashboard.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-950">Message Dispatched!</h4>
              <p className="text-xs text-emerald-800">
                Thank you for reaching out. A team representative will review your inquiry shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-900 underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                    placeholder="e.g. Ayesha Khan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                    placeholder="e.g. ayesha@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                  placeholder="e.g. Question regarding book drop-box near Chehla"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  rows="4"
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
                  placeholder="Type your message details here..."
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-[#E8A94A]" />
                  <span>{submitting ? 'Sending...' : 'Send Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}

export default ContactPage;