import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.SECRET_KEY;
import jwt from "jsonwebtoken";

// Middleware to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default verifyToken;
