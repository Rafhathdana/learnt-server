const { Schema, model } = require("mongoose");
const {
  COURSES,
  USERS,
  LESSONS,
} = require("../../../frameworks/database/collection");

const lessonScheme = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: COURSES,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoKey: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    order: {
      type: Number,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: USERS }],
  },
  {
    timestamps: true,
  }
);
module.exports = model(LESSONS, lessonScheme);
