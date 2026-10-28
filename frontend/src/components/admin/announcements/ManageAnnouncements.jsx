import React, { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { API } from '../../../services/api';
import AnnouncementStats from './AnnouncementStats';
import AnnouncementsTable from './AnnouncementsTable';
import AnnouncementEditor from './AnnouncementEditor';

const CATEGORIES = ['All categories', 'Winner Announcement', 'Event Recap', 'Impact Story', 'Collaboration', 'General Update'];
const errorText = err => err.response?.data?.error || err.response?.data?.message || err.message || 'Something went wrong.';

export default function ManageAnnouncements() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState('All categories');
  const [status, setStatus] = useState('All statuses');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editor, setEditor] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => { const t = setTimeout(() => setDebounced(search), 350); return () => clearTimeout(t); }, [search]);
  useEffect(() => setPage(1), [debounced, category, status]);

  const reload = useCallback(() => setVersion(v => v + 1), []);

  useEffect(() => { let active = true; (async () => { setLoading(true); setError(''); try { const res = await API.get('/announcements/admin', { params: { page, limit: 10, ...(debounced ? { search: debounced } : {}), ...(category !== 'All categories' ? { category } : {}), ...(status !== 'All statuses' ? { status } : {}) } }); if (active) { setItems(res.data.announcements || []); setTotal(res.data.total || 0); setPages(Math.max(1, res.data.totalPages || 1)); } } catch (err) { if (active) setError(errorText(err)); } finally { if (active) setLoading(false); } })(); return () => { active = false; }; }, [page, debounced, category, status, version]);

  async function save(form, image) { setSaving(true); setError(''); try { const payload = new FormData(); for (const field of ['title', 'category', 'status', 'excerpt', 'content', 'author']) payload.append(field, form[field] ?? ''); if (form.status === 'Scheduled') payload.append('publishAt', new Date(form.publishAt).toISOString()); else payload.append('publishAt', ''); if (image) payload.append('featuredImage', image); if (editor?._id) await API.patch(`/announcements/${editor._id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } }); else await API.post('/announcements', payload, { headers: { 'Content-Type': 'multipart/form-data' } }); setEditor(undefined); setMessage(editor?._id ? 'Announcement updated.' : 'Announcement created.'); setPage(1); reload(); } catch (err) { setError(errorText(err)); } finally { setSaving(false); } }
  async function remove(item) { if (!window.confirm(`Permanently delete “${item.title}”?`)) return; setDeleting(item._id); setError(''); try { await API.delete(`/announcements/${item._id}`); setMessage('Announcement deleted.'); reload(); } catch (err) { setError(errorText(err)); } finally { setDeleting(null); } }

  return <section className="space-y-6"><div className="bg-[#193E32] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><p className="text-[#E8A94A] text-xs font-bold tracking-[.2em] uppercase">Content publishing</p><h2 className="text-2xl sm:text-3xl font-black mt-2">Announcements & News</h2><p className="text-sm text-white/70 mt-2">Create stories, manage drafts, and schedule public updates.</p></div><button onClick={() => { setEditor(null); setError(''); }} className="inline-flex items-center justify-center gap-2 bg-[#E8A94A] hover:bg-[#f1b85e] text-[#193E32] px-5 py-3 rounded-xl font-extrabold text-sm"><Plus className="w-4 h-4" /> New announcement</button></div><AnnouncementStats items={items} total={total} /><div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col lg:flex-row gap-3"><label className="relative flex-1"><Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input aria-label="Search announcements" placeholder="Search announcement titles..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm" /></label><select aria-label="Filter category" value={category} onChange={e => setCategory(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select><select aria-label="Filter status" value={status} onChange={e => setStatus(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm">{['All statuses', 'Draft', 'Published', 'Scheduled'].map(s => <option key={s}>{s}</option>)}</select><button onClick={reload} title="Refresh" className="border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-bold"><RefreshCw className="w-4 h-4" /> Refresh</button></div>{message && <div role="status" className="rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 text-sm">{message}</div>}{error && <div role="alert" className="rounded-xl bg-rose-50 text-rose-800 border border-rose-200 p-3 text-sm">{error}</div>}{loading ? <div className="bg-white rounded-2xl p-12 text-center text-slate-500">Loading announcements...</div> : <AnnouncementsTable items={items} onEdit={item => { setEditor(item); setError(''); }} onDelete={remove} deleting={deleting} />}<div className="flex justify-between items-center text-sm text-slate-600"><span>Page {page} of {pages} · {total} matching posts</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-white border rounded-xl disabled:opacity-40">Previous</button><button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-white border rounded-xl disabled:opacity-40">Next</button></div></div>{editor !== undefined && <AnnouncementEditor item={editor} onClose={() => setEditor(undefined)} onSave={save} saving={saving} />}</section>;
}
