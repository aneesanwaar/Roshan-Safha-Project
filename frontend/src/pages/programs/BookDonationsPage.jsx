import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import DonationForm from '../../components/forms/DonationForm';
import { 
  BookOpen, 
  RotateCw, 
  Sparkles, 
  HeartHandshake, 
  Filter, 
  CheckCircle2, 
  Package, 
  MapPin, 
  Loader2, 
  X,
  BookCheck
} from 'lucide-react';

function BookDonationsPage() {
  const [books, setBooks] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);
  const [requestModalBook, setRequestModalBook] = useState(null);
  const [requestForm, setRequestForm] = useState({ studentName: '', school: '', phone: '', email: '', city: '' });
  const [requestStatus, setRequestStatus] = useState({ loading: false, success: false });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await api.getAvailableBooks();
        setBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const grades = ['All', 'Class 5', 'Class 9', 'Class 10', 'Class 11'];
  const subjects = ['All', 'Mathematics', 'English', 'Physics', 'Science', 'Chemistry'];

  const filteredBooks = books.filter(b => {
    const matchGrade = selectedGrade === 'All' || b.grade === selectedGrade;
    const matchSubject = selectedSubject === 'All' || b.subject === selectedSubject;
    return matchGrade && matchSubject;
  });

  const handleBookRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestStatus({ loading: true, success: false });
    const res = await api.submitBookRequest({ ...requestForm, bookTitle: requestModalBook.title, bookId: requestModalBook._id });
    if (res.success) {
      setRequestStatus({ loading: false, success: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Program 01 • Circular Literacy
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Book Donations & Distribution
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Because books deserve second chances. We collect pre-loved and worn books, restore damaged pages and bindings, and deliver them directly to deserving students across Azad Jammu & Kashmir.
        </p>
      </div>

      {/* 2. Three-Step Process Cycle */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">1</div>
          <h3 className="font-bold text-slate-900">Collect & Pledge</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Community members, colleges, and families pledge textbooks, syllabus guides, and literature through our portal.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">2</div>
          <h3 className="font-bold text-slate-900">Restore & Rebind</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Volunteers carefully inspect, tape, rebind, and categorize incoming copies into complete class kits.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">3</div>
          <h3 className="font-bold text-slate-900">Deliver to Students</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Books are distributed directly to public schools and individual learners on a zero-cost basis.
          </p>
        </div>
      </div>

      {/* 3. Available Books Inventory Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-brand-600" />
              Available Books Inventory
            </h2>
            <p className="text-xs text-slate-500 mt-1">Browse class-wise and subject-wise restored books available for immediate request.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <span>Class:</span>
              <select value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)} className="bg-transparent font-bold text-slate-900 outline-none">
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <span>Subject:</span>
              <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="bg-transparent font-bold text-slate-900 outline-none">
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12 gap-2 text-slate-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
            <span>Loading inventory catalog...</span>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">No books matching current filter selections.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(b => (
              <div key={b._id} className="border border-slate-200 rounded-2xl p-4 flex gap-4 items-center bg-slate-50/50 hover:bg-white hover:shadow-md transition">
                <img src={b.coverImage} alt={b.title} className="w-20 h-24 object-cover rounded-xl shrink-0 bg-slate-200" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md">{b.grade}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${b.quantity > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {b.quantity > 0 ? `${b.quantity} copies in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{b.title}</h4>
                  <p className="text-[11px] text-slate-500">Subject: {b.subject} • {b.condition}</p>
                  <button 
                    disabled={b.quantity === 0}
                    onClick={() => { setRequestModalBook(b); setRequestStatus({ loading: false, success: false }); }}
                    className="mt-2 w-full text-xs font-bold py-1.5 px-3 bg-white hover:bg-slate-900 hover:text-white border border-slate-300 rounded-lg transition disabled:opacity-40"
                  >
                    {b.quantity > 0 ? 'Request This Book' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Book Donation Intake Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" />
            Pledge a Book / Funds Donation
          </h2>
          <p className="text-xs text-slate-500 mt-1">Have extra books at home or in your institute? Fill the pledge form below.</p>
        </div>
        <DonationForm />
      </div>

      {/* Request Modal */}
      {requestModalBook && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative animate-in fade-in zoom-in-95">
            <button onClick={() => setRequestModalBook(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-brand-600 uppercase">Book Distribution Request</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{requestModalBook.title}</h3>
              <p className="text-xs text-slate-500">{requestModalBook.grade} • {requestModalBook.subject}</p>
            </div>

            {requestStatus.success ? (
              <div className="bg-brand-50 border border-brand-200 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-brand-600 mx-auto" />
                <h4 className="font-bold text-brand-900 text-sm">Request Submitted!</h4>
                <p className="text-xs text-brand-800">Our team will verify stock and contact you for parcel dispatch.</p>
                <button onClick={() => setRequestModalBook(null)} className="text-xs font-bold text-brand-700 underline">Close Window</button>
              </div>
            ) : (
              <form onSubmit={handleBookRequestSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Student / Requester Name</label>
                  <input required type="text" value={requestForm.studentName} onChange={e => setRequestForm({...requestForm, studentName: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">School / Institute Name</label>
                  <input required type="text" value={requestForm.school} onChange={e => setRequestForm({...requestForm, school: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" placeholder="School name" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase text-slate-600 mb-1">Contact Phone</label>
                    <input required type="tel" value={requestForm.phone} onChange={e => setRequestForm({...requestForm, phone: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" placeholder="0300-1234567" />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-slate-600 mb-1">City / Area</label>
                    <input required type="text" value={requestForm.city} onChange={e => setRequestForm({...requestForm, city: e.target.value})} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" placeholder="Muzaffarabad" />
                  </div>
                </div>
                <button disabled={requestStatus.loading} type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2">
                  {requestStatus.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Book Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default BookDonationsPage;