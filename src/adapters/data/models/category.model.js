const { Schema, model } = require("mongoose");
const { CATEGORIES } = require("../../../frameworks/database/collection");
const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = model(CATEGORIES, categorySchema);
