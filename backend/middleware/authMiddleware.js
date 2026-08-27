const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the "Authorization" header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get the token from the header (Bearer <token_string>)
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in DB and attach to the request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next function (the Controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token found' });
  }
};

module.exports = { protect };