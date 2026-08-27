import React from 'react';
import EssayForm from '../../components/forms/EssayForm';
import { Award, Trophy, CheckCircle, Calendar, Sparkles } from 'lucide-react';

function EssayContestsPage() {
  const pastWinners = [
    { name: "Ali Raza", title: "Preserving Regional Literature in the Digital Era", rank: "1st Position (Senior)", year: "2025", institute: "MUST University" },
    { name: "Fatima Noor", title: "The Power of Books in Rural Communities", rank: "1st Position (Junior)", year: "2025", institute: "Kashmir Model School" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Program 02 • Literary Youth Development
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Annual Essay Contests & Archive
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Inspiring youth to express critical thought, literary imagination, and societal ideas through structured essay competitions.
        </p>
      </div>

      {/* Rules & Categories Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Junior Category (Under 16)
          </div>
          <h3 className="text-xl font-bold text-slate-900">Theme: The Book That Changed My Perspective</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Word count: 500 – 800 words</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Formats: PDF or Word document (.doc, .docx)</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Prizes: Shields, Certificates & Book Hampers</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            Senior Category (16+ / University)
          </div>
          <h3 className="text-xl font-bold text-slate-900">Theme: Sustainable Literacy in the AI Century</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Word count: 1,000 – 1,500 words</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Plagiarism policy: 100% original work mandatory</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Prizes: Cash award, certificate & journal feature</li>
          </ul>
        </div>
      </div>

      {/* Submission Portal */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-600" />
            Contest Registration & File Upload
          </h2>
          <p className="text-xs text-slate-500 mt-1">Submit your contest essay directly to the evaluation jury.</p>
        </div>
        <EssayForm />
      </div>

      {/* Past Winners Archive */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4" /> Hall of Fame & Past Contests Archive
        </div>
        <h3 className="text-2xl font-bold">Previous Contest Winners</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {pastWinners.map((w, i) => (
            <div key={i} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-400">{w.rank}</span>
                <span className="text-[10px] text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">{w.year}</span>
              </div>
              <h4 className="text-base font-bold text-white">{w.name}</h4>
              <p className="text-xs text-slate-300 italic leading-snug">"{w.title}"</p>
              <p className="text-[11px] text-slate-400">{w.institute}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default EssayContestsPage;