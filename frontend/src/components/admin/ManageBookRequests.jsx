import { useCallback, useEffect, useState } from 'react';

import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  RefreshCw,
  SearchX,
  ShieldAlert,
  Truck,
  X,
  XCircle,
} from 'lucide-react';

import {
  getAdminBookRequests,
  getAdminBookRequestById,
  updateAdminBookRequestStatus,
} from '../../services/api';

// -------------------------------------------------------------
// Constants
// -------------------------------------------------------------

const STATUSES = [
  'All',
  'Pending',
  'Approved',
  'Rejected',
  'Fulfilled',
];

const PAGE_SIZE = 10;

const badgeStyles = {
  Pending: 'bg-amber-50 text-amber-800 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Fulfilled: 'bg-slate-100 text-slate-700 border-slate-200',
};

// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------

const dateLabel = (date) => {
  if (!date) return '—';

  const value = new Date(date);

  return Number.isNaN(value.getTime())
    ? '—'
    : value.toLocaleString('en-PK', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

// -------------------------------------------------------------
// Main Component
// -------------------------------------------------------------

export default function ManageBookRequests() {
  // -----------------------------------------------------------
  // Request list state
  // -----------------------------------------------------------

  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  // -----------------------------------------------------------
  // Selected request state
  // -----------------------------------------------------------

  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);

  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const [notice, setNotice] = useState('');

  // -----------------------------------------------------------
  // Refresh request list
  // -----------------------------------------------------------

  const refresh = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  // -----------------------------------------------------------
  // Load requests
  // -----------------------------------------------------------

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setListError('');

      try {
        const response = await getAdminBookRequests({
          page,
          limit: PAGE_SIZE,
          ...(statusFilter !== 'All'
            ? { status: statusFilter }
            : {}),
        });

        if (!active) return;

        const payload = response.data;

        setRequests(
          Array.isArray(payload.data)
            ? payload.data
            : []
        );

        setTotal(Number(payload.total) || 0);

        setTotalPages(
          Math.max(
            1,
            Number(payload.totalPages) || 1
          )
        );
      } catch (error) {
        if (!active) return;

        setListError(
          getErrorMessage(
            error,
            'Unable to load book requests.'
          )
        );

        setRequests([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [page, statusFilter, refreshKey]);

  // -----------------------------------------------------------
  // Load selected request details
  // -----------------------------------------------------------

  useEffect(() => {
    if (!selectedId) return undefined;

    let active = true;

    setDetailLoading(true);
    setDetailError('');
    setActionError('');
    setSelected(null);

    getAdminBookRequestById(selectedId)
      .then((response) => {
        if (!active) return;

        const request = response.data.data;

        setSelected(request);

        setNotes(request?.adminNotes || '');
      })
      .catch((error) => {
        if (active) {
          setDetailError(
            getErrorMessage(
              error,
              'Unable to load request details.'
            )
          );
        }
      })
      .finally(() => {
        if (active) {
          setDetailLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedId]);

  // -----------------------------------------------------------
  // Close modal with Escape
  // -----------------------------------------------------------

  useEffect(() => {
    if (!selectedId) return undefined;

    const onKeyDown = (event) => {
      if (
        event.key === 'Escape' &&
        !saving
      ) {
        setSelectedId(null);
      }
    };

    window.addEventListener(
      'keydown',
      onKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        onKeyDown
      );
    };
  }, [selectedId, saving]);

  // -----------------------------------------------------------
  // Change status filter
  // -----------------------------------------------------------

  const changeFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
    setNotice('');
  };

  // -----------------------------------------------------------
  // Close request details
  // -----------------------------------------------------------

  const closeDetails = () => {
    if (saving) return;

    setSelectedId(null);
    setSelected(null);
    setDetailError('');
    setActionError('');
  };

  // -----------------------------------------------------------
  // Approve / Reject / Fulfill
  // -----------------------------------------------------------

  const updateStatus = async (status) => {
    if (
      !selected ||
      saving ||
      selected.status === 'Fulfilled'
    ) {
      return;
    }

    if (
      ![
        'Approved',
        'Rejected',
        'Fulfilled',
      ].includes(status)
    ) {
      return;
    }

    // ---------------------------------------------------------
    // Fulfillment is allowed only for approved requests.
    // ---------------------------------------------------------

    if (
      status === 'Fulfilled' &&
      selected.status !== 'Approved'
    ) {
      setActionError(
        'Only approved requests can be fulfilled.'
      );

      return;
    }

    // ---------------------------------------------------------
    // Check displayed inventory before fulfillment.
    // Backend performs the authoritative stock check.
    // ---------------------------------------------------------

    if (status === 'Fulfilled') {
      if (!selected.book?._id) {
        setActionError(
          'The requested book no longer exists in inventory.'
        );

        return;
      }

      const availableQuantity = Number(
        selected.book.availableQuantity
      );

      const requestedQuantity = Number(
        selected.quantity
      );

      if (
        !Number.isFinite(availableQuantity) ||
        availableQuantity < requestedQuantity
      ) {
        setActionError(
          `Insufficient inventory. Only ${
            Number.isFinite(availableQuantity)
              ? availableQuantity
              : 0
          } copies are currently available.`
        );

        return;
      }
    }

    // ---------------------------------------------------------
    // Confirmation messages
    // ---------------------------------------------------------

    let message = '';

    if (status === 'Approved') {
      message =
        'Approve this book request?\n\n' +
        'Approving does not deduct inventory.';
    }

    if (status === 'Rejected') {
      message =
        'Reject this book request?\n\n' +
        'The request will be marked as Rejected.';
    }

    if (status === 'Fulfilled') {
      message =
        'Confirm Book Fulfillment\n\n' +
        `Student: ${selected.studentName}\n` +
        `Book: ${selected.book?.title || 'Unknown'}\n` +
        `Copies to deduct: ${selected.quantity}\n\n` +
        'This action will permanently mark the request ' +
        'as Fulfilled and deduct the copies from inventory.\n\n' +
        'Fulfilled requests cannot be modified or deleted.\n\n' +
        'Do you want to continue?';
    }

    if (!window.confirm(message)) {
      return;
    }

    // ---------------------------------------------------------
    // Submit status update
    // ---------------------------------------------------------

    setSaving(true);
    setActionError('');

    try {
      const response =
        await updateAdminBookRequestStatus(
          selected._id,
          status,
          notes
        );

      if (status === 'Fulfilled') {
        const remaining =
          response?.data?.inventory
            ?.availableQuantity;

        setNotice(
          'Book request fulfilled successfully! ' +
          `${selected.quantity} ${
            Number(selected.quantity) === 1
              ? 'copy has'
              : 'copies have'
          } been deducted from inventory.` +
          (
            remaining !== undefined
              ? ` Remaining copies: ${remaining}.`
              : ''
          )
        );
      } else {
        setNotice(
          `Request ${status.toLowerCase()} successfully.`
        );
      }

      closeDetailsAfterSuccess();
      refresh();
    } catch (error) {
      setActionError(
        getErrorMessage(
          error,
          status === 'Fulfilled'
            ? 'Unable to fulfill the book request.'
            : 'Unable to update the request.'
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------------------------
  // Close modal after successful action
  // -----------------------------------------------------------

  const closeDetailsAfterSuccess = () => {
    setSelectedId(null);
    setSelected(null);
    setDetailError('');
    setActionError('');
  };

  // -----------------------------------------------------------
  // Fulfillment eligibility
  // -----------------------------------------------------------

  const isApproved =
    selected?.status === 'Approved';

  const isFulfilled =
    selected?.status === 'Fulfilled';

  const requestedQuantity =
    Number(selected?.quantity) || 0;

  const availableQuantity =
    Number(selected?.book?.availableQuantity);

  const hasEnoughStock =
    selected?.book?._id &&
    Number.isFinite(availableQuantity) &&
    availableQuantity >= requestedQuantity;

  const canFulfill =
    isApproved &&
    hasEnoughStock &&
    !saving;

  // -----------------------------------------------------------
  // Render
  // -----------------------------------------------------------

  return (
    <section className="min-w-0 space-y-6 pb-8 text-[#193E32]">

      {/* -----------------------------------------------------
          Page header
      ----------------------------------------------------- */}

      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#193E32] via-[#205443] to-[#276B56] p-6 text-white shadow-[0_16px_40px_rgba(25,62,50,0.14)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[#E8A94A]">
              <BookOpen size={17} />
              Roshan Safha • Distribution
            </div>

            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Book Requests
            </h2>

            <p className="mt-2 text-sm text-white/75">
              Review student requests, manage approvals,
              and fulfill approved book distributions.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />
            Refresh
          </button>

        </div>
      </div>

      {/* Status snapshot: counts apply only to the currently loaded page. */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {['Pending', 'Approved', 'Rejected', 'Fulfilled'].map((status) => (
          <div key={status} className="rounded-[20px] border border-[#E0EADF] bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#658073]">{status} · This page</p>
            <p className="mt-2 text-2xl font-black text-[#193E32]">
              {loading ? '—' : requests.filter((item) => item.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* -----------------------------------------------------
          Requests table
      ----------------------------------------------------- */}

      <div className="min-w-0 overflow-hidden rounded-[24px] border border-[#E0EADF] bg-white p-4 shadow-[0_8px_28px_rgba(25,62,50,0.05)] sm:p-6">

        {/* Status filters */}

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div
            className="flex flex-wrap gap-2"
            aria-label="Filter requests by status"
          >
            {STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  changeFilter(status)
                }
                aria-pressed={
                  statusFilter === status
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === status
                    ? 'bg-[#193E32] text-white'
                    : 'bg-[#E7EEE5] text-[#193E32] hover:bg-[#d6e5d8]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <span className="text-sm text-gray-500">
            {loading
              ? 'Loading…'
              : `${total} request${
                  total === 1 ? '' : 's'
                }`}
          </span>

        </div>

        {/* Success notice */}

        {notice && (
          <div
            role="status"
            className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />
              <span>{notice}</span>
            </div>
          </div>
        )}

        {/* List error */}

        {listError && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {listError}
          </div>
        )}

        {/* Table */}

        <div className="mt-5 max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-[#E8EEE5]">

          <table className="min-w-[760px] w-full border-collapse text-left text-sm">

            <thead>
              <tr className="border-b border-[#E0EADF] bg-[#F2F7F0] text-[#34594A]">
                <th className="px-4 py-3 font-semibold">
                  Student
                </th>

                <th className="px-4 py-3 font-semibold">
                  Book
                </th>

                <th className="px-4 py-3 font-semibold">
                  Copies
                </th>

                <th className="px-4 py-3 font-semibold">
                  Submitted
                </th>

                <th className="px-4 py-3 font-semibold">
                  Status
                </th>

                <th className="px-4 py-3 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                requests.map((request) => (
                  <tr
                    key={request._id}
                    className="border-b border-[#E7EEE5] last:border-0 hover:bg-[#F7FAF5]"
                  >

                    {/* Student */}

                    <td className="px-4 py-4">
                      <div className="font-semibold">
                        {request.studentName || '—'}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {request.institution || '—'}
                      </div>
                    </td>

                    {/* Book */}

                    <td className="px-4 py-4">
                      <div className="max-w-[240px] font-medium">
                        {request.book?.title ||
                          'Book removed'}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {request.book?.author || ''}
                      </div>
                    </td>

                    {/* Quantity */}

                    <td className="px-4 py-4">
                      {request.quantity}
                    </td>

                    {/* Date */}

                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                      {dateLabel(
                        request.createdAt
                      )}
                    </td>

                    {/* Status */}

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                          badgeStyles[
                            request.status
                          ] || ''
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>

                    {/* Details button */}

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedId(
                            request._id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#E7EEE5] px-3 py-2 font-semibold text-[#193E32] hover:bg-[#d6e5d8]"
                      >
                        <Eye size={15} />
                        Details
                      </button>
                    </td>

                  </tr>
                ))}
            </tbody>

          </table>

          {/* Loading state */}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-14 text-gray-500">
              <Loader2
                size={19}
                className="animate-spin"
              />
              Loading requests…
            </div>
          )}

          {/* Empty state */}

          {!loading &&
            !listError &&
            requests.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-14 text-center text-gray-500">
                <SearchX size={30} />

                <p className="font-semibold">
                  No requests found
                </p>

                <p className="text-sm">
                  Try another status filter or refresh.
                </p>
              </div>
            )}

        </div>

        {/* Pagination */}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E7EEE5] pt-4">

          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <div className="flex gap-2">

            <button
              type="button"
              disabled={
                loading ||
                page <= 1
              }
              onClick={() =>
                setPage((current) =>
                  Math.max(
                    1,
                    current - 1
                  )
                )
              }
              className="inline-flex items-center gap-1 rounded-lg border border-[#E7EEE5] px-3 py-2 text-sm font-semibold disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              disabled={
                loading ||
                page >= totalPages
              }
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages,
                    current + 1
                  )
                )
              }
              className="inline-flex items-center gap-1 rounded-lg border border-[#E7EEE5] px-3 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>

          </div>
        </div>

      </div>

      {/* -----------------------------------------------------
          Request details modal
      ----------------------------------------------------- */}

      {selectedId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0B2119]/70 p-3 backdrop-blur-[3px] sm:p-6"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !saving
            ) {
              closeDetails();
            }
          }}
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-request-dialog-title"
            className="my-auto flex max-h-[min(92dvh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-[26px] bg-white shadow-2xl"
          >

            {/* Modal header */}

            <div className="flex items-start justify-between gap-4 rounded-t-2xl bg-[#193E32] px-6 py-5 text-white">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#E8A94A]">
                  Request review
                </p>

                <h3
                  id="book-request-dialog-title"
                  className="mt-1 font-serif text-2xl font-bold"
                >
                  Book Request Details
                </h3>
              </div>

              <button
                type="button"
                aria-label="Close details"
                onClick={closeDetails}
                disabled={saving}
                className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal body */}

            <div className="min-h-0 space-y-5 overflow-y-auto p-5 sm:p-6">

              {/* Detail loading */}

              {detailLoading && (
                <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
                  <Loader2
                    className="animate-spin"
                    size={20}
                  />
                  Loading details…
                </div>
              )}

              {/* Detail error */}

              {detailError && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {detailError}
                </p>
              )}

              {/* Request details */}

              {selected &&
                !detailLoading && (
                  <>

                    {/* Status and date */}

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          badgeStyles[
                            selected.status
                          ] || ''
                        }`}
                      >
                        {selected.status}
                      </span>

                      <span className="text-xs text-gray-500">
                        Submitted{' '}
                        {dateLabel(
                          selected.createdAt
                        )}
                      </span>

                    </div>

                    {/* Request information */}

                    <div className="grid gap-4 rounded-xl bg-[#FFF9EF] p-4 sm:grid-cols-2">

                      <Info
                        label="Student"
                        value={
                          selected.studentName
                        }
                      />

                      <Info
                        label="Phone / WhatsApp"
                        value={
                          selected.phone
                        }
                      />

                      <Info
                        label="Institution"
                        value={
                          selected.institution
                        }
                      />

                      <Info
                        label="Collection preference"
                        value={
                          selected.collectionPreference
                        }
                      />

                      <Info
                        label="Book title"
                        value={
                          selected.book?.title ||
                          'Book removed'
                        }
                      />

                      <Info
                        label="Author"
                        value={
                          selected.book?.author
                        }
                      />

                      <Info
                        label="Copies requested"
                        value={
                          selected.quantity
                        }
                      />

                      <Info
                        label="Currently available"
                        value={
                          selected.book
                            ?.availableQuantity ??
                          'Unavailable'
                        }
                      />

                      <Info
                        label="Shelf"
                        value={
                          selected.book
                            ?.locationShelf
                        }
                      />

                      <Info
                        label="Fulfilled on"
                        value={
                          selected.fulfilledAt
                            ? dateLabel(
                                selected.fulfilledAt
                              )
                            : '—'
                        }
                      />

                    </div>

                    {/* Reason */}

                    <div>
                      <p className="text-sm font-semibold">
                        Reason for request
                      </p>

                      <p className="mt-2 whitespace-pre-wrap rounded-xl border border-[#E7EEE5] p-4 text-sm text-gray-700">
                        {selected.reason ||
                          'No reason provided.'}
                      </p>
                    </div>

                    {/* Admin notes */}

                    <div>
                      <label
                        htmlFor="book-request-admin-notes"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Admin notes
                      </label>

                      <textarea
                        id="book-request-admin-notes"
                        value={notes}
                        onChange={(event) =>
                          setNotes(
                            event.target.value
                          )
                        }
                        disabled={
                          saving ||
                          isFulfilled
                        }
                        maxLength={1000}
                        rows={3}
                        className="w-full rounded-xl border border-[#d3ded5] p-3 text-sm outline-none focus:border-[#276B56] focus:ring-2 focus:ring-[#276B56]/20 disabled:bg-gray-100"
                        placeholder="Optional internal notes for this decision…"
                      />

                      <p className="mt-1 text-right text-xs text-gray-500">
                        {notes.length}/1000
                      </p>
                    </div>

                    {/* Action error */}

                    {actionError && (
                      <p
                        role="alert"
                        className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                      >
                        {actionError}
                      </p>
                    )}

                    {/* Fulfillment information */}

                    {isApproved && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">

                        <div className="flex items-start gap-2">

                          <Truck
                            size={18}
                            className="mt-0.5 shrink-0"
                          />

                          <div>
                            <p className="font-semibold">
                              Ready for fulfillment
                            </p>

                            <p className="mt-1">
                              Requested copies:{' '}
                              <strong>
                                {requestedQuantity}
                              </strong>
                            </p>

                            <p className="mt-1">
                              Available copies:{' '}
                              <strong>
                                {
                                  Number.isFinite(
                                    availableQuantity
                                  )
                                    ? availableQuantity
                                    : 'Unavailable'
                                }
                              </strong>
                            </p>

                            <p className="mt-2 text-xs">
                              Fulfillment will
                              automatically deduct
                              the requested quantity
                              from inventory.
                            </p>
                          </div>

                        </div>

                      </div>
                    )}

                    {/* Insufficient stock warning */}

                    {isApproved &&
                      !hasEnoughStock && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">

                          <div className="flex items-start gap-2">

                            <ShieldAlert
                              size={18}
                              className="mt-0.5 shrink-0"
                            />

                            <p>
                              <strong>
                                Fulfillment unavailable.
                              </strong>{' '}
                              There are not enough
                              copies in inventory
                              to complete this request.
                            </p>

                          </div>

                        </div>
                      )}

                    {/* Fulfilled information */}

                    {isFulfilled && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">

                        <div className="flex items-start gap-2">

                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0"
                          />

                          <p>
                            This request has been
                            fulfilled successfully.
                            Inventory was deducted
                            when fulfillment was
                            recorded.
                          </p>

                        </div>

                      </div>
                    )}

                    {/* Action buttons */}

                    <div className="flex flex-wrap gap-3 border-t border-[#E7EEE5] pt-4">

                      {/* Approve */}

                      {!isFulfilled && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                'Approved'
                              )
                            }
                            disabled={
                              saving ||
                              isApproved
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-[#276B56] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#193E32] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {saving ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle2
                                size={16}
                              />
                            )}

                            Approve
                          </button>

                          {/* Reject */}

                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                'Rejected'
                              )
                            }
                            disabled={
                              saving ||
                              selected.status ===
                                'Rejected'
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </>
                      )}

                      {/* Fulfill */}

                      {isApproved && (
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(
                              'Fulfilled'
                            )
                          }
                          disabled={!canFulfill}
                          title={
                            hasEnoughStock
                              ? 'Fulfill this request and deduct inventory'
                              : 'Insufficient inventory'
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-[#E8A94A] px-4 py-2.5 text-sm font-semibold text-[#193E32] transition hover:bg-[#d99a36] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saving ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Truck size={16} />
                          )}

                          {saving
                            ? 'Processing…'
                            : 'Fulfill Request'}
                        </button>
                      )}

                      {/* Close */}

                      <button
                        type="button"
                        onClick={closeDetails}
                        disabled={saving}
                        className="ml-auto rounded-xl border border-[#E7EEE5] px-4 py-2.5 text-sm font-semibold hover:bg-[#FFF9EF] disabled:opacity-50"
                      >
                        Close
                      </button>

                    </div>

                    {/* Permanent distribution record */}

                    {isFulfilled && (
                      <p className="flex items-center gap-2 text-sm text-emerald-700">
                        <Check size={16} />
                        This request is a permanent
                        distribution record.
                      </p>
                    )}

                  </>
                )}

            </div>
          </div>
        </div>
      )}

    </section>
  );
}

// -------------------------------------------------------------
// Reusable information field
// -------------------------------------------------------------

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-[#193E32]">
        {value === null ||
        value === undefined ||
        value === ''
          ? '—'
          : value}
      </p>
    </div>
  );
}