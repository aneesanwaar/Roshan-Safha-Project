import React from "react";
import {
  Activity, ArrowRight, ArrowUpRight, BookMarked, BookOpen,
  CheckCircle2, Clock3, FileText, HandHeart, LayoutDashboard,
  PackageCheck, Sparkles, TrendingUp,
} from "lucide-react";

const formatCount = (value) =>
  typeof value === "number" && Number.isFinite(value) ? value.toLocaleString() : "—";

const sectionTitle = (eyebrow, title, subtitle) => (
  <div className="min-w-0">
    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#B7812D]">{eyebrow}</p>
    <h3 className="mt-1 text-xl font-black tracking-tight text-[#193E32] sm:text-2xl">{title}</h3>
    <p className="mt-1 text-xs leading-5 text-[#708378]">{subtitle}</p>
  </div>
);

function StatCard({ title, value, description, icon: Icon, tint, onClick }) {
  return (
    <button type="button" onClick={onClick} disabled={!onClick}
      className="group relative min-w-0 overflow-hidden rounded-[22px] border border-[#E0E9DF] bg-white p-5 text-left shadow-[0_6px_20px_rgba(25,62,50,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#B8D2BF] hover:shadow-[0_14px_28px_rgba(25,62,50,0.1)] disabled:cursor-default disabled:hover:translate-y-0 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tint}`}>
          <Icon className="h-5 w-5" />
        </div>
        {onClick && <ArrowUpRight className="h-4 w-4 text-[#9AAFA1] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wide text-[#6B8074]">{title}</p>
      <p className="mt-1 text-3xl font-black tracking-tight text-[#193E32] sm:text-4xl">{formatCount(value)}</p>
      <p className="mt-2 text-xs leading-5 text-[#839389]">{description}</p>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#E8A94A] transition-all group-hover:w-full" />
    </button>
  );
}

function QuickAction({ title, description, icon: Icon, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="group flex min-w-0 items-center gap-3 rounded-2xl border border-[#E5ECE3] bg-[#FCFDFB] p-4 text-left transition-all hover:border-[#B8D2BF] hover:bg-[#F1F7EF]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E7EEE5] text-[#276B56]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-[#193E32]">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-[#788A7E]">{description}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-[#729583] transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function RequestRow({ title, value, icon: Icon, tint }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#EDF1EA] py-3.5 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tint}`}><Icon className="h-4 w-4" /></span>
        <span className="text-sm font-semibold text-[#4E6558]">{title}</span>
      </div>
      <span className="text-base font-black text-[#193E32]">{formatCount(value)}</span>
    </div>
  );
}

function DashboardOverview({ activeAdmin, onNavigate, stats = {}, recentActivity = [] }) {
  const navigateTo = (section) => {
    if (typeof onNavigate === "function") onNavigate(section);
  };
  const firstName = activeAdmin?.name?.trim()?.split(/\s+/)[0] || "Administrator";

  const summaryCards = [
    { title: "Total Books", value: stats.totalBooks, description: "Books in the inventory", icon: BookOpen, tint: "bg-[#DCF3E5] text-[#167654]", section: "books" },
    { title: "Book Requests", value: stats.totalBookRequests, description: "Requests from readers", icon: BookMarked, tint: "bg-[#E4EEFF] text-[#3866B4]", section: "bookRequests" },
    { title: "Essay Submissions", value: stats.totalEssays, description: "Student essays received", icon: FileText, tint: "bg-[#FFF0CE] text-[#B8791C]", section: "submissions" },
    { title: "Book Donations", value: stats.totalDonations, description: "Donation forms received", icon: HandHeart, tint: "bg-[#F1E7FF] text-[#8256B4]", section: "submissions" },
  ];
  const quickActions = [
    { title: "Manage Books", description: "Organize the book inventory", icon: BookOpen, section: "books" },
    { title: "Book Requests", description: "Review and fulfill requests", icon: BookMarked, section: "bookRequests" },
    { title: "Form Submissions", description: "Review community submissions", icon: FileText, section: "submissions" },
    { title: "AI Trend Analytics", description: "Explore insights and forecasts", icon: TrendingUp, section: "analytics" },
  ];

  return (
    <div className="min-w-0 space-y-7 pb-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[26px] border border-[#2D5B49] bg-[#193E32] p-6 text-white shadow-[0_12px_32px_rgba(25,62,50,0.12)] sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full border-[35px] border-white/[0.045]" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-[-90px] right-24 h-40 w-40 rounded-full bg-[#E8A94A]/[0.07] blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E8A94A]/30 bg-[#E8A94A]/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#F1BF69]">
              <LayoutDashboard className="h-3.5 w-3.5" /> Administration workspace
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">Welcome back, {firstName} <span aria-hidden="true">👋</span></h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[#D4E3D9]">
              Your literacy operations, book circulation, and community activity — all in one place.
            </p>
          </div>
          <button type="button" onClick={() => navigateTo("submissions")}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#E8A94A] px-4 py-3 text-xs font-extrabold text-[#193E32] transition hover:bg-[#F4BF6D]">
            Review Submissions <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="min-w-0">
        <div className="mb-5">{sectionTitle("Live overview", "Organization at a Glance", "Operational totals provided by your dashboard data.")}</div>
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => <StatCard key={card.title} {...card} onClick={() => navigateTo(card.section)} />)}
        </div>
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="min-w-0 rounded-[22px] border border-[#E0E9DF] bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex items-start justify-between gap-3">
            {sectionTitle("Fulfillment", "Book Request Status", "Track reader requests by status.")}
            <span className="rounded-xl bg-[#E7EEE5] p-2 text-[#276B56]"><BookMarked className="h-5 w-5" /></span>
          </div>
          <div className="mt-5">
            <RequestRow title="Pending" value={stats.pendingRequests} icon={Clock3} tint="bg-[#FFF2D7] text-[#B77D23]" />
            <RequestRow title="Approved" value={stats.approvedRequests} icon={CheckCircle2} tint="bg-[#E6EEFF] text-[#4A71B7]" />
            <RequestRow title="Fulfilled" value={stats.fulfilledRequests} icon={PackageCheck} tint="bg-[#DCF3E5] text-[#167654]" />
          </div>
          <button type="button" onClick={() => navigateTo("bookRequests")}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E7EEE5] px-4 py-3 text-xs font-extrabold text-[#193E32] transition hover:bg-[#D5E5D5]">
            Manage Requests <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="min-w-0 rounded-[22px] border border-[#E0E9DF] bg-white p-5 shadow-sm sm:p-6 xl:col-span-3">
          <div className="flex items-start justify-between gap-3">
            {sectionTitle("Platform updates", "Recent Activity", "Latest available records from your system.")}
            <span className="rounded-xl bg-[#E7EEE5] p-2 text-[#276B56]"><Activity className="h-5 w-5" /></span>
          </div>
          {!recentActivity.length ? (
            <div className="mt-5 flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE7DC] bg-[#F8FBF7] px-5 py-7 text-center">
              <span className="rounded-2xl bg-[#E7EEE5] p-3 text-[#6B9980]"><Clock3 className="h-6 w-6" /></span>
              <p className="mt-3 text-sm font-extrabold text-[#193E32]">No recent activity available</p>
              <p className="mt-1 max-w-xs text-xs leading-6 text-[#7B8E81]">Activity will appear when the dashboard receives activity records.</p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-[#EDF1EA]">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={activity.id || index} className="flex min-w-0 items-start gap-3 py-3.5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#E8A94A]" />
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-bold text-[#193E32]">{activity.title}</p>
                    <p className="mt-1 break-words text-xs leading-5 text-[#7B8E81]">{activity.description}</p>
                  </div>
                  <span className="max-w-24 shrink-0 text-right text-[10px] text-[#8B9C90]">{activity.date || ""}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="min-w-0 rounded-[22px] border border-[#E0E9DF] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">{sectionTitle("Shortcuts", "Quick Actions", "Jump directly to frequently used management tools.")}</div>
        <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
          {quickActions.map((action) => <QuickAction key={action.title} {...action} onClick={() => navigateTo(action.section)} />)}
        </div>
      </section>

      <section className="flex min-w-0 flex-col gap-5 rounded-[22px] border border-[#EBD8AD] bg-[#FFF7E6] p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F8E7BB] text-[#98681D]"><Sparkles className="h-6 w-6" /></span>
          <div className="min-w-0">
            <h3 className="text-base font-black text-[#193E32]">Explore AI-Powered Insights</h3>
            <p className="mt-1 max-w-2xl text-xs leading-6 text-[#6F765D] sm:text-sm">Explore trends in donations, essay participation, and literacy activity using the existing analytics module.</p>
          </div>
        </div>
        <button type="button" onClick={() => navigateTo("analytics")}
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#193E32] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#276B56]">
          Open Analytics <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
}

export default DashboardOverview;
