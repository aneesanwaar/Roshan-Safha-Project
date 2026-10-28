import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Search,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';

import { api } from '../services/api';

const CATEGORIES = [
  { label: 'All Stories', value: 'All' },
  { label: 'Impact Stories', value: 'Impact Story' },
  { label: 'Event Recaps', value: 'Event Recap' },
  { label: 'Winners', value: 'Winner Announcement' },
  { label: 'Collaborations', value: 'Collaboration' },
  { label: 'General Updates', value: 'General Update' },
];

const CATEGORY_ALIASES = {
  'Winner Announcements': 'Winner Announcement',
  'Event Recaps': 'Event Recap',
  'Impact Stories': 'Impact Story',
  Collaborations: 'Collaboration',
  'General Updates': 'General Update',
};

function normalizeCategory(category) {
  return CATEGORY_ALIASES[category] || category || 'General Update';
}

function formatDate(value) {
  if (!value) return 'Date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getExcerpt(item) {
  const text = (item.excerpt || item.content || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= 145) {
    return text;
  }

  return `${text.slice(0, 145).trimEnd()}...`;
}

function AnnouncementCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const image = item.featuredImage || item.imageUrl;
  const category = normalizeCategory(item.category);

  const announcementUrl = `${window.location.origin}/announcements${item.slug ? `?story=${encodeURIComponent(item.slug)}` : ''
    }`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: getExcerpt(item),
          url: announcementUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(announcementUrl);

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Unable to share announcement:', error);
      }
    }
  };

  return (
    <article
      id={item.slug ? `story-${item.slug}` : undefined}
      className="
        group flex flex-col overflow-hidden
        rounded-[24px] border border-[#E5EAE3]
        bg-white shadow-[0_8px_28px_rgba(25,62,50,0.045)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_42px_rgba(25,62,50,0.10)]
      "
    >
      {/* Image */}
      <div className="relative h-[210px] overflow-hidden bg-[#E7EEE5] sm:h-[225px]">
        {image ? (
          <img
            src={image}
            alt={item.title}
            loading="lazy"
            className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-[1.04]
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Bell className="h-12 w-12 text-[#276B56]/30" />
          </div>
        )}

        <span
          className="
            absolute bottom-4 left-4 rounded-full
            border border-white/60 bg-white/95
            px-3 py-1.5 text-[11px] font-bold
            text-[#193E32] shadow-sm backdrop-blur
          "
        >
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[#718076]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(item.publishAt || item.date || item.createdAt)}
          </span>

          <span className="h-1 w-1 rounded-full bg-[#B6C3B8]" />

          <span className="truncate">
            {item.author || 'Roshan Safha Team'}
          </span>
        </div>

        <h2
          className="
            mb-3 font-serif text-[22px] font-bold
            leading-snug tracking-tight text-[#193E32]
          "
        >
          {item.title}
        </h2>

        <p className="mb-5 text-sm leading-7 text-[#69766C]">
          {getExcerpt(item)}
        </p>

        {expanded && (
          <div
            className="
              mb-5 whitespace-pre-line border-t
              border-[#EDF0EA] pt-4
              text-sm leading-7 text-[#4C5D52]
            "
          >
            {item.content || 'No additional details available.'}
          </div>
        )}

        {/* Actions */}
        <div
          className="
            mt-auto flex items-center justify-between
            gap-3 border-t border-[#EDF0EA] pt-4
          "
        >
          <button
            type="button"
            onClick={() => setExpanded((previous) => !previous)}
            aria-expanded={expanded}
            className="
              inline-flex items-center gap-2
              text-sm font-bold text-[#276B56]
              transition hover:text-[#193E32]
            "
          >
            {expanded ? 'Show Less' : 'Read Full Story'}

            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            title={copied ? 'Link copied' : 'Share announcement'}
            aria-label={copied ? 'Link copied' : 'Share announcement'}
            className="
              inline-flex h-9 w-9 items-center
              justify-center rounded-full
              bg-[#F1F5EF] text-[#276B56]
              transition hover:bg-[#E2ECE3]
            "
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function AnnouncementSkeleton() {
  return (
    <div
      className="
        overflow-hidden rounded-[24px]
        border border-[#E5EAE3] bg-white
      "
    >
      <div className="h-[210px] animate-pulse bg-[#E7EEE5]" />

      <div className="space-y-4 p-6">
        <div className="h-3 w-36 animate-pulse rounded bg-[#E7EEE5]" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-[#E7EEE5]" />
        <div className="h-3 w-full animate-pulse rounded bg-[#E7EEE5]" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-[#E7EEE5]" />
      </div>
    </div>
  );
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let active = true;

    async function loadAnnouncements() {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/announcements');

        const payload = response.data;

        const items = Array.isArray(payload)
          ? payload
          : payload?.announcements || payload?.data || [];

        if (active) {
          setAnnouncements(Array.isArray(items) ? items : []);
        }
      } catch (err) {
        console.error('Failed to load announcements:', err);

        if (active) {
          setError('We could not load announcements right now.');
          setAnnouncements([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnnouncements();

    return () => {
      active = false;
    };
  }, []);

  const filteredAnnouncements = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return announcements
      .filter((item) => {
        const category = normalizeCategory(item.category);

        const matchesCategory =
          selectedCategory === 'All' ||
          category === selectedCategory;

        const searchableText = [
          item.title,
          item.excerpt,
          item.content,
          item.category,
          item.author,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const matchesSearch =
          !keyword || searchableText.includes(keyword);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.publishAt || a.date || a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.publishAt || b.date || b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      });
  }, [announcements, searchTerm, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <main className="min-h-screen bg-[#FFF9EF]">
      {/* Page Header */}
      <section
        className="
          relative overflow-hidden
          border-b border-[#E8E9DD]
          bg-[#F5F5E9]
        "
      >
        <div
          className="
            pointer-events-none absolute -right-24
            -top-32 h-80 w-80 rounded-full
            bg-[#DCE9DC]/60 blur-3xl
          "
        />

        <div
          className="
            relative mx-auto max-w-6xl
            px-4 py-14 text-center
            sm:px-6 sm:py-16 lg:px-8
          "
        >


          <h1
            className="
              font-serif text-4xl font-bold
              tracking-tight text-[#193E32]
              sm:text-5xl
            "
          >
            Stories That Inspire
            <span className="block text-[#276B56]">
              Change
            </span>
          </h1>

          <p
            className="
              mx-auto mt-5 max-w-2xl
              text-sm leading-7 text-[#657568]
              sm:text-base
            "
          >
            Explore the latest updates, community achievements,
            literacy initiatives, and inspiring moments from
            the Roshan Safha journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section
        className="
          mx-auto max-w-6xl
          px-4 py-10 sm:px-6 lg:px-8
        "
      >
        {/* Search and Filters */}
        <div
          className="
            mb-9 rounded-[22px]
            border border-[#E5EAE3]
            bg-white p-4 shadow-sm
            sm:p-5
          "
        >
          <div className="relative">
            <Search
              className="
                absolute left-4 top-1/2
                h-4 w-4 -translate-y-1/2
                text-[#8A988C]
              "
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              placeholder="Search stories, events, and updates..."
              className="
                w-full rounded-xl border
                border-[#E1E8DF] bg-[#FAFCF9]
                py-3 pl-11 pr-4 text-sm
                text-[#193E32] outline-none
                transition placeholder:text-[#9AA79A]
                focus:border-[#276B56]
                focus:ring-2 focus:ring-[#276B56]/10
              "
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category.value;

              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.value);
                  }}
                  className={`
                    rounded-full px-4 py-2
                    text-xs font-semibold transition
                    ${active
                      ? 'bg-[#193E32] text-white shadow-sm'
                      : 'bg-[#F1F5EF] text-[#5C705F] hover:bg-[#E4ECE3]'
                    }
                  `}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Heading */}
        <div
          className="
            mb-6 flex flex-wrap items-center
            justify-between gap-3
          "
        >
          <div>
            <p
              className="
                mb-1 text-[11px] font-bold
                uppercase tracking-[0.2em]
                text-[#C58D36]
              "
            >
              Community Journal
            </p>

            <h2
              className="
                font-serif text-2xl font-bold
                text-[#193E32]
              "
            >
              Latest Announcements
            </h2>
          </div>

          {!loading && !error && (
            <span
              className="
                rounded-full border border-[#DDE8DC]
                bg-[#F1F6EF] px-4 py-2
                text-xs font-semibold text-[#276B56]
              "
            >
              {filteredAnnouncements.length}{' '}
              {filteredAnnouncements.length === 1
                ? 'Story'
                : 'Stories'}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((number) => (
              <AnnouncementSkeleton key={number} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="
              rounded-3xl border border-red-100
              bg-white px-6 py-14 text-center
            "
          >
            <Bell className="mx-auto mb-4 h-10 w-10 text-red-300" />

            <h3 className="text-lg font-bold text-[#193E32]">
              Unable to load announcements
            </h3>

            <p className="mt-2 text-sm text-[#718076]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                mt-5 rounded-xl bg-[#193E32]
                px-5 py-2.5 text-sm font-bold
                text-white transition hover:bg-[#276B56]
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          filteredAnnouncements.length === 0 && (
            <div
              className="
                rounded-3xl border border-[#E5EAE3]
                bg-white px-6 py-16 text-center
              "
            >
              <Bell
                className="
                  mx-auto mb-4 h-12 w-12
                  text-[#A5B9A8]
                "
              />

              <h3 className="text-lg font-bold text-[#193E32]">
                No announcements found
              </h3>

              <p className="mt-2 text-sm text-[#718076]">
                Try a different keyword or category.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="
                  mt-5 inline-flex items-center
                  gap-2 rounded-xl bg-[#193E32]
                  px-5 py-2.5 text-sm font-bold
                  text-white transition hover:bg-[#276B56]
                "
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          )}

        {/* Announcement Grid */}
        {!loading &&
          !error &&
          filteredAnnouncements.length > 0 && (
            <div className="grid items-start gap-6 md:grid-cols-2">
              {filteredAnnouncements.map((item) => (
                <AnnouncementCard
                  key={item._id || item.slug}
                  item={item}
                />
              ))}
            </div>
          )}
      </section>
    </main>
  );
}