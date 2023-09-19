const router = require("express").Router();
const courseController = require("../../controller/course.controller");
const { validateParams } = require("../../middleware/validate.params");
const isAuth = require("../../middleware/user.auth");

router.route("/").get(courseController.getAllCourses);
router
  .route("/enroll")
  .all(isAuth)
  .get(courseController.getEnrolledCourses)
  .post(courseController.enrollCourse);
router
  .route("/enroll/:id")
  .get(validateParams, courseController.getSpecificCourse);
router
  .route("/enrolled/:id")
  .all(isAuth)
  .get(
    validateParams,
    courseController.enrollValidation,
    courseController.getSpecificCourse
  );
module.exports = router;
