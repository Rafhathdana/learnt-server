const router = require("express").Router();
const authController = require("../controller/auth.controller");
/**
 * @desc User Authentcion routes
 * @route /api/auth/
 * @access public
 */

router.route("/signin").post(authController.handleSignIn);
router.route("/signup").post(authController.handleSignUp);
router.route("/sendotp").post(authController.handleSignOtp);

module.exports = router;
