import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  BookOpen,
  ArrowUpRight,
  Heart,
  LibraryBig,
  PenLine,
  Leaf,
} from "lucide-react";

import logoImg from "../../assets/logo.png";
import { getPublicMenuItems } from "../../services/api";

/* ==========================================
   DEFAULT NAVIGATION
========================================== */

const DEFAULT_NAV_ITEMS = [
  { _id: "p-1", name: "Home", path: "/", isVisible: true },
  { _id: "p-2", name: "About Us", path: "/about", isVisible: true },
  {
    _id: "p-3",
    name: "Programs",
    path: "/programs",
    isVisible: true,
    isDropdown: true,
  },
  { _id: "p-4", name: "Gallery", path: "/gallery", isVisible: true },
  {
    _id: "p-5",
    name: "Announcements",
    path: "/announcements",
    isVisible: true,
  },
  {
    _id: "p-6",
    name: "Get Involved",
    path: "/get-involved",
    isVisible: true,
  },
  { _id: "p-7", name: "Contact Us", path: "/contact", isVisible: true },
];

/* ==========================================
   PROGRAM LINKS
========================================== */

const PROGRAM_LINKS = [
  {
    name: "Book Donations",
    description: "Give books a second life.",
    path: "/programs/donate-books",
    icon: Heart,
    color: "text-[#276B56]",
    bg: "bg-[#E7EEE5]",
  },
  {
    name: "Available Books",
    description: "Explore books ready to share.",
    path: "/programs/book-catalog",
    icon: LibraryBig,
    color: "text-[#B77A26]",
    bg: "bg-[#FFF1D9]",
  },
  {
    name: "Essay Contests",
    description: "Inspiring young voices.",
    path: "/programs/essays",
    icon: PenLine,
    color: "text-[#276B56]",
    bg: "bg-[#E7EEE5]",
  },
  {
    name: "SDGs Summer Circle",
    description: "Learning for a better tomorrow.",
    path: "/programs/summer-circle",
    icon: Leaf,
    color: "text-[#B77A26]",
    bg: "bg-[#FFF1D9]",
  },
];

/* ==========================================
   NAVBAR COMPONENT
========================================== */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navItems, setNavItems] = useState(DEFAULT_NAV_ITEMS);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const dropdownRef = useRef(null);

  /* ------------------------------------------
     ACTIVE ROUTE
  ------------------------------------------ */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  /* ------------------------------------------
     FETCH MENU VISIBILITY FROM BACKEND
  ------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    const fetchMenu = async () => {
      try {
        const res = await getPublicMenuItems();

        const serverItems = res.data?.data || res.data || [];

        if (
          !cancelled &&
          Array.isArray(serverItems) &&
          serverItems.length > 0
        ) {
          const activeMap = new Map(
            serverItems.map((item) => [
              item.path || item.name,
              item.isVisible,
            ])
          );

          setNavItems((prev) =>
            prev.map((item) => {
              const serverVisible =
                activeMap.get(item.path) ??
                activeMap.get(item.name);

              return serverVisible !== undefined
                ? { ...item, isVisible: serverVisible }
                : item;
            })
          );
        }
      } catch (error) {
        // Keep default navigation if the API is unavailable.
        console.error("Unable to load public navigation:", error);
      }
    };

    fetchMenu();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  /* ------------------------------------------
     CLOSE MENUS WHEN ROUTE CHANGES
  ------------------------------------------ */

  useEffect(() => {
    setMobileOpen(false);
    setMobileProgramsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  /* ------------------------------------------
     DETECT SCROLL
  ------------------------------------------ */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ------------------------------------------
     CLOSE DESKTOP DROPDOWN ON OUTSIDE CLICK
  ------------------------------------------ */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
        setMobileProgramsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ------------------------------------------
     PREVENT BACKGROUND SCROLL ON MOBILE
  ------------------------------------------ */

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const visibleNavItems = navItems.filter(
    (item) => item.isVisible !== false
  );

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileProgramsOpen(false);
  };

  return (
    <header
      className={`
        sticky top-0 z-50 w-full
        border-b border-[#E6DFD3]
        bg-[#FFF9EF]/95 backdrop-blur-xl
        transition-all duration-300
        ${
          scrolled
            ? "shadow-[0_8px_30px_rgba(25,62,50,0.08)]"
            : "shadow-none"
        }
      `}
    >
      {/* ======================================
          DESKTOP / MAIN NAVBAR
      ====================================== */}

      <div className="rs-container">
        <div
          className={`
            flex items-center justify-between gap-4
            transition-all duration-300
            ${scrolled ? "h-[76px]" : "h-[88px]"}
          `}
        >
          {/* LOGO */}

          <Link
            to="/"
            className="flex shrink-0 items-center gap-3"
            aria-label="Roshan Safha — Home"
            onClick={closeMobileMenu}
          >
            <img
              src={logoImg}
              alt="Roshan Safha"
              className="
                h-[58px] w-auto max-w-[170px]
                object-contain
                transition-transform duration-300
                hover:scale-[1.03]
                sm:h-[66px]
              "
            />
          </Link>

          {/* ==================================
              DESKTOP NAVIGATION
          ================================== */}

          <nav
            className="
              hidden xl:flex
              items-center gap-1
            "
            aria-label="Main navigation"
          >
            {visibleNavItems.map((item) => {
              /* PROGRAMS DROPDOWN */

              if (item.isDropdown) {
                return (
                  <div
                    key={item._id}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setDropdownOpen((prev) => !prev)
                      }
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                      aria-controls="desktop-programs-menu"
                      className={`
                        relative flex items-center gap-1.5
                        rounded-full px-3.5 py-2.5
                        text-[13px] font-semibold
                        transition-all duration-200
                        ${
                          isActive("/programs")
                            ? "bg-[#E7EEE5] text-[#276B56]"
                            : "text-[#493D32] hover:bg-[#E7EEE5] hover:text-[#276B56]"
                        }
                      `}
                    >
                      {item.name}

                      <ChevronDown
                        size={15}
                        strokeWidth={2}
                        className={`
                          transition-transform duration-200
                          ${dropdownOpen ? "rotate-180" : ""}
                        `}
                      />
                    </button>

                    {/* DROPDOWN PANEL */}

                    {dropdownOpen && (
                      <div
                        id="desktop-programs-menu"
                        className="
                          absolute left-1/2 top-full
                          w-[330px] -translate-x-1/2
                          pt-3
                        "
                      >
                        <div
                          className="
                            overflow-hidden rounded-[22px]
                            border border-[#E6DFD3]
                            bg-white p-3
                            shadow-[0_20px_60px_rgba(25,62,50,0.14)]
                          "
                        >
                          <div className="px-3 pb-3 pt-2">
                            <p
                              className="
                                text-[10px] font-bold
                                uppercase tracking-[0.18em]
                                text-[#B77A26]
                              "
                            >
                              Our Initiatives
                            </p>

                            <p
                              className="
                                mt-1 text-sm font-semibold
                                text-[#342719]
                              "
                            >
                              Explore our programs
                            </p>
                          </div>

                          <div className="space-y-1">
                            {PROGRAM_LINKS.map((program) => {
                              const Icon = program.icon;

                              return (
                                <Link
                                  key={program.path}
                                  to={program.path}
                                  onClick={() =>
                                    setDropdownOpen(false)
                                  }
                                  className="
                                    group flex items-center
                                    gap-3 rounded-2xl p-3
                                    transition-colors duration-200
                                    hover:bg-[#FFF9EF]
                                  "
                                >
                                  <span
                                    className={`
                                      flex h-11 w-11 shrink-0
                                      items-center justify-center
                                      rounded-xl
                                      ${program.bg}
                                      ${program.color}
                                    `}
                                  >
                                    <Icon size={20} strokeWidth={1.8} />
                                  </span>

                                  <span className="min-w-0 flex-1">
                                    <span
                                      className="
                                        block text-[13px] font-bold
                                        text-[#342719]
                                        group-hover:text-[#276B56]
                                      "
                                    >
                                      {program.name}
                                    </span>

                                    <span
                                      className="
                                        mt-0.5 block text-[11px]
                                        text-[#71685B]
                                      "
                                    >
                                      {program.description}
                                    </span>
                                  </span>

                                  <ArrowUpRight
                                    size={16}
                                    className="
                                      text-[#A9A094]
                                      transition-transform
                                      group-hover:-translate-y-0.5
                                      group-hover:translate-x-0.5
                                      group-hover:text-[#276B56]
                                    "
                                  />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              /* NORMAL NAVIGATION LINK */

              const active = isActive(item.path);

              return (
                <Link
                  key={item._id}
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`
                    relative rounded-full
                    px-3.5 py-2.5
                    text-[13px] font-semibold
                    transition-all duration-200
                    ${
                      active
                        ? "bg-[#E7EEE5] text-[#276B56]"
                        : "text-[#493D32] hover:bg-[#E7EEE5] hover:text-[#276B56]"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* ==================================
              DESKTOP CTA
          ================================== */}

          <div className="hidden xl:flex shrink-0 items-center">
            <Link
              to="/programs/donate-books#donation-form"
              className="
                group inline-flex items-center
                justify-center gap-2
                rounded-full bg-[#276B56]
                px-5 py-3
                text-[12px] font-bold text-white
                shadow-[0_5px_15px_rgba(39,107,86,0.18)]
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-[#193E32]
                hover:shadow-[0_10px_25px_rgba(39,107,86,0.22)]
              "
            >
              <BookOpen size={17} strokeWidth={2} />

              Donate Books

              <ArrowUpRight
                size={15}
                className="
                  transition-transform duration-200
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>
          </div>

          {/* ==================================
              MOBILE / TABLET TOGGLE
          ================================== */}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl border border-[#E6DFD3]
              bg-white text-[#276B56]
              transition-colors
              hover:bg-[#E7EEE5]
              xl:hidden
            "
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? (
              <X size={23} strokeWidth={2} />
            ) : (
              <Menu size={23} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* ======================================
          MOBILE / TABLET NAVIGATION
      ====================================== */}

      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="
            absolute left-0 right-0 top-full
            max-h-[calc(100dvh-76px)]
            overflow-y-auto
            border-t border-[#E6DFD3]
            bg-[#FFF9EF]
            shadow-[0_20px_40px_rgba(25,62,50,0.12)]
            xl:hidden
          "
        >
          <nav
            className="rs-container py-5"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {visibleNavItems.map((item) => {
                /* MOBILE PROGRAMS ACCORDION */

                if (item.isDropdown) {
                  return (
                    <div key={item._id}>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileProgramsOpen((prev) => !prev)
                        }
                        aria-expanded={mobileProgramsOpen}
                        aria-controls="mobile-programs-menu"
                        className={`
                          flex w-full items-center
                          justify-between rounded-xl
                          px-4 py-3.5 text-left
                          text-sm font-semibold
                          transition-colors
                          ${
                            isActive("/programs")
                              ? "bg-[#E7EEE5] text-[#276B56]"
                              : "text-[#493D32] hover:bg-[#E7EEE5]"
                          }
                        `}
                      >
                        {item.name}

                        <ChevronDown
                          size={18}
                          className={`
                            transition-transform duration-200
                            ${
                              mobileProgramsOpen
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        />
                      </button>

                      {mobileProgramsOpen && (
                        <div
                          id="mobile-programs-menu"
                          className="
                            ml-4 mt-1 space-y-1
                            border-l-2 border-[#E8A94A]
                            pl-3
                          "
                        >
                          {PROGRAM_LINKS.map((program) => {
                            const Icon = program.icon;

                            return (
                              <Link
                                key={program.path}
                                to={program.path}
                                onClick={closeMobileMenu}
                                className={`
                                  flex items-center gap-3
                                  rounded-xl px-3 py-3
                                  text-[13px] font-medium
                                  transition-colors
                                  ${
                                    isActive(program.path)
                                      ? "bg-[#E7EEE5] text-[#276B56]"
                                      : "text-[#493D32] hover:bg-[#E7EEE5]"
                                  }
                                `}
                              >
                                <Icon
                                  size={18}
                                  className="text-[#276B56]"
                                />

                                {program.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                /* MOBILE NORMAL LINK */

                const active = isActive(item.path);

                return (
                  <Link
                    key={item._id}
                    to={item.path}
                    onClick={closeMobileMenu}
                    aria-current={active ? "page" : undefined}
                    className={`
                      block rounded-xl px-4 py-3.5
                      text-sm font-semibold
                      transition-colors
                      ${
                        active
                          ? "bg-[#E7EEE5] text-[#276B56]"
                          : "text-[#493D32] hover:bg-[#E7EEE5] hover:text-[#276B56]"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* MOBILE CTA */}

            <div className="mt-5 border-t border-[#E6DFD3] pt-5">
              <Link
                to="/programs/donate-books#donation-form"
                onClick={closeMobileMenu}
                className="
                  flex w-full items-center
                  justify-center gap-2
                  rounded-full bg-[#276B56]
                  px-5 py-3.5
                  text-sm font-bold text-white
                  transition-colors
                  hover:bg-[#193E32]
                "
              >
                <BookOpen size={18} />

                Donate Books

                <ArrowUpRight size={17} />
              </Link>
            </div>

            {/* MOBILE BRAND MESSAGE */}

            <div className="mt-6 pb-2 text-center">
              <p
                className="
                  text-[11px] font-medium
                  leading-relaxed text-[#71685B]
                "
              >
                Because second chances are for
                <br />
                everyone and everything.
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;