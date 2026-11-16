import os
import math
from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_models.trend_analyzer import run_linear_regression
from nlp.chatbot_engine import predict_intent

app = Flask(__name__)
# Limit request bodies before JSON parsing. Applies to both AI endpoints.
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024
CORS(app)  # Existing behavior; restrict origins in the dedicated CORS patch.

MAX_CHAT_CHARS = 2000
MAX_SERIES_ROWS = 120


def read_json_object():
    if not request.is_json:
        return None, (jsonify({"success": False, "error": "Content-Type must be application/json."}), 415)
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return None, (jsonify({"success": False, "error": "A JSON object is required."}), 400)
    return payload, None


@app.errorhandler(413)
def request_too_large(_error):
    return jsonify({"success": False, "error": "Request body is too large."}), 413


@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "service": "Roshan Safha Python AI & NLP Engine",
        "status": "online",
        "modules": ["Scikit-Learn OLS Regression", "NLTK / TF-IDF Hybrid Chatbot"]
    })

@app.route("/api/ai/predict-trends", methods=["POST"])
def predict_trends():
    payload, error = read_json_object()
    if error is not None:
        return error

    time_series = payload.get("timeSeriesData", [])
    if not isinstance(time_series, list) or len(time_series) > MAX_SERIES_ROWS:
        return jsonify({"success": False, "error": "timeSeriesData must be a list of at most 120 rows."}), 400

    for row in time_series:
        if not isinstance(row, dict):
            return jsonify({"success": False, "error": "Each time-series row must be an object."}), 400
        for key in ("books", "participation"):
            value = row.get(key, 0)
            if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0 or value > 1_000_000_000:
                return jsonify({"success": False, "error": f"{key} must be a finite, non-negative number."}), 400

    books_model = run_linear_regression(time_series, target_key="books")
    participation_model = run_linear_regression(time_series, target_key="participation")

    return jsonify({
        "success": True,
        "models": {
            "books": books_model,
            "participation": participation_model
        }
    })


@app.route("/api/ai/chat", methods=["POST"])
def chat():
    payload, error = read_json_object()
    if error is not None:
        return error

    message = payload.get("message")
    if not isinstance(message, str):
        return jsonify({"success": False, "error": "Message must be a string."}), 400
    user_message = message.strip()
    if not user_message:
        return jsonify({"success": False, "error": "Query cannot be empty"}), 400
    if len(user_message) > MAX_CHAT_CHARS:
        return jsonify({"success": False, "error": "Message must not exceed 2000 characters."}), 400

    result = predict_intent(user_message)
    return jsonify({
        "success": True,
        "reply": result["response"],
        "actionLink": result["action_link"],
        "meta": {
            "intent": result["intent"],
            "confidence": result["confidence"],
            "engine": "Python Scikit-Learn & NLTK"
        }
    })


if __name__ == "__main__":
    # Local development entry point only. Production should use a WSGI server.
    port = int(os.getenv("AI_PORT", "8000"))
    host = os.getenv("AI_HOST", "127.0.0.1")
    debug = os.getenv("FLASK_DEBUG", "false").strip().lower() in ("1", "true", "yes", "on")

    if debug and host not in ("127.0.0.1", "localhost", "::1"):
        raise RuntimeError("Flask debugger must only be enabled on a loopback interface.")

    print(f"Python AI Microservice running on http://{host}:{port} (debug={debug})")
    app.run(host=host, port=port, debug=debug)