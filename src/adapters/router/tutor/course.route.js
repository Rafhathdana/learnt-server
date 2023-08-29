const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const courseContoller = require("../../controller/course.controller");
const isAuthTutor = require("../../middleware/tutor.auth");
router
  .route("/create")
  .post(
    isAuthTutor,
    upload.single("thumbnail"),
    courseContoller.handleCourseCreate
  );
router.route("/").get(isAuthTutor, courseContoller.getAllCourseByTutor);
router.route("/:id").all(isAuthTutor).get(courseContoller.getSpecificCourse);
module.exports = router;
