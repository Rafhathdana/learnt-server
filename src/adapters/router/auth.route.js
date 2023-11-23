const router = require("express").Router();
const authController = require("../controller/auth.controller");
const authTutorController = require("../controller/auth.tutor.controller");
const authAdminController = require("../controller/auth.admin.controller");
/**
 * @desc User Authentcion routes
 * @route /api/auth/
 * @access public
 */

router.route("/signin").post(authController.handleSignIn);
router.route("/signup").post(authController.handleSignUp);
router.route("/sendotp").post(authController.handleSignOtp);
router.route("/user/restore").get(authController.restoreUserDetails);
router.route("/token").get(authController.refreshToken);
router
  .route("/signin/firebase/verify")
  .post(authController.firebaseSignInVerify);
router.route("/logout").delete(authController.handleLogout);

/**
 * @desc tutor Authentication
 * @route /api/auth/tutor
 * @access public
 */
router.route("/tutor/signin").post(authTutorController.handleSignIn);
router.route("/tutor/signup").post(authTutorController.handleSignUp);
router.route("/tutor/sendotp").post(authTutorController.handleSignOtp);
router.route("/tutor/restore").get(authTutorController.restoreUserDetails);
router.route("/tutor/token").get(authTutorController.refreshToken);
router.route("/tutor/logout").delete(authTutorController.handleLogout);

/**
 * @desc admin Authentication
 * @route /api/auth/admin
 * @access public
 */
router.route("/admin/signin").post(authAdminController.handleSignIn);
router.route("/admin/signup").post(authAdminController.handleSignUp);
router.route("/admin/sendotp").post(authAdminController.handleSignOtp);
router.route("/admin/restore").get(authAdminController.restoreAdminDetails);
router.route("/admin/token").get(authAdminController.refreshToken);

router.route("/admin/logout").delete(authAdminController.handleLogout);
module.exports = router;
