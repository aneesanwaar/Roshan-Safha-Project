const axios = require('axios');

const verifyRecaptcha = async (req, res, next) => {
  // 1. Professional Bypass: If we are in development mode, skip verification for Postman testing
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const token = req.body.recaptchaToken;

  if (!token) {
    return res.status(400).json({ error: "Please complete the reCAPTCHA" });
  }

  try {
    // 2. Contact Google to verify the token 
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
    );

    if (response.data.success) {
      return next(); 
    } else {
      return res.status(400).json({ error: "reCAPTCHA verification failed. Bot detected." });
    }
  } catch (error) {
    return res.status(500).json({ error: "reCAPTCHA server communication error" });
  }
};

module.exports = verifyRecaptcha;