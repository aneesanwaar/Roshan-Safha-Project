import React from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, ShieldCheck } from "lucide-react";
import { adminNavItems } from "./AdminSidebar";

function AdminHeader({ currentSection, onOpenSidebar, sidebarVisible = true, onToggleSidebar }) {
  const title = adminNavItems.find((item) => item.id === currentSection)?.label || "Admin Dashboard";
  return (
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-3 border-b border-[#E1E9DF] bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-6 xl:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onOpenSidebar} aria-label="Open admin sidebar" className="rounded-xl border border-[#E3EBE1] bg-[#F6F8F3] p-2.5 text-[#193E32] hover:bg-[#E7EEE5] lg:hidden"><Menu size={20}/></button>
        <button type="button" onClick={onToggleSidebar} aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"} title={sidebarVisible ? "Hide sidebar" : "Show sidebar"} className="hidden rounded-xl border border-[#E3EBE1] bg-[#F6F8F3] p-2.5 text-[#193E32] transition hover:bg-[#E7EEE5] lg:inline-flex">{sidebarVisible ? <PanelLeftClose size={20}/> : <PanelLeftOpen size={20}/>}</button>
        <div className="min-w-0"><p className="mb-0.5 hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#739184] sm:block">Administration / Workspace</p><h1 className="truncate text-sm font-black text-[#193E32] sm:text-lg">{title}</h1></div>
      </div>
      <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#DCE8DD] bg-[#F0F6EF] px-3 py-2 text-[11px] font-bold text-[#276B56]" title="Admin workspace (not a live connection health check)"><ShieldCheck size={15}/><span className="hidden sm:inline">Admin Workspace</span><span className="sm:hidden">Admin</span></div>
    </header>
  );
}
export default AdminHeader;
