const { model, Schema } = require("mongoose");
const { TUTORS, LESSONS } = require("../../../frameworks/database/collection");

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    tutor: {
      type: Schema.Types.ObjectId,
      ref: TUTORS,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    lessons: [{ type: Schema.Types.ObjectId, ref: LESSONS }],
  },
  {
    timestamps: true,
  }
);
module.exports = model("courses", courseSchema);
