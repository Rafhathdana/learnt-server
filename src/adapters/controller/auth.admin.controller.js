const {
  signInSchema,
  signUpSchemaWithOTP,
  signUpSchema,
} = require("../../entities/auth.validator");
const AppError = require("../../frameworks/web/utils/app.error.util");
const asyncHandler = require("../../frameworks/web/utils/async.handler.util");
/**
 * @desc Admin Sign in
 * @route POST /auth/admin/signin/
 * @access public
 *
 * @body
 * {
 *   "email": "user@gmail.com",
 *   "password": "password123"
 * }
 */
const adminService = require("../../usecases/admin.service");
const handleSignIn = asyncHandler(async (req, res) => {
  const { error, value } = signInSchema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({ message: error.details[0].message });
  }
  const { adminData, accessToken, refreshToken } =
    await adminService.handleSignIn(value);
  attachTokenToCookie("accessTokenAdmin", accessToken, res);
  attachTokenToCookie("refreshTokenAdmin", refreshToken, res);
  res.status(200).json({ message: "Login successfull", admin: adminData });
});
/**
 * @desc admin signup
 * @route POST /auth/admin/signup
 * @access public
 */
const handleSignUp = asyncHandler(async (req, res) => {
  const { error, value } = signUpSchemaWithOTP.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const admin = await adminService.handleSignUp(value);
  console.log("signed in");
  return res.status(200).json({ message: "Account created successfully" });
});
const handleSignOtp = asyncHandler(async (req, res) => {
  const { error, value } = signUpSchema.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const otp = await adminService.handleSignUpOtp(value);
  return res.status(200).json({ message: "Otp send successfully" });
});

const restoreAdminDetails = asyncHandler(async (req, res) => {
  if (!req.cookies["accessTokenAdmin"]) {
    return res
      .status(200)
      .json({ message: "access token not found", adminData: null });
  }
  const adminData = await adminService.getAdminFromToken(
    req.cookies["accessTokenAdmin"]
  );
  if (!adminData) {
    res.clearCookie("refreshTokenAdmin");
    res.clearCookie("accessTokenAdmin");
  }
  return res.status(200).json({
    message: adminData ? "admin details found" : "admin not found",
    adminData,
  });
});
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies["refreshTokenAdmin"];
  if (!refreshToken) {
    throw AppError.authentication("provide a refresh token");
  }
  const accessToken = await adminService.getAccessTokenByRefreshToken(
    refreshToken
  );
  attachTokenToCookie("accessTokenAdmin", accessToken, res);

  res.status(200).json({ message: "token created successfully" });
});
const handleLogout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies["refreshTokenAdmin"];
  if (!refreshToken) console.log("refresh token not present in request");

  //delete refresh token from database
  const isTokenPresent = await adminService.checkTokenAndDelete(refreshToken);
  if (!isTokenPresent) console.log("token not present in database");

  // clear cookie from response
  res.clearCookie("refreshTokenAdmin");
  res.clearCookie("accessTokenAdmin");

  res.status(200).json({ message: "logout successful" });
});
module.exports = {
  handleSignIn,
  handleSignUp,
  handleSignOtp,
  restoreAdminDetails,
  handleLogout,
  refreshToken,
};
