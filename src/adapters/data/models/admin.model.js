const mongoose = require("mongoose");
const { ADMINS } = require("../../../frameworks/database/collection");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    adminname: {
      type: String,
      required: true,
      unique: true,
    },
    isBlocked: {
      type: Boolean,
      default: true,
    },
    token: Array,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(ADMINS, userSchema);
