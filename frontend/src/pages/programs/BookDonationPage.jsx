import React, { useState } from 'react';
import { BookOpen, CheckCircle, Heart, MapPin, Sparkles, Send, ShieldCheck, AlertCircle } from 'lucide-react';

function DonateBooks() {
  const [formData, setFormData] = useState({
    donorName: '',
    contactNumber: '',
    email: '',
    city: 'Muzaffarabad',
    bookCount: '',
    bookCategories: [],
    condition: 'Good',
    deliveryMethod: 'dropoff', // 'dropoff' or 'pickup'
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Matric / Class 9-10 Textbooks',
    'FSc / Intermediate (Pre-Med/Pre-Eng)',
    'Primary & Middle School Books',
    'English & Urdu Storybooks / Literature',
    'University Reference & General Books'
  ];

  const toggleCategory = (cat) => {
    setFormData(prev => ({
      ...prev,
      bookCategories: prev.bookCategories.includes(cat)
        ? prev.bookCategories.filter(c => c !== cat)
        : [...prev.bookCategories, cat]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.bookCategories.length === 0) {
      alert('Please select at least one book category.');
      return;
    }
    // Simulate backend pledge submission
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
            <Heart className="w-3.5 h-3.5 fill-emerald-700" />
            Book Restoration & Circulation Drive
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Donate Books, Fuel a Student’s Dream
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Give your gently used or extra syllabus books a second life. We restore worn bindings and deliver them directly to deserving students across Azad Kashmir.
          </p>
        </div>

        {/* Guidelines Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">What We Accept</h4>
              <p className="text-[11px] text-slate-500 mt-1">Syllabus textbooks, guides, reference books, and children’s literature.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Restoration Promise</h4>
              <p className="text-[11px] text-slate-500 mt-1">Damaged spine or torn covers? Our volunteers rebind and clean each copy.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Drop-off Hub</h4>
              <p className="text-[11px] text-slate-500 mt-1">Main Secretariat Road & University Campuses, Muzaffarabad.</p>
            </div>
          </div>
        </div>

        {/* Form or Confirmation */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10">
          {submitted ? (
            <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Thank You, {formData.donorName}!</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your pledge of approximately <strong className="text-emerald-700">{formData.bookCount} books</strong> has been logged. Our volunteer team will WhatsApp you at <strong className="text-slate-800">{formData.contactNumber}</strong> shortly to coordinate.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    donorName: '',
                    contactNumber: '',
                    email: '',
                    city: 'Muzaffarabad',
                    bookCount: '',
                    bookCategories: [],
                    condition: 'Good',
                    deliveryMethod: 'dropoff',
                    notes: ''
                  });
                }}
                className="mt-4 inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                Submit Another Pledge
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Book Donation Intake Pledge</h3>
                <p className="text-xs text-slate-500">Please provide accurate contact details so we can coordinate collection or provide the nearest drop-off point.</p>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Tariq"
                    value={formData.donorName}
                    onChange={e => setFormData({ ...formData, donorName: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={formData.contactNumber}
                    onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Region *</label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Muzaffarabad">Muzaffarabad</option>
                    <option value="Rawalakot">Rawalakot</option>
                    <option value="Mirpur">Mirpur</option>
                    <option value="Islamabad / Rawalpindi">Islamabad / Rawalpindi</option>
                    <option value="Other AJK Region">Other AJK Region</option>
                  </select>
                </div>
              </div>

              {/* Book Details */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">Categories of Books Being Donated *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <label 
                      key={cat} 
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition ${
                        formData.bookCategories.includes(cat)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.bookCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Number of Books *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 5, 15, 50"
                    value={formData.bookCount}
                    onChange={e => setFormData({ ...formData, bookCount: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">General Condition</label>
                  <select
                    value={formData.condition}
                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Like New">Like New (Unmarked)</option>
                    <option value="Good">Good (Minor highlights or pencil notes)</option>
                    <option value="Needs Minor Restoration">Needs Restoration (Torn spine / binding)</option>
                  </select>
                </div>
              </div>

              {/* Delivery Option */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Handover Preference</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-3.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 ${
                    formData.deliveryMethod === 'dropoff' ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="delivery"
                      value="dropoff"
                      checked={formData.deliveryMethod === 'dropoff'}
                      onChange={() => setFormData({ ...formData, deliveryMethod: 'dropoff' })}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">I will drop them off</span>
                      <span className="text-[11px] text-slate-500">At our Muzaffarabad center or designated volunteer point.</span>
                    </div>
                  </label>

                  <label className={`p-3.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 ${
                    formData.deliveryMethod === 'pickup' ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={formData.deliveryMethod === 'pickup'}
                      onChange={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Request volunteer pickup</span>
                      <span className="text-[11px] text-slate-500">Available for bulk donations (15+ books) in Muzaffarabad city limits.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes / Specific Book Titles (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Physics FBISE 11th, Chemistry Matric, Oxford English readers..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Submit Book Donation Pledge
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default DonateBooks;