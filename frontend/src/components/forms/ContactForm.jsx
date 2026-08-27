import React, { useState } from 'react';
import { api } from '../../services/api';
import { CheckCircle2, Loader2 } from 'lucide-react';

function ContactForm() {
  const [data, setData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });
    try {
      const res = await api.submitContact(data);
      if (res.success) setStatus({ loading: false, error: null, success: true });
      else setStatus({ loading: false, error: res.message || "Failed.", success: false });
    } catch {
      setStatus({ loading: false, error: "Network error.", success: false });
    }
  };

  if (status.success) {
    return (
      <div className="bg-brand-50 border border-brand-200 p-8 rounded-2xl text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-brand-600 mx-auto" />
        <h3 className="text-lg font-bold text-brand-900">Message Dispatched!</h3>
        <p className="text-brand-800 text-xs">Our administrative team will respond to your email shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status.error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">{status.error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Your Name</label>
          <input required type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Name" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Email</label>
          <input required type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Email" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Subject</label>
        <input required type="text" value={data.subject} onChange={e => setData({...data, subject: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Topic of inquiry" />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Message (Min 10 characters)</label>
        <textarea required rows={4} minLength={10} value={data.message} onChange={e => setData({...data, message: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Write your message here..." />
      </div>
      <button disabled={status.loading} type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-sm text-sm flex items-center justify-center gap-2">
        {status.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Message"}
      </button>
    </form>
  );
}

export default ContactForm;