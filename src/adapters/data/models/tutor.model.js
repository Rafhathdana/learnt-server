const mongoose = require("mongoose");
const tutorSchema = new mongoose.Schema([
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
    occupation: String,
    skills: Array,
    enrolledCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    token: Array,
  },
  {
    timestamps: true,
  },
]);
module.exports = mongoose.model("tutors", tutorSchema);
