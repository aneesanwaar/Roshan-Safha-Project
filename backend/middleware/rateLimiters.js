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

// Count failed login attempts, but do not penalize successful logins.
// Express-rate-limit skips responses with status < 400 when skipSuccessfulRequests is true.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, error: "Too many failed login attempts. Please try again in 15 minutes." },
});

// Broad safety net; route-specific limits from Stage 1.5A remain stricter.
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, error: "Too many API requests. Please try again later." },
});

module.exports = { chatbotLimiter, contactLimiter, donationLimiter, loginLimiter, generalApiLimiter };
