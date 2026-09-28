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

      // 5. Ensure user still exists in the database
      if (!req.user) {
        return res.status(401).json({ error: 'User no longer exists, token invalid.' });
      }

      return next(); // Move to the next function (the Controller)
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ error: 'Not authorized, token failed.' });
    }
  }

  // If no Bearer token was provided in headers
  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token found.' });
  }
};

// Role-based Access Control Guard (e.g. authorizeRoles('admin', 'Super Admin'))
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `User role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };