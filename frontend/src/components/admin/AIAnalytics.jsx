import React, { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Database,
  FileText,
  Info,
  Lightbulb,
  RefreshCw,
  Server,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { getAdminAnalyticsTrends } from "../../services/api";

// =============================================================
// ROSHAN SAFHA — AI ANALYTICS DASHBOARD
// =============================================================

const COLORS = {
  forest: "#193E32",
  green: "#276B56",
  gold: "#E8A94A",
  cream: "#FFF9EF",
  sage: "#E7EEE5",
  slate: "#64748B",
};

const formatNumber = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }

  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return "—";
  }

  return numeric.toLocaleString();
};

const formatDecimal = (value, digits = 2) => {
  if (value === null || value === undefined) {
    return "—";
  }

  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return "—";
  }

  return numeric.toFixed(digits);
};

const getTrendInfo = (trend) => {
  if (trend === "Increasing") {
    return {
      label: "Increasing",
      icon: ArrowUpRight,
      className:
        "bg-emerald-50 text-emerald-800 border-emerald-200",
    };
  }

  if (trend === "Decreasing") {
    return {
      label: "Decreasing",
      icon: ArrowDownRight,
      className:
        "bg-rose-50 text-rose-800 border-rose-200",
    };
  }

  if (trend === "Stable") {
    return {
      label: "Stable",
      icon: ArrowRight,
      className:
        "bg-slate-50 text-slate-700 border-slate-200",
    };
  }

  return {
    label: trend || "Insufficient Data",
    icon: Info,
    className:
      "bg-amber-50 text-amber-800 border-amber-200",
  };
};

const getNextMonthLabel = (timeSeriesData) => {
  const lastMonth = timeSeriesData?.[
    timeSeriesData.length - 1
  ]?.month;

  if (!lastMonth) {
    return "Next reporting month";
  }

  const parsed = new Date(`${lastMonth} 1`);

  if (Number.isNaN(parsed.getTime())) {
    return "Next reporting month";
  }

  parsed.setMonth(parsed.getMonth() + 1);

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

// =============================================================
// REUSABLE COMPONENTS
// =============================================================

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#276B56] mb-2">
            {eyebrow}
          </p>
        )}

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#193E32]">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  description,
  accent = "green",
}) {
  const isGold = accent === "gold";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <div className="flex flex-wrap items-baseline gap-2 mt-3">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#193E32]">
              {value}
            </span>

            {suffix && (
              <span className="text-xs font-semibold text-slate-500">
                {suffix}
              </span>
            )}
          </div>
        </div>

        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
            isGold
              ? "bg-amber-50 text-amber-700"
              : "bg-[#E7EEE5] text-[#276B56]"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function TrendBadge({ trend }) {
  const info = getTrendInfo(trend);
  const Icon = info.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${info.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {info.label}
    </span>
  );
}

// =============================================================
// RESPONSIVE SVG LINE CHART
// =============================================================

function ActivityChart({
  title,
  subtitle,
  data,
  dataKey,
  color,
  forecast,
  forecastAvailable,
  unit,
}) {
  const [showForecast, setShowForecast] = useState(true);

  const chart = useMemo(() => {
    const historical = Array.isArray(data)
      ? data.map((item) => {
          const numeric = Number(item?.[dataKey]);

          return Number.isFinite(numeric)
            ? Math.max(0, numeric)
            : 0;
        })
      : [];

    const validForecast =
      forecastAvailable &&
      forecast !== null &&
      forecast !== undefined &&
      Number.isFinite(Number(forecast))
        ? Math.max(0, Number(forecast))
        : null;

    const values = [
      ...historical,
      ...(showForecast && validForecast !== null
        ? [validForecast]
        : []),
    ];

    const maxValue = Math.max(1, ...values);

    const width = 760;
    const height = 290;

    const padding = {
      left: 48,
      right: 34,
      top: 28,
      bottom: 48,
    };

    const plotWidth =
      width - padding.left - padding.right;

    const plotHeight =
      height - padding.top - padding.bottom;

    const pointCount =
      historical.length +
      (showForecast && validForecast !== null ? 1 : 0);

    const getX = (index) =>
      padding.left +
      (pointCount > 1
        ? (index / (pointCount - 1)) * plotWidth
        : plotWidth / 2);

    const getY = (value) =>
      padding.top +
      plotHeight -
      (value / maxValue) * plotHeight;

    const historicalPoints = historical.map(
      (value, index) => ({
        x: getX(index),
        y: getY(value),
        value,
        label:
          data[index]?.label ||
          data[index]?.month ||
          `Month ${index + 1}`,
      })
    );

    const historicalPath = historicalPoints
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
      )
      .join(" ");

    let forecastPoint = null;
    let forecastPath = "";

    if (
      showForecast &&
      validForecast !== null &&
      historicalPoints.length > 0
    ) {
      const previous =
        historicalPoints[historicalPoints.length - 1];

      forecastPoint = {
        x: getX(historicalPoints.length),
        y: getY(validForecast),
        value: validForecast,
      };

      forecastPath =
        `M ${previous.x} ${previous.y} ` +
        `L ${forecastPoint.x} ${forecastPoint.y}`;
    }

    const ticks = Array.from(
      { length: 5 },
      (_, index) => (maxValue / 4) * index
    );

    return {
      width,
      height,
      padding,
      getY,
      ticks,
      historicalPoints,
      historicalPath,
      forecastPoint,
      forecastPath,
      maxValue,
    };
  }, [
    data,
    dataKey,
    forecast,
    forecastAvailable,
    showForecast,
  ]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#193E32]">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>

        {forecastAvailable && (
          <button
            type="button"
            onClick={() =>
              setShowForecast((previous) => !previous)
            }
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span
              className="w-3 h-0.5 border-t-2 border-dashed"
              style={{ borderColor: color }}
            />

            {showForecast
              ? "Hide Forecast"
              : "Show Forecast"}
          </button>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="w-full min-w-[500px] h-auto"
          role="img"
          aria-label={`${title}: historical monthly activity and optional next-month forecast`}
        >
          {chart.ticks.map((tick, index) => (
            <g key={`tick-${index}`}>
              <line
                x1={chart.padding.left}
                x2={
                  chart.width -
                  chart.padding.right
                }
                y1={chart.getY(tick)}
                y2={chart.getY(tick)}
                stroke="#E2E8F0"
                strokeDasharray="4 5"
              />

              <text
                x={chart.padding.left - 12}
                y={chart.getY(tick) + 4}
                textAnchor="end"
                fontSize="11"
                fill="#94A3B8"
              >
                {Math.round(tick)}
              </text>
            </g>
          ))}

          {chart.historicalPath && (
            <path
              d={chart.historicalPath}
              fill="none"
              stroke={color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {chart.forecastPath && (
            <path
              d={chart.forecastPath}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeDasharray="7 6"
              opacity="0.65"
            />
          )}

          {chart.historicalPoints.map(
            (point, index) => (
              <g key={`point-${index}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5.5"
                  fill={color}
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <title>
                    {`${point.label}: ${point.value} ${unit}`}
                  </title>
                </circle>

                <text
                  x={point.x}
                  y={Math.max(15, point.y - 13)}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#334155"
                >
                  {formatNumber(point.value)}
                </text>

                <text
                  x={point.x}
                  y={chart.height - 16}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#64748B"
                >
                  {point.label}
                </text>
              </g>
            )
          )}

          {chart.forecastPoint && (
            <g>
              <circle
                cx={chart.forecastPoint.x}
                cy={chart.forecastPoint.y}
                r="7"
                fill="white"
                stroke={color}
                strokeWidth="3"
              >
                <title>
                  {`Forecast: ${chart.forecastPoint.value} ${unit}`}
                </title>
              </circle>

              <text
                x={chart.forecastPoint.x}
                y={Math.max(
                  15,
                  chart.forecastPoint.y - 15
                )}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={color}
              >
                {formatNumber(
                  chart.forecastPoint.value
                )}
              </text>

              <text
                x={chart.forecastPoint.x}
                y={chart.height - 16}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={color}
              >
                Forecast
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-slate-100 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          Actual records
        </span>

        {forecastAvailable && (
          <span className="inline-flex items-center gap-2">
            <span
              className="w-5 border-t-2 border-dashed"
              style={{ borderColor: color }}
            />
            AI estimate
          </span>
        )}
      </div>
    </div>
  );
}

// =============================================================
// FOUNDER-FRIENDLY FORECAST CARD
// =============================================================

function ForecastCard({
  title,
  icon: Icon,
  model,
  forecastMonth,
  color = "green",
  activeMonths = 0,
}) {
  const isGold = color === "gold";

  const available =
    model?.forecast_available === true &&
    model?.forecast_next !== null &&
    model?.forecast_next !== undefined;

  const insight = model?.insight;

  const limitedHistory = activeMonths < 3;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div
        className={`h-1.5 ${
          isGold
            ? "bg-[#E8A94A]"
            : "bg-[#276B56]"
        }`}
      />

      <div className="p-5 sm:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isGold
                  ? "bg-amber-50 text-amber-700"
                  : "bg-[#E7EEE5] text-[#276B56]"
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-semibold">
                {forecastMonth} estimate
              </p>

              <h3 className="text-base font-black text-[#193E32]">
                {title}
              </h3>
            </div>
          </div>

          <TrendBadge trend={model?.trend} />
        </div>

        <div className="flex items-end gap-3">
          <span className="text-5xl font-black tracking-tight text-[#193E32]">
            {available
              ? formatNumber(
                  model.forecast_next
                )
              : "—"}
          </span>

          <span className="text-xs text-slate-500 font-semibold pb-2">
            {available
              ? "estimated next month"
              : "forecast unavailable"}
          </span>
        </div>

        {limitedHistory && (
          <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />

            <div>
              <p className="text-xs font-extrabold text-amber-900">
                Limited historical activity
              </p>

              <p className="text-xs text-amber-800 leading-relaxed mt-1">
                Only {activeMonths} of the six
                reporting months recorded activity.
                This estimate should be treated
                cautiously.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-black text-[#193E32]">
            What does this mean?
          </h4>

          <p className="text-sm text-slate-600 leading-relaxed">
            {insight?.explanation ||
              "More historical activity is needed before a meaningful explanation can be generated."}
          </p>
        </div>

        <div className="bg-[#FFF9EF] rounded-2xl border border-amber-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-700" />

            <h4 className="text-xs font-black uppercase tracking-wide text-amber-900">
              Suggested action
            </h4>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {insight?.recommendation ||
              "Continue recording activity and review the trends regularly."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500 border-t border-slate-100 pt-4">
          <span>
            Monthly change:{" "}
            <strong className="text-slate-700">
              {formatDecimal(model?.slope)}
            </strong>
          </span>

          <span className="text-slate-300">•</span>

          <span>
            Historical fit (R²):{" "}
            <strong className="text-slate-700">
              {formatDecimal(
                model?.r2_score,
                3
              )}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// TECHNICAL DETAILS FOR UNIVERSITY DEFENSE
// =============================================================

function TechnicalDetails({
  booksModel,
  participationModel,
  analyticsMeta,
}) {
  const [expanded, setExpanded] = useState(false);

  const rows = [
    {
      label: "Book donations",
      model: booksModel,
    },
    {
      label: "Essay submissions",
      model: participationModel,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() =>
          setExpanded((previous) => !previous)
        }
        aria-expanded={expanded}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
            <BrainCircuit className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-black text-[#193E32]">
              Technical Model Details
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Regression coefficients and historical fit
            </p>
          </div>
        </div>

        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-slate-100 p-5 sm:p-6 space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 rounded-l-xl">
                    Metric
                  </th>

                  <th className="px-4 py-3">
                    Slope
                  </th>

                  <th className="px-4 py-3">
                    Intercept
                  </th>

                  <th className="px-4 py-3">
                    R²
                  </th>

                  <th className="px-4 py-3 rounded-r-xl">
                    Forecast
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map(({ label, model }) => (
                  <tr
                    key={label}
                    className="border-b border-slate-100 text-sm"
                  >
                    <td className="px-4 py-4 font-bold text-[#193E32]">
                      {label}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {formatDecimal(
                        model?.slope
                      )}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {formatDecimal(
                        model?.intercept
                      )}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {formatDecimal(
                        model?.r2_score,
                        3
                      )}
                    </td>

                    <td className="px-4 py-4 font-bold text-[#276B56]">
                      {formatNumber(
                        model?.forecast_next
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-950 rounded-2xl p-5 text-white space-y-3">
            <p className="text-[11px] uppercase tracking-wider font-black text-[#E8A94A]">
              Mathematical model
            </p>

            <p className="text-sm font-mono">
              Y = mX + c
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">
              Ordinary Least Squares Linear Regression
              estimates the relationship between
              consecutive monthly periods (X) and
              recorded activity (Y).
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">
              The model predicts the next monthly
              observation by extending the fitted
              straight line one period forward.
              Negative predictions are clipped to zero.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 p-4">
            <Info className="w-5 h-5 text-blue-700 shrink-0" />

            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>Important:</strong> R² measures
              how closely the regression line fits
              the historical observations. It is not
              a guaranteed prediction accuracy
              percentage. Predictions based on only
              a few active months have substantial
              uncertainty.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Engine:{" "}
            <strong>
              {analyticsMeta?.predictionEngine ||
                "Not reported"}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}

// =============================================================
// MAIN ANALYTICS COMPONENT
// =============================================================

export default function AIAnalytics() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [models, setModels] = useState(null);
  const [analyticsMeta, setAnalyticsMeta] = useState(null);

  const loadAnalytics = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response =
        await getAdminAnalyticsTrends();

      const payload = response?.data;

      if (
        !payload?.success ||
        !Array.isArray(payload.timeSeriesData) ||
        !payload.models
      ) {
        throw new Error(
          "The analytics API returned an unexpected response."
        );
      }

      setTimeSeriesData(
        payload.timeSeriesData
      );

      setModels(payload.models);

      setAnalyticsMeta(
        payload.analyticsMeta || null
      );
    } catch (err) {
      console.error(
        "Failed to load AI analytics:",
        err
      );

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to load analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const booksModel = models?.books;
  const participationModel =
    models?.participation;

  const forecastMonth =
    getNextMonthLabel(timeSeriesData);

  const totalBooks = timeSeriesData.reduce(
    (sum, item) =>
      sum + (Number(item.books) || 0),
    0
  );

  const totalEssays = timeSeriesData.reduce(
    (sum, item) =>
      sum + (Number(item.participation) || 0),
    0
  );

  const activeBookMonths =
    timeSeriesData.filter(
      (item) => Number(item.books) > 0
    ).length;

  const activeEssayMonths =
    timeSeriesData.filter(
      (item) =>
        Number(item.participation) > 0
    ).length;

  const usingPython =
    analyticsMeta?.fallbackUsed === false;

  const hasLimitedHistory =
    activeBookMonths < 3 ||
    activeEssayMonths < 3;

  // -----------------------------------------------------------
  // Loading
  // -----------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-slate-200">
        <RefreshCw className="w-9 h-9 text-[#276B56] animate-spin" />

        <div className="text-center">
          <h3 className="font-black text-[#193E32]">
            Loading AI Analytics
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Retrieving MongoDB activity and AI predictions...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // Error
  // -----------------------------------------------------------

  if (error && !models) {
    return (
      <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />

        <h3 className="text-lg font-black text-slate-900 mt-4">
          Analytics Unavailable
        </h3>

        <p className="text-sm text-slate-600 mt-2">
          {error}
        </p>

        <button
          type="button"
          onClick={() => loadAnalytics()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#193E32] px-5 py-3 text-sm font-bold text-white hover:bg-[#276B56] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-[#193E32] p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-[#E8A94A]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E8A94A]/40 bg-[#E8A94A]/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#F6C875]">
              {/* <Sparkles className="w-4 h-4" /> */}
              AI-Powered Decision Support
            </span>

            <button
              type="button"
              onClick={() => loadAnalytics(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 disabled:opacity-60 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />
              {refreshing
                ? "Refreshing..."
                : "Refresh Data"}
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-6">
            Understand Your Impact.
            <br />
            <span className="text-[#E8A94A]">
              Plan What Comes Next.
            </span>
          </h1>

          <p className="text-sm text-white/75 max-w-2xl leading-relaxed mt-4">
            Explore real donation and essay activity,
            understand emerging trends, and use
            machine-learning estimates to support
            better planning decisions.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-2 text-xs font-semibold">
              <Database className="w-4 h-4 text-[#E8A94A]" />
              MongoDB Atlas Data
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-2 text-xs font-semibold">
              {usingPython ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              ) : (
                <Server className="w-4 h-4 text-amber-300" />
              )}

              {usingPython
                ? "Python Scikit-Learn Connected"
                : "JavaScript Prediction Fallback"}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-2 text-xs font-semibold">
              <Activity className="w-4 h-4 text-[#E8A94A]" />
              Six Completed Months
            </span>
          </div>
        </div>
      </div>

      {/* Refresh errors while retaining old data */}
      {error && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />

          <p className="text-sm text-amber-900">
            Latest refresh failed. Previously loaded
            analytics are still displayed. {error}
          </p>
        </div>
      )}

      {/* =====================================================
          KPI OVERVIEW
      ===================================================== */}

      <SectionHeading
        eyebrow="Performance overview"
        title="Your Last Six Months"
        description="Actual activity recorded in Roshan Safha's database, excluding the current incomplete month."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Books in Donation Records"
          value={formatNumber(totalBooks)}
          suffix="books"
          description="Total books reported through donation submissions during the six-month period."
        />

        <StatCard
          icon={FileText}
          label="Essay Submissions"
          value={formatNumber(totalEssays)}
          suffix="entries"
          description="Total essay submissions recorded during the six-month period."
          accent="gold"
        />

        <StatCard
          icon={BarChart3}
          label="Active Donation Months"
          value={`${activeBookMonths}/6`}
          description="Number of months with recorded book donation activity."
        />

        <StatCard
          icon={Activity}
          label="Active Essay Months"
          value={`${activeEssayMonths}/6`}
          description="Number of months with recorded essay submissions."
          accent="gold"
        />
      </div>

      {/* =====================================================
          DATA RELIABILITY NOTICE
      ===================================================== */}

      {hasLimitedHistory && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />

            <div>
              <h3 className="text-sm font-black text-amber-950">
                Early-Stage Data: Interpret Predictions Carefully
              </h3>

              <p className="text-sm text-amber-900/90 leading-relaxed mt-2">
                Some reporting periods contain little
                or no recorded activity. The AI can
                calculate a trend, but the resulting
                forecast may change significantly
                as new data arrives.
              </p>

              <p className="text-xs font-semibold text-amber-900 mt-3">
                Recommended approach: Use these
                estimates as planning indicators,
                not guaranteed outcomes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FORECAST CARDS
      ===================================================== */}

      <SectionHeading
        eyebrow="Machine-learning estimates"
        title={`Looking Ahead to ${forecastMonth}`}
        description="These estimates use Scikit-Learn linear regression when the Python AI service is available."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ForecastCard
          title="Book Donations"
          icon={BookOpen}
          model={booksModel}
          forecastMonth={forecastMonth}
          activeMonths={activeBookMonths}
        />

        <ForecastCard
          title="Essay Submissions"
          icon={FileText}
          model={participationModel}
          forecastMonth={forecastMonth}
          activeMonths={activeEssayMonths}
          color="gold"
        />
      </div>

      {/* =====================================================
          ACTIVITY CHARTS
      ===================================================== */}

      <SectionHeading
        eyebrow="Historical activity"
        title="See the Trends"
        description="Solid lines show actual records. Dashed extensions show model estimates for the following month."
      />

      <div className="grid grid-cols-1 gap-5">
        <ActivityChart
          title="Monthly Book Donation Activity"
          subtitle="Books recorded in donation submissions"
          data={timeSeriesData}
          dataKey="books"
          color={COLORS.green}
          forecast={booksModel?.forecast_next}
          forecastAvailable={
            booksModel?.forecast_available === true
          }
          unit="books"
        />

        <ActivityChart
          title="Monthly Essay Participation"
          subtitle="Essay submissions recorded each month"
          data={timeSeriesData}
          dataKey="participation"
          color={COLORS.gold}
          forecast={
            participationModel?.forecast_next
          }
          forecastAvailable={
            participationModel?.forecast_available === true
          }
          unit="essays"
        />
      </div>

      {/* =====================================================
          DATA SOURCE / MODEL INFORMATION
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#E7EEE5] rounded-3xl border border-[#D4E1D7] p-6">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-[#276B56]" />

            <h3 className="font-black text-[#193E32]">
              Where Does This Data Come From?
            </h3>
          </div>

          <p className="text-sm text-[#193E32]/80 leading-relaxed mt-4">
            Roshan Safha's Express backend
            aggregates donation and essay
            submissions stored in MongoDB Atlas.
            The Python AI service analyzes these
            monthly totals.
          </p>

          <div className="space-y-2 mt-4 text-xs text-[#193E32]/80">
            <p>
              <strong>Books:</strong>{" "}
              {analyticsMeta?.metricDefinitions?.books ||
                "Books recorded in donation submissions."}
            </p>

            <p>
              <strong>Participation:</strong>{" "}
              {analyticsMeta?.metricDefinitions?.participation ||
                "Number of essay submissions."}
            </p>
          </div>
        </div>

        <div className="bg-[#FFF9EF] rounded-3xl border border-amber-100 p-6">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-amber-700" />

            <h3 className="font-black text-[#193E32]">
              How Does the AI Work?
            </h3>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed mt-4">
            The system uses Ordinary Least Squares
            Linear Regression to identify historical
            trends and estimate the next monthly
            value. The estimate is calculated
            from the available observations.
          </p>

          <p className="text-xs text-slate-600 leading-relaxed mt-4">
            This is a statistical forecasting
            method. It does not guarantee future
            outcomes or independently verify
            whether reported donations have been
            physically collected.
          </p>
        </div>
      </div>

      {/* =====================================================
          TECHNICAL MODEL DETAILS
      ===================================================== */}

      <TechnicalDetails
        booksModel={booksModel}
        participationModel={participationModel}
        analyticsMeta={analyticsMeta}
      />

      {/* =====================================================
          FOOTNOTE
      ===================================================== */}

      <div className="flex items-start gap-2 px-2 text-xs text-slate-500 leading-relaxed">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />

        <p>
          {analyticsMeta?.disclaimer ||
            "Forecasts are estimates based on historical trends and should not be treated as guarantees."}
        </p>
      </div>
    </div>
  );
}