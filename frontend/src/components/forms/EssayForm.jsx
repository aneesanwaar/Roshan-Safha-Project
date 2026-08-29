import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Upload } from 'lucide-react';

function EssayForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    studentName: '',
    age: '',
    institutionName: '',
    category: 'Junior',
    email: '',
    phone: '',
    essayTitle: '',
    hasAgreed: false
  });

  const [essayFile, setEssayFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEssayFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!essayFile) {
      setStatus({ type: 'error', message: 'Please select an essay document to upload.' });
      return;
    }

    if (!formData.hasAgreed) {
      setStatus({ type: 'error', message: 'You must agree to the terms and conditions.' });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('studentName', formData.studentName);
      data.append('age', Number(formData.age));
      data.append('institutionName', formData.institutionName);
      data.append('category', formData.category);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('essayTitle', formData.essayTitle);
      data.append('hasAgreed', String(formData.hasAgreed));
      data.append('essayFile', essayFile);

      const response = await fetch('/api/essays', {
        method: 'POST',
        body: data // Sent as multipart/form-data
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Failed to submit essay');
      }

      setStatus({ type: 'success', message: 'Essay submitted successfully! Good luck.' });
      setFormData({
        studentName: '',
        age: '',
        institutionName: '',
        category: 'Junior',
        email: '',
        phone: '',
        essayTitle: '',
        hasAgreed: false
      });
      setEssayFile(null);
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
          <label className="block text-xs font-bold text-slate-700 mb-1">Student Name *</label>
          <input
            type="text"
            name="studentName"
            required
            placeholder="e.g. Maryam Tariq"
            value={formData.studentName}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Age *</label>
          <input
            type="number"
            name="age"
            min="5"
            max="100"
            required
            placeholder="e.g. 15"
            value={formData.age}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Institution / School *</label>
          <input
            type="text"
            name="institutionName"
            required
            placeholder="e.g. Army Public School Muzaffarabad"
            value={formData.institutionName}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="Junior">Junior (Under 16)</option>
            <option value="Senior">Senior (16+ / University)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            required
            placeholder="maryam@example.com"
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
        <label className="block text-xs font-bold text-slate-700 mb-1">Essay Title *</label>
        <input
          type="text"
          name="essayTitle"
          required
          placeholder="e.g. Sustainable Literacy & Community Development"
          value={formData.essayTitle}
          onChange={handleChange}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Upload Essay Document (PDF / DOCX) *</label>
        <div className="relative border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition text-center cursor-pointer">
          <input
            type="file"
            name="essayFile"
            required
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
          <p className="text-xs font-semibold text-slate-700">
            {essayFile ? essayFile.name : 'Click or drag document to upload'}
          </p>
          <p className="text-[10px] text-slate-400">PDF, DOC, or DOCX (Max 10MB)</p>
        </div>
      </div>

      <label className="flex items-start gap-2 pt-1 cursor-pointer">
        <input
          type="checkbox"
          name="hasAgreed"
          required
          checked={formData.hasAgreed}
          onChange={handleChange}
          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
        />
        <span className="text-[11px] text-slate-600">
          I confirm that this essay is my 100% original work and I agree to the competition rules and terms. *
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        <Send className="w-3.5 h-3.5" />
        {loading ? 'Uploading & Submitting...' : 'Submit Essay Entry'}
      </button>
    </form>
  );
}

export default EssayForm;