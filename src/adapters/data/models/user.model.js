const mongoose = require("mongoose");
const { USERS } = require("../../../frameworks/database/collection");
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
    about: String,
    website: String,
    age: Number,
    address: String,
    gitLink: String,
    linkedinLink: String,
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    // ActiveCourse: [
    //   { courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" } },
    //   {
    //     currentlessons: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "lessons",
    //     },
    //   },
    // ],
    occupation: String,
    token: Array,
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(USERS, userSchema);
