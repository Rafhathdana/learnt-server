require("dotenv").config();
const connectDB = require("./frameworks/database/connection");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize"); //secure mongodb it check the data if it contain alteration
const xss = require("xss-clean"); // prevent Cross-Site Scripting (XSS) attacks. XSS attacks occur when malicious scripts are injected into web applications through user-supplied data.

const compression = require("./frameworks/web/middlewares/compression");
const authLimiter = require("./frameworks/web/middlewares/rate.limiter");
const customLog = require("./frameworks/web/middlewares/logger");
const errorHandler = require("./frameworks/web/middlewares/error.handler");
const app = express();
app.set("trust proxy", true);
//Custom Http logging console and local
app.use(customLog);

//Applies gzip compression to responses for better network performance
app.use(compression);
// prevent NoSQL injection attacks in applications that use MongoDB as their database.
app.use(mongoSanitize());
// protect against Cross-Site Scripting (XSS) attacks
app.use(xss());

app.use(express.json());
app.use(cookieParser());

//error will be handled here
app.use(errorHandler);
// Database connection setup
connectDB();

// Sample route for testing the server
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});
const server = app.listen(process.env.PORT, () => {
  console.log(`server started at port${process.env.PORT}`);
});
