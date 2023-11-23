const { createCourseSchema } = require("../../entities/course.validator");
const objectIdSchema = require("../../entities/id.validator");
const errorHandler = require("../../frameworks/web/middlewares/error.handler");
const AppError = require("../../frameworks/web/utils/app.error.util");
const asyncHandler = require("../../frameworks/web/utils/async.handler.util");
const courseService = require("../../usecases/course.service");
const userService = require("../../usecases/user.service");
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
  const totalStudentsEnrolled = await userService.getEnrolledStudentsCount(
    req.params.id
  );
  course.totalStudentsEnrolled = totalStudentsEnrolled;
  res.status(200).json({ message: "course Found", data: course });
};
const getAllCourses = async (req, res) => {
  let query = {
    page: parseInt(req.query.page) - 1 || 0,
    limit: parseInt(req.query.limit) || 5,
    search: req.query.search || "",
    difficulty: req.query.difficulty || "all",
    sort: req.query.sort || "createdAt",
    category: req.query.category || "all",
    reqSort: req.query.sort,
  };
  const { courses, total } = await courseService.getAllCourseByFilter(query);
  return res
    .status(200)
    .json({ message: "Course found", total, data: courses });
};
const enrollCourse = async (req, res) => {
  const { error } = await objectIdSchema.validate(req.body.courseId);
  if (error) return res.status(400).json({ message: "invalid course id" });
  const params = {
    courseId: req.body.courseId,
    userId: req.user._id,
  };
  const isEnrolled = await courseService.enrollInCourse(params);
  res.status(200).json({
    message: "student enrolled for course successfully",
    data: req.body,
  });
};
const getEnrolledCourses = async (req, res) => {
  const enrolledCourses = await courseService.getEnrolledCourses(req.user._id);
  return res.status(200).json({ message: "success", data: enrolledCourses });
};
const enrollValidation = async (req, res, next) => {
  const params = {
    courseId: req.params.id,
    userId: req.user._id,
  };
  const isEnrolled = await userService.isEnrolledForCourse(params);
  if (isEnrolled) {
    next();
    return;
  }
  res.status(403).json({ error: "course not enrolled" });
};
module.exports = {
  handleCourseCreate,
  getAllCourseByTutor,
  getSpecificCourse,
  getAllCourses,
  enrollCourse,
  getEnrolledCourses,
  enrollValidation,
};
