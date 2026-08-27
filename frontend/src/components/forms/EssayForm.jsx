import React, { useState } from 'react';
import { api } from '../../services/api';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function EssayForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    age: '',
    institutionName: '',
    category: 'Junior',
    essayTitle: '',
    agree: false
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setStatus({ ...status, error: "File size exceeds 5MB limit." });
        return;
      }
      setFile(selected);
      setStatus({ ...status, error: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ ...status, error: "Please upload your essay file (.pdf, .doc, .docx)." });
      return;
    }
    if (!formData.agree) {
      setStatus({ ...status, error: "You must certify original authorship." });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    const payload = new FormData();
    Object.keys(formData).forEach(k => payload.append(k, formData[k]));
    payload.append('essayFile', file);

    try {
      const res = await api.submitEssay(payload);
      if (res.success) {
        setStatus({ loading: false, error: null, success: true });
      } else {
        setStatus({ loading: false, error: res.message || "Failed to submit.", success: false });
      }
    } catch {
      setStatus({ loading: false, error: "Network error occurred.", success: false });
    }
  };

  if (status.success) {
    return (
      <div className="bg-brand-50 border border-brand-200 p-8 rounded-2xl text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-brand-600 mx-auto" />
        <h3 className="text-xl font-bold text-brand-900">Submission Confirmed!</h3>
        <p className="text-brand-800 text-sm max-w-md mx-auto">
          Your essay entry has been recorded. A confirmation email and direct download link have been sent.
        </p>
        <button 
          onClick={() => setStatus({ loading: false, error: null, success: false })}
          className="text-sm font-semibold text-brand-700 underline hover:text-brand-800"
        >
          Submit Another Entry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status.error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Student Full Name</label>
          <input required type="text" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Fatima Noor" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Email Address</label>
          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="fatima@example.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Phone Number</label>
          <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="0300-1234567" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Age</label>
          <input required type="number" min="5" max="100" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="16" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Category</label>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white">
            <option value="Junior">Junior (Under 16)</option>
            <option value="Senior">Senior (16+)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Educational Institution</label>
        <input required type="text" value={formData.institutionName} onChange={e => setFormData({...formData, institutionName: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="School, College, or University" />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Essay Title</label>
        <input required type="text" value={formData.essayTitle} onChange={e => setFormData({...formData, essayTitle: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Title of your written piece" />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Essay Document (.pdf, .doc, .docx - Max 5MB)</label>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer relative bg-slate-50/50">
          <input required type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">{file ? file.name : "Click or drag file to attach"}</p>
          <p className="text-xs text-slate-400 mt-1">Stored securely on Cloudinary storage</p>
        </div>
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer pt-2">
        <input type="checkbox" checked={formData.agree} onChange={e => setFormData({...formData, agree: e.target.checked})} className="mt-1 rounded text-brand-600 focus:ring-brand-500" />
        <span className="text-xs text-slate-600 leading-relaxed">I certify that this submission is original work and meets all Roshan Safha contest criteria.</span>
      </label>

      <button disabled={status.loading} type="submit" className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm">
        {status.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : "Submit Contest Entry"}
      </button>
    </form>
  );
}

export default EssayForm;