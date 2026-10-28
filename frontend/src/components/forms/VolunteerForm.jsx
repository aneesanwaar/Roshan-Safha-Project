import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitVolunteer } from '../../services/api';

const PAK_PHONE_REGEX = /^((\+92)|(0092)|(0))?[ -]?3[0-9]{2}[ -]?[0-9]{7}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function VolunteerForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    city: '',
    skills: '',
    availability: '',
    message: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Clear overall banner and field-specific error as soon as user edits
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (status.message) {
      setStatus({ type: '', message: '' });
    }
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!formData.age || Number(formData.age) < 10 || Number(formData.age) > 100) {
      errors.age = 'Age must be between 10 and 100';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com)';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!PAK_PHONE_REGEX.test(formData.phone.trim())) {
      errors.phone = 'Use valid Pakistani mobile format (e.g., 03001234567 or +923001234567)';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.availability.trim()) {
      errors.availability = 'Availability details are required';
    }

    if (!formData.skills.trim()) {
      errors.skills = 'Please enter your skills or areas of interest';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // Client-side format & required validation
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
        age: Number(formData.age),
        recaptchaToken: formData.recaptchaToken || null
      };

      const response = await submitVolunteer(payload);

      setStatus({
        type: 'success',
        message: response.data?.message || 'Volunteer application submitted successfully!'
      });

      setFormData({
        name: '',
        age: '',
        email: '',
        phone: '',
        city: '',
        skills: '',
        availability: '',
        message: ''
      });
      setFieldErrors({});

      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      const respData = err.response?.data;

      // Map backend express-validator error array to individual input fields
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
        'Failed to submit volunteer application';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Helper classes for input borders
  const getInputClass = (fieldName) =>
    `w-full text-xs rounded-xl p-2.5 outline-none transition ${fieldErrors[fieldName]
      ? 'bg-red-50/50 border border-red-400 focus:ring-2 focus:ring-red-400 focus:bg-white text-[#193E32]'
      : 'bg-[#FAFCF8] border border-[#DCE5DB] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15 text-[#193E32]'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      {/* Roshan Safha form introduction */}
      <div className="border-b border-[#E2EADF] pb-6">

        <h2 className="mt-4 text-2xl font-black tracking-tight text-[#193E32] sm:text-3xl">Become a Volunteer</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64796D]">Share your details and help us create meaningful literacy opportunities.</p>
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Bilal Ahmed"
            value={formData.name}
            onChange={handleChange}
            className={getInputClass('name')}
          />
          {fieldErrors.name && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Age *</label>
          <input
            type="number"
            name="age"
            min="10"
            max="100"
            placeholder="e.g. 20"
            value={formData.age}
            onChange={handleChange}
            className={getInputClass('age')}
          />
          {fieldErrors.age && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.age}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="bilal@example.com"
            value={formData.email}
            onChange={handleChange}
            className={getInputClass('email')}
          />
          {fieldErrors.email && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            placeholder="0300 1234567"
            value={formData.phone}
            onChange={handleChange}
            className={getInputClass('phone')}
          />
          {fieldErrors.phone && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.phone}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">City *</label>
          <input
            type="text"
            name="city"
            placeholder="e.g. Muzaffarabad"
            value={formData.city}
            onChange={handleChange}
            className={getInputClass('city')}
          />
          {fieldErrors.city && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.city}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Availability *</label>
          <input
            type="text"
            name="availability"
            placeholder="e.g. Weekends, 4 hrs/week"
            value={formData.availability}
            onChange={handleChange}
            className={getInputClass('availability')}
          />
          {fieldErrors.availability && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.availability}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#193E32]">Skills & Areas of Interest *</label>
        <input
          type="text"
          name="skills"
          placeholder="e.g. Book Repair, Event Coordination, Graphic Design, Social Media"
          value={formData.skills}
          onChange={handleChange}
          className={getInputClass('skills')}
        />
        {fieldErrors.skills && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.skills}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#193E32]">Message / Note (Optional)</label>
        <textarea
          name="message"
          rows="2"
          placeholder="Why would you like to join Roshan Safha?"
          value={formData.message}
          onChange={handleChange}
          className="w-full rounded-xl border border-[#DCE5DB] bg-[#FAFCF8] px-4 py-3 text-sm text-[#193E32] outline-none transition focus:border-[#276B56] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#193E32] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(25,62,50,0.15)] transition hover:bg-[#276B56] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Submitting Application...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Register as Volunteer
          </>
        )}
      </button>
    </form>
  );
}

export default VolunteerForm;