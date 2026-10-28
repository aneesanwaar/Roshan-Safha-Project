import React, { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  getPageContent,
  updatePageContent,
  getAdminWinners,
  createAdminWinner,
  deleteAdminWinner,
} from '../../../services/api';
import ContestSettings from './ContestSettings';
import WinnersArchive from './WinnersArchive';

const DEFAULT_CONFIG = {
  editionYear: '2026',
  status: 'Active',
  juniorTheme: 'The Book That Changed My Perspective',
  juniorWordLimit: '1,000 words',
  juniorFormats: 'PDF, DOC, DOCX',
  juniorPrizes: 'Shields, Certificates & Book Hampers',
  juniorDeadline: '2026-10-30',
  seniorTheme: 'Digital Media vs. Physical Libraries in Modern Civic Literacy',
  seniorWordLimit: '2,500 words',
  seniorFormats: 'PDF, DOC, DOCX',
  seniorPrizes: 'Cash Award & Publication Feature',
  seniorDeadline: '2026-10-30',
};

export default function ManageContests() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [winnerBusy, setWinnerBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [contestResult, winnersResult] = await Promise.allSettled([
      getPageContent('contest'),
      getAdminWinners(),
    ]);

    if (contestResult.status === 'fulfilled') {
      const saved = contestResult.value?.data?.content;
      if (saved && typeof saved === 'object') {
        setConfig((previous) => ({ ...previous, ...saved }));
      }
    }

    if (winnersResult.status === 'fulfilled') {
      const records = winnersResult.value?.data?.data;
      if (Array.isArray(records)) setWinners(records);
    }

    if (contestResult.status === 'rejected' || winnersResult.status === 'rejected') {
      setNotice({ error: true, text: 'Some contest data could not be loaded. Check your connection and refresh.' });
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveContest = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const response = await updatePageContent('contest', config);
      if (response?.data?.success !== true || response?.data?.data?.page !== 'contest') {
        throw new Error('Contest settings were not confirmed by the server.');
      }
      setNotice({ error: false, text: 'Contest rules saved successfully.' });
    } catch (error) {
      setNotice({ error: true, text: error.response?.data?.error || error.message || 'Failed to save contest rules.' });
    } finally {
      setSaving(false);
    }
  };

  const addWinner = async (form) => {
    setWinnerBusy(true);
    setNotice(null);
    try {
      const response = await createAdminWinner(form);
      if (!response.data?.success || !response.data?.data) {
        throw new Error('Winner creation was not confirmed by the server.');
      }
      setWinners((previous) => [response.data.data, ...previous]);
      setNotice({ error: false, text: 'Winner recorded successfully.' });
      return true;
    } catch (error) {
      setNotice({ error: true, text: error.response?.data?.error || error.message || 'Failed to add winner.' });
      return false;
    } finally {
      setWinnerBusy(false);
    }
  };

  const deleteWinner = async (id) => {
    if (!window.confirm('Delete this winner entry?')) return;
    setWinnerBusy(true);
    setNotice(null);
    try {
      const response = await deleteAdminWinner(id);
      if (!response.data?.success) throw new Error('Deletion was not confirmed by the server.');
      setWinners((previous) => previous.filter((winner) => winner._id !== id));
      setNotice({ error: false, text: 'Winner deleted successfully.' });
    } catch (error) {
      setNotice({ error: true, text: error.response?.data?.error || error.message || 'Failed to delete winner.' });
    } finally {
      setWinnerBusy(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center gap-3 rounded-3xl bg-white p-12 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /> Loading contests and winners...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#193E32]">Contests & Winners</h1>
        <p className="mt-1 text-sm text-slate-500">Manage essay competitions and celebrate student achievements.</p>
      </div>

      {notice && (
        <div role="status" className={`rounded-xl border px-4 py-3 text-sm ${notice.error ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
          {notice.text}
        </div>
      )}

      <ContestSettings config={config} onChange={setConfig} onSave={saveContest} saving={saving} />
      <WinnersArchive winners={winners} onAdd={addWinner} onDelete={deleteWinner} busy={winnerBusy} />
    </div>
  );
}
