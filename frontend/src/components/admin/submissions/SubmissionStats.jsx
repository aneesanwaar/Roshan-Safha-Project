import React from 'react';
import { Inbox, Filter, Layers } from 'lucide-react';
export default function SubmissionStats({ total, filtered, typeLabel }) {
  const cards = [{ label: `${typeLabel} matching filters`, value: total, Icon: Inbox }, { label: 'Currently displayed', value: filtered, Icon: Layers }, { label: 'Filter scope', value: 'Live', Icon: Filter }];
  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{cards.map(({ label, value, Icon }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3"><span className="rounded-xl bg-[#E7EEE5] p-3 text-[#193E32]"><Icon size={19}/></span><div><p className="text-[11px] text-slate-500 font-medium">{label}</p><p className="text-xl font-black text-[#193E32]">{value}</p></div></div>)}</div>;
}
