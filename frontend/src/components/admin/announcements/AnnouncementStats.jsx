import React from 'react';

export default function AnnouncementStats({ items, total }) {
  
  const cards = [['Total records', total], ['Published on this page', items.filter(x => x.status === 'Published' || !x.status).length], ['Drafts on this page', items.filter(x => x.status === 'Draft').length], ['Scheduled on this page', items.filter(x => x.status === 'Scheduled').length]];
  
  return <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">{cards.map(([label, value]) => <div key={label} className="bg-white border border-[#E7EEE5] rounded-2xl p-4 shadow-sm"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="text-2xl font-black text-[#193E32] mt-2">{value}</p></div>)}</div>;
}
