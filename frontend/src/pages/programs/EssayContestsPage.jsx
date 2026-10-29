import React, { useEffect, useState } from "react";
import { Calendar, CheckCircle2, Trophy } from "lucide-react";
import EssayForm from "../../components/forms/EssayForm";
import { getPageContent } from "../../services/api";

const DEFAULT_CONTEST_CONFIG = {
  editionYear: "2026",
  status: "Active",

  // Junior Category
  juniorTheme: "The Book That Changed My Perspective",
  juniorWordLimit: "1,000 words",
  juniorFormats: "PDF, DOC, DOCX",
  juniorPrizes: "Shields, Certificates & Book Hampers",
  juniorDeadline: "2026-10-30",

  // Senior Category
  seniorTheme:
    "Digital Media vs. Physical Libraries in Modern Civic Literacy",
  seniorWordLimit: "2,500 words",
  seniorFormats: "PDF, DOC, DOCX",
  seniorPrizes: "Cash Award & Publication Feature",
  seniorDeadline: "2026-10-30",
};

// Convert YYYY-MM-DD to a readable date without timezone shifts.
const formatContestDeadline = (dateValue) => {
  if (typeof dateValue !== "string") {
    return "Not announced";
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);

  if (!match) {
    return "Not announced";
  }

  const [, year, month, day] = match;

  const date = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day))
  );

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    return "Not announced";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};

function EssayContestsPage() {
  const [contestConfig, setContestConfig] = useState(
    DEFAULT_CONTEST_CONFIG
  );

  useEffect(() => {
    let cancelled = false;

    const loadContestConfig = async () => {
      try {
        const response = await getPageContent("contest");

        if (
          !cancelled &&
          response?.data?.success === true &&
          response?.data?.content &&
          typeof response.data.content === "object" &&
          !Array.isArray(response.data.content)
        ) {
          setContestConfig((previousConfig) => ({
            ...previousConfig,
            ...response.data.content,
          }));
        }
      } catch (error) {
        console.error(
          "Failed to load public contest configuration:",
          error
        );
      }
    };

    loadContestConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  // Existing archive data remains unchanged until
  // we connect this section to the public winners API.
  const pastContests = [
    {
      year: "2025",
      theme: "The Book That Changed My Perspective",
      winner: "Fatima Noor (Rawalakot)",
      runnerUp: "Hamza Tariq (Muzaffarabad)",
      totalEntries: "180+ Entries",
    },
    {
      year: "2024",
      theme: "Sustainable Literacy & Climate Action",
      winner: "Zainab Bibi (Muzaffarabad)",
      runnerUp: "Abdullah Khan (Mirpur)",
      totalEntries: "140+ Entries",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9EF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="relative overflow-hidden rounded-[30px] bg-[#193E32] px-6 py-12 text-center space-y-4 sm:px-12">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Annual Essay Contests & Archive
          </h1>

          <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto leading-7">
            Inspiring youth to express critical thought, literary
            imagination, and societal ideas through structured essay
            competitions.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Junior Category */}
          <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#E0E9DD] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">

              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#193E32] bg-[#E7EEE5] px-2.5 py-1 rounded-md border border-emerald-100">
                Junior Category (Under 16)
              </span>

              <h3 className="text-base font-bold text-[#193E32] leading-snug">
                Theme: {contestConfig.juniorTheme}
              </h3>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#276B56] shrink-0 mt-0.5" />
                  <span>
                    <strong>Word limit:</strong>{" "}
                    {contestConfig.juniorWordLimit}
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#276B56] shrink-0 mt-0.5" />
                  <span>
                    <strong>Formats:</strong>{" "}
                    {contestConfig.juniorFormats}
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#276B56] shrink-0 mt-0.5" />
                  <span>
                    <strong>Prizes:</strong>{" "}
                    {contestConfig.juniorPrizes}
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#276B56] shrink-0" />
              <span>
                Deadline:{" "}
                {formatContestDeadline(contestConfig.juniorDeadline)}
              </span>
            </div>
          </div>

          {/* Senior Category */}
          <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#E0E9DD] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">

              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                Senior Category (16+ / University)
              </span>

              <h3 className="text-base font-bold text-[#193E32] leading-snug">
                Theme: {contestConfig.seniorTheme}
              </h3>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#276B56] shrink-0 mt-0.5" />
                  <span>
                    <strong>Word limit:</strong>{" "}
                    {contestConfig.seniorWordLimit}
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#276B56] shrink-0 mt-0.5" />
                  <span>
                    <strong>Formats:</strong>{" "}
                    {contestConfig.seniorFormats}
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#276B56] shrink-0 mt-0.5" />
                  <span>
                    <strong>Prizes:</strong>{" "}
                    {contestConfig.seniorPrizes}
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#276B56] shrink-0" />
              <span>
                Deadline:{" "}
                {formatContestDeadline(contestConfig.seniorDeadline)}
              </span>
            </div>
          </div>

        </div>

        {/* Backend Connected Submission Form Card */}
        <div id="essay-submission-form" className="scroll-mt-28 bg-white rounded-[28px] border border-[#DDE8DD] shadow-[0_18px_50px_rgba(25,62,50,0.08)] p-6 sm:p-10 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Online Essay Submission Portal
            </h3>

            <p className="text-xs text-slate-500">
              Attach your essay document directly to submit your entry.
            </p>
          </div>

          <EssayForm />
        </div>

        {/* Past Archive Showcase */}
        <div className="bg-white rounded-[24px] border border-[#E0E9DD] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />

            <h3 className="font-bold text-slate-900 text-sm">
              Past Winners & Competition Archive
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pastContests.map((item) => (
              <div
                key={item.year}
                className="p-3.5 rounded-xl bg-[#F8FAF5] border border-[#E0E9DD]/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#193E32] bg-[#E7EEE5] px-2 py-0.5 rounded">
                    Edition {item.year}
                  </span>

                  <span className="text-[10px] text-slate-500">
                    {item.totalEntries}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900">
                  "{item.theme}"
                </h4>

                <div className="text-[11px] text-slate-600 space-y-0.5 pt-0.5">
                  <p>
                    🥇 <strong>Winner:</strong> {item.winner}
                  </p>

                  <p>
                    🥈 <strong>Runner Up:</strong> {item.runnerUp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default EssayContestsPage;