const axios = require("axios");

const Donation = require("../models/Donation");
const Essay = require("../models/Essay");

// =============================================================
// ROSHAN SAFHA — AI ANALYTICS CONTROLLER
// =============================================================

// Metrics used by the existing Python AI service.
const METRICS = {
  books: "Book Donations",
  participation: "Essay Participation",
};

// -------------------------------------------------------------
// HELPER: Founder-friendly insights
// -------------------------------------------------------------

const buildInsight = (
  trend,
  forecast,
  metricName,
  sufficientData
) => {
  if (!sufficientData) {
    return {
      headline: "Not enough historical data",
      explanation:
        `We need more monthly ${metricName.toLowerCase()} records ` +
        "before we can make a meaningful prediction.",
      recommendation:
        "Continue recording activity regularly. " +
        "Predictions will become more useful as more data is collected.",
      confidence_label: "Insufficient Data",
    };
  }

  if (trend === "Increasing") {
    return {
      headline: `${metricName} activity is increasing`,
      explanation:
        `Based on recent monthly records, ${metricName.toLowerCase()} ` +
        "activity is trending upward. " +
        `The estimated activity for the next period is approximately ${forecast}.`,
      recommendation:
        "Prepare resources for potentially higher activity " +
        "and continue monitoring monthly trends.",
      confidence_label: "Historical Trend Estimate",
    };
  }

  if (trend === "Decreasing") {
    return {
      headline: `${metricName} activity is decreasing`,
      explanation:
        `Recent monthly records suggest a downward trend in ` +
        `${metricName.toLowerCase()} activity. ` +
        `The estimated activity for the next period is approximately ${forecast}.`,
      recommendation:
        "Review recent activities and consider outreach " +
        "or engagement initiatives.",
      confidence_label: "Historical Trend Estimate",
    };
  }

  return {
    headline: `${metricName} activity is relatively stable`,
    explanation:
      "Recent monthly records do not show a strong upward or " +
      "downward trend. " +
      `The estimated activity for the next period is approximately ${forecast}.`,
    recommendation:
      "Maintain current activities and monitor future changes.",
    confidence_label: "Historical Trend Estimate",
  };
};

// -------------------------------------------------------------
// HELPER: Empty or insufficient prediction
// -------------------------------------------------------------

const insufficientPrediction = (
  metricName,
  dataPoints,
  trend = "Insufficient Data"
) => ({
  slope: 0,
  intercept: 0,
  r2_score: null,
  forecast_next: null,
  growth_rate: null,
  trend,
  insight: buildInsight(
    trend,
    null,
    metricName,
    false
  ),
  data_points: dataPoints,
  model_name: "JavaScript Ordinary Least Squares",
  forecast_available: false,
});

// -------------------------------------------------------------
// HELPER: JavaScript OLS regression fallback
// -------------------------------------------------------------

const calculateLinearRegression = (dataArray, key) => {
  const metricName =
    METRICS[key] ||
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const values = Array.isArray(dataArray)
    ? dataArray.map((row) => {
        const value = Number(row?.[key]);

        return Number.isFinite(value)
          ? Math.max(0, value)
          : 0;
      })
    : [];

  const n = values.length;

  if (n < 3) {
    return insufficientPrediction(metricName, n);
  }

  if (values.every((value) => value === 0)) {
    return insufficientPrediction(
      metricName,
      n,
      "No Activity Recorded"
    );
  }

  // Ordinary Least Squares:
  // x = 0, 1, 2, ..., n - 1
  // y = monthly activity

  const meanX = (n - 1) / 2;

  const meanY =
    values.reduce((sum, value) => sum + value, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i += 1) {
    const xDifference = i - meanX;

    numerator +=
      xDifference * (values[i] - meanY);

    denominator +=
      xDifference * xDifference;
  }

  const slope =
    denominator > 0
      ? numerator / denominator
      : 0;

  const intercept =
    meanY - slope * meanX;

  // -----------------------------------------------------------
  // Forecast next monthly period
  // -----------------------------------------------------------

  const rawForecast =
    slope * n + intercept;

  const forecastNext = Math.max(
    0,
    Math.round(rawForecast)
  );

  // -----------------------------------------------------------
  // Calculate historical model fit (R²)
  // -----------------------------------------------------------

  const totalVariance = values.reduce(
    (sum, value) =>
      sum + Math.pow(value - meanY, 2),
    0
  );

  const residualVariance = values.reduce(
    (sum, value, index) => {
      const fittedValue =
        slope * index + intercept;

      return (
        sum +
        Math.pow(value - fittedValue, 2)
      );
    },
    0
  );

  let r2Score = null;

  // A constant series does not provide meaningful R².
  if (totalVariance > 1e-12) {
    r2Score =
      1 - residualVariance / totalVariance;

    r2Score = Math.round(
      r2Score * 1000
    ) / 1000;
  }

  // -----------------------------------------------------------
  // Calculate growth
  // -----------------------------------------------------------

  const initialValue = values[0];
  const latestValue = values[n - 1];

  const growthRate =
    initialValue > 0
      ? Math.round(
          ((latestValue - initialValue) /
            initialValue) *
            10000
        ) / 100
      : null;

  // -----------------------------------------------------------
  // Classify trend
  // -----------------------------------------------------------

  let trend = "Stable";

  if (Math.abs(slope) >= 0.01) {
    trend =
      slope > 0
        ? "Increasing"
        : "Decreasing";
  }

  return {
    slope: Math.round(slope * 100) / 100,
    intercept: Math.round(intercept * 100) / 100,
    r2_score: r2Score,
    forecast_next: forecastNext,
    growth_rate: growthRate,
    trend,
    insight: buildInsight(
      trend,
      forecastNext,
      metricName,
      true
    ),
    data_points: n,
    model_name: "JavaScript Ordinary Least Squares",
    forecast_available: true,
  };
};

// -------------------------------------------------------------
// HELPER: Build six completed calendar months
// -------------------------------------------------------------

const buildCompletedMonths = () => {
  const now = new Date();

  // UTC boundaries avoid local timezone shifts and month-end
  // overflow when constructing monthly periods.
  const currentMonthStart = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1
    )
  );

  const months = [];

  // Oldest completed month first.
  for (let offset = 6; offset >= 1; offset -= 1) {
    const monthStart = new Date(
      Date.UTC(
        currentMonthStart.getUTCFullYear(),
        currentMonthStart.getUTCMonth() - offset,
        1
      )
    );

    const year = monthStart.getUTCFullYear();
    const month = monthStart.getUTCMonth() + 1;

    const shortName = monthStart.toLocaleString(
      "en-US",
      {
        month: "short",
        timeZone: "UTC",
      }
    );

    months.push({
      year,
      month,
      monthStart,
      label: shortName,
      displayMonth: `${shortName} ${year}`,
    });
  }

  return {
    currentMonthStart,
    months,
    firstMonthStart: months[0].monthStart,
  };
};

// -------------------------------------------------------------
// HELPER: Safely read aggregation values
// -------------------------------------------------------------

const findMonthlyValue = (
  records,
  year,
  month,
  field
) => {
  const record = records.find(
    (item) =>
      item?._id?.year === year &&
      item?._id?.month === month
  );

  const value = Number(record?.[field] ?? 0);

  return Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
};

// -------------------------------------------------------------
// GET /api/admin/analytics/trends
// -------------------------------------------------------------

exports.getAnalyticsTrends = async (req, res) => {
  try {
    const {
      currentMonthStart,
      months,
      firstMonthStart,
    } = buildCompletedMonths();

    // ---------------------------------------------------------
    // 1. Read real monthly activity from MongoDB Atlas
    // ---------------------------------------------------------

    const [donationStats, essayStats] =
      await Promise.all([
        Donation.aggregate([
          {
            $match: {
              createdAt: {
                $gte: firstMonthStart,
                $lt: currentMonthStart,
              },
            },
          },
          {
            $group: {
              _id: {
                year: {
                  $year: {
                    date: "$createdAt",
                    timezone: "UTC",
                  },
                },
                month: {
                  $month: {
                    date: "$createdAt",
                    timezone: "UTC",
                  },
                },
              },
              totalBooks: {
                $sum: {
                  $ifNull: [
                    "$numberOfBooks",
                    0,
                  ],
                },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]),

        Essay.aggregate([
          {
            $match: {
              createdAt: {
                $gte: firstMonthStart,
                $lt: currentMonthStart,
              },
            },
          },
          {
            $group: {
              _id: {
                year: {
                  $year: {
                    date: "$createdAt",
                    timezone: "UTC",
                  },
                },
                month: {
                  $month: {
                    date: "$createdAt",
                    timezone: "UTC",
                  },
                },
              },
              totalParticipants: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]),
      ]);

    // ---------------------------------------------------------
    // 2. Construct evenly spaced monthly observations
    // ---------------------------------------------------------

    const timeSeriesData = months.map(
      ({ year, month, label, displayMonth }) => ({
        month: displayMonth,
        label,
        books: findMonthlyValue(
          donationStats,
          year,
          month,
          "totalBooks"
        ),
        participation: findMonthlyValue(
          essayStats,
          year,
          month,
          "totalParticipants"
        ),
      })
    );

    // ---------------------------------------------------------
    // 3. Request predictions from the Python AI service
    // ---------------------------------------------------------

    const AI_SERVICE_URL = (
      process.env.AI_SERVICE_URL ||
      "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    let models;
    let predictionEngine;
    let fallbackUsed = false;

    try {
      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/api/ai/predict-trends`,
        {
          timeSeriesData,
        },
        {
          timeout: 5000,
        }
      );

      if (
        !aiResponse.data?.success ||
        !aiResponse.data?.models?.books ||
        !aiResponse.data?.models?.participation
      ) {
        throw new Error(
          "Python AI service returned an invalid response."
        );
      }

      models = aiResponse.data.models;

      predictionEngine =
        "Python Scikit-Learn Linear Regression";
    } catch (aiError) {
      // The dashboard remains available if Flask is offline.
      // We explicitly identify the fallback engine.
      console.warn(
        "Python AI service unavailable; using JavaScript fallback:",
        aiError.message
      );

      models = {
        books: calculateLinearRegression(
          timeSeriesData,
          "books"
        ),
        participation: calculateLinearRegression(
          timeSeriesData,
          "participation"
        ),
      };

      predictionEngine =
        "JavaScript Ordinary Least Squares";

      fallbackUsed = true;
    }

    // ---------------------------------------------------------
    // 4. Respond using existing API structure
    // ---------------------------------------------------------

    return res.status(200).json({
      success: true,

      // Existing frontend-compatible fields.
      timeSeriesData,
      models,

      // Additional metadata for the improved dashboard.
      analyticsMeta: {
        predictionEngine,
        fallbackUsed,
        dataSource: "MongoDB Atlas",
        reportingPeriod: "Monthly",
        historicalMonths: 6,
        completedMonthsOnly: true,
        forecastPeriod: "Next calendar month",
        metricDefinitions: {
          books:
            "Number of books recorded in donation submissions.",
          participation:
            "Number of essay submissions.",
        },
        disclaimer:
          "Forecasts are estimates based on historical trends. " +
          "They are not guarantees of future activity.",
      },
    });
  } catch (error) {
    console.error(
      "Analytics Trends Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Unable to generate analytics. Please try again.",
    });
  }
};