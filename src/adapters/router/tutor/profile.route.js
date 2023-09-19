const isAuth = require("../../middleware/tutor.auth");
const tutorController = require("../../controller/tutor.controller");
const router = require("express").Router();
router
  .route("/")
  .all(isAuth)
  .get(tutorController.getTutorDetails)
  .post(tutorController.updateTutorDetails);
router.route("/top").get(tutorController.getTopTutors);

module.exports = router;
