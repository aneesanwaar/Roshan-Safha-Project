import React from 'react';
import { Search, RefreshCw, Download } from 'lucide-react';
import { SUBMISSION_TYPES } from '../../../hooks/useAdminSubmissions';
import { exportAdminSubmissions } from '../../../services/api';
export default function SubmissionFilters({ type, search, changeSearch, status, changeStatus, refresh, loading }) {
  const options = SUBMISSION_TYPES.find((t) => t.id === type)?.statuses || [];
  return <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
    <label className="relative flex-1 min-w-[190px]"><Search className="absolute left-3 top-3 text-slate-400" size={16}/><input aria-label="Search submissions" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8A94A]" placeholder="Search submissions..." value={search} onChange={(e) => changeSearch(e.target.value)}/></label>
    <select aria-label="Filter by status" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white" value={status} onChange={(e) => changeStatus(e.target.value)}><option value="">All statuses</option>{options.map((s) => <option key={s} value={s}>{s}</option>)}</select>
    <button type="button" onClick={refresh} disabled={loading} className="rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold flex gap-2 items-center"><RefreshCw size={15}/> Refresh</button>
    <div className="flex flex-wrap gap-1.5">{['csv','excel','pdf'].map((format) => <button key={format} type="button" onClick={() => exportAdminSubmissions(type, format)} className="rounded-xl bg-[#193E32] hover:bg-[#276B56] text-white px-3 py-2.5 text-xs font-bold flex gap-1.5 items-center"><Download size={14}/>{format === 'excel' ? 'Excel' : format.toUpperCase()}</button>)}</div>
  </div>;
}
