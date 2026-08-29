import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

function EventForm({ defaultEventName = '', onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventName: defaultEventName || 'SDGs Summer Circle 2026',
    attendees: 1,
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
      const payload = {
        ...formData,
        attendees: Number(formData.attendees) || 1
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register for event');
      }

      setStatus({ type: 'success', message: 'Registration confirmed!' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventName: defaultEventName || 'SDGs Summer Circle 2026',
        attendees: 1,
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
          <label className="block text-xs font-bold text-slate-700 mb-1">Attendee / Parent Name *</label>
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
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            required
            placeholder="rashid@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
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

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Number of Attendees</label>
          <input
            type="number"
            name="attendees"
            min="1"
            max="10"
            required
            value={formData.attendees}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Event Name *</label>
        <input
          type="text"
          name="eventName"
          required
          value={formData.eventName}
          onChange={handleChange}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Additional Message / Note (Optional)</label>
        <textarea
          name="message"
          rows="2"
          placeholder="e.g. Student grade, special requirements..."
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
        {loading ? 'Registering...' : 'Confirm Event Registration'}
      </button>
    </form>
  );
}

export default EventForm;