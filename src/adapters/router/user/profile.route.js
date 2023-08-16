const isAuth = require("../../middleware/user.auth");
const userController = require("../../controller/user.controller");
const router = require("express").Router();
router
  .route("/")
  .all(isAuth)
  .get(userController.getUserDetails)
  .post(userController.updateUserDetails);
module.exports = router;
