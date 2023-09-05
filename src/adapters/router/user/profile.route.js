const isAuth = require("../../middleware/user.auth");
const isAuthOptional = require("../../middleware/auth.optional");
const userController = require("../../controller/user.controller");
const { validateParams } = require("../../middleware/validate.params");
const router = require("express").Router();
router
  .route("/")
  .all(isAuth)
  .get(userController.getUserDetails)
  .post(userController.updateUserDetails);
router
  .route("/enrolled/:id/check")
  .get(validateParams, isAuthOptional, userController.checkCourseEnrolled);
module.exports = router;
