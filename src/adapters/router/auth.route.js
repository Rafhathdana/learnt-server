const router = require("express").Router();
const authController = require("../controller/auth.controller");
const authTutorController = require("../controller/auth.tutor.controller");
/**
 * @desc User Authentcion routes
 * @route /api/auth/
 * @access public
 */

router.route("/signin").post(authController.handleSignIn);
router.route("/signup").post(authController.handleSignUp);
router.route("/sendotp").post(authController.handleSignOtp);
/**
 * @desc tutor Authentication
 * @route /api/auth/tutor
 * @access public
 */
router.route("/tutor/signin").post(authTutorController.handleSignIn);
router.route("/tutor/signup").post(authTutorController.handleSignUp);
router.route("/tutor/sendotp").post(authTutorController.handleSignOtp);
/**
 * @desc admin Authentication
 * @route /api/auth/admin
 * @access public
 */
router.route("/admin/signin").post(authAdminController.handleSignIn);
router.route("/admin/signup").post(authAdminController.handleSignUp);
router.route("/admin/sendotp").post(authAdminController.handleSignOtp);
module.exports = router;
