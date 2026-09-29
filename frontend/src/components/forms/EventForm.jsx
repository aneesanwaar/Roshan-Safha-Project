import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { registerEvent } from '../../services/api';

const PAK_PHONE_REGEX = /^((\+92)|(0092)|(0))?[ -]?3[0-9]{2}[ -]?[0-9]{7}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EventForm({ defaultEventName = '', onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventName: defaultEventName || 'SDGs Summer Circle 2026',
    attendees: 1,
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
    if (!formData.name.trim()) errors.name = 'Full name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!PAK_PHONE_REGEX.test(formData.phone.trim())) {
      errors.phone = 'Use valid Pakistani mobile format (e.g., 03001234567 or +923001234567)';
    }

    if (!formData.eventName.trim()) errors.eventName = 'Event name is required';

    if (!formData.attendees || Number(formData.attendees) < 1) {
      errors.attendees = 'At least 1 attendee is required';
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
        attendees: Number(formData.attendees) || 1,
        recaptchaToken: formData.recaptchaToken || null
      };

      const response = await registerEvent(payload);

      setStatus({
        type: 'success',
        message: response.data?.message || 'Registration confirmed!'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        eventName: defaultEventName || 'SDGs Summer Circle 2026',
        attendees: 1,
        message: ''
      });
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
        'Failed to register for event';
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Attendee / Parent Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Dr. Rashid Khan"
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
            placeholder="rashid@example.com"
            value={formData.email}
            onChange={handleChange}
            className={getInputClass('email')}
          />
          {fieldErrors.email && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
          <input
            type="tel"
            name="phone"
            placeholder="0300 1234567"
            value={formData.phone}
            onChange={handleChange}
            className={getInputClass('phone')}
          />
          {fieldErrors.phone && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Number of Attendees *</label>
          <input
            type="number"
            name="attendees"
            min="1"
            max="10"
            value={formData.attendees}
            onChange={handleChange}
            className={getInputClass('attendees')}
          />
          {fieldErrors.attendees && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.attendees}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Event Name *</label>
        <input
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          className={getInputClass('eventName')}
        />
        {fieldErrors.eventName && (
          <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.eventName}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Additional Message / Note (Optional)</label>
        <textarea
          name="message"
          rows="2"
          placeholder="e.g. Student grade, special requirements..."
          value={formData.message}
          onChange={handleChange}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Registering...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Confirm Event Registration
          </>
        )}
      </button>
    </form>
  );
}

export default EventForm;