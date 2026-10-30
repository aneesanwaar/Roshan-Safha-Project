import React, { useState } from 'react';
import { Plus, Trophy, Trash2, X, Loader2, Pencil } from 'lucide-react';

const INITIAL_FORM = {
  editionYear: '2026',
  category: 'Senior',
  placement: '🥇 1st Place / Gold',
  studentName: '',
  institution: '',
  essayTitle: '',
  awardPrizes: '',
};

export default function WinnersArchive({ winners, onAdd, onEdit, onDelete, busy }) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const openAdd = () => { setEditingId(null); setForm({ ...INITIAL_FORM }); setOpen(true); };
  const openEdit = (winner) => { setEditingId(winner._id); setForm(Object.fromEntries(Object.keys(INITIAL_FORM).map(key => [key, winner[key] ?? INITIAL_FORM[key]]))); setOpen(true); };
  const [form, setForm] = useState(INITIAL_FORM);
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const saved = editingId ? await onEdit(editingId, form) : await onAdd(form);
    if (saved) {
      setForm(INITIAL_FORM);
      setOpen(false);
      setEditingId(null);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#193E32]">
            <Trophy className="h-5 w-5 text-[#E8A94A]" /> Hall of Fame & Laureates
          </h2>
          <p className="mt-1 text-xs text-slate-500">{winners.length} winner record(s)</p>
        </div>
        <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-[#E8A94A] px-4 py-2.5 text-xs font-bold text-[#193E32] hover:brightness-95">
          <Plus className="h-4 w-4" /> Add Winner
        </button>
      </div>

      {winners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
          No winners recorded yet. Add the first winner to build your archive.
        </div>
      ) : (
        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {winners.map((winner) => (
            <article key={winner._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <span className="inline-block rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                Edition {winner.editionYear} · {winner.placement}
              </span>
              <h3 className="mt-3 text-base font-bold text-[#193E32]">{winner.studentName}</h3>
              <p className="mt-1 text-xs text-slate-500">{winner.institution} · {winner.category}</p>
              <p className="mt-3 text-sm italic text-slate-700">“{winner.essayTitle}”</p>
              {winner.awardPrizes && <p className="mt-2 text-xs font-semibold text-[#276B56]">{winner.awardPrizes}</p>}
              <div className="mt-4 flex justify-end border-t border-slate-200 pt-3">
                <button type="button" disabled={busy} onClick={() => openEdit(winner)} className="mr-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#276B56] hover:underline disabled:opacity-50"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                <button type="button" disabled={busy} onClick={() => onDelete(winner._id)} className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 disabled:opacity-50">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) setOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="winner-modal-title" className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5">
              <h3 id="winner-modal-title" className="text-lg font-bold text-[#193E32]">{editingId ? "Edit Winner Record" : "Declare / Add Winner"}</h3>
              <button type="button" disabled={busy} onClick={() => setOpen(false)} aria-label="Close modal" className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
              <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
                {[
                  ['editionYear', 'Edition Year'],
                  ['studentName', 'Student Name'],
                  ['institution', 'Institution / College'],
                  ['essayTitle', 'Winning Essay Title'],
                  ['awardPrizes', 'Award / Prizes'],
                ].map(([field, label]) => (
                  <label key={field} className={`text-xs font-bold text-slate-700 ${field === 'essayTitle' || field === 'awardPrizes' ? 'sm:col-span-2' : ''}`}>
                    {label}
                    <input type="text" required={field !== 'awardPrizes'} value={form[field]} onChange={(event) => update(field, event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-normal outline-none focus:border-[#276B56]" />
                  </label>
                ))}
                <label className="text-xs font-bold text-slate-700">
                  Category
                  <select value={form.category} onChange={(event) => update('category', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-normal">
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                  </select>
                </label>
                <label className="text-xs font-bold text-slate-700">
                  Placement
                  <select value={form.placement} onChange={(event) => update('placement', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-normal">
                    <option value="🥇 1st Place / Gold">🥇 1st Place / Gold</option>
                    <option value="🥈 2nd Place / Silver">🥈 2nd Place / Silver</option>
                    <option value="🥉 3rd Place / Bronze">🥉 3rd Place / Bronze</option>
                    <option value="Honorable Mention">Honorable Mention</option>
                  </select>
                </label>
              </div>
              <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
                <button type="button" disabled={busy} onClick={() => setOpen(false)} className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#E8A94A] px-5 py-2.5 text-xs font-bold text-[#193E32] disabled:opacity-50">
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {busy ? 'Saving...' : editingId ? 'Save Changes' : 'Save Winner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
