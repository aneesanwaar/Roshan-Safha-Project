import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_models.trend_analyzer import run_linear_regression
from nlp.chatbot_engine import predict_intent

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "service": "Roshan Safha Python AI & NLP Engine",
        "status": "online",
        "modules": ["Scikit-Learn OLS Regression", "NLTK / TF-IDF Hybrid Chatbot"]
    })

@app.route("/api/ai/predict-trends", methods=["POST"])
def predict_trends():
    payload = request.get_json() or {}
    time_series = payload.get("timeSeriesData", [])
    
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
    payload = request.get_json() or {}
    user_message = payload.get("message", "").strip()

    if not user_message:
        return jsonify({"success": False, "error": "Query cannot be empty"}), 400

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