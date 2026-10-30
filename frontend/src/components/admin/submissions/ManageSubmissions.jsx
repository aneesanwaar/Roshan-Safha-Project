import React, { useState } from 'react';
import { createAdminWinner } from '../../../services/api';
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
  const [declaring, setDeclaring] = useState(null);
  const [winnerBusy, setWinnerBusy] = useState(false);
  const [winnerNotice, setWinnerNotice] = useState('');
  const [winnerForm, setWinnerForm] = useState({ editionYear: '2026', placement: '🥇 1st Place / Gold', awardPrizes: '' });
  const declareWinner = async (event) => {
    event.preventDefault();
    if (!declaring) return;
    setWinnerBusy(true); setActionError('');
    try {
      const response = await createAdminWinner({ ...winnerForm, essaySubmission: declaring._id });
      if (!response.data?.success) throw new Error('Winner creation was not confirmed.');
      setDeclaring(null);
      setWinnerNotice(`${declaring.studentName} added to Hall of Fame. You can edit the record in Contests & Winners.`);
      // A winner archive record is created; the original essay review status is not changed.
    } catch (e) { setActionError(e.response?.data?.error || e.message || 'Failed to declare winner.'); }
    finally { setWinnerBusy(false); }
  };
  const changeStatus = async (record, status) => { setActionError(''); try { await data.changeRecordStatus(record, status); } catch (e) { setActionError(e.response?.data?.error || e.response?.data?.message || e.message || 'Status update failed.'); } };
  return <div className="min-w-0 space-y-6"><div className="relative overflow-hidden rounded-3xl bg-[#193E32] p-6 shadow-sm sm:p-8 text-white"><p className="text-xs font-black tracking-[0.2em] uppercase text-[#E8A94A]">Administration · Live Records</p><h1 className="mt-2 text-2xl sm:text-3xl font-black">Manage Submissions</h1><p className="mt-2 text-sm text-white/70">Review community participation, manage submissions, export records, and track verified donations into inventory.</p></div>
    {winnerNotice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{winnerNotice}</div>}
    <SubmissionTabs type={data.type} onChange={(v) => { data.changeType(v); setSelected(null); setActionError(''); }} counts={data.counts}/>
    <SubmissionStats total={data.total} filtered={data.records.length} typeLabel={SUBMISSION_TYPES.find((t) => t.id === data.type)?.label || 'Submissions'}/>
    <SubmissionFilters {...data}/>
    {(data.error || actionError) && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{data.error || actionError} <button className="ml-2 underline font-bold" onClick={data.refresh}>Retry</button></div>}
    {data.loading ? <div role="status" className="rounded-2xl bg-white border border-slate-200 p-12 text-center text-sm text-slate-500">Loading submissions...</div> : <SubmissionsTable type={data.type} records={data.records} onView={setSelected} onStatus={changeStatus} busyId={data.busyId} onDeclareWinner={(r) => { setDeclaring(r); setActionError(''); setWinnerNotice(''); }}/>}
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E7EEE5] bg-white p-4 text-sm"><span className="text-slate-500">Page {data.page} of {data.totalPages} · {data.total} matching records</span><div className="flex gap-2"><button disabled={data.loading || data.page <= 1} onClick={() => data.setPage((p) => p - 1)} className="rounded-xl border border-[#D7E3D9] bg-white px-4 py-2 font-bold transition hover:bg-[#E7EEE5] disabled:opacity-40">Previous</button><button disabled={data.loading || data.page >= data.totalPages} onClick={() => data.setPage((p) => p + 1)} className="rounded-xl bg-[#193E32] text-white px-4 py-2 font-bold disabled:opacity-40">Next</button></div></div>
    {declaring && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4" role="presentation"><div role="dialog" aria-modal="true" aria-label="Declare essay winner" className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><h2 className="text-xl font-bold text-[#193E32]">Declare Winner / Runner-up</h2><p className="mt-2 text-sm text-slate-600">{declaring.studentName} · {declaring.category} · {declaring.essayTitle}</p><form onSubmit={declareWinner} className="mt-5 space-y-4"><label className="block text-sm font-semibold">Edition Year<input required value={winnerForm.editionYear} onChange={e => setWinnerForm(p => ({ ...p, editionYear: e.target.value }))} className="mt-1 w-full rounded-xl border p-3" /></label><label className="block text-sm font-semibold">Placement<select value={winnerForm.placement} onChange={e => setWinnerForm(p => ({ ...p, placement: e.target.value }))} className="mt-1 w-full rounded-xl border p-3"><option value="🥇 1st Place / Gold">🥇 1st Place / Gold</option><option value="🥈 2nd Place / Silver">🥈 2nd Place / Silver (Runner-up)</option><option value="🥉 3rd Place / Bronze">🥉 3rd Place / Bronze</option><option value="Honorable Mention">Honorable Mention</option></select></label><label className="block text-sm font-semibold">Award / Prizes<input value={winnerForm.awardPrizes} onChange={e => setWinnerForm(p => ({ ...p, awardPrizes: e.target.value }))} className="mt-1 w-full rounded-xl border p-3" /></label><p className="text-xs text-slate-500">The student's submitted name, institution, category, and essay title are copied from the verified submission.</p><div className="flex justify-end gap-3"><button type="button" disabled={winnerBusy} onClick={() => setDeclaring(null)} className="rounded-xl border px-4 py-2 text-sm">Cancel</button><button type="submit" disabled={winnerBusy} className="rounded-xl bg-[#E8A94A] px-4 py-2 text-sm font-bold text-[#193E32] disabled:opacity-50">{winnerBusy ? 'Saving...' : 'Declare Winner'}</button></div></form></div></div>}
    {selected && <SubmissionDetails item={selected} type={data.type} onClose={() => setSelected(null)} onChanged={data.refresh}/>}
  </div>;
}
