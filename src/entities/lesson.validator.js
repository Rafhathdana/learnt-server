const Joi = require("joi");
const createLessonSchema = Joi.object({
  title: Joi.string().trim().min(3).max(50).required().messages({
    "string.base": "Title should be a type of text",
    "string.empty": "Title is required",
    "string.min": "Title should have a minimum length of 3",
    "string.max": "Title should have a maximum length of 50",
    "string.alphanum": "Title should only contain alpha-numeric characters",
  }),
  courseId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Course ID is required",
    "string.length": "Inavalid course",
  }),

  description: Joi.string().required(),
}).required();

module.exports = { createLessonSchema };
