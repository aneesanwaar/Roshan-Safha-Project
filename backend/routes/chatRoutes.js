const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST /api/chat (Proxies query to Python NLTK / TF-IDF Chat Engine on port 8000)
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message content cannot be empty." });
    }

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

    const response = await axios.post(`${AI_SERVICE_URL}/api/ai/chat`, {
      message
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Chat Proxy Error:", error.message);
    return res.status(500).json({
      success: false,
      reply: "Our automated assistant is temporarily resting. Please reach out to us at roshansafha@gmail.com.",
      actionLink: "/contact"
    });
  }
});

module.exports = router;