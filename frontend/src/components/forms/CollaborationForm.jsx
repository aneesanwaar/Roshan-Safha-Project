import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitCollaboration } from '../../services/api';

const PAK_PHONE_REGEX = /^((\+92)|(0092)|(0))?[ -]?3[0-9]{2}[ -]?[0-9]{7}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function CollaborationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    collabType: 'School / College Partnership',
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
    if (!formData.name.trim()) errors.name = 'Representative name is required';
    if (!formData.organization.trim()) errors.organization = 'Organization name is required';

    if (!formData.email.trim()) {
      errors.email = 'Official email is required';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!PAK_PHONE_REGEX.test(formData.phone.trim())) {
      errors.phone = 'Use valid Pakistani mobile format (e.g., 03001234567 or +923001234567)';
    }

    if (!formData.collabType.trim()) errors.collabType = 'Collaboration type is required';

    if (!formData.message.trim()) {
      errors.message = 'Proposal description is required';
    } else if (formData.message.trim().length < 20) {
      errors.message = 'Please provide a detailed proposal (minimum 20 characters)';
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

      const response = await submitCollaboration(payload);

      setStatus({
        type: 'success',
        message: response.data?.message || 'Partnership request submitted successfully!'
      });

      setFormData({
        name: '',
        organization: '',
        email: '',
        phone: '',
        collabType: 'School / College Partnership',
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
        'Failed to submit collaboration proposal';
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
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      {/* Roshan Safha form introduction */}
      <div className="border-b border-[#E2EADF] pb-6">

        <h2 className="mt-4 text-2xl font-black tracking-tight text-[#193E32] sm:text-3xl">Partner With Purpose</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64796D]">Tell us about your organization and how we can work together to expand access to learning.</p>
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
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Representative Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Dr. Rashid Khan"
            value={formData.name}
            onChange={handleChange}
            className={getInputClass('name')}
          />
          {fieldErrors.name && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Organization / Entity *</label>
          <input
            type="text"
            name="organization"
            placeholder="e.g. AJK Youth Forum / City Grammar School"
            value={formData.organization}
            onChange={handleChange}
            className={getInputClass('organization')}
          />
          {fieldErrors.organization && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.organization}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#193E32]">Official Email *</label>
          <input
            type="email"
            name="email"
            placeholder="contact@org.org"
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
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#193E32]">Collaboration Type *</label>
        <select
          name="collabType"
          value={formData.collabType}
          onChange={handleChange}
          className={`${getInputClass('collabType')} font-medium text-[#193E32]`}
        >
          <option value="School / College Partnership">School / College Partnership</option>
          <option value="NGO / Youth Foundation">NGO / Youth Foundation</option>
          <option value="Book Drive Co-Host">Book Drive Co-Host</option>
          <option value="Corporate / Event Sponsor">Corporate / Event Sponsor</option>
        </select>
        {fieldErrors.collabType && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.collabType}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#193E32]">Proposal / Message *</label>
        <textarea
          name="message"
          rows="3"
          placeholder="Briefly describe the collaboration proposal (minimum 20 characters)..."
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
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#193E32] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(25,62,50,0.15)] transition hover:bg-[#276B56] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Submitting Proposal...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Submit Partnership Proposal
          </>
        )}
      </button>
    </form>
  );
}

export default CollaborationForm;