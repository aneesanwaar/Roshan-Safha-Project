import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Eye,
  Heart,
  HeartHandshake,
  Leaf,
  Quote,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { getPublicPageContent } from "../services/api";

/* ==========================================
   DEFAULT ABOUT CONTENT
   Existing CMS fields are preserved.
========================================== */

const DEFAULT_ABOUT_CONTENT = {
  heroTitle: "Rooted in Local Literacy and Action",
  missionBody:
    "To bridge book accessibility disparities across regional communities by restoring textbooks, creating sustainable local mini-libraries, and supporting student literacy across Azad Jammu and Kashmir.",
  visionStatement:
    "A sustainable network of restored community reading libraries where every curious child, student, and educator has immediate access to rich, mind-expanding literature.",

  // Future Admin Dashboard fields
  founderName: "",
  founderRole: "Founder, Roshan Safha",
  founderBio: "",
  founderImage: "",
};

/*
 * Temporary image for layout demonstration.
 * Replace with the client's photograph or CMS image later.
 */
const TEMP_FOUNDER_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85";

/* ==========================================
   SMALL REUSABLE COMPONENTS
========================================== */

function SectionLabel({ children, light = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] ${
        light ? "text-[#F1C77F]" : "text-[#276B56]"
      }`}
    >
      <span className="h-[2px] w-6 bg-[#E8A94A]" />
      {children}
    </span>
  );
}

function ValueCard({ icon: Icon, title, description }) {
  return (
    <article className="group rounded-[24px] border border-[#E5E8E0] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(25,62,50,0.08)] sm:p-8">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7EEE5] text-[#276B56] transition-colors group-hover:bg-[#276B56] group-hover:text-white">
        <Icon size={23} strokeWidth={1.8} />
      </div>

      <h3
        className="mb-3 text-[22px] font-bold text-[#193E32]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h3>

      <p className="text-sm leading-7 text-[#646D65]">{description}</p>
    </article>
  );
}

/* ==========================================
   ABOUT PAGE
========================================== */

function AboutPage() {
  const [content, setContent] = useState(DEFAULT_ABOUT_CONTENT);

  useEffect(() => {
    let active = true;

    const fetchAboutCms = async () => {
      try {
        const res = await getPublicPageContent("about");

        const cmsContent = res.data?.content;

        if (
          active &&
          res.data?.success === true &&
          cmsContent &&
          typeof cmsContent === "object" &&
          !Array.isArray(cmsContent)
        ) {
          setContent({
            ...DEFAULT_ABOUT_CONTENT,
            ...cmsContent,
          });
        }
      } catch (error) {
        console.warn(
          "[AboutPage] CMS unavailable; using default About content."
        );
      }
    };

    fetchAboutCms();

    return () => {
      active = false;
    };
  }, []);

  const founderName =
    typeof content.founderName === "string" && content.founderName.trim()
      ? content.founderName.trim()
      : "Meet the Founder";

  const founderRole =
    typeof content.founderRole === "string" && content.founderRole.trim()
      ? content.founderRole.trim()
      : "Founder, Roshan Safha";

  const founderBio =
    typeof content.founderBio === "string" && content.founderBio.trim()
      ? content.founderBio.trim()
      : "Roshan Safha was built around a simple idea: books deserve another chapter, and young people deserve more opportunities to learn. We look forward to sharing the founder's personal story and vision here.";

  const founderImage =
    typeof content.founderImage === "string" &&
    /^https:\/\//i.test(content.founderImage.trim())
      ? content.founderImage.trim()
      : TEMP_FOUNDER_IMAGE;

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF9EF] text-[#193E32]">
      {/* ======================================
          HERO SECTION
      ====================================== */}

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-28 top-0 h-80 w-80 rounded-full bg-[#F3D8A7]/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#DDE9DC]/60 blur-3xl" />

        <div className="rs-container relative py-20 text-center sm:py-24 lg:py-28">
          <SectionLabel>Who we are</SectionLabel>

          <h1
            className="mx-auto mt-6 max-w-4xl text-[clamp(2.7rem,5.5vw,5.2rem)] font-bold leading-[1.1] tracking-[-0.045em] text-[#193E32]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {content.heroTitle}
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#646D65] sm:text-lg">
            Founded on the belief that no valuable book should go to waste
            and no eager reader should be left without the opportunity to
            learn.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/programs/donate-books#donation-form"
              className="rs-btn-primary inline-flex items-center justify-center gap-2"
            >
              Support Our Mission
              <ArrowUpRight size={17} />
            </Link>

            <a
              href="#our-story"
              className="rs-btn-outline inline-flex items-center justify-center gap-2"
            >
              Explore Our Story
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* ======================================
          OUR STORY
      ====================================== */}

      <section
        id="our-story"
        className="border-y border-[#E7E8DE] bg-white"
      >
        <div className="rs-container grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionLabel>Our story</SectionLabel>

            <h2
              className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Every book deserves
              <br />
              another chapter.
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-[#646D65] sm:text-lg">
              Roshan Safha is a community-driven educational initiative
              focused on extending the life of books and expanding access
              to learning opportunities.
            </p>

            <p className="mt-5 text-base leading-8 text-[#646D65]">
              Through book restoration, educational activities, essay
              competitions, and youth participation, we aim to create
              meaningful opportunities for learners across Azad Jammu
              and Kashmir.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================
          MISSION AND VISION
      ====================================== */}

      <section className="rs-container py-20 sm:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <SectionLabel>Our guiding principles</SectionLabel>

          <h2
            className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Purpose in every page.
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#69736A] sm:text-base">
            Our mission and vision guide how we support education,
            restore resources, and strengthen our communities.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          {/* MISSION */}

          <article className="group flex h-full flex-col rounded-[28px] border border-[#E4E9DF] bg-white p-8 shadow-[0_10px_35px_rgba(25,62,50,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(25,62,50,0.1)] sm:p-10">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7EEE5] text-[#276B56]">
              <Target size={27} strokeWidth={1.8} />
            </div>

            <h3
              className="mb-5 text-3xl font-bold text-[#193E32]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Our Mission
            </h3>

            <p className="flex-1 text-base leading-8 text-[#646D65]">
              {content.missionBody}
            </p>

            <div className="mt-8 flex items-center gap-2 border-t border-[#E8EDE5] pt-6 text-xs font-bold uppercase tracking-[0.1em] text-[#276B56]">
              <HeartHandshake size={18} />
              Community-powered literacy
            </div>
          </article>

          {/* VISION */}

          <article className="group flex h-full flex-col rounded-[28px] border border-[#EAE4D7] bg-[#FFFCF6] p-8 shadow-[0_10px_35px_rgba(25,62,50,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(25,62,50,0.1)] sm:p-10">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF1D9] text-[#B77A26]">
              <Eye size={27} strokeWidth={1.8} />
            </div>

            <h3
              className="mb-5 text-3xl font-bold text-[#193E32]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Our Vision
            </h3>

            <p className="flex-1 text-base leading-8 text-[#646D65]">
              {content.visionStatement}
            </p>

            <div className="mt-8 flex items-center gap-2 border-t border-[#EAE4D7] pt-6 text-xs font-bold uppercase tracking-[0.1em] text-[#B77A26]">
              <Sparkles size={18} />
              A brighter academic future
            </div>
          </article>
        </div>
      </section>

      {/* ======================================
          FOUNDER SECTION
          Placeholder content until client
          provides verified details.
      ====================================== */}

      <section className="bg-[#E7EEE5]">
        <div className="rs-container grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-20">
          {/* FOUNDER PHOTO */}

          <div className="relative mx-auto w-full max-w-[530px] lg:mx-0">
            <div className="absolute -left-5 -top-5 h-32 w-32 rounded-[30px] bg-[#E8A94A]/35" />

            <div className="absolute -bottom-5 -right-5 h-36 w-36 rounded-[30px] bg-[#276B56]/20" />

            <div className="relative aspect-[4/4.5] overflow-hidden rounded-[32px] bg-[#D5E1D7] shadow-[0_24px_55px_rgba(25,62,50,0.13)]">
              <img
                src={founderImage}
                alt={
                  content.founderName
                    ? `Portrait of ${content.founderName}`
                    : "Temporary founder portrait placeholder"
                }
                loading="lazy"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#102D24]/40 via-transparent to-transparent" />

              {/* {!content.founderImage && (
                <div className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-[11px] font-bold text-[#193E32] shadow-sm">
                  Temporary photograph
                </div>
              )} */}
            </div>
          </div>

          {/* FOUNDER CONTENT */}

          <div>
            <SectionLabel>Behind the initiative</SectionLabel>

            <h2
              className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              A vision rooted
              <br />
              in community.
            </h2>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-10 bg-[#E8A94A]" />

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#276B56]">
                Founder Spotlight
              </span>
            </div>

            <h3
              className="mt-5 text-2xl font-bold text-[#193E32] sm:text-3xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {founderName}
            </h3>

            <p className="mt-2 text-sm font-semibold text-[#B77A26]">
              {founderRole}
            </p>

            <p className="mt-6 text-base leading-8 text-[#58695D]">
              {founderBio}
            </p>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#D2DFD2] bg-white/65 p-5">
              <Quote
                size={22}
                className="mt-1 shrink-0 text-[#B77A26]"
              />

              <p className="text-sm italic leading-7 text-[#58695D]">
                The founder's personal message and background will be
                added after confirmation with the organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================
          CORE VALUES
      ====================================== */}

      <section className="rs-container py-20 sm:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <SectionLabel>What matters to us</SectionLabel>

          <h2
            className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Values that move us forward.
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#69736A] sm:text-base">
            Our work is shaped by the belief that education,
            sustainability, and community participation belong together.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <ValueCard
            icon={BookOpen}
            title="Accessible Learning"
            description="We believe books and educational opportunities should reach more learners, regardless of their circumstances."
          />

          <ValueCard
            icon={Leaf}
            title="Resource Stewardship"
            description="Restoring and recirculating books helps valuable educational resources continue serving their purpose."
          />

          <ValueCard
            icon={Users}
            title="Community Participation"
            description="We encourage young people, volunteers, and local communities to contribute to meaningful educational initiatives."
          />
        </div>
      </section>

      {/* ======================================
          CLOSING CALL TO ACTION
      ====================================== */}

      <section className="rs-container pb-20 sm:pb-24">
        <div className="relative overflow-hidden rounded-[30px] bg-[#193E32] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border-[55px] border-[#E8A94A]/10" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <SectionLabel light>Be part of our story</SectionLabel>

              <h2
                className="mt-5 text-3xl font-bold leading-tight sm:text-4xl"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                Together, we can turn
                <br className="hidden sm:block" />
                another page.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                Whether you share a book, volunteer your time, or help
                spread the word, your contribution can support more
                learning opportunities.
              </p>
            </div>

            <Link
              to="/get-involved"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#E8A94A] px-7 py-4 text-sm font-bold text-[#3D2415] transition-colors hover:bg-[#F3BF6C]"
            >
              Get Involved
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;