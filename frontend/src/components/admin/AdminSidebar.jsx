import React from "react";
import {
  TrendingUp,
  FileSpreadsheet,
  Megaphone,
  Trophy,
  Image as ImageIcon,
  LayoutTemplate,
  ShieldCheck,
  LogOut,
  X,
  FileText,
  BookOpen,
  SlidersHorizontal,
} from "lucide-react";

/**
 * Dashboard navigation configuration.
 *
 * Exported so AdminDashboard and AdminHeader can
 * use the same section names.
 */
export const adminNavItems = [
  {
    id: "analytics",
    label: "AI Trend Analytics",
    icon: TrendingUp,
  },
  {
    id: "submissions",
    label: "Form Submissions & Export",
    icon: FileSpreadsheet,
  },
  {
    id: "books",
    label: "Manage Books",
    icon: BookOpen,
  },
  {
    id: "bookRequests",
    label: "Book Requests",
    icon: FileText,
  },
  {
    id: "announcements",
    label: "Announcements & Blog",
    icon: Megaphone,
  },
  {
    id: "contests",
    label: "Contests & Winners",
    icon: Trophy,
  },
  {
    id: "gallery",
    label: "Gallery & Media Library",
    icon: ImageIcon,
  },
  {
    id: "cms",
    label: "Page Content CMS",
    icon: LayoutTemplate,
  },
  {
    id: "menu",
    label: "Menu & Page Management",
    icon: SlidersHorizontal,
  },
  {
    id: "roles",
    label: "Team Roles & Permissions",
    icon: ShieldCheck,
  },
];

/**
 * Roshan Safha Admin Sidebar
 *
 * Props:
 * currentSection: currently selected dashboard section
 * setCurrentSection: changes the selected section
 * sidebarOpen: controls mobile sidebar visibility
 * setSidebarOpen: opens/closes mobile sidebar
 * activeAdmin: authenticated administrator profile
 * onSignOut: signs out the current administrator
 */
function AdminSidebar({
  currentSection,
  setCurrentSection,
  sidebarOpen,
  setSidebarOpen,
  activeAdmin,
  onSignOut,
}) {
  const handleNavigation = (sectionId) => {
    setCurrentSection(sectionId);
    setSidebarOpen(false);
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-slate-900 text-slate-200 flex flex-col justify-between border-r border-slate-800 transition-transform duration-200 ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Sidebar content */}
      <div className="p-6 space-y-6 overflow-y-auto">
        {/* Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8A94A] flex items-center justify-center text-slate-950 font-black text-base shadow-sm">
              RS
            </div>

            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                Roshan Safha
              </h2>

              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Admin Control
              </span>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin navigation"
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Administrator profile */}
        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {activeAdmin?.name?.trim()?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="overflow-hidden min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {activeAdmin?.name || "Administrator"}
            </p>

            <p
              className="text-[10px] text-slate-400 truncate mt-0.5"
              title={activeAdmin?.email || ""}
            >
              {activeAdmin?.email || "No profile loaded"}
            </p>

            <span className="inline-block text-[9px] font-bold bg-[#E8A94A]/20 text-[#E8A94A] px-2 py-0.5 rounded-md mt-1 capitalize">
              {activeAdmin?.role || "Admin"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5" aria-label="Admin navigation">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-3">
            Management Console
          </span>

          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-[#E8A94A] text-slate-950 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/30 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;