const { createCourseSchema } = require("../../entities/course.validator");
const objectIdSchema = require("../../entities/id.validator");
const errorHandler = require("../../frameworks/web/middlewares/error.handler");
const AppError = require("../../frameworks/web/utils/app.error.util");
const asyncHandler = require("../../frameworks/web/utils/async.handler.util");
const courseService = require("../../usecases/course.service");
const getTutorDashboard = asyncHandler(async (req, res) => {
  if (!req.tutor._id) throw AppError.validation("error");
  const coursesData = {};
  coursesData = await courseService.getAllCourseCountByTutor(req?.tutor._id);
  return res.status(200).json({ message: "courses found", data: coursesData });
});
