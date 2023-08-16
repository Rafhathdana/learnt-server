const Joi = require("joi");

const URLRegex =
  /^(https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+)|(https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+)|[a-zA-Z0-9_-]+$/;

const tutorDetailsSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z\s]*$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "Name should be a type of text",
      "string.empty": "Name cannot be empty",
      "string.min": "Name should have a minimum length of {#limit}",
      "string.max": "Name should have a maximum length of {#limit}",
      "string.pattern.base":
        "Name should only contain characters and space, and space is not permitted on first",
      "any.required": "'name' is a required field",
    }),
  about: Joi.string().optional().min(3).empty(""),
  website: Joi.string()
    .uri()
    .custom((value, helpers) => {
      if (!value || value.trim().length === 0) {
        return value; // Empty or undefined value is valid
      }
      if (!URLRegex.test(value.trim())) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .optional()
    .empty(""),
  age: Joi.number().integer().min(0).optional(),
  address: Joi.string().optional(),
  gitLink: Joi.string()
    .custom((value, helpers) => {
      if (!value || value.trim().length === 0) {
        return value; // Empty or undefined value is valid
      }
      if (!URLRegex.test(value.trim())) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .optional()
    .empty(""),
  linkedinLink: Joi.string()
    .custom((value, helpers) => {
      if (!value || value.trim().length === 0) {
        return value; // Empty or undefined value is valid
      }
      if (!URLRegex.test(value.trim())) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .optional()
    .empty(""),
  occupation: Joi.string().min(1).optional(),
  qualification: Joi.string().min(1).optional(),
});

module.exports = tutorDetailsSchema;
