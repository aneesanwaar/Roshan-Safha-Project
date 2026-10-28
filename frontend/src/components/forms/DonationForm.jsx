import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Loader2,
  Send,
  ShieldCheck,
} from "lucide-react";

import { submitDonation } from "../../services/api";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const BOOK_CATEGORIES = [
  "Matric / Class 9–10 Textbooks",
  "FSc / Intermediate Books",
  "Primary & Middle School Books",
  "English & Urdu Literature",
  "University & Reference Books",
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  city: "",
  numberOfBooks: "",
  bookCategories: [],
  condition: "Good",
  dropoffMethod: "Drop-off",
  message: "",
};

const inputClass =
  "w-full rounded-xl border border-[#DCE5DB] bg-[#FAFCF8] px-4 py-3 text-sm text-[#193E32] outline-none transition placeholder:text-[#9BA69B] focus:border-[#276B56] focus:bg-white focus:ring-2 focus:ring-[#276B56]/15";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#193E32]";

function DonationForm({ onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const captchaRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleCategory = (category) => {
    setFormData((previous) => ({
      ...previous,
      bookCategories: previous.bookCategories.includes(category)
        ? previous.bookCategories.filter((item) => item !== category)
        : [...previous.bookCategories, category],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setStatus({ type: "", message: "" });

    if (formData.bookCategories.length === 0) {
      setStatus({
        type: "error",
        message: "Please select at least one book category.",
      });
      return;
    }

    const bookCount = Number(formData.numberOfBooks);

    if (!Number.isInteger(bookCount) || bookCount < 1) {
      setStatus({
        type: "error",
        message: "Please enter a valid number of books.",
      });
      return;
    }

    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setStatus({
        type: "error",
        message: "Please complete the reCAPTCHA verification.",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        numberOfBooks: bookCount,
        bookTypes: formData.bookCategories.join(", "),
        dropoffMethod: formData.dropoffMethod,
        message: [
          `Book condition: ${formData.condition}`,
          formData.message.trim()
            ? `Additional notes: ${formData.message.trim()}`
            : "",
        ]
          .filter(Boolean)
          .join(". "),
        recaptchaToken: captchaToken,
      };

      const response = await submitDonation(payload);

      if (!response.data || response.data.success === false) {
        throw new Error(
          response.data?.message ||
            response.data?.error ||
            "Unable to submit your donation request."
        );
      }

      setStatus({
        type: "success",
        message:
          "Thank you! Your book donation request has been received. Our team will contact you regarding the next steps.",
      });

      setFormData(INITIAL_FORM);
      setCaptchaToken(null);
      captchaRef.current?.reset();

      if (typeof onSuccess === "function") {
        onSuccess(response.data);
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Unable to connect to the server. Please try again.",
      });

      setCaptchaToken(null);
      captchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="border-b border-[#E7ECE5] pb-6">

        <h3
          className="text-2xl font-bold text-[#193E32] sm:text-3xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Tell us about your books
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#68766A]">
          Complete the form below and our team will review your donation
          request. Fields marked * are required.
        </p>
      </div>

      {status.message && (
        <div
          role="alert"
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            status.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
          )}

          <span>{status.message}</span>
        </div>
      )}

      {/* DONOR DETAILS */}

      <div>
        <h4 className="mb-5 text-base font-bold text-[#193E32]">
           Your details
        </h4>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="donor-name" className={labelClass}>
              Full Name *
            </label>

            <input
              id="donor-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="donor-email" className={labelClass}>
              Email Address *
            </label>

            <input
              id="donor-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="donor-phone" className={labelClass}>
              Phone / WhatsApp *
            </label>

            <input
              id="donor-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="0300 1234567"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="donor-city" className={labelClass}>
              City / Area *
            </label>

            <input
              id="donor-city"
              name="city"
              type="text"
              required
              autoComplete="address-level2"
              placeholder="e.g. Muzaffarabad"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* BOOK DETAILS */}

      <div className="border-t border-[#E7ECE5] pt-7">
        <h4 className="mb-5 text-base font-bold text-[#193E32]">
           Book details
        </h4>

        <fieldset>
          <legend className={labelClass}>
            Types of Books *
          </legend>

          <p className="mb-4 text-xs text-[#7B897D]">
            Select all categories that apply.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {BOOK_CATEGORIES.map((category) => {
              const selected =
                formData.bookCategories.includes(category);

              return (
                <label
                  key={category}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition ${
                    selected
                      ? "border-[#276B56] bg-[#E7EEE5] text-[#193E32]"
                      : "border-[#E0E7DE] bg-[#FAFCF8] text-[#617062] hover:border-[#A9C1AC]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleCategory(category)}
                    className="mt-0.5 h-4 w-4 accent-[#276B56]"
                  />

                  <span>{category}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="donor-book-count" className={labelClass}>
              Estimated Number of Books *
            </label>

            <input
              id="donor-book-count"
              name="numberOfBooks"
              type="number"
              min="1"
              step="1"
              required
              placeholder="e.g. 10"
              value={formData.numberOfBooks}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="donor-condition" className={labelClass}>
              General Book Condition
            </label>

            <select
              id="donor-condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Needs Minor Restoration">
                Needs Minor Restoration
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* HANDOVER DETAILS */}

      <div className="border-t border-[#E7ECE5] pt-7">
        <h4 className="mb-5 text-base font-bold text-[#193E32]">
           Handover preference
        </h4>

        <fieldset>
          <legend className={labelClass}>
            How would you prefer to hand over your books?
          </legend>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                value: "Drop-off",
                title: "Drop-off",
                description:
                  "Our team will confirm the available drop-off location.",
              },
              {
                value: "Pickup Required",
                title: "Request Pickup",
                description:
                  "Pickup availability will be confirmed by our team.",
              },
            ].map((option) => {
              const selected =
                formData.dropoffMethod === option.value;

              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    selected
                      ? "border-[#276B56] bg-[#E7EEE5]"
                      : "border-[#E0E7DE] bg-[#FAFCF8] hover:border-[#A9C1AC]"
                  }`}
                >
                  <input
                    type="radio"
                    name="dropoffMethod"
                    value={option.value}
                    checked={selected}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 accent-[#276B56]"
                  />

                  <span>
                    <span className="block text-sm font-bold text-[#193E32]">
                      {option.title}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#778579]">
                      {option.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5">
          <label htmlFor="donor-message" className={labelClass}>
            Additional Notes / Book Titles
          </label>

          <textarea
            id="donor-message"
            name="message"
            rows={4}
            placeholder="Tell us about specific book titles or any collection details..."
            value={formData.message}
            onChange={handleChange}
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      {/* RECAPTCHA */}

      <div className="border-t border-[#E7ECE5] pt-7">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#193E32]">
          <ShieldCheck size={18} className="text-[#276B56]" />
          Security Verification
        </div>

        {RECAPTCHA_SITE_KEY ? (
          <div className="max-w-full overflow-x-auto">
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={setCaptchaToken}
              onExpired={() => setCaptchaToken(null)}
              onErrored={() => {
                setCaptchaToken(null);
                setStatus({
                  type: "error",
                  message:
                    "reCAPTCHA could not load. Please try again.",
                });
              }}
            />
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            reCAPTCHA is not configured. Add
            {" "}
            <code>VITE_RECAPTCHA_SITE_KEY</code>
            {" "}
            to your frontend environment to enable verification.
          </div>
        )}
      </div>

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={loading || (Boolean(RECAPTCHA_SITE_KEY) && !captchaToken)}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#193E32] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#276B56] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting Request...
          </>
        ) : (
          <>
            <Send size={18} />
            Submit Book Donation Request
          </>
        )}
      </button>

      <p className="text-center text-xs leading-6 text-[#899589]">
        Your information will be used to coordinate your donation request.
      </p>
    </form>
  );
}

export default DonationForm;