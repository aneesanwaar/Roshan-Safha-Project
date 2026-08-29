import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

function DonationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    numberOfBooks: '',
    bookTypes: '',
    dropoffMethod: 'Drop-off',
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
        numberOfBooks: Number(formData.numberOfBooks) || 0
      };

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit donation pledge');
      }

      setStatus({ type: 'success', message: 'Thank you! Your donation pledge has been registered.' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        numberOfBooks: '',
        bookTypes: '',
        dropoffMethod: 'Drop-off',
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
          <label className="block text-xs font-bold text-slate-700 mb-1">Donor Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Ayesha Tariq"
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
            placeholder="ayesha@example.com"
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

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            placeholder="e.g. Muzaffarabad"
            value={formData.city}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Number of Books</label>
          <input
            type="number"
            name="numberOfBooks"
            min="1"
            placeholder="e.g. 10"
            value={formData.numberOfBooks}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Drop-off Method</label>
          <select
            name="dropoffMethod"
            value={formData.dropoffMethod}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="Drop-off">Drop-off at Center</option>
            <option value="Pickup Required">Pickup Required (Muzaffarabad)</option>
            <option value="Courier">Courier</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Book Types</label>
        <input
          type="text"
          name="bookTypes"
          placeholder="e.g. Matric Science, FSc Pre-Med, English Novels"
          value={formData.bookTypes}
          onChange={handleChange}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Message / Notes</label>
        <textarea
          name="message"
          rows="2"
          placeholder="Any additional details..."
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
        {loading ? 'Submitting...' : 'Submit Donation'}
      </button>
    </form>
  );
}

export default DonationForm;