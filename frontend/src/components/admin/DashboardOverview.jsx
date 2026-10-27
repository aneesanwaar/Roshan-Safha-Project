import React from "react";
import {
  BookOpen,
  BookMarked,
  FileText,
  HandHeart,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  PackageCheck,
  TrendingUp,
  ArrowRight,
  Activity,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

/**
 * Display a number only when valid data is available.
 */
const formatCount = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  return value.toLocaleString();
};

/**
 * Reusable statistics card.
 */
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBackground,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-full bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm text-left transition-all ${
        onClick
          ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          : "cursor-default"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBackground}`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>

        {onClick && (
          <ArrowUpRight className="w-4 h-4 text-slate-400" />
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-500">
          {title}
        </p>

        <h3 className="text-3xl font-black text-[#193E32] mt-2">
          {formatCount(value)}
        </h3>

        <p className="text-xs text-slate-500 mt-2">
          {description}
        </p>
      </div>
    </button>
  );
}

/**
 * Reusable quick-action button.
 */
function QuickAction({ title, description, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:bg-[#FFF9EF] hover:border-[#E8A94A] transition-all text-left group"
    >
      <div className="w-11 h-11 rounded-xl bg-[#E7EEE5] text-[#193E32] flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900">
          {title}
        </h4>

        <p className="text-xs text-slate-500 mt-1">
          {description}
        </p>
      </div>

      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#193E32] group-hover:translate-x-1 transition-transform shrink-0" />
    </button>
  );
}

/**
 * Request status indicator.
 */
function RequestStatus({ title, value, icon: Icon, color }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${color}`} />

        <span className="text-sm font-medium text-slate-700">
          {title}
        </span>
      </div>

      <span className="text-sm font-black text-slate-900">
        {formatCount(value)}
      </span>
    </div>
  );
}

/**
 * Roshan Safha Admin Dashboard Overview
 *
 * Props:
 * - activeAdmin: currently authenticated administrator
 * - onNavigate: callback that changes dashboard section
 * - stats: verified statistics supplied by the parent
 * - recentActivity: activity records supplied by the parent
 *
 * No hardcoded statistics are used.
 */
function DashboardOverview({
  activeAdmin,
  onNavigate,
  stats = {},
  recentActivity = [],
}) {
  const navigateTo = (section) => {
    if (typeof onNavigate === "function") {
      onNavigate(section);
    }
  };

  const firstName =
    activeAdmin?.name?.trim()?.split(/\s+/)[0] || "Administrator";

  const summaryCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      description: "Books recorded in the inventory",
      icon: BookOpen,
      iconColor: "text-emerald-700",
      iconBackground: "bg-emerald-100",
      section: "books",
    },
    {
      title: "Book Requests",
      value: stats.totalBookRequests,
      description: "Requests submitted by readers",
      icon: BookMarked,
      iconColor: "text-blue-700",
      iconBackground: "bg-blue-100",
      section: "bookRequests",
    },
    {
      title: "Essay Submissions",
      value: stats.totalEssays,
      description: "Student essays received",
      icon: FileText,
      iconColor: "text-amber-700",
      iconBackground: "bg-amber-100",
      section: "submissions",
    },
    {
      title: "Book Donations",
      value: stats.totalDonations,
      description: "Donation submissions received",
      icon: HandHeart,
      iconColor: "text-violet-700",
      iconBackground: "bg-violet-100",
      section: "submissions",
    },
  ];

  const quickActions = [
    {
      title: "Manage Books",
      description: "Add, update, and organize inventory",
      icon: BookOpen,
      section: "books",
    },
    {
      title: "Review Book Requests",
      description: "Approve and fulfill reader requests",
      icon: BookMarked,
      section: "bookRequests",
    },
    {
      title: "Review Submissions",
      description: "View essays, donations, and inquiries",
      icon: FileText,
      section: "submissions",
    },
    {
      title: "View AI Analytics",
      description: "Explore trends and predictions",
      icon: TrendingUp,
      section: "analytics",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#193E32] text-white p-6 sm:p-9 shadow-lg">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#E8A94A]/10" />

        <div className="absolute -bottom-24 right-32 w-52 h-52 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8A94A]/30 bg-[#E8A94A]/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold text-[#E8A94A]">
            <LayoutDashboard className="w-4 h-4" />
            ADMINISTRATOR OVERVIEW
          </div>

          <h2 className="mt-5 text-2xl sm:text-4xl font-black tracking-tight">
            Welcome back, {firstName}!
          </h2>

          <p className="mt-3 text-sm sm:text-base text-white/75 max-w-2xl leading-relaxed">
            Manage Roshan Safha's literacy initiatives, monitor
            book circulation, review student submissions, and
            oversee community engagement from one place.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-2 text-xs font-semibold">
              <Activity className="w-4 h-4 text-[#E8A94A]" />
              Operations Dashboard
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-2 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-[#E8A94A]" />
              Roshan Safha
            </span>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Organization at a Glance
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Key operational statistics from Roshan Safha
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              description={card.description}
              icon={card.icon}
              iconColor={card.iconColor}
              iconBackground={card.iconBackground}
              onClick={() => navigateTo(card.section)}
            />
          ))}
        </div>
      </section>

      {/* Operational Details */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Book Request Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Book Request Status
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Reader request progress
              </p>
            </div>

            <BookMarked className="w-5 h-5 text-[#276B56]" />
          </div>

          <RequestStatus
            title="Pending"
            value={stats.pendingRequests}
            icon={Clock3}
            color="text-amber-600"
          />

          <RequestStatus
            title="Approved"
            value={stats.approvedRequests}
            icon={CheckCircle2}
            color="text-blue-600"
          />

          <RequestStatus
            title="Fulfilled"
            value={stats.fulfilledRequests}
            icon={PackageCheck}
            color="text-emerald-600"
          />

          <button
            type="button"
            onClick={() => navigateTo("bookRequests")}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-[#E7EEE5] hover:bg-[#d8e6d4] text-[#193E32] px-4 py-3 text-xs font-bold transition-colors"
          >
            Manage Book Requests
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Recent Activity
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Latest activity across the platform
              </p>
            </div>

            <Activity className="w-5 h-5 text-[#276B56]" />
          </div>

          {recentActivity.length === 0 ? (
            <div className="min-h-48 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8">
              <Clock3 className="w-9 h-9 text-slate-300" />

              <p className="mt-3 text-sm font-bold text-slate-700">
                No activity loaded yet
              </p>

              <p className="mt-2 text-xs text-slate-500 max-w-sm">
                Recent activity will appear here after we
                connect the overview to the backend.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="flex items-start justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                      {activity.title}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {activity.description}
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0">
                    {activity.date || ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-black text-slate-900">
            Quick Actions
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Jump directly to frequently used management tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <QuickAction
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              onClick={() => navigateTo(action.section)}
            />
          ))}
        </div>
      </section>

      {/* AI Analytics Promotion */}
      <section className="rounded-2xl border border-[#E8A94A]/30 bg-[#FFF9EF] p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E8A94A]/20 text-[#193E32] flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-black text-[#193E32]">
              Explore AI-Powered Insights
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
              Analyze donation patterns, essay participation,
              and forecast future trends using Roshan Safha's
              AI analytics system.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo("analytics")}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#193E32] hover:bg-[#276B56] text-white px-5 py-3 text-xs font-bold transition-colors"
        >
          Open AI Analytics
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}

export default DashboardOverview;