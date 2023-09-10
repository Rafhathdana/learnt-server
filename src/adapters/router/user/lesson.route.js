const router = require("express").Router();
const lessonController = require("../../controller/lesson.controller");
const { validateParams } = require("../../middleware/validate.params");

router.route("/:id").get(validateParams, lessonController.getLesson);
module.exports = router;
