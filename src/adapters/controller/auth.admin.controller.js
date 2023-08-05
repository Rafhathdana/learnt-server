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
  module.exports = {
    handleSignIn,
    handleSignUp,
    handleSignOtp,
  };
  