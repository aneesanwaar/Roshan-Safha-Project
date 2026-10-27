import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score


# -------------------------------------------------------------
# Helpers
# -------------------------------------------------------------

def build_insight(trend, forecast, metric_name, sufficient_data):
    """
    Generate simple, founder-friendly explanations.
    """

    if not sufficient_data:
        return {
            "headline": "Not enough historical data",
            "explanation": (
                f"We need more monthly {metric_name.lower()} records "
                "before we can make a meaningful prediction."
            ),
            "recommendation": (
                "Continue recording activity regularly. "
                "Predictions will become more useful as more data is collected."
            ),
            "confidence_label": "Insufficient Data"
        }

    if trend == "Increasing":
        return {
            "headline": f"{metric_name} activity is increasing",
            "explanation": (
                f"Based on recent monthly records, {metric_name.lower()} "
                f"activity is trending upward. The estimated activity "
                f"for the next period is approximately {forecast}."
            ),
            "recommendation": (
                "Prepare resources for potentially higher activity "
                "and continue monitoring monthly trends."
            ),
            "confidence_label": "Historical Trend Estimate"
        }

    if trend == "Decreasing":
        return {
            "headline": f"{metric_name} activity is decreasing",
            "explanation": (
                f"Recent monthly records suggest a downward trend in "
                f"{metric_name.lower()} activity. The estimated activity "
                f"for the next period is approximately {forecast}."
            ),
            "recommendation": (
                "Review recent activities and consider outreach "
                "or engagement initiatives."
            ),
            "confidence_label": "Historical Trend Estimate"
        }

    return {
        "headline": f"{metric_name} activity is relatively stable",
        "explanation": (
            f"Recent monthly records do not show a strong upward or "
            f"downward trend. The estimated activity for the next "
            f"period is approximately {forecast}."
        ),
        "recommendation": (
            "Maintain current activities and monitor future changes."
        ),
        "confidence_label": "Historical Trend Estimate"
    }


# -------------------------------------------------------------
# Scikit-Learn Linear Regression
# -------------------------------------------------------------

def run_linear_regression(time_series_data, target_key="books"):
    """
    Analyze monthly data using Scikit-Learn Ordinary Least Squares.

    Preserves existing API fields:
        slope
        intercept
        r2_score
        forecast_next
        growth_rate
        trend

    Adds:
        insight
        data_points
        model_name
        forecast_available
    """

    metric_names = {
        "books": "Book Donations",
        "participation": "Essay Participation"
    }

    metric_name = metric_names.get(
        target_key,
        target_key.replace("_", " ").title()
    )

    # ---------------------------------------------------------
    # Validate input
    # ---------------------------------------------------------

    if not isinstance(time_series_data, list):
        time_series_data = []

    if len(time_series_data) == 0:
        insight = build_insight(
            "Insufficient Data",
            None,
            metric_name,
            False
        )

        return {
            "slope": 0.0,
            "intercept": 0.0,
            "r2_score": None,
            "forecast_next": None,
            "growth_rate": None,
            "trend": "Insufficient Data",
            "insight": insight,
            "data_points": 0,
            "model_name": "Scikit-Learn Linear Regression",
            "forecast_available": False
        }

    # ---------------------------------------------------------
    # Prepare numeric data
    # ---------------------------------------------------------

    df = pd.DataFrame(time_series_data)

    if target_key not in df.columns:
        df[target_key] = 0.0

    df[target_key] = pd.to_numeric(
        df[target_key],
        errors="coerce"
    ).fillna(0.0)

    df[target_key] = df[target_key].clip(lower=0)

    values = df[target_key].to_numpy(dtype=float)

    data_points = len(values)

    # ---------------------------------------------------------
    # Require at least 3 observations for a basic forecast
    # ---------------------------------------------------------

    if data_points < 3:
        insight = build_insight(
            "Insufficient Data",
            None,
            metric_name,
            False
        )

        return {
            "slope": 0.0,
            "intercept": 0.0,
            "r2_score": None,
            "forecast_next": None,
            "growth_rate": None,
            "trend": "Insufficient Data",
            "insight": insight,
            "data_points": data_points,
            "model_name": "Scikit-Learn Linear Regression",
            "forecast_available": False
        }

    # ---------------------------------------------------------
    # Avoid presenting all-zero data as a useful forecast
    # ---------------------------------------------------------

    if np.all(values == 0):
        insight = build_insight(
            "Insufficient Data",
            None,
            metric_name,
            False
        )

        return {
            "slope": 0.0,
            "intercept": 0.0,
            "r2_score": None,
            "forecast_next": None,
            "growth_rate": None,
            "trend": "No Activity Recorded",
            "insight": insight,
            "data_points": data_points,
            "model_name": "Scikit-Learn Linear Regression",
            "forecast_available": False
        }

    # ---------------------------------------------------------
    # Train linear regression model
    # ---------------------------------------------------------

    X = np.arange(data_points).reshape(-1, 1)
    y = values

    model = LinearRegression()
    model.fit(X, y)

    slope = float(model.coef_[0])
    intercept = float(model.intercept_)

    # ---------------------------------------------------------
    # Calculate actual R²
    # ---------------------------------------------------------

    predictions = model.predict(X)

    if np.allclose(values, values[0]):
        model_r2 = None
    else:
        model_r2 = float(r2_score(values, predictions))

    # ---------------------------------------------------------
    # Forecast next period
    # ---------------------------------------------------------

    next_period = np.array([[data_points]])

    raw_forecast = float(
        model.predict(next_period)[0]
    )

    forecast_next = max(
        0,
        int(round(raw_forecast))
    )

    # ---------------------------------------------------------
    # Calculate growth rate
    # ---------------------------------------------------------

    initial_value = float(values[0])
    latest_value = float(values[-1])

    if initial_value > 0:
        growth_rate = round(
            (
                (latest_value - initial_value)
                / initial_value
            ) * 100,
            2
        )
    else:
        growth_rate = None

    # ---------------------------------------------------------
    # Determine trend
    # ---------------------------------------------------------

    if abs(slope) < 0.01:
        trend = "Stable"
    elif slope > 0:
        trend = "Increasing"
    else:
        trend = "Decreasing"

    # ---------------------------------------------------------
    # Generate founder-friendly explanation
    # ---------------------------------------------------------

    insight = build_insight(
        trend,
        forecast_next,
        metric_name,
        True
    )

    return {
        "slope": round(slope, 2),
        "intercept": round(intercept, 2),
        "r2_score": (
            round(model_r2, 3)
            if model_r2 is not None
            else None
        ),
        "forecast_next": forecast_next,
        "growth_rate": growth_rate,
        "trend": trend,
        "insight": insight,
        "data_points": data_points,
        "model_name": "Scikit-Learn Linear Regression",
        "forecast_available": True
    }