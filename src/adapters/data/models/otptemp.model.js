const mongoose = require("mongoose");
const { OTPTEMP } = require("../../../frameworks/database/collection");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    createdAt: { type: Date, expires: "10m", default: Date.now }, // TTL of 10 minutes (10m)
  },
  {
    // Set the 'expires' option for the 'createdAt' field to automatically remove data after 4 minutes (240 seconds)
    // Note: The 'expires' option is specified in seconds
    expires: 600,
  }
);

// Create the index on 'createdAt' field
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

// Create the model using the dynamically referenced collection name
const OTPTEMPModel = mongoose.model(OTPTEMP, otpSchema);

module.exports = OTPTEMPModel;
