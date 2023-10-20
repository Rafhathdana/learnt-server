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
const corsOptions = require("./frameworks/web/middlewares/cors.options");
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
// security feature to control how web pages in one domain can request and access resources
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
// Limit requests - Prevent Brute force attacks to auth end points
if (process.env.NODE_ENV === "production") {
  app.use("/api/auth", authLimiter);
}

// Application Routes
app.use("/", require("./adapters/router"));

//unnessary route will be given 404 error
app.use("*", (req, res) => {
  res.status(404).json("Not found");
});
//error will be handled here
app.use(errorHandler);
// Database connection setup

const server = app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`server started at port${process.env.PORT}`);
});
//process closed due to the uncaught exception and exit with code of 1 (indicating an error)
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception - ", err);
  console.log("closing node process");
  process.exit(1);
});
//This event is triggered when a Promise is rejected, but there is no .catch() or .then(null, ...) handler to handle the rejection.
process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection - ", err);
  console.log("closing node process");
  process.exit(1);
});
//The server is closed by invoking its close method, which stops it from accepting new connections. The server will continue processing existing connections until they are completed or closed by the clients.
process.on("SIGTERM", () => {
  server.close((err) => {
    console.log("Http server closed");
    process.exit(err ? 1 : 0);
  });
});
