import React from "react";
import { Menu } from "lucide-react";
import { adminNavItems } from "./AdminSidebar";

/**
 * Roshan Safha Admin Dashboard Header
 *
 * Displays:
 * - Current dashboard section title
 * - Mobile sidebar toggle
 * - Administration system subtitle
 * - Live database sync indicator
 *
 * Props:
 * currentSection: currently selected dashboard section
 * onOpenSidebar: opens the sidebar on mobile devices
 */
function AdminHeader({ currentSection, onOpenSidebar }) {
  const activeSection = adminNavItems.find(
    (item) => item.id === currentSection
  );

  const sectionTitle = activeSection?.label || "Admin Dashboard";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu + Section Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Sidebar Toggle */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open admin navigation"
          className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Section Heading */}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-black text-slate-900 truncate">
            {sectionTitle}
          </h1>

          <p className="text-[11px] text-slate-500 hidden sm:block">
            Roshan Safha Automated Operations System
          </p>
        </div>
      </div>

      {/* Right: Database Status */}
      <div className="shrink-0">
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

          <span className="hidden sm:inline">
            Live Database Sync
          </span>

          <span className="sm:hidden">
            Live
          </span>
        </span>
      </div>
    </header>
  );
}

export default AdminHeader;