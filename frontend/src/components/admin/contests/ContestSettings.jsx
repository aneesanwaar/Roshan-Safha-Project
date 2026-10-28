import React from 'react';
import { Save, Loader2 } from 'lucide-react';

const GROUPS = [
  {
    title: 'Junior Category (Under 16)',
    fields: [
      ['juniorTheme', 'Essay Theme / Title', 'text'],
      ['juniorWordLimit', 'Word Limit', 'text'],
      ['juniorFormats', 'Accepted Formats', 'text'],
      ['juniorPrizes', 'Prizes', 'text'],
      ['juniorDeadline', 'Submission Deadline', 'date'],
    ],
  },
  {
    title: 'Senior Category (16+ / University)',
    fields: [
      ['seniorTheme', 'Essay Theme / Title', 'text'],
      ['seniorWordLimit', 'Word Limit', 'text'],
      ['seniorFormats', 'Accepted Formats', 'text'],
      ['seniorPrizes', 'Prizes', 'text'],
      ['seniorDeadline', 'Submission Deadline', 'date'],
    ],
  },
];

export default function ContestSettings({ config, onChange, onSave, saving }) {
  const update = (key, value) => onChange((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold text-[#193E32]">Contest Rules & Settings</h2>
          <p className="mt-1 text-xs text-slate-500">Edit competition themes, limits, prizes, and deadlines.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
          {config.status || 'Active'}
        </span>
      </div>

      <form onSubmit={onSave} className="space-y-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-bold text-slate-700">
            Edition Year
            <input
              type="text"
              required
              value={config.editionYear || ''}
              onChange={(event) => update('editionYear', event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#276B56]"
            />
          </label>
          <label className="block text-xs font-bold text-slate-700">
            Contest Status
            <select
              value={config.status || 'Active'}
              onChange={(event) => update('status', event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#276B56]"
            >
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Closed">Closed</option>
            </select>
          </label>
        </div>

        {GROUPS.map((group) => (
          <fieldset key={group.title} className="space-y-4 rounded-2xl border border-slate-100 bg-[#FFF9EF]/50 p-4 sm:p-5">
            <legend className="px-2 text-sm font-bold text-[#193E32]">{group.title}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map(([key, label, type]) => (
                <label key={key} className={`block text-xs font-bold text-slate-700 ${key.endsWith('Theme') || key.endsWith('Prizes') ? 'sm:col-span-2' : ''}`}>
                  {label}
                  <input
                    type={type}
                    required
                    value={config[key] || ''}
                    onChange={(event) => update(key, event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-normal outline-none focus:border-[#276B56]"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#193E32] px-5 py-3 text-xs font-bold text-white hover:bg-[#276B56] disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Contest Rules'}
          </button>
        </div>
      </form>
    </section>
  );
}
