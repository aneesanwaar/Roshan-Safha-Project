import React, { useEffect } from "react";
import logoImg from "../../assets/logo.png";
import {
  LayoutDashboard, TrendingUp, FileSpreadsheet, Megaphone, Trophy,
  Image as ImageIcon, LayoutTemplate, ShieldCheck, LogOut, X,
  FileText, BookOpen, SlidersHorizontal, PanelLeftClose,
} from "lucide-react";

export const adminNavItems = [
  { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
  { id: "analytics", label: "AI Trend Analytics", icon: TrendingUp },
  { id: "submissions", label: "Form Submissions & Export", icon: FileSpreadsheet },
  { id: "books", label: "Manage Books", icon: BookOpen },
  { id: "bookRequests", label: "Book Requests", icon: FileText },
  { id: "announcements", label: "Announcements & Blog", icon: Megaphone },
  { id: "contests", label: "Contests & Winners", icon: Trophy },
  { id: "gallery", label: "Gallery & Media Library", icon: ImageIcon },
  { id: "cms", label: "Page Content CMS", icon: LayoutTemplate },
  { id: "menu", label: "Menu & Page Management", icon: SlidersHorizontal },
  { id: "roles", label: "Team Roles & Permissions", icon: ShieldCheck },
];

function AdminSidebar({ currentSection, setCurrentSection, sidebarOpen,
  setSidebarOpen, sidebarVisible = true, activeAdmin, onSignOut }) {
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (event) => { if (event.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, setSidebarOpen]);

  const navigate = (id) => { setCurrentSection(id); setSidebarOpen(false); };
  return (
    <>
      {sidebarOpen && (
        <button type="button" aria-label="Close navigation overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#071B14]/60 backdrop-blur-[2px] lg:hidden" />
      )}
      <aside aria-label="Admin sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(19rem,85vw)] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#193E32] text-white shadow-2xl transition-[transform,width] duration-300 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarVisible ? "lg:w-[17.5rem] lg:translate-x-0" : "lg:w-0 lg:-translate-x-full lg:border-r-0"}`}
      >
        <div className="flex min-h-0 w-[min(19rem,85vw)] flex-1 flex-col lg:w-[17.5rem]">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFF9EF] p-1 shadow-lg">
                <img
                  src={logoImg}
                  alt="Roshan Safha Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0"><p className="truncate text-base font-black tracking-tight">Roshan Safha</p><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E8A94A]">Administration</p></div>
            </div>
            <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"
              className="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"><X size={19} /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5 [scrollbar-width:thin]">
            <p className="px-3 pb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45">Workspace</p>
            <nav aria-label="Admin sections" className="space-y-1">
              {adminNavItems.map(({ id, label, icon: Icon }) => {
                const active = currentSection === id;
                return <button key={id} type="button" onClick={() => navigate(id)}
                  aria-current={active ? "page" : undefined} title={label}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A94A] ${active ? "bg-[#E8A94A] text-[#193E32] shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
                  <Icon size={17} className="shrink-0" /><span className="min-w-0 flex-1 leading-5">{label}</span>
                  {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#193E32]" />}
                </button>;
              })}
            </nav>
          </div>
          <div className="shrink-0 border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8A94A] text-sm font-black text-[#193E32]">{activeAdmin?.name?.trim()?.charAt(0)?.toUpperCase() || "A"}</div>
              <div className="min-w-0"><p className="truncate text-xs font-bold">{activeAdmin?.name || "Administrator"}</p><p className="truncate text-[10px] text-white/55">{activeAdmin?.email || activeAdmin?.role || "Admin"}</p></div>
            </div>
            <button type="button" onClick={onSignOut} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-xs font-bold text-white/85 hover:border-rose-300/40 hover:bg-rose-400/10 hover:text-rose-200"><LogOut size={16} /> Sign Out</button>
          </div>
        </div>
      </aside>
    </>
  );
}
export default AdminSidebar;
