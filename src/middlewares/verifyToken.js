const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

module.exports = verifyToken;
