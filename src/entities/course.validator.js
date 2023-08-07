const Joi = require("joi");
const createCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": "Title should be a type of text",
    "string.empty": "Title is required",
    "string.min": "Title should have a minimum length of {#limit}",
    "string.max": "Title should have a maximum length of {#limit}",
    "string.alphanum": "Title should only contain alpha-numeric characters",
    "any.required": "Title is required",
  }),

  tagline: Joi.string().min(3).max(60).required().messages({
    "string.base": "Tagline should be a type of text",
    "string.empty": "Tagline is required",
    "string.min": "Tagline should have a minimum length of {#limit}",
    "string.max": "Tagline should have a maximum length of {#limit}",
    "string.alphanum": "Tagline should only contain alpha-numeric characters",
    "any.required": "Tagline is required",
  }),

  about: Joi.string().required().messages({
    "any.required": "About is required",
  }),

  category: Joi.string().required().messages({
    "any.required": "Category is required",
  }),

  difficulty: Joi.string().required().messages({
    "any.required": "Difficulty is required",
  }),

  price: Joi.number()
    .required()
    .positive()
    .max(1000 * 50)
    .messages({
      "number.base": "Price should be a number",
      "number.empty": "Price is required",
      "number.positive": "Price should be a positive number",
      "number.max": "Price should not exceed 50000",
      "any.required": "Price is required",
    }),
}).required();
module.exports = { createCourseSchema };
