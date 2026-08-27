const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  // Sign the token with the User ID and your Secret Key from .env
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token is valid for 30 days
  });
};

module.exports = generateToken;