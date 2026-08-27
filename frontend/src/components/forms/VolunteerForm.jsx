import React, { useState } from 'react';
import { api } from '../../services/api';
import { CheckCircle2, Loader2 } from 'lucide-react';

function VolunteerForm() {
  const [data, setData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    city: '',
    skills: '',
    availability: 'Weekends'
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });
    try {
      const res = await api.submitVolunteer(data);
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
        <h3 className="text-lg font-bold text-brand-900">Application Received!</h3>
        <p className="text-brand-800 text-xs">Welcome to the volunteer network. We'll be in touch for the next orientation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status.error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">{status.error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Full Name</label>
          <input required type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Email</label>
          <input required type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="you@example.com" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Age</label>
          <input required type="number" min="12" max="90" value={data.age} onChange={e => setData({...data, age: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="20" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Phone</label>
          <input required type="tel" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="0300-1234567" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">City</label>
          <input required type="text" value={data.city} onChange={e => setData({...data, city: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Islamabad" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Skills & Experience</label>
        <input required type="text" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Event Management, Social Media, Public Speaking" />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Availability</label>
        <select value={data.availability} onChange={e => setData({...data, availability: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white">
          <option value="Weekends">Weekends Only</option>
          <option value="Full-time">Full-time / Flexible</option>
          <option value="Evenings">Evenings</option>
        </select>
      </div>
      <button disabled={status.loading} type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-sm text-sm flex items-center justify-center gap-2">
        {status.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Volunteer Network"}
      </button>
    </form>
  );
}

export default VolunteerForm;