import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitContact } from '../../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (status.message) setStatus({ type: '', message: '' });
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Your name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) errors.subject = 'Subject is required';

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    const clientValidationErrors = validateForm();
    if (Object.keys(clientValidationErrors).length > 0) {
      setFieldErrors(clientValidationErrors);
      setStatus({ type: 'error', message: 'Please correct the highlighted fields below.' });
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const payload = {
        ...formData,
        recaptchaToken: formData.recaptchaToken || null
      };

      // Calls Axios instance pointing to /api/contact
      const response = await submitContact(payload);

      setStatus({
        type: 'success',
        message: response.data?.message || 'Message sent! Our team will reply shortly.'
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
      setFieldErrors({});
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      const respData = err.response?.data;

      if (respData?.errors && Array.isArray(respData.errors)) {
        const mappedErrors = {};
        respData.errors.forEach((item) => {
          if (item.path && !mappedErrors[item.path]) {
            mappedErrors[item.path] = item.msg;
          }
        });
        setFieldErrors(mappedErrors);
      }

      const errorMsg =
        respData?.error ||
        respData?.message ||
        err.message ||
        'Failed to send message';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) =>
    `w-full text-xs rounded-xl p-2.5 outline-none transition ${
      fieldErrors[fieldName]
        ? 'bg-red-50/50 border border-red-400 focus:ring-2 focus:ring-red-400 focus:bg-white text-slate-800'
        : 'bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {status.message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
        <input
          type="text"
          name="name"
          placeholder="e.g. Usman Ali"
          value={formData.name}
          onChange={handleChange}
          className={getInputClass('name')}
        />
        {fieldErrors.name && (
          <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
        <input
          type="email"
          name="email"
          placeholder="usman@example.com"
          value={formData.email}
          onChange={handleChange}
          className={getInputClass('email')}
        />
        {fieldErrors.email && (
          <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
        <input
          type="text"
          name="subject"
          placeholder="e.g. Inquiry regarding Book Collection"
          value={formData.subject}
          onChange={handleChange}
          className={getInputClass('subject')}
        />
        {fieldErrors.subject && (
          <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.subject}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
        <textarea
          name="message"
          rows="3"
          placeholder="Write your message (minimum 10 characters)..."
          value={formData.message}
          onChange={handleChange}
          className={getInputClass('message')}
        ></textarea>
        {fieldErrors.message && (
          <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Sending Message...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

export default ContactForm;