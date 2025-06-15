const jwt = require("jsonwebtoken");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY5Zjk5MWRjLTg5NWYtNGI1NS05YzUwLTg1NmZjYzU2MjJjMCIsImVtYWlsIjoiYWRtaW5Ac29saWdhbnQuY29tIiwiaWF0IjoxNzQ5OTY4OTQzLCJleHAiOjE3NTAwNTUzNDN9.pPruL2Evm_k96tWQUSg9ksIuQPY7vcFa2FeHziZZ2C0";

// Decode token without verification to see payload
console.log("Token payload:", jwt.decode(token));

// Check expiration
const payload = jwt.decode(token);
const now = Math.floor(Date.now() / 1000);
console.log("Current timestamp:", now);
console.log("Token expires at:", payload.exp);
console.log("Token expired?", now > payload.exp);

// Verify with JWT_SECRET
try {
  const JWT_SECRET =
    process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-here-make-it-long-and-random";
  const verified = jwt.verify(token, JWT_SECRET);
  console.log("Token verified successfully:", verified);
} catch (error) {
  console.error("Token verification failed:", error.message);
}
