import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Upload, FileText, X } from 'lucide-react';

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

  const removeFile = () => {
    setEssayFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!essayFile) {
      setStatus({ type: 'error', message: 'Please attach your essay document (PDF/Word).' });
      return;
    }

    if (!formData.hasAgreed) {
      setStatus({ type: 'error', message: 'You must agree to the terms and conditions.' });
      return;
    }

    setLoading(true);

    try {
      // Must use FormData to match uploadDoc.single("essayFile") in essayroutes.js
      const data = new FormData();
      data.append('studentName', formData.studentName);
      data.append('age', Number(formData.age));
      data.append('institutionName', formData.institutionName);
      data.append('category', formData.category);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('essayTitle', formData.essayTitle);
      data.append('hasAgreed', String(formData.hasAgreed));
      data.append('essayFile', essayFile); // Backend multer field name

      const response = await fetch('/api/essays', {
        method: 'POST',
        body: data
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Failed to submit essay');
      }

      setStatus({ type: 'success', message: 'Essay submitted successfully! Your submission is now under review.' });
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
            placeholder="e.g. University of AJK"
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
          placeholder="e.g. Sustainable Literacy in Azad Kashmir"
          value={formData.essayTitle}
          onChange={handleChange}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Direct File Upload matching uploadDoc.single("essayFile") */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Upload Essay File (PDF / Word) *</label>
        
        {!essayFile ? (
          <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition">
            <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
            <span className="text-xs font-bold text-slate-700">Click to browse file</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Accepts .pdf, .doc, or .docx (Max 10MB)</span>
            <input
              type="file"
              name="essayFile"
              required
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-950 truncate max-w-60 sm:max-w-xs">{essayFile.name}</p>
                <p className="text-[10px] text-emerald-700">{(essayFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Agreement Checkbox matching hasAgreed: Boolean */}
      <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
        <input
          type="checkbox"
          name="hasAgreed"
          required
          checked={formData.hasAgreed}
          onChange={handleChange}
          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
        />
        <span className="text-[11px] text-slate-600 leading-tight">
          I confirm that this essay is my 100% original work and I agree to the competition terms. *
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        <Send className="w-3.5 h-3.5" />
        {loading ? 'Uploading & Submitting...' : 'Submit Essay Entry'}
      </button>
    </form>
  );
}

export default EssayForm;