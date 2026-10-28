import React from 'react';
import { Search, RefreshCw, Download } from 'lucide-react';
import { SUBMISSION_TYPES } from '../../../hooks/useAdminSubmissions';
import { exportAdminSubmissions } from '../../../services/api';
export default function SubmissionFilters({ type, search, changeSearch, status, changeStatus, refresh, loading }) {
  const options = SUBMISSION_TYPES.find((t) => t.id === type)?.statuses || [];
  return <div className="bg-white rounded-2xl border border-[#E7EEE5] p-4 sm:p-5 flex flex-wrap gap-3 items-center shadow-sm">
    <label className="relative flex-1 min-w-0 basis-full sm:basis-[240px]"><Search className="absolute left-3 top-3 text-slate-400" size={16}/><input aria-label="Search submissions" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#276B56]/20 focus:border-[#276B56]" placeholder="Search submissions..." value={search} onChange={(e) => changeSearch(e.target.value)}/></label>
    <select aria-label="Filter by status" className="min-w-0 flex-1 sm:flex-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white" value={status} onChange={(e) => changeStatus(e.target.value)}><option value="">All statuses</option>{options.map((s) => <option key={s} value={s}>{s}</option>)}</select>
    <button type="button" onClick={refresh} disabled={loading} className="rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold flex gap-2 items-center"><RefreshCw size={15}/> Refresh</button>
    <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">{['csv','excel','pdf'].map((format) => <button key={format} type="button" onClick={() => exportAdminSubmissions(type, format)} className="rounded-xl bg-[#193E32] hover:bg-[#276B56] text-white px-3 py-2.5 text-xs font-bold flex gap-1.5 items-center"><Download size={14}/>{format === 'excel' ? 'Excel' : format.toUpperCase()}</button>)}</div>
  </div>;
}
