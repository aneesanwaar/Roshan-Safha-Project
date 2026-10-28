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
    `w-full text-xs rounded-xl p-2.5 outline-none transition ${fieldErrors[fieldName]
      ? 'bg-red-50/50 border border-red-400 focus:ring-2 focus:ring-red-400 focus:bg-white text-[#193E32]'
      : 'bg-[#FAFCF8] border border-[#DCE5DB] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15 text-[#193E32]'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Roshan Safha form introduction */}
      <div className="border-b border-[#E2EADF] pb-6">

        <h2 className="mt-4 text-2xl font-black tracking-tight text-[#193E32] sm:text-3xl">Tell Us What’s on Your Mind</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64796D]">Whether you have a question, a suggestion, or an idea for collaboration, your message matters to us.</p>
      </div>
      {status.message && (
        <div
          className={`flex items-start gap-3 rounded-xl p-4 text-sm ${status.type === 'success'
              ? 'border border-[#C8DDCE] bg-[#EDF7EF] text-[#193E32]'
              : 'border border-rose-200 bg-rose-50 text-rose-800'
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
        <label className="mb-2 block text-sm font-bold text-[#193E32]">Your Name *</label>
        <input
          type="text"
          name="name"
          placeholder="e.g. Usman Ali"
          value={formData.name}
          onChange={handleChange}
          className={getInputClass('name')}
        />
        {fieldErrors.name && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-[#193E32]">Email Address *</label>
        <input
          type="email"
          name="email"
          placeholder="usman@example.com"
          value={formData.email}
          onChange={handleChange}
          className={getInputClass('email')}
        />
        {fieldErrors.email && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-[#193E32]">Subject *</label>
        <input
          type="text"
          name="subject"
          placeholder="e.g. Inquiry regarding Book Collection"
          value={formData.subject}
          onChange={handleChange}
          className={getInputClass('subject')}
        />
        {fieldErrors.subject && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.subject}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-[#193E32]">Message *</label>
        <textarea
          name="message"
          rows="5"
          placeholder="Write your message (minimum 10 characters)..."
          value={formData.message}
          onChange={handleChange}
          className={getInputClass('message')}
        ></textarea>
        {fieldErrors.message && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#193E32] px-6 py-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(25,62,50,0.15)] transition hover:bg-[#276B56] disabled:cursor-not-allowed disabled:opacity-50"
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