import React, { useState } from 'react';
import { Search, Filter, BookOpen, Check, X, Send, Sparkles, MapPin } from 'lucide-react';

const mockCatalog = [
  { id: 1, title: 'Physics Part 1 (Class 11)', author: 'Punjab Textbook Board', grade: 'Intermediate / FSc', copies: 6, condition: 'Restored - Excellent', location: 'Muzaffarabad Hub' },
  { id: 2, title: 'Chemistry Part 2 (Class 12)', author: 'National Book Foundation', grade: 'Intermediate / FSc', copies: 4, condition: 'Good Condition', location: 'Muzaffarabad Hub' },
  { id: 3, title: 'Mathematics (Class 9)', author: 'AJK Textbook Board', grade: 'Matric / Class 9-10', copies: 9, condition: 'Restored - Excellent', location: 'Rawalakot Desk' },
  { id: 4, title: 'Biology (Class 10)', author: 'Punjab Textbook Board', grade: 'Matric / Class 9-10', copies: 5, condition: 'Good Condition', location: 'Muzaffarabad Hub' },
  { id: 5, title: 'English Grammar & Composition', author: 'Wren & Martin (Edition 2021)', grade: 'General / Reference', copies: 3, condition: 'Restored - Like New', location: 'Muzaffarabad Hub' },
  { id: 6, title: 'Urdu Adab Reader (Class 8)', author: 'AJK Board', grade: 'Middle School', copies: 7, condition: 'Good Condition', location: 'Mirpur Desk' },
  { id: 7, title: 'General Science (Class 7)', author: 'National Book Foundation', grade: 'Middle School', copies: 4, condition: 'Good Condition', location: 'Muzaffarabad Hub' },
  { id: 8, title: 'Oxford Junior Illustrated Dictionary', author: 'Oxford University Press', grade: 'Primary / Early Years', copies: 2, condition: 'Like New', location: 'Muzaffarabad Hub' }
];

function BookCatalog() {
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null); // For Claim Modal
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimForm, setClaimForm] = useState({ studentName: '', phone: '', institution: '', reason: '' });

  const grades = ['All', 'Intermediate / FSc', 'Matric / Class 9-10', 'Middle School', 'Primary / Early Years', 'General / Reference'];

  const filteredBooks = mockCatalog.filter(book => {
    const matchesGrade = selectedGrade === 'All' || book.grade === selectedGrade;
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                          book.author.toLowerCase().includes(search.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setSelectedBook(null);
      setClaimForm({ studentName: '', phone: '', institution: '', reason: '' });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
            <BookOpen className="w-3.5 h-3.5" />
            Free Community Library & Textbook Repository
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Available Books Catalog
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Browse verified, restored textbooks available for students and educators free of cost. Request single copies or class sets.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by book title, subject, or author..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-700"
            >
              {grades.map(g => (
                <option key={g} value={g}>{g === 'All' ? 'All Academic Levels' : g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((b) => (
              <div 
                key={b.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    {b.grade}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500">{b.author}</p>
                  
                  <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Available:</span>
                      <span className="font-bold text-emerald-700">{b.copies} Copies</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Condition:</span>
                      <span className="font-medium text-slate-800">{b.condition}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 pt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{b.location}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBook(b)}
                  className="mt-4 w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs transition duration-150 cursor-pointer"
                >
                  Request This Book
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-sm text-slate-700">No books found matching your filter.</p>
              <p className="text-xs">Try clearing your search terms or checking another grade level.</p>
            </div>
          )}
        </div>

      </div>

      {/* Claim / Request Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setSelectedBook(null)} 
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {claimSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Request Registered!</h3>
                <p className="text-xs text-slate-600">Our literacy coordinator will contact you to verify student identity and arrange collection.</p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">Book Request</span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{selectedBook.title}</h3>
                  <p className="text-xs text-slate-500">{selectedBook.grade} • {selectedBook.location}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student / Requester Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bilal Ahmed"
                      value={claimForm.studentName}
                      onChange={e => setClaimForm({ ...claimForm, studentName: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Contact Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0300 0000000"
                      value={claimForm.phone}
                      onChange={e => setClaimForm({ ...claimForm, phone: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">School / College Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Govt Degree College Muzaffarabad"
                      value={claimForm.institution}
                      onChange={e => setClaimForm({ ...claimForm, institution: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Purpose / Need Note</label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Preparing for annual board exams..."
                      value={claimForm.reason}
                      onChange={e => setClaimForm({ ...claimForm, reason: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition"
                >
                  Confirm Book Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default BookCatalog;