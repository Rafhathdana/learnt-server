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
    username: {
      type: String,
      required: true,
      unique: true,
    },
    enrolledCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    token: Array,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(ADMINS, userSchema);
