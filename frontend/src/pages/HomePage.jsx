import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BookMarked,
  CalendarDays,
  Heart,
  MapPin,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';

import { getPublicPageContent } from '../services/api';

/*
 * Roshan Safha Homepage
 *
 * Integrations:
 * - Existing public CMS endpoint: /api/admin/cms/home
 * - Existing public announcements endpoint: /api/announcements
 *
 * Images:
 * - Automatically discovered from frontend/src/assets
 * - Prefer descriptive filenames for predictable placement
 *
 * Important:
 * - No invented impact statistics
 * - No invented upcoming events
 * - No private registration data displayed
 */

const DEFAULT_HOME_CONTENT = {
  heroHeadline: 'Second Chances for Everyone & Everything.',
  heroSubtext:
    'Giving books a second life, encouraging young voices, and creating more opportunities to learn across Azad Jammu & Kashmir.',
  impactBooks: '',
  impactStudents: '',
  impactSchools: '',
};

const IMAGE_MODULES = import.meta.glob(
  '../assets/**/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
);

const AVAILABLE_IMAGES = Object.entries(IMAGE_MODULES)
  .map(([path, url]) => ({
    path: path.toLowerCase(),
    url,
  }))
  .filter((image) => typeof image.url === 'string');

const IMAGE_KEYWORDS = {
  hero: [
    'hero',
    'children',
    'students',
    'community',
    'activity',
    'group',
    'reading',
  ],
  books: [
    'restoration',
    'restore',
    'repaired',
    'repair',
    'books',
    'book',
    'donation',
    'before',
    'after',
  ],
  essays: [
    'essay',
    'winner',
    'certificate',
    'competition',
    'award',
    'ceremony',
  ],
  summer: [
    'summer',
    'circle',
    'workshop',
    'sdg',
    'session',
    'learning',
  ],
  story: [
    'children',
    'students',
    'community',
    'reading',
    'activity',
    'group',
  ],
};

function scoreImage(path, keywords) {
  return keywords.reduce((score, keyword, index) => {
    if (!path.includes(keyword)) return score;
    return score + (keywords.length - index) * 10;
  }, 0);
}

function findImage(keywords, excludedUrls = []) {
  const candidates = AVAILABLE_IMAGES
    .filter((image) => !excludedUrls.includes(image.url))
    .map((image) => ({
      ...image,
      score: scoreImage(image.path, keywords),
    }))
    .sort((a, b) => b.score - a.score);

  return candidates.find((image) => image.score > 0)?.url || null;
}

function getImageCollection() {
  const used = [];

  const choose = (keywords) => {
    const image = findImage(keywords, used);

    if (image) {
      used.push(image);
    }

    return image;
  };

  return {
    hero: choose(IMAGE_KEYWORDS.hero),
    books: choose(IMAGE_KEYWORDS.books),
    essays: choose(IMAGE_KEYWORDS.essays),
    summer: choose(IMAGE_KEYWORDS.summer),
    story: choose(IMAGE_KEYWORDS.story),
  };
}

function safeText(value, fallback = '') {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : fallback;
}

/**
 * Accepts a CMS image reference only when it has a valid
 * HTTPS Cloudinary URL.
 *
 * Local images remain the fallback when no CMS image exists.
 */
function getCmsImageUrl(imageReference) {
  if (
    !imageReference ||
    typeof imageReference !== 'object' ||
    Array.isArray(imageReference)
  ) {
    return null;
  }

  const url = imageReference.url;

  if (typeof url !== 'string' || !url.trim()) {
    return null;
  }

  try {
    const parsedUrl = new URL(url.trim());

    if (
      parsedUrl.protocol !== 'https:' ||
      parsedUrl.hostname !== 'res.cloudinary.com'
    ) {
      return null;
    }

    if (!parsedUrl.pathname.startsWith('/')) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

function safeStatistic(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 0 ? String(value) : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const cleaned = value.trim();

  if (!cleaned || cleaned === '0') {
    return null;
  }

  /*
   * These values existed as unverified frontend defaults.
   * Do not display them until independently confirmed.
   */
  const unverifiedDefaults = ['1,450+', '3,800+', '52+'];

  if (unverifiedDefaults.includes(cleaned)) {
    return null;
  }

  return cleaned;
}

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-PK', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function truncateText(value, limit = 135) {
  if (typeof value !== 'string') return '';

  const plainText = value.replace(/<[^>]*>/g, '').trim();

  if (plainText.length <= limit) {
    return plainText;
  }

  return `${plainText.slice(0, limit).trimEnd()}…`;
}

function SectionLabel({ children, light = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] ${light ? 'text-[#F1C77F]' : 'text-[#276B56]'
        }`}
    >
      <span
        className={`h-[2px] w-6 ${light ? 'bg-[#E8A94A]' : 'bg-[#E8A94A]'
          }`}
      />
      {children}
    </span>
  );
}

function ImagePlaceholder({ icon: Icon = BookOpen, label, className = '' }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-[#E7EEE5] p-8 text-center text-[#276B56] ${className}`}
    >
      <Icon className="h-11 w-11 opacity-70" strokeWidth={1.4} />
      {label && (
        <span className="max-w-[220px] text-xs font-semibold tracking-wide opacity-75">
          {label}
        </span>
      )}
    </div>
  );
}

function ProgramCard({
  number,
  title,
  description,
  image,
  icon: Icon,
  link,
  linkText,
  imageAlt,
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#E5E5DF] bg-white shadow-[0_10px_35px_rgba(25,62,50,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(25,62,50,0.11)]">
      <div className="relative h-56 overflow-hidden bg-[#E7EEE5] sm:h-64">
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder icon={Icon} label="Roshan Safha initiative" />
        )}

        <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#193E32] shadow-sm">
          {number}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E7EEE5] text-[#276B56]">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>

        <h3
          className="mb-3 text-[23px] font-bold leading-tight text-[#193E32]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h3>

        <p className="mb-7 flex-1 text-sm leading-7 text-[#6B706C]">
          {description}
        </p>

        <Link
          to={link}
          className="inline-flex w-fit items-center gap-2 border-b border-[#E8A94A] pb-1 text-sm font-bold text-[#276B56] transition-all hover:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#276B56]"
        >
          {linkText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function AnnouncementCard({ announcement }) {
  const title = safeText(announcement?.title, 'Roshan Safha Update');
  const category = safeText(announcement?.category, 'General Update');
  const description = truncateText(announcement?.content);
  const date = formatDate(
    announcement?.date || announcement?.createdAt
  );

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#E9E8E2] bg-white p-6 transition-shadow hover:shadow-[0_14px_35px_rgba(25,62,50,0.08)]">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#E7EEE5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#276B56]">
          {category}
        </span>

        {date && (
          <span className="inline-flex items-center gap-1.5 text-xs text-[#7D817C]">
            <CalendarDays className="h-3.5 w-3.5" />
            {date}
          </span>
        )}
      </div>

      <h3
        className="mb-3 text-xl font-bold leading-snug text-[#193E32]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h3>

      {description && (
        <p className="line-clamp-4 flex-1 text-sm leading-7 text-[#6B706C]">
          {description}
        </p>
      )}

      <div className="mt-6 flex items-center gap-2 border-t border-[#F0EFE9] pt-4 text-xs font-semibold text-[#276B56]">
        <Sparkles className="h-4 w-4 text-[#E8A94A]" />
        Latest from our community
      </div>
    </article>
  );
}

export default function HomePage() {
  const [content, setContent] = useState(DEFAULT_HOME_CONTENT);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  const fallbackImages = useMemo(() => getImageCollection(), []);

  const images = useMemo(() => {
    const cmsImages =
      content.images &&
        typeof content.images === 'object' &&
        !Array.isArray(content.images)
        ? content.images
        : {};

    return {
      hero: getCmsImageUrl(cmsImages.hero) || fallbackImages.hero,

      books: getCmsImageUrl(cmsImages.books) || fallbackImages.books,

      essays: getCmsImageUrl(cmsImages.essays) || fallbackImages.essays,

      summer: getCmsImageUrl(cmsImages.summer) || fallbackImages.summer,

      story: getCmsImageUrl(cmsImages.story) || fallbackImages.story,
    };
  }, [content.images, fallbackImages]);

  useEffect(() => {
    let active = true;

    const loadHomeContent = async () => {
      try {
        const response = await getPublicPageContent('home');
        const cmsContent = response.data?.content;

        if (
          active &&
          response.data?.success &&
          cmsContent &&
          typeof cmsContent === 'object' &&
          !Array.isArray(cmsContent)
        ) {
          setContent({
            ...DEFAULT_HOME_CONTENT,
            ...cmsContent,
          });
        }
      } catch (error) {
        console.warn(
          '[HomePage] CMS unavailable; using safe default content.'
        );
      }
    };

    loadHomeContent();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadAnnouncements = async () => {
      try {
        const baseUrl =
          import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        const response = await fetch(
          `${baseUrl.replace(/\/$/, '')}/announcements`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Announcements request failed: ${response.status}`);
        }

        const data = await response.json();

        if (active && Array.isArray(data)) {
          setAnnouncements(data.slice(0, 3));
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('[HomePage] Announcements unavailable.');
        }
      } finally {
        if (active) {
          setAnnouncementsLoading(false);
        }
      }
    };

    loadAnnouncements();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const heroHeadline = safeText(
    content.heroHeadline,
    DEFAULT_HOME_CONTENT.heroHeadline
  );

  const heroSubtext = safeText(
    content.heroSubtext,
    DEFAULT_HOME_CONTENT.heroSubtext
  );

  const impactStats = [
    {
      value: safeStatistic(content.impactBooks),
      label: 'Books Restored',
    },
    {
      value: safeStatistic(content.impactStudents),
      label: 'Students Reached',
    },
    {
      value: safeStatistic(content.impactSchools),
      label: 'Partner Institutions',
    },
  ].filter((stat) => stat.value);

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF9EF] text-[#193E32] selection:bg-[#E8A94A]/30">
      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute -right-28 top-0 h-80 w-80 rounded-full bg-[#F3D8A7]/30 blur-3xl" />

        <div className="rs-container relative grid items-center gap-12 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-[1.03fr_0.97fr] lg:gap-14 lg:pb-24 lg:pt-20">
          <div className="relative z-10 max-w-[660px]">
            <SectionLabel>
              A youth-led educational initiative
            </SectionLabel>

            <h1
              className="mt-6 text-[clamp(2.8rem,5.6vw,5.6rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#193E32]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {heroHeadline}
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#646D65] sm:text-lg">
              {heroSubtext}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/programs/donate-books"
                className="rs-btn-primary inline-flex items-center justify-center gap-2"
              >
                Give a Book New Life
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                to="/about"
                className="rs-btn-outline inline-flex items-center justify-center gap-2"
              >
                Discover Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#DDE2D8] pt-6 text-xs font-semibold text-[#617165]">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#276B56]" />
                Muzaffarabad, AJK
              </span>

              <span className="inline-flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#E8A94A]" />
                Community-powered
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[580px] lg:mx-0">
            <div className="absolute -left-5 -top-5 h-32 w-32 rounded-[30px] bg-[#E8A94A]/30 sm:-left-7 sm:-top-7" />

            <div className="absolute -bottom-5 -right-5 h-40 w-40 rounded-[30px] bg-[#276B56]/15 sm:-bottom-7 sm:-right-7" />

            <div className="relative aspect-[5/5.1] overflow-hidden rounded-[34px] bg-[#E7EEE5] shadow-[0_24px_60px_rgba(25,62,50,0.15)] sm:aspect-[5/4.7]">
              {images.hero ? (
                <img
                  src={images.hero}
                  alt="Roshan Safha community educational activity"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlaceholder
                  icon={BookOpen}
                  label="Every page deserves another chance."
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#102D24]/45 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-auto sm:max-w-[270px] sm:p-5">
                <div className="mb-2 flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-[#276B56]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#276B56]">
                    Our belief
                  </span>
                </div>

                <p
                  className="text-base font-bold leading-snug text-[#193E32]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  A book's story doesn't end with its first reader.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-y border-[#E7E8DE] bg-white">
        <div className="rs-container grid gap-8 py-16 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-20">
          <div>
            <SectionLabel>Why we exist</SectionLabel>

            <h2
              className="mt-5 text-3xl font-bold leading-tight tracking-tight text-[#193E32] sm:text-4xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Small acts.
              <br />
              Lasting possibilities.
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-[#646D65] sm:text-lg">
              At Roshan Safha, we believe educational resources should
              continue creating opportunities long after their first use.
              Through book restoration, creative writing, and
              community-led learning, we help young people discover
              what is possible.
            </p>

            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#276B56] transition-all hover:gap-3"
            >
              Learn about our mission
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* VERIFIED IMPACT ONLY */}
      {impactStats.length > 0 && (
        <section className="bg-[#193E32]">
          <div className="rs-container py-14 sm:py-16">
            <div className="mb-9 text-center">
              <SectionLabel light>Our impact</SectionLabel>

              <h2
                className="mt-4 text-3xl font-bold text-white sm:text-4xl"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
              </h2>
            </div>

            <div
              className={`grid gap-6 text-center ${impactStats.length === 3
                ? 'sm:grid-cols-3'
                : impactStats.length === 2
                  ? 'sm:grid-cols-2'
                  : 'grid-cols-1'
                }`}
            >
              {impactStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-8"
                >
                  <div className="text-4xl font-bold tracking-tight text-[#E8A94A] sm:text-5xl">
                    {stat.value}
                  </div>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/75">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROGRAMS */}
      <section className="rs-container py-20 sm:py-24">
        <div className="mb-11 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[660px]">
            <SectionLabel>Our programs</SectionLabel>

            <h2
              className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[#193E32] sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Three ways to make
              <br className="hidden sm:block" /> a difference.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[#69736A]">
            From restoring well-loved books to encouraging new ideas,
            our programs bring learning opportunities closer to the
            communities we serve.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-7">
          <ProgramCard
            number="01 / RESTORE"
            title="Book Restoration & Donation"
            description="Give used books another chapter. We collect, repair, and help recirculate educational resources so more learners can benefit from them."
            image={images.books}
            imageAlt="Books collected or restored through Roshan Safha"
            icon={BookOpen}
            link="/programs/donate-books"
            linkText="Donate your books"
          />

          <ProgramCard
            number="02 / EXPRESS"
            title="Essay Competitions"
            description="Encouraging young people to explore ideas, develop their voices, and build confidence through thoughtful writing and creative expression."
            image={images.essays}
            imageAlt="Roshan Safha essay competition or award activity"
            icon={Trophy}
            link="/programs/essays"
            linkText="Explore competitions"
          />

          <ProgramCard
            number="03 / CONNECT"
            title="SDGs Summer Circle"
            description="A space for young minds to learn together, discuss sustainable development, and turn curiosity into meaningful community action."
            image={images.summer}
            imageAlt="Roshan Safha Summer Circle learning activity"
            icon={Users}
            link="/programs/summer-circle"
            linkText="Discover Summer Circle"
          />
        </div>

        <div className="mt-9 text-center">
          <Link
            to="/programs/book-catalog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#276B56] transition-all hover:gap-3"
          >
            Browse the book catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* PHOTOGRAPHIC STORY */}
      <section className="bg-[#E7EEE5]">
        <div className="rs-container grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="relative">
            <div className="aspect-[5/4] overflow-hidden rounded-[30px] bg-[#D5E1D7] shadow-[0_18px_45px_rgba(25,62,50,0.09)]">
              {images.story || images.books ? (
                <img
                  src={images.story || images.books}
                  alt="Roshan Safha educational outreach and community activities"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlaceholder
                  icon={Heart}
                  label="Community learning and shared opportunity"
                />
              )}
            </div>

            <div className="absolute -bottom-5 -right-3 rounded-2xl bg-[#E8A94A] px-5 py-4 shadow-lg sm:-right-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#3D2415]">
                Rooted in community
              </p>
              <p className="mt-1 text-sm font-semibold text-[#3D2415]">
                Growing through shared effort
              </p>
            </div>
          </div>

          <div className="pt-4 lg:pt-0">
            <SectionLabel>More than books</SectionLabel>

            <h2
              className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[#193E32] sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              A brighter future begins with access.
            </h2>

            <p className="mt-6 text-base leading-8 text-[#58695D]">
              A restored textbook can support another student. A writing
              competition can encourage a new perspective. A learning
              circle can bring young people together around ideas that
              matter.
            </p>

            <p className="mt-4 text-base leading-8 text-[#58695D]">
              Each initiative reflects a simple belief: everyone
              deserves the opportunity to learn, contribute, and grow.
            </p>

            <Link
              to="/get-involved"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#276B56] transition-all hover:gap-3"
            >
              Find your way to contribute
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      {(announcementsLoading || announcements.length > 0) && (
        <section className="rs-container py-20 sm:py-24">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>News & stories</SectionLabel>

              <h2
                className="mt-5 text-4xl font-bold tracking-tight text-[#193E32] sm:text-5xl"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Latest from Roshan Safha.
              </h2>
            </div>

            <Link
              to="/announcements"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#276B56] transition-all hover:gap-3"
            >
              All announcements
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {announcementsLoading ? (
            <div
              className="grid gap-6 md:grid-cols-3"
              aria-label="Loading announcements"
              aria-busy="true"
            >
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl bg-[#E7EEE5]"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement._id}
                  announcement={announcement}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* FINAL CTA */}
      <section className="rs-container pb-20 sm:pb-24">
        <div className="relative overflow-hidden rounded-[30px] bg-[#193E32] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border-[55px] border-[#E8A94A]/10" />
          <div className="pointer-events-none absolute -bottom-36 right-20 h-80 w-80 rounded-full border-[55px] border-white/5" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <SectionLabel light>Be part of the story</SectionLabel>

              <h2
                className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Your time can help turn
                <br className="hidden sm:block" /> another page.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                Join a community of people who believe in sharing
                knowledge, restoring resources, and creating
                opportunities for young learners.
              </p>
            </div>

            <Link
              to="/get-involved"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#E8A94A] px-7 py-4 text-sm font-bold text-[#3D2415] transition-colors hover:bg-[#F3BF6C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Become a Volunteer
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}