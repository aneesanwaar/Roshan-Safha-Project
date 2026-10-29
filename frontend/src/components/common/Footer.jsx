import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  Heart,
  BookOpen,
} from "lucide-react";

import logoImg from "../../assets/logo.png";

function InstagramIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <path d="M7 10v7" />
      <path d="M7 7v.01" />
      <path d="M11 17v-7" />
      <path d="M11 13a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

/* ==========================================
   FOOTER NAVIGATION LINKS
========================================== */

const QUICK_LINKS = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Announcements", path: "/announcements" },
  { name: "Get Involved", path: "/get-involved" },
  { name: "Contact Us", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms & Conditions", path: "/terms" },
];

const PROGRAM_LINKS = [
  { name: "Donate Books", path: "/programs/donate-books" },
  { name: "Available Books", path: "/programs/book-catalog" },
  { name: "Essay Contests", path: "/programs/essays" },
  { name: "SDGs Summer Circle", path: "/programs/summer-circle" },
];

/* ==========================================
   SOCIAL LINKS

   Replace these URLs with the organization's
   official profiles when available.
========================================== */

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/roshan_safha",
    icon: InstagramIcon,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/",
    icon: LinkedinIcon,
  },
];

/* ==========================================
   REUSABLE FOOTER LINK
========================================== */

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="
        group inline-flex items-center gap-2
        text-[13px] leading-relaxed
        text-[#D3E1D8]
        transition-colors duration-200
        hover:text-[#F3BD65]
      "
    >
      <span
        className="
          h-1 w-1 rounded-full
          bg-[#E8A94A]
          opacity-0 transition-opacity
          group-hover:opacity-100
        "
      />

      <span>{children}</span>
    </Link>
  );
}

/* ==========================================
   FOOTER COMPONENT
========================================== */

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#193E32] text-white">
      {/* Decorative background circles */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-32 -top-32
          h-[420px] w-[420px]
          rounded-full border
          border-white/5
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-16 -top-16
          h-[290px] w-[290px]
          rounded-full border
          border-white/5
        "
      />

      
      {/* ======================================
          MAIN FOOTER CONTENT
      ====================================== */}

      <div className="relative rs-container">
        <div
          className="
            grid grid-cols-1
            gap-12 py-14
            sm:grid-cols-2
            lg:grid-cols-12
            lg:gap-10 lg:py-20
          "
        >
          {/* ==================================
              BRAND COLUMN
          ================================== */}

          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              to="/"
              aria-label="Roshan Safha — Home"
              className="
                inline-flex items-center
                rounded-2xl
                bg-[#FFF9EF]
                px-4 py-3
                shadow-[0_8px_25px_rgba(0,0,0,0.08)]
                transition-transform duration-300
                hover:-translate-y-1
              "
            >
              <img
                src={logoImg}
                alt="Roshan Safha Logo"
                className="
                  h-[62px] w-auto
                  max-w-[190px]
                  object-contain
                "
              />
            </Link>

            <p
              className="
                mt-6 max-w-xs
                font-serif text-lg
                italic leading-relaxed
                text-[#F3BD65]
              "
            >
              “Because second chances are for
              everyone and everything.”
            </p>

            <p
              className="
                mt-4 max-w-xs
                text-[13px] leading-7
                text-[#D3E1D8]
              "
            >
              A community-driven initiative
              dedicated to giving books a second
              life and creating meaningful
              learning opportunities for children.
            </p>

            {/* SOCIAL ICONS */}

            <div className="mt-7 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit Roshan Safha on ${social.name}`}
                    className="
                      flex h-10 w-10
                      items-center justify-center
                      rounded-full
                      border border-white/15
                      bg-white/5
                      text-[#D3E1D8]
                      transition-all duration-200
                      hover:-translate-y-1
                      hover:border-[#E8A94A]
                      hover:bg-[#E8A94A]
                      hover:text-[#193E32]
                    "
                  >
                    <Icon size={18} strokeWidth={1.8} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* ==================================
              QUICK LINKS COLUMN
          ================================== */}

          <div className="lg:col-span-2">
            <h3
              className="
                mb-6 text-[12px]
                font-bold uppercase
                tracking-[0.16em]
                text-[#F3BD65]
              "
            >
              Explore
            </h3>

            <ul className="space-y-3.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <FooterLink to={link.path}>
                    {link.name}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ==================================
              PROGRAMS COLUMN
          ================================== */}

          <div className="lg:col-span-3">
            <h3
              className="
                mb-6 text-[12px]
                font-bold uppercase
                tracking-[0.16em]
                text-[#F3BD65]
              "
            >
              Our Programs
            </h3>

            <ul className="space-y-3.5">
              {PROGRAM_LINKS.map((link) => (
                <li key={link.path}>
                  <FooterLink to={link.path}>
                    {link.name}
                  </FooterLink>
                </li>
              ))}
            </ul>

           <Link
              to="/programs/donate-books#donation-form"
              className="
                group mt-7 inline-flex
                items-center gap-2
                text-[12px] font-bold
                text-[#F3BD65]
                transition-colors
                hover:text-white
              "
            >
              <BookOpen size={16} />

              Give a Book

              <ArrowRight
                size={15}
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>

          {/* ==================================
              CONTACT COLUMN
          ================================== */}

          <div className="lg:col-span-3">
            <h3
              className="
                mb-6 text-[12px]
                font-bold uppercase
                tracking-[0.16em]
                text-[#F3BD65]
              "
            >
              Get in Touch
            </h3>

            <ul className="space-y-5">
              {/* EMAIL */}

              <li className="flex items-start gap-3">
                <span
                  className="
                    mt-0.5 flex h-9 w-9
                    shrink-0 items-center
                    justify-center rounded-xl
                    bg-white/10 text-[#F3BD65]
                  "
                >
                  <Mail size={17} />
                </span>

                <div>
                  <p className="mb-1 text-[11px] text-[#B4C9BD]">
                    Email Us
                  </p>

                  <a
                    href="mailto:roshansafha@gmail.com"
                    className="
                      break-all text-[13px]
                      text-[#F2F7F3]
                      transition-colors
                      hover:text-[#F3BD65]
                    "
                  >
                    roshansafha@gmail.com
                  </a>
                </div>
              </li>

              {/* PHONE */}

              <li className="flex items-start gap-3">
                <span
                  className="
                    mt-0.5 flex h-9 w-9
                    shrink-0 items-center
                    justify-center rounded-xl
                    bg-white/10 text-[#F3BD65]
                  "
                >
                  <Phone size={17} />
                </span>

                <div>
                  <p className="mb-1 text-[11px] text-[#B4C9BD]">
                    Call Us
                  </p>

                  <a
                    href="tel:+923005966967"
                    className="
                      text-[13px] text-[#F2F7F3]
                      transition-colors
                      hover:text-[#F3BD65]
                    "
                  >
                    +92 300 5966967
                  </a>
                </div>
              </li>

              {/* LOCATION */}

              <li className="flex items-start gap-3">
                <span
                  className="
                    mt-0.5 flex h-9 w-9
                    shrink-0 items-center
                    justify-center rounded-xl
                    bg-white/10 text-[#F3BD65]
                  "
                >
                  <MapPin size={17} />
                </span>

                <div>
                  <p className="mb-1 text-[11px] text-[#B4C9BD]">
                    Based In
                  </p>

                  <p
                    className="
                      max-w-[220px]
                      text-[13px] leading-6
                      text-[#F2F7F3]
                    "
                  >
                    Muzaffarabad,
                    <br />
                    Azad Jammu & Kashmir,
                    <br />
                    Pakistan
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Centered copyright bar; legal links now live under Explore. */}
      <div className="relative border-t border-white/10">
        <div className="rs-container py-6 text-center">
          <p className="text-[12px] text-[#B4C9BD]">
            © {currentYear} Roshan Safha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;