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

const restoreUserDetails = asyncHandler(async (req, res) => {
    if (!req.cookies["accessToken"]) {
      return res
        .status(200)
        .json({ message: "access token not found", userData: null });
    }
    const userData = await tutorService.getFromToken(
      req.cookies["accessToken"]
    );
    if (!userData) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
    }
    return res.status(200).json({
      message: userData ? "user details found" : "user not found",
      userData,
    });
  });
  const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      throw AppError.authentication("provide a refresh token");
    }
    const accessToken = await tutorService.getAccessTokenByRefreshToken(
      refreshToken
    );
    attachTokenToCookie("accessToken", accessToken, res);
  
    res.status(200).json({ message: "token created successfully" });
  });
  const handleLogout = asyncHandler(async (req, res) => {
  
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) console.log('refresh token not present in request')
  
    //delete refresh token from database
    const isTokenPresent = await tutorService.checkTokenAndDelete(refreshToken)
    if (!isTokenPresent) console.log('token not present in database');
  
    // clear cookie from response
    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')
  
    res.status(200).json({ message: 'logout successful' })
  })
module.exports = {
  handleSignIn,
  handleSignUp,
  handleSignOtp,
  handleLogout,
  refreshToken,
  restoreUserDetails
};
