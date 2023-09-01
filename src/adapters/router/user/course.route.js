const router = require("express").Router();
const courseController = require("../../controller/course.controller");
const { validateParams } = require("../../middleware/validate.params");
const isAuth = require("../../middleware/user.auth");

router.route("/").get(courseController.getAllCourses);
router
  .route("/enroll/:id")
  .get(validateParams, courseController.getSpecificCourse);
module.exports = router;
