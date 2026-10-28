import React, { useEffect, useState } from 'react';
import { X, PackageCheck, PlusCircle, RefreshCw } from 'lucide-react';
import { API } from '../../../services/api';
const SKIP = new Set(['__v', '_id', 'createdAt', 'updatedAt']);
export default function SubmissionDetails({ item, type, onClose, onChanged }) {
  const [verified, setVerified] = useState('');
  const [quantity, setQuantity] = useState('');
  const [bookId, setBookId] = useState('');
  const [books, setBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [donation, setDonation] = useState(item);
  useEffect(() => { setDonation(item); setVerified(''); setQuantity(''); setError(''); setMessage(''); }, [item]);
  useEffect(() => {
    if (!item || type !== 'donations') return;
    let live = true;
    API.get(`/admin/donations/${item._id}/inventory`).then((r) => { if (live) { setHistory(r.data?.entries || r.data?.history || []); if (r.data?.donation) setDonation((previous) => ({ ...previous, ...r.data.donation })); } }).catch(() => {});
    API.get('/books/admin/inventory', { params: { limit: 100 } }).then((r) => { if (live) { const data = r.data; setBooks(Array.isArray(data) ? data : data?.books || data?.data?.books || (Array.isArray(data?.data) ? data.data : [])); } }).catch(() => {});
    return () => { live = false; };
  }, [item, type]);
  if (!item) return null;
  const collect = async () => {
    setBusy(true); setError(''); setMessage('');
    try { await API.patch(`/admin/donations/${item._id}/collect`, { verifiedQuantity: Number(verified) }); setMessage('Donation collection verified.'); onChanged(); const r = await API.get(`/admin/donations/${item._id}/inventory`); if (r.data?.donation) setDonation((previous) => ({ ...previous, ...r.data.donation })); }
    catch (e) { setError(e.response?.data?.error || e.response?.data?.message || e.message); }
    finally { setBusy(false); }
  };
  const addInventory = async () => {
    setBusy(true); setError(''); setMessage('');
    try { await API.post(`/admin/donations/${item._id}/inventory`, { bookId, quantity: Number(quantity), operationKey: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}` }); setMessage('Books added to inventory successfully.'); onChanged(); const r = await API.get(`/admin/donations/${item._id}/inventory`); setHistory(r.data?.entries || r.data?.history || []); if (r.data?.donation) setDonation((previous) => ({ ...previous, ...r.data.donation })); setQuantity(''); }
    catch (e) { setError(e.response?.data?.error || e.response?.data?.message || e.message); }
    finally { setBusy(false); }
  };
  const donationStatus = String(donation?.status ?? item?.status ?? 'Pledged').trim();
  const remaining = Math.max(0, (donation.verifiedQuantity || 0) - (donation.processedQuantity || 0));
  return <div className="fixed inset-0 z-[80] flex justify-end bg-slate-950/50" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}><aside role="dialog" aria-modal="true" aria-label="Submission details" className="w-full max-w-xl h-full min-w-0 bg-white shadow-2xl overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-5"><div className="flex justify-between items-center gap-3 rounded-2xl bg-[#193E32] px-5 py-5 text-white shadow-sm sm:px-6 sm:py-6"><div><h2 className="text-xl font-black text-white">Submission Details</h2><p className="text-xs text-white/70">{type} · {new Date(item.createdAt || Date.now()).toLocaleString()}</p></div><button aria-label="Close details" onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-50" disabled={busy}><X/></button></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{Object.entries(donation).filter(([k,v]) => !SKIP.has(k) && v !== null && typeof v !== 'object').map(([k,v]) => <div key={k} className="rounded-xl border border-[#E7EEE5] bg-[#FFF9EF]/60 p-3 min-w-0"><p className="text-[10px] uppercase tracking-wide font-bold text-slate-500">{k.replace(/([A-Z])/g,' $1')}</p><p className="mt-1 text-sm text-slate-800 break-words">{String(v)}</p></div>)}</div>
    {type === 'essays' && item.fileUrl && item.fileUrl !== '#' && <a className="inline-flex text-[#276B56] font-bold underline text-sm" href={item.fileUrl} target="_blank" rel="noreferrer">Open essay document</a>}
    {type === 'donations' && <section className="space-y-4 border-t border-slate-200 pt-5"><h3 className="font-black text-[#193E32] flex items-center gap-2"><PackageCheck size={18}/> Donation to Inventory</h3><div className="rounded-xl bg-[#E7EEE5] p-4 text-sm"><p><b>Collection:</b> {donationStatus}</p><p><b>Verified:</b> {donation.verifiedQuantity || 0} · <b>Cataloged:</b> {donation.processedQuantity || 0} · <b>Remaining:</b> {remaining}</p><p><b>Inventory:</b> {donation.inventoryStatus || 'Not Processed'}</p></div>
      {donationStatus.toLowerCase() === 'pledged' && <div className="space-y-2"><label className="text-xs font-bold text-slate-700">Physically received books</label><div className="flex flex-wrap gap-2"><input type="number" min="1" max={donation.numberOfBooks || undefined} value={verified} onChange={(e) => setVerified(e.target.value)} className="w-28 min-w-0 rounded-xl border border-[#D7E3D9] p-2 focus:outline-none focus:ring-2 focus:ring-[#276B56]/20"/><button disabled={busy || !Number.isInteger(Number(verified)) || Number(verified) <= 0} onClick={collect} className="rounded-xl bg-[#193E32] px-4 py-2 text-white text-xs font-bold disabled:opacity-40">Verify Collection</button></div></div>}
      {donationStatus.toLowerCase() === 'collected' && remaining > 0 && <div className="space-y-2"><label className="text-xs font-bold text-slate-700">Add a verified batch to an existing catalog book</label><select value={bookId} onChange={(e) => setBookId(e.target.value)} className="w-full min-w-0 rounded-xl border border-[#D7E3D9] p-2.5 text-sm"><option value="">Select a book</option>{books.map((b) => <option key={b._id} value={b._id}>{b.title} {b.educationLevel ? `(${b.educationLevel})` : ''}</option>)}</select><div className="flex flex-wrap gap-2"><input aria-label="Batch quantity" type="number" min="1" max={remaining} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-28 min-w-0 rounded-xl border border-[#D7E3D9] p-2 focus:outline-none focus:ring-2 focus:ring-[#276B56]/20"/><button disabled={busy || !bookId || !Number.isInteger(Number(quantity)) || Number(quantity) < 1 || Number(quantity) > remaining} onClick={addInventory} className="rounded-xl bg-[#276B56] px-4 py-2 text-white text-xs font-bold disabled:opacity-40 flex items-center gap-2"><PlusCircle size={16}/> Add to Inventory</button></div><p className="text-xs text-slate-500">For a new book title, create it in Book Inventory first, then return here to add its verified quantity.</p></div>}
      <h4 className="text-sm font-bold text-slate-800">Processing history</h4>{history.length ? history.map((h) => <p key={h._id} className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{h.quantity} book(s) · {h.createdAt ? new Date(h.createdAt).toLocaleString() : 'Recorded'} · {h.book?.title || h.bookId?.title || 'Catalog entry'}</p>) : <p className="text-xs text-slate-500">No batches processed yet.</p>}
    </section>}
    {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{message && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
    <button onClick={onClose} className="w-full rounded-xl border border-[#D7E3D9] p-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#E7EEE5] disabled:opacity-50" disabled={busy}><RefreshCw size={15}/> Close details</button></aside></div>;
}
