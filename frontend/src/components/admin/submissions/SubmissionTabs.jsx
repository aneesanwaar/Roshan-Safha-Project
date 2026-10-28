import React from 'react';
import { SUBMISSION_TYPES } from '../../../hooks/useAdminSubmissions';
export default function SubmissionTabs({ type, onChange, counts }) {
  return <div className="flex max-w-full gap-2 overflow-x-auto rounded-2xl border border-[#E7EEE5] bg-white p-3 shadow-sm" role="tablist" aria-label="Submission categories">
    {SUBMISSION_TYPES.map((item) => <button key={item.id} type="button" role="tab" aria-selected={type === item.id} onClick={() => onChange(item.id)} className={`shrink-0 rounded-xl px-4 py-3 text-xs font-bold transition ${type === item.id ? 'bg-[#193E32] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-[#E7EEE5]'}`}>{item.label} <span className={`ml-1 rounded-md px-1.5 py-0.5 ${type === item.id ? 'bg-white/20' : 'bg-slate-100'}`}>{counts[item.id] ?? '—'}</span></button>)}
  </div>;
}
