// Stage 1.5A: public write-endpoint rate limits (in-memory, per client IP).
const { rateLimit } = require("express-rate-limit");

function publicLimiter(windowMs, limit, label) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { success: false, error: `Too many ${label} requests. Please try again later.` },
  });
}

const chatbotLimiter = publicLimiter(5 * 60 * 1000, 30, "chatbot");
const contactLimiter = publicLimiter(15 * 60 * 1000, 5, "contact form");
const donationLimiter = publicLimiter(15 * 60 * 1000, 10, "donation");

module.exports = { chatbotLimiter, contactLimiter, donationLimiter };
