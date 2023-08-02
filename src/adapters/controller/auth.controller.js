const {
  signUpSchema,
  signInSchema,
  signUpSchemaWithOTP,
} = require("../../entities/auth.validator");
const userService = require("../../usecases/user.service");
const AppError = require("../../frameworks/web/utils/app.error.util");
const asyncHandler = require("../../frameworks/web/utils/async.handler.util");
const attachTokenToCookie = require("../../frameworks/web/utils/cookie.util");
/**
 * @desc User Sign in
 * @route POST /auth/signin/
 * @access public
 *
 * @body
 * {
 *   "email": "user@gmail.com",
 *   "password": "password123"
 * }
 */

const handleSignIn = asyncHandler(async (req, res) => {
  const { error, value } = signInSchema.validate(req.body);
  if (error) {
    console.log(error);
    throw AppError.validation(error.details[0].message);
  }
  const { user, accessToken, refreshToken } = await userService.handleSignIn(
    value
  );
  attachTokenToCookie("accessToken", accessToken, res);
  attachTokenToCookie("refreshToken", refreshToken, res);
  console.log("user login successful.user is ", user.name);
  res.status(200).json({ message: "Login successfull", user });
});
/**
 * @desc user signup
 * @route  POST /auth/signup
 * @access public
 */
const handleSignUp = asyncHandler(async (req, res) => {
  const { error, value } = signUpSchemaWithOTP.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const user = await userService.handleSignUp(value);
  console.log(
    "New User has been registered -",
    value.name,
    "with email - ",
    value.email,
    "with phone number ",
    value.phone
  );
  return res.status(200).json({ message: "Account created successfully" });
});
const handleSignOtp = asyncHandler(async (req, res) => {
  const { error, value } = signUpSchema.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  console.log("rafhath reached here");
  const otp = await userService.handleSignUpOtp(value);
  return res.status(200).json({ message: "Otp send successfully" });
});
module.exports = {
  handleSignIn,
  handleSignUp,
  handleSignOtp,
};
