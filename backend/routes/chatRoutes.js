const express = require("express");
const router = express.Router();
const axios = require("axios");

const MAX_CHAT_CHARS = 2000;
const AI_TIMEOUT_MS = 5000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// POST /api/chat — public chatbot; validate before forwarding to Flask.
router.post("/", async (req, res) => {
  const message = req.body?.message;

  if (typeof message !== "string") {
    return res.status(400).json({ success: false, error: "Message must be a string." });
  }

  const cleanMessage = message.trim();
  if (!cleanMessage) {
    return res.status(400).json({ success: false, error: "Message cannot be empty." });
  }
  if (cleanMessage.length > MAX_CHAT_CHARS) {
    return res.status(400).json({ success: false, error: "Message must not exceed 2000 characters." });
  }

  const serviceKey = process.env.AI_SERVICE_KEY;
  if (!serviceKey) {
    console.error("Chat proxy: AI_SERVICE_KEY is not configured");
    return res.status(503).json({
      success: false,
      reply: "Our automated assistant is temporarily resting. Please reach out to us at roshansafha@gmail.com.",
      actionLink: "/contact"
    });
  }

  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/ai/chat`,
      { message: cleanMessage },
      { timeout: AI_TIMEOUT_MS, headers: { "X-AI-Service-Key": serviceKey } }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    // Log operational context only; do not expose internal exception details.
    console.error("Chat proxy request failed:", error.code || error.response?.status || "upstream_error");
    const status = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT" ? 504 : 502;
    return res.status(status).json({
      success: false,
      reply: "Our automated assistant is temporarily resting. Please reach out to us at roshansafha@gmail.com.",
      actionLink: "/contact"
    });
  }
});

module.exports = router;
