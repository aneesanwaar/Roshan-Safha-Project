import React from 'react';
import { Calendar, CheckCircle2, Trophy } from 'lucide-react';
import EssayForm from '../../components/forms/EssayForm';

function EssayContestsPage() {
  const pastContests = [
    {
      year: '2025',
      theme: 'The Book That Changed My Perspective',
      winner: 'Fatima Noor (Rawalakot)',
      runnerUp: 'Hamza Tariq (Muzaffarabad)',
      totalEntries: '180+ Entries'
    },
    {
      year: '2024',
      theme: 'Sustainable Literacy & Climate Action',
      winner: 'Zainab Bibi (Muzaffarabad)',
      runnerUp: 'Abdullah Khan (Mirpur)',
      totalEntries: '140+ Entries'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
            <span>✍️</span>
            <span>Youth Expression & Writing Initiative</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Annual Essay Contests & Archive
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Inspiring youth to express critical thought, literary imagination, and societal ideas through structured essay competitions.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Junior Category */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                Junior Category (Under 16)
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Theme: The Book That Changed My Perspective
              </h3>
              
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Word count:</strong> 500 – 800 words</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Formats:</strong> PDF, Word document (.doc, .docx)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Prizes:</strong> Shields, Certificates & Book Hampers</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Deadline: October 30, 2026
            </div>
          </div>

          {/* Senior Category */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                Senior Category (16+ / University)
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Theme: Sustainable Literacy in the AI Century
              </h3>
              
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Word count:</strong> 1,000 – 1,500 words</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Plagiarism:</strong> 100% original work mandatory</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Prizes:</strong> Cash award & publication feature</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Deadline: October 30, 2026
            </div>
          </div>

        </div>

        {/* Backend Connected Submission Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Online Essay Submission Portal</h3>
            <p className="text-xs text-slate-500">Attach your essay document directly to submit your entry.</p>
          </div>
          
          <EssayForm />
        </div>

        {/* Past Archive Showcase */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Past Winners & Competition Archive</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pastContests.map((item) => (
              <div key={item.year} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Edition {item.year}</span>
                  <span className="text-[10px] text-slate-500">{item.totalEntries}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">"{item.theme}"</h4>
                <div className="text-[11px] text-slate-600 space-y-0.5 pt-0.5">
                  <p>🥇 <strong>Winner:</strong> {item.winner}</p>
                  <p>🥈 <strong>Runner Up:</strong> {item.runnerUp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default EssayContestsPage;