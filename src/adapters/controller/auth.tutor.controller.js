const {
  signInSchema,
  signUpSchemaWithOTP,
  signUpSchema,
} = require("../../entities/auth.validator");
const AppError = require("../../frameworks/web/utils/app.error.util");
const asyncHandler = require("../../frameworks/web/utils/async.handler.util");
/**
 * @desc Tutor Sign in
 * @route POST /auth/tutor/signin/
 * @access public
 *
 * @body
 * {
 *   "email": "user@gmail.com",
 *   "password": "password123"
 * }
 */
const tutorService = require("../../usecases/tutor.service");
const handleSignIn = asyncHandler(async (req, res) => {
  const { error, value } = signInSchema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({ message: error.details[0].message });
  }
  const { tutorData, accessToken, refreshToken } =
    await tutorService.handleSignIn(value);
  attachTokenToCookie("accessTokenTutor", accessToken, res);
  attachTokenToCookie("refreshTokenTutor", refreshToken, res);
  res.status(200).json({ message: "Login successfull", tutor: tutorData });
});
/**
 * @desc tutor signup
 * @route POST /auth/tutor/signup
 * @access public
 */
const handleSignUp = asyncHandler(async (req, res) => {
  const { error, value } = signUpSchemaWithOTP.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const tutor = await tutorService.handleSignUp(value);
  console.log("signed in");
  return res.status(200).json({ message: "Account created successfully" });
});
const handleSignOtp = asyncHandler(async (req, res) => {
  const { error, value } = signUpSchema.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const otp = await tutorService.handleSignUpOtp(value);
  return res.status(200).json({ message: "Otp send successfully" });
});
module.exports = {
  handleSignIn,
  handleSignUp,
  handleSignOtp,
};
