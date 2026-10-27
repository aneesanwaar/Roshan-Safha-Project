import React, { useState } from 'react';
import useAdminSubmissions, { SUBMISSION_TYPES } from '../../../hooks/useAdminSubmissions';
import SubmissionTabs from './SubmissionTabs';
import SubmissionStats from './SubmissionStats';
import SubmissionFilters from './SubmissionFilters';
import SubmissionsTable from './SubmissionsTable';
import SubmissionDetails from './SubmissionDetails';
export default function ManageSubmissions() {
  const data = useAdminSubmissions();
  const [selected, setSelected] = useState(null);
  const [actionError, setActionError] = useState('');
  const changeStatus = async (record, status) => { setActionError(''); try { await data.changeRecordStatus(record, status); } catch (e) { setActionError(e.response?.data?.error || e.response?.data?.message || e.message || 'Status update failed.'); } };
  return <div className="space-y-5"><div className="rounded-3xl bg-[#193E32] p-6 sm:p-8 text-white"><p className="text-xs font-black tracking-[0.2em] uppercase text-[#E8A94A]">Administration · Live Records</p><h1 className="mt-2 text-2xl sm:text-3xl font-black">Manage Submissions</h1><p className="mt-2 text-sm text-white/70">Review community activity, update workflows, and track donated books into inventory.</p></div>
    <SubmissionTabs type={data.type} onChange={(v) => { data.changeType(v); setSelected(null); setActionError(''); }} counts={data.counts}/>
    <SubmissionStats total={data.total} filtered={data.records.length} typeLabel={SUBMISSION_TYPES.find((t) => t.id === data.type)?.label || 'Submissions'}/>
    <SubmissionFilters {...data}/>
    {(data.error || actionError) && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{data.error || actionError} <button className="ml-2 underline font-bold" onClick={data.refresh}>Retry</button></div>}
    {data.loading ? <div role="status" className="rounded-2xl bg-white border border-slate-200 p-12 text-center text-sm text-slate-500">Loading submissions...</div> : <SubmissionsTable type={data.type} records={data.records} onView={setSelected} onStatus={changeStatus} busyId={data.busyId}/>}
    <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-500">Page {data.page} of {data.totalPages} · {data.total} matching records</span><div className="flex gap-2"><button disabled={data.loading || data.page <= 1} onClick={() => data.setPage((p) => p - 1)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold disabled:opacity-40">Previous</button><button disabled={data.loading || data.page >= data.totalPages} onClick={() => data.setPage((p) => p + 1)} className="rounded-xl bg-[#193E32] text-white px-4 py-2 font-bold disabled:opacity-40">Next</button></div></div>
    {selected && <SubmissionDetails item={selected} type={data.type} onClose={() => setSelected(null)} onChanged={data.refresh}/>}
  </div>;
}
