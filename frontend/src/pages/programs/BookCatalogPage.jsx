import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  GraduationCap,
  LibraryBig,
  MapPin,
  Loader2,
  Send,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { fetchPublicBooks, submitBookRequest } from "../../services/api";

// -------------------------------------------------------------
// Configuration
// -------------------------------------------------------------

const EDUCATION_LEVELS = [
  "All",
  "Primary",
  "Middle",
  "Matric (9th-10th)",
  "Intermediate (FSc/ICS)",
  "General Reading",
  "Other",
];

const BOOK_THEMES = [
  {
    background: "#204D40",
    accent: "#E8A94A",
    light: "#DDEBE2",
  },
  {
    background: "#324B67",
    accent: "#F0C77C",
    light: "#E3ECF6",
  },
  {
    background: "#785043",
    accent: "#F2C38A",
    light: "#F9E9DB",
  },
  {
    background: "#4D496D",
    accent: "#D9C5F3",
    light: "#EDE8F7",
  },
  {
    background: "#526344",
    accent: "#E7C982",
    light: "#EDF1E6",
  },
  {
    background: "#774F60",
    accent: "#F2C4C9",
    light: "#F8E8ED",
  },
];

const PAGE_SIZE = 12;

// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------

function getBookTheme(book) {
  const text = `${book.title || ""}${book.subject || ""}`;

  const hash = Array.from(text).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );

  return BOOK_THEMES[hash % BOOK_THEMES.length];
}

function getBookInitials(title = "") {
  return title
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function getBookCountLabel(count) {
  return `${count} ${count === 1 ? "copy" : "copies"}`;
}

// -------------------------------------------------------------
// Decorative Book Cover
// -------------------------------------------------------------

function BookCover({ book }) {
  const theme = getBookTheme(book);

  return (
    <div
      className="relative mx-auto flex aspect-[3/4] w-full max-w-[185px] flex-col overflow-hidden rounded-r-xl rounded-l-sm shadow-[8px_12px_22px_rgba(0,0,0,0.17)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-2deg]"
      style={{
        backgroundColor: theme.background,
        color: theme.light,
      }}
    >
      {/* Book spine */}
      <div className="absolute inset-y-0 left-0 z-10 w-[10px] bg-black/20" />

      <div className="absolute inset-y-0 left-[10px] z-10 w-px bg-white/20" />

      {/* Decorative circles */}
      <div
        className="absolute -right-14 -top-14 h-40 w-40 rounded-full border-[25px] opacity-20"
        style={{ borderColor: theme.accent }}
      />

      <div
        className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full border-[24px] opacity-20"
        style={{ borderColor: theme.accent }}
      />

      <div className="relative z-10 flex h-full flex-col px-5 pb-5 pt-6">
        <div className="flex items-center justify-between gap-2">
          <BookOpen
            className="h-5 w-5"
            style={{ color: theme.accent }}
          />

          <span
            className="text-[8px] font-bold uppercase tracking-[0.18em]"
            style={{ color: theme.accent }}
          >
            Roshan Safha
          </span>
        </div>

        <div className="my-auto py-5 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border text-lg font-bold"
            style={{
              borderColor: `${theme.accent}80`,
              color: theme.accent,
            }}
          >
            {getBookInitials(book.title) || "RS"}
          </div>

          <p
            className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: theme.accent }}
          >
            {book.subject}
          </p>

          <h3
            className="line-clamp-4 text-base font-bold leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {book.title}
          </h3>
        </div>

        <div
          className="border-t pt-3 text-center"
          style={{ borderColor: `${theme.accent}55` }}
        >
          <p className="line-clamp-2 text-[9px] opacity-80">
            {book.author || "Unknown Author"}
          </p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Book Card
// -------------------------------------------------------------

function BookCard({ book, onRequest }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E5EAE2] bg-white shadow-[0_5px_24px_rgba(25,62,50,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B7CDBF] hover:shadow-[0_18px_40px_rgba(25,62,50,0.12)]">
      {/* Book cover area */}
      <div className="relative flex min-h-[275px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#F2F5ED] via-[#F8F6EF] to-[#E7EEE5] px-7 py-8">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#9BAF9C_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="absolute left-4 top-4 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CFE5D7] bg-white/95 px-3 py-1.5 text-[10px] font-bold text-[#276B56] shadow-sm">
            <Check className="h-3 w-3" />
            In Stock
          </span>
        </div>

        <div className="absolute bottom-4 right-4 z-20">
          <span className="rounded-full bg-[#193E32] px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
            {getBookCountLabel(book.availableQuantity)}
          </span>
        </div>

        <BookCover book={book} />
      </div>

      {/* Book information */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <span className="inline-flex rounded-lg bg-[#E7EEE5] px-2.5 py-1 text-[10px] font-bold text-[#276B56]">
            {book.educationLevel}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-bold leading-snug text-[#193E32]">
          {book.title}
        </h3>

        <p className="mt-1.5 line-clamp-1 text-xs text-slate-500">
          {book.author || "Unknown Author"}
        </p>

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-start justify-between gap-3 text-xs">
            <span className="text-slate-500">Subject</span>

            <span className="max-w-[60%] text-right font-semibold text-slate-700">
              {book.subject}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3 text-xs">
            <span className="text-slate-500">Condition</span>

            <span className="font-semibold text-[#276B56]">
              {book.condition || "Not specified"}
            </span>
          </div>

          {book.language && (
            <div className="flex items-start justify-between gap-3 text-xs">
              <span className="text-slate-500">Language</span>

              <span className="font-medium text-slate-700">
                {book.language}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-start gap-2 rounded-xl bg-[#F6F8F4] px-3 py-3 text-xs text-slate-600">
            <MapPin className="h-4 w-4 shrink-0 text-[#276B56]" />

            <span className="line-clamp-2">
              {book.locationShelf || "Roshan Safha Library"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRequest(book)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#193E32] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#276B56] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#276B56]"
        >
          Request This Book
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

// -------------------------------------------------------------
// Loading Skeleton
// -------------------------------------------------------------

function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white">
      <div className="flex h-[275px] animate-pulse items-center justify-center bg-slate-100">
        <div className="h-48 w-32 rounded-lg bg-slate-200" />
      </div>

      <div className="space-y-4 p-5">
        <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="h-20 animate-pulse rounded bg-slate-50" />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Book Request Dialog
// -------------------------------------------------------------

function BookRequestDialog({ book, onClose, onSubmitted }) {
  const [form, setForm] = useState({
    studentName: "",
    phone: "",
    institution: "",
    quantity: 1,
    reason: "",
    collectionPreference: "Collection",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previousFocus = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !submittingRef.current) onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
        )).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;
    const quantity = Number(form.quantity);
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > book.availableQuantity) {
      setError(`Please request between 1 and ${book.availableQuantity} copies.`);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      const response = await submitBookRequest({
        bookId: book._id,
        studentName: form.studentName.trim(),
        phone: form.phone.trim(),
        institution: form.institution.trim(),
        quantity,
        reason: form.reason.trim(),
        collectionPreference: form.collectionPreference,
      });
      if (!response.data?.success) throw new Error("The request could not be submitted.");
      setSuccess(true);
      onSubmitted();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unable to submit your request. Please try again."
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10281F]/75 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-request-heading"
        className="max-h-full w-full max-w-xl overflow-y-auto rounded-[26px] bg-[#FFF9EF] shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#DCE6DC] bg-[#193E32] px-6 py-5 text-white">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#E8A94A]">Roshan Safha Library</p>
            <h2 id="book-request-heading" className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {success ? "Request Received" : "Request This Book"}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close request form"
            className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="mb-6 rounded-2xl border border-[#DCE6DC] bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#276B56]">Selected book</p>
            <p className="mt-1 font-bold text-[#193E32]">{book.title}</p>
            <p className="mt-1 text-xs text-slate-500">{book.author || "Unknown Author"} · {getBookCountLabel(book.availableQuantity)} currently available</p>
          </div>

          {success ? (
            <div role="status" className="py-5 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E7EEE5] text-[#276B56]">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-[#193E32]">Your request has been submitted!</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-600">
                Our team will review your request. Submitting a request does not reserve a copy or guarantee approval.
              </p>
              <button type="button" onClick={onClose} className="mt-6 rounded-xl bg-[#193E32] px-8 py-3 text-sm font-bold text-white hover:bg-[#276B56]">
                Back to Books
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold text-[#193E32]">
                  Full name <span className="text-rose-600">*</span>
                  <input required name="studentName" value={form.studentName} onChange={updateField} maxLength={120} autoComplete="name" className="mt-2 w-full rounded-xl border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#276B56] focus:ring-2 focus:ring-[#276B56]/15" placeholder="Your full name" />
                </label>
                <label className="block text-xs font-bold text-[#193E32]">
                  Phone / WhatsApp <span className="text-rose-600">*</span>
                  <input required type="tel" name="phone" value={form.phone} onChange={updateField} maxLength={30} autoComplete="tel" className="mt-2 w-full rounded-xl border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#276B56] focus:ring-2 focus:ring-[#276B56]/15" placeholder="03XX XXXXXXX" />
                </label>
              </div>
              <label className="block text-xs font-bold text-[#193E32]">
                School / college / institution <span className="text-rose-600">*</span>
                <input required name="institution" value={form.institution} onChange={updateField} maxLength={200} className="mt-2 w-full rounded-xl border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#276B56] focus:ring-2 focus:ring-[#276B56]/15" placeholder="Your institution" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold text-[#193E32]">
                  Copies requested <span className="text-rose-600">*</span>
                  <input required type="number" name="quantity" min="1" max={book.availableQuantity} step="1" value={form.quantity} onChange={updateField} className="mt-2 w-full rounded-xl border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#276B56] focus:ring-2 focus:ring-[#276B56]/15" />
                </label>
                <label className="block text-xs font-bold text-[#193E32]">
                  Receive books by
                  <select name="collectionPreference" value={form.collectionPreference} onChange={updateField} className="mt-2 w-full rounded-xl border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#276B56] focus:ring-2 focus:ring-[#276B56]/15">
                    <option value="Collection">Collection</option>
                    <option value="Delivery">Delivery (subject to availability)</option>
                  </select>
                </label>
              </div>
              <label className="block text-xs font-bold text-[#193E32]">
                Why do you need this book? <span className="font-normal text-slate-500">(optional)</span>
                <textarea name="reason" value={form.reason} onChange={updateField} maxLength={1000} rows={3} className="mt-2 w-full resize-y rounded-xl border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#276B56] focus:ring-2 focus:ring-[#276B56]/15" placeholder="Tell us a little about your learning needs..." />
              </label>
              <p className="text-xs leading-5 text-slate-500">Your contact details will be shared with the Roshan Safha team to review and coordinate your request.</p>
              {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
              <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#193E32] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#276B56] disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Submitting Request..." : "Submit Book Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Main Page
// -------------------------------------------------------------

export default function BookCatalog() {
  const [books, setBooks] = useState([]);
  const [requestBook, setRequestBook] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch books directly from MongoDB through the existing API.
  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      if (!active) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetchPublicBooks({
          page,
          limit: PAGE_SIZE,
          search: search.trim(),
          educationLevel:
            selectedLevel === "All" ? undefined : selectedLevel,
        });

        if (!active) return;

        if (!response.data?.success) {
          throw new Error("The book catalog could not be loaded.");
        }

        setBooks(response.data.data || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 0);
      } catch (err) {
        if (!active) return;

        console.error("Public catalog error:", err);

        setBooks([]);
        setTotal(0);
        setTotalPages(0);

        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to load the library. Please try again."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [page, search, selectedLevel, refreshKey]);

  // Sorting applies to the currently loaded page.
  const sortedBooks = useMemo(() => {
    const result = [...books];

    if (sortBy === "title") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    }

    if (sortBy === "copies") {
      result.sort(
        (a, b) =>
          (b.availableQuantity || 0) -
          (a.availableQuantity || 0)
      );
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [books, sortBy]);

  const hasFilters =
    search.trim() !== "" || selectedLevel !== "All";

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setPage(1);
    setShowMobileFilters(false);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedLevel("All");
    setSortBy("newest");
    setPage(1);
  };

  const refreshBooks = () => {
    setRefreshKey((previous) => previous + 1);
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] pb-20">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#193E32] px-4 pb-24 pt-16 text-white sm:px-6 sm:pb-28 sm:pt-20 lg:px-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full border-[75px] border-white/[0.035]" />

        <div className="pointer-events-none absolute -bottom-56 -left-36 h-[500px] w-[500px] rounded-full border-[75px] border-[#E8A94A]/[0.07]" />

        <div className="pointer-events-none absolute right-[12%] top-20 hidden rotate-12 opacity-10 lg:block">
          <BookOpen className="h-56 w-56" strokeWidth={0.7} />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">


            <h1
              className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Every Book Opens
              <br />
              <span className="text-[#E8A94A]">
                a New Possibility.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-white/75 sm:text-base">
              Explore Roshan Safha's growing collection of
              restored textbooks and educational resources.
              Discover books ready to support your next chapter
              of learning.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5 text-xs font-medium text-white/75">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#E8A94A]" />
                Free Educational Resources
              </div>

              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#E8A94A]" />
                Community-Powered Library
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FLOATING SEARCH */}
      {/* ===================================================== */}

      <div className="relative z-10 mx-auto -mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[24px] border border-[#E5EAE2] bg-white p-4 shadow-[0_18px_55px_rgba(25,62,50,0.12)] sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#276B56]" />

              <input
                type="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by title, author, or subject..."
                className="w-full rounded-2xl border border-[#E5EAE2] bg-[#F8FAF6] py-4 pl-12 pr-4 text-sm text-[#193E32] outline-none transition focus:border-[#276B56] focus:bg-white focus:ring-4 focus:ring-[#276B56]/10"
              />
            </div>

            <div className="relative hidden sm:block">
              <GraduationCap className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#276B56]" />

              <select
                value={selectedLevel}
                onChange={(event) =>
                  handleLevelChange(event.target.value)
                }
                className="h-full min-w-[225px] appearance-none rounded-2xl border border-[#E5EAE2] bg-[#F8FAF6] py-4 pl-12 pr-10 text-sm font-semibold text-[#193E32] outline-none transition focus:border-[#276B56]"
              >
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level === "All"
                      ? "All Education Levels"
                      : level}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowMobileFilters((previous) => !previous)
              }
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#E5EAE2] px-5 py-4 text-sm font-semibold text-[#193E32] sm:hidden"
            >
              <Filter className="h-4 w-4" />
              Filter Books
            </button>
          </div>

          {showMobileFilters && (
            <div className="mt-3 sm:hidden">
              <select
                value={selectedLevel}
                onChange={(event) =>
                  handleLevelChange(event.target.value)
                }
                className="w-full rounded-xl border border-[#E5EAE2] bg-[#F8FAF6] px-4 py-3 text-sm text-[#193E32]"
              >
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level === "All"
                      ? "All Education Levels"
                      : level}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <LibraryBig className="h-4 w-4 text-[#276B56]" />

              {!loading && !error ? (
                <>
                  <span className="font-bold text-[#193E32]">
                    {total}
                  </span>
                  available book {total === 1 ? "title" : "titles"}
                </>
              ) : (
                "Explore our community collection"
              )}
            </p>

            <button
              type="button"
              onClick={refreshBooks}
              disabled={loading}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#276B56] transition hover:text-[#193E32] disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""
                  }`}
              />
              Refresh Inventory
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* COLLECTION */}
      {/* ===================================================== */}

      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#276B56]">
              <span className="h-px w-7 bg-[#E8A94A]" />
              Our Collection
            </div>

            <h2
              className="text-3xl font-bold text-[#193E32] sm:text-4xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Browse Available Books
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Carefully restored and ready for curious minds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-[#276B56] transition hover:bg-[#E7EEE5]"
              >
                <X className="h-3.5 w-3.5" />
                Clear Filters
              </button>
            )}

            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#276B56]" />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="appearance-none rounded-xl border border-[#E5EAE2] bg-white py-3 pl-10 pr-9 text-xs font-semibold text-[#193E32] outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="title">Title A–Z</option>
                <option value="copies">Most Copies</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Quick education filters */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {EDUCATION_LEVELS.map((level) => {
            const active = selectedLevel === level;

            return (
              <button
                key={level}
                type="button"
                onClick={() => handleLevelChange(level)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition ${active
                    ? "border-[#193E32] bg-[#193E32] text-white shadow-sm"
                    : "border-[#DCE6DC] bg-white text-[#496456] hover:border-[#276B56] hover:bg-[#E7EEE5]"
                  }`}
              >
                {level === "All" ? "All Books" : level}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-[28px] border border-rose-100 bg-white px-6 py-16 text-center shadow-sm"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <X className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold text-[#193E32]">
              We Couldn't Load the Library
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={refreshBooks}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#193E32] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#276B56]"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && books.length === 0 && (
          <div className="rounded-[28px] border border-[#E5EAE2] bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E7EEE5] text-[#276B56]">
              <BookOpen className="h-10 w-10" />
            </div>

            <h3
              className="text-2xl font-bold text-[#193E32]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No Books Found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              {hasFilters
                ? "We couldn't find any available books matching your search. Try another keyword or education level."
                : "Our shelves are waiting for their next chapter. New books will appear here as our team adds them to the library."}
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-[#193E32] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#276B56]"
              >
                View All Books
              </button>
            )}
          </div>
        )}

        {/* Real database books */}
        {!loading && !error && sortedBooks.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedBooks.map((book) => (
              <BookCard key={book._id} book={book} onRequest={setRequestBook} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#E5EAE2] bg-white px-5 py-4 sm:flex-row">
            <p className="text-xs font-medium text-slate-500">
              Page{" "}
              <span className="font-bold text-[#193E32]">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#193E32]">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => {
                  setPage((previous) => previous - 1);
                }}
                className="inline-flex items-center gap-1 rounded-xl border border-[#E5EAE2] px-4 py-2.5 text-xs font-bold text-[#193E32] transition hover:bg-[#E7EEE5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => {
                  setPage((previous) => previous + 1);
                }}
                className="inline-flex items-center gap-1 rounded-xl bg-[#193E32] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#276B56] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ===================================================== */}
      {/* CLOSING BANNER */}
      {/* ===================================================== */}

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[30px] bg-[#193E32] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border-[40px] border-white/5" />

          <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full border-[40px] border-[#E8A94A]/10" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#E8A94A]">
              <BookOpen className="h-7 w-7" />
            </div>

            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Knowledge Deserves to Be Shared.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
              Every restored book represents another opportunity
              for someone to learn, discover, and grow. Together,
              we're building a brighter future, one page at a time.
            </p>

            <a
              href="/programs/donate-books"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8A94A] px-7 py-3.5 text-sm font-bold text-[#193E32] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#F2BC68] hover:shadow-xl"
            >
              Donate Books
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
      {requestBook && (
        <BookRequestDialog
          key={requestBook._id}
          book={requestBook}
          onClose={() => setRequestBook(null)}
          onSubmitted={refreshBooks}
        />
      )}
    </div>
  );
}