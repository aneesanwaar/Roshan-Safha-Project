import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

function CollaborationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    collabType: 'School / College Partnership',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit collaboration proposal');
      }

      setStatus({ type: 'success', message: 'Partnership request submitted successfully!' });
      setFormData({
        name: '',
        organization: '',
        email: '',
        phone: '',
        collabType: 'School / College Partnership',
        message: ''
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status.message && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Representative Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Dr. Rashid Khan"
            value={formData.name}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Entity *</label>
          <input
            type="text"
            name="organization"
            required
            placeholder="e.g. AJK Youth Forum / City Grammar School"
            value={formData.organization}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Official Email *</label>
          <input
            type="email"
            name="email"
            required
            placeholder="contact@org.org"
            value={formData.email}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="0300 1234567"
            value={formData.phone}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Collaboration Type *</label>
        <select
          name="collabType"
          required
          value={formData.collabType}
          onChange={handleChange}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
        >
          <option value="School / College Partnership">School / College Partnership</option>
          <option value="NGO / Youth Foundation">NGO / Youth Foundation</option>
          <option value="Book Drive Co-Host">Book Drive Co-Host</option>
          <option value="Corporate / Event Sponsor">Corporate / Event Sponsor</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Proposal / Message *</label>
        <textarea
          name="message"
          rows="3"
          required
          placeholder="Briefly describe the collaboration proposal..."
          value={formData.message}
          onChange={handleChange}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        <Send className="w-3.5 h-3.5" />
        {loading ? 'Submitting...' : 'Submit Partnership Proposal'}
      </button>
    </form>
  );
}

export default CollaborationForm;