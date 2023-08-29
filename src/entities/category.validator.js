const Joi = require("joi");
const createCategorySchema = Joi.object({
  title: Joi.string().min(3).max(30).trim().required().messages({
    "string.base": "Title should be a type of text",
    "string.empty": "Title is required",
    "any.required": "Title is required",
    "string.min": "Title should have a minimum length of 3",
    "string.max": "Title should have a maximum length of 30",
    "string.alphanum": "Title should only contain alpha-numeric characters",
  }),

  description: Joi.string().required().min(50).max(90).messages({
    "string.base": "Description should be a type of text",
    "string.empty": "Description is required",
    "string.min": "Description should have a minimum length of 3",
    "string.max": "Description should have a maximum length of 30",
    "any.required": "Description is required",
  }),
}).required()
module.exports={createCategorySchema}
