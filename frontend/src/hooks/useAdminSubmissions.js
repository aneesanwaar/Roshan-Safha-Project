import { useCallback, useEffect, useState } from 'react';
import { API, updateSubmissionStatus } from '../services/api';

export const SUBMISSION_TYPES = [
  { id: 'essays', label: 'Essays', statuses: ['Pending', 'Reviewed', 'Winner'] },
  { id: 'donations', label: 'Book Donations', statuses: ['Pledged', 'Collected', 'Cancelled'] },
  { id: 'volunteers', label: 'Volunteers', statuses: ['Pending', 'Active', 'Declined', 'Archived'] },
  { id: 'collaborations', label: 'Collaborations', statuses: ['Pending', 'Contacted', 'Approved', 'Declined'] },
  { id: 'events', label: 'Event Registrations', statuses: ['Registered', 'Confirmed', 'Cancelled'] },
  { id: 'contacts', label: 'Contact Messages', statuses: ['Unread', 'Reviewed', 'Resolved'] },
];

export default function useAdminSubmissions() {
  const [type, setType] = useState('essays');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const refresh = useCallback(() => setRefreshKey((v) => v + 1), []);
  const changeType = useCallback((next) => { setType(next); setSearch(''); setStatus(''); setPage(1); }, []);
  const changeSearch = useCallback((next) => { setSearch(next); setPage(1); }, []);
  const changeStatus = useCallback((next) => { setStatus(next); setPage(1); }, []);

  useEffect(() => {
    let live = true;
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      try {
        const res = await API.get('/admin/submissions', { params: { type, search, status, page, limit: 20 } });
        if (!live) return;
        setRecords(res.data?.submissions || []);
        setTotal(res.data?.total ?? 0);
        setTotalPages(Math.max(1, res.data?.totalPages || 1));
      } catch (err) {
        if (live) { setError(err.response?.data?.message || err.response?.data?.error || 'Could not load submissions.'); setRecords([]); }
      } finally { if (live) setLoading(false); }
    }, search ? 300 : 0);
    return () => { live = false; clearTimeout(timer); };
  }, [type, search, status, page, refreshKey]);

  useEffect(() => {
    let live = true;
    Promise.allSettled(SUBMISSION_TYPES.map(({ id }) => API.get('/admin/submissions', { params: { type: id, page: 1, limit: 1 } })))
      .then((results) => { if (live) setCounts(Object.fromEntries(results.map((r, i) => [SUBMISSION_TYPES[i].id, r.status === 'fulfilled' ? r.value.data?.total : undefined]))); });
    return () => { live = false; };
  }, [refreshKey]);

  const changeRecordStatus = async (record, nextStatus) => {
    setBusyId(record._id);
    try {
      if (type === 'donations' && nextStatus === 'Collected') throw new Error('Use Verify Collection to enter the physically received quantity.');
      await updateSubmissionStatus(type, record._id, nextStatus);
      refresh();
    } finally { setBusyId(''); }
  };
  return { type, changeType, search, changeSearch, status, changeStatus, page, setPage, records, total, totalPages, counts, loading, error, busyId, refresh, changeRecordStatus };
}
