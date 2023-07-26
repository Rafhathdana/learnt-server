require("dotenv").config();
const connectDB = require("./config/connection");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.set('trust proxy', true);
// Middleware
app.use(express.json());
app.use(cookieParser());

// Database connection setup
connectDB();

// Sample route for testing the server
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
