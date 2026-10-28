import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Upload, FileText, X, Loader2 } from 'lucide-react';
import { submitEssay } from '../../services/api';

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
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'File size exceeds maximum limit of 10MB.' });
        return;
      }
      setEssayFile(file);
      setStatus({ type: '', message: '' });
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

      const response = await submitEssay(data);

      if (response.data) {
        setStatus({
          type: 'success',
          message: response.data.message || 'Essay submitted successfully! Your submission is now under review.'
        });
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
        if (onSuccess) onSuccess(response.data);
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to connect to the server.';
      setStatus({ type: 'error', message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Roshan Safha form introduction */}
      <div className="border-b border-[#E2EADF] pb-6">

        <h2 className="mt-4 text-2xl font-black tracking-tight text-[#193E32] sm:text-3xl">Submit Your Essay</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64796D]">Share your perspective and take part in the Roshan Safha writing competition.</p>
      </div>
      {status.message && (
        <div className={`flex items-start gap-3 rounded-xl p-4 text-sm ${status.type === 'success' ? 'border border-[#C8DDCE] bg-[#EDF7EF] text-[#193E32]' : 'border border-rose-200 bg-rose-50 text-rose-800'
          }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Student Name *</label>
          <input
            type="text"
            name="studentName"
            required
            placeholder="e.g. Maryam Tariq"
            value={formData.studentName}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#DCE5DB] bg-[#FAFCF8] px-4 py-3 text-sm text-[#193E32] outline-none transition focus:border-[#276B56] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Age *</label>
          <input
            type="number"
            name="age"
            min="5"
            max="100"
            required
            placeholder="e.g. 15"
            value={formData.age}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#DCE5DB] bg-[#FAFCF8] px-4 py-3 text-sm text-[#193E32] outline-none transition focus:border-[#276B56] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Institution / School *</label>
          <input
            type="text"
            name="institutionName"
            required
            placeholder="e.g. University of AJK"
            value={formData.institutionName}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#DCE5DB] bg-[#FAFCF8] px-4 py-3 text-sm text-[#193E32] outline-none transition focus:border-[#276B56] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Category *</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#DCE5DB] bg-[#FAFCF8] px-4 py-3 text-sm font-medium text-[#193E32] outline-none transition focus:border-[#276B56] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15"
          >
            <option value="Junior">Junior (Under 16)</option>
            <option value="Senior">Senior (16+ / University)</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Email Address *</label>
          <input
            type="email"
            name="email"
            required
            placeholder="maryam@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#DCE5DB] bg-[#FAFCF8] px-4 py-3 text-sm text-[#193E32] outline-none transition focus:border-[#276B56] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="0300 1234567"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#DCE5DB] bg-[#FAFCF8] px-4 py-3 text-sm text-[#193E32] outline-none transition focus:border-[#276B56] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#193E32]">Essay Title *</label>
        <input
          type="text"
          name="essayTitle"
          required
          placeholder="e.g. Sustainable Literacy in Azad Kashmir"
          value={formData.essayTitle}
          onChange={handleChange}
          className="w-full rounded-xl border border-[#DCE5DB] bg-[#FAFCF8] px-4 py-3 text-sm text-[#193E32] outline-none transition focus:border-[#276B56] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#193E32]">Upload Essay File (PDF / Word) *</label>

        {!essayFile ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#B9D0BE] bg-[#F5F9F3] p-8 transition hover:border-[#276B56] hover:bg-[#E7EEE5]">
            <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
            <span className="text-xs font-bold text-[#193E32]">Click to browse file</span>
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
              <FileText className="w-5 h-5 text-[#276B56] shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-950 truncate max-w-60 sm:max-w-xs">{essayFile.name}</p>
                <p className="text-[10px] text-[#276B56]">{(essayFile.size / (1024 * 1024)).toFixed(2)} MB</p>
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

      <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
        <input
          type="checkbox"
          name="hasAgreed"
          required
          checked={formData.hasAgreed}
          onChange={handleChange}
          className="mt-0.5 rounded text-emerald-600 focus:ring-[#276B56]/15 cursor-pointer"
        />
        <span className="text-[11px] text-slate-600 leading-tight">
          I confirm that this essay is my 100% original work and I agree to the competition terms. *
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#193E32] hover:bg-[#276B56] text-white font-bold py-3 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading & Submitting...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Submit Essay Entry
          </>
        )}
      </button>
    </form>
  );
}

export default EssayForm;