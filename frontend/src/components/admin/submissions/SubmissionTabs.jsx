import React from 'react';
import { SUBMISSION_TYPES } from '../../../hooks/useAdminSubmissions';
export default function SubmissionTabs({ type, onChange, counts }) {
  return <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Submission categories">
    {SUBMISSION_TYPES.map((item) => <button key={item.id} type="button" role="tab" aria-selected={type === item.id} onClick={() => onChange(item.id)} className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition ${type === item.id ? 'bg-[#193E32] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-[#E7EEE5]'}`}>{item.label} <span className={`ml-1 rounded-md px-1.5 py-0.5 ${type === item.id ? 'bg-white/20' : 'bg-slate-100'}`}>{counts[item.id] ?? '—'}</span></button>)}
  </div>;
}
