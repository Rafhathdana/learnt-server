const { createCourseSchema } = require("../../entities/course.validator");
const errorHandler = require("../../frameworks/web/middlewares/error.handler");
const AppError = require("../../frameworks/web/utils/app.error.util");
const asyncHandler = require("../../frameworks/web/utils/async.handler.util");
const courseService = require("../../usecases/course.service");

const handleCourseCreate = asyncHandler(async (req, res) => {
  const { value, error } = createCourseSchema.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const course = await courseService.courseCreate(req.file, value, req.tutor);
  return res.status(200).json({ message: "course created successfully" });
});
const getAllCourseByTutor = async (req, res) => {
  if (!req.tutor._id) throw AppError.validation("error");
  const courses = await courseService.getAllCourseByTutor(req?.tutor._id);
  return res.status(200).json({ message: "courses found", data: courses });
};
const getSpecificCourse = async (req, res) => {
  const course = await courseService.getCourseDetails(req.params.id);
  res.status(200).json({ message: "course Found", data: course });
};
module.exports = {
  handleCourseCreate,
  getAllCourseByTutor,
  getSpecificCourse,
};
