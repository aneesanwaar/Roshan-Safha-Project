const axios = require('axios');

const verifyRecaptcha = async (req, res, next) => {
  // Preserve the existing local-development workflow. Never bypass in production.
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret || !secret.trim()) {
    console.error('reCAPTCHA verification unavailable: RECAPTCHA_SECRET is not configured');
    return res.status(503).json({ error: 'reCAPTCHA verification is temporarily unavailable.' });
  }

  const token = req.body && req.body.recaptchaToken;
  if (typeof token !== 'string' || !token.trim() || token.length > 4096) {
    return res.status(400).json({ error: 'Please complete the reCAPTCHA.' });
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 5000,
    });

    if (response.data && response.data.success === true) {
      return next();
    }
    return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
  } catch (error) {
    console.error('reCAPTCHA verification request failed:', error.message);
    return res.status(503).json({ error: 'reCAPTCHA verification is temporarily unavailable.' });
  }
};

module.exports = verifyRecaptcha;
