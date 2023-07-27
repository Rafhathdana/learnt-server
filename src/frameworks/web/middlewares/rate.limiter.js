const rateLimit = require("express-rate-limit"); // for avoiding brute force attack
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //time period
  max: 40,
  message: "too many request from this IP , please try again later",
  skipSuccessfulRequests: true,
});
module.exports = authLimiter;
