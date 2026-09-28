import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

def run_linear_regression(time_series_data, target_key='books'):
    """
    Executes Scikit-Learn Ordinary Least Squares Linear Regression.
    """
    if not time_series_data or len(time_series_data) < 2:
        return {
            "slope": 0.0,
            "intercept": 0.0,
            "r2_score": 0.0,
            "forecast_next": 0,
            "growth_rate": 0,
            "trend": "Insufficient Data"
        }

    df = pd.DataFrame(time_series_data)
    
    # Feature matrix X (steps 0, 1, 2...) and target vector y
    X = np.arange(len(df)).reshape(-1, 1)
    y = df[target_key].to_numpy().reshape(-1, 1)

    model = LinearRegression()
    model.fit(X, y)

    slope = float(model.coef_[0][0])
    intercept = float(model.intercept_[0])
    r2_score = float(model.score(X, y))

    # Forecast next step
    next_step = np.array([[len(df)]])
    prediction = model.predict(next_step)
    forecast_next = int(max(0, round(float(prediction[0][0]))))
# 5. Percentage Growth Surge
    initial_val = float(df[target_key].iloc[0])
    latest_val = float(df[target_key].iloc[-1])
    
    # Handle flat zero datasets cleanly
    if initial_val == 0 and latest_val == 0:
        growth_rate = 0.0
        trend_status = "No Activity Recorded"
    elif initial_val == 0:
        growth_rate = round(latest_val * 100.0, 2)
        trend_status = "Accelerating Growth" if slope > 0 else "Steady Growth"
    else:
        growth_rate = round(((latest_val - initial_val) / initial_val) * 100.0, 2)
        trend_status = "Accelerating Growth" if slope > 5 else ("Steady Growth" if slope > 0 else "Decline")

    return {
        "slope": round(slope, 2),
        "intercept": round(intercept, 2),
        "r2_score": round(r2_score, 3),
        "forecast_next": forecast_next,
        "growth_rate": growth_rate,
        "trend": trend_status
    }
   