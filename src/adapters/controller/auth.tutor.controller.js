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
 *   "email": "tutor@gmail.com",
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
  const { tutorData, accessTokenTutor, refreshTokenTutor } =
    await tutorService.handleSignIn(value);
  attachTokenToCookie("accessTokenTutor", accessTokenTutor, res);
  attachTokenToCookie("refreshTokenTutor", refreshTokenTutor, res);
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
  if (!req.cookies["accessTokenTutor"] && req.cookies["refressTokenTutor"]) {
    const refreshToken = req.cookies["refreshTokenTutor"];
    if (!refreshToken) {
      throw AppError.authentication("provide a refresh token");
    }
    const accessToken = await tutorService.getAccessTokenByRefreshToken(
      refreshToken
    );
    attachTokenToCookie("accessTokenTutor", accessToken, res);
  }
  if (!req.cookies["accessTokenTutor"] && !req.cookies["refressTokenTutor"]) {
    return res
      .status(200)
      .json({ message: "access token not found", tutorData: null });
  }

  const tutorData = await tutorService.getTutorFromToken(
    req.cookies["accessTokenTutor"]
  );
  if (!tutorData) {
    res.clearCookie("refreshTokenTutor");
    res.clearCookie("accessTokenTutor");
  }
  return res.status(200).json({
    message: tutorData ? "tutor details found" : "tutor not found",
    tutorData,
  });
});
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies["refreshTokenTutor"];
  if (!refreshToken) {
    throw AppError.authentication("provide a refresh token");
  }
  const accessToken = await tutorService.getAccessTokenByRefreshToken(
    refreshToken
  );
  attachTokenToCookie("accessTokenTutor", accessToken, res);

  res.status(200).json({ message: "token created successfully" });
});
const handleLogout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies["refreshTokenTutor"];
  if (!refreshToken) console.log("refresh token not present in request");

  //delete refresh token from database
  const isTokenPresent = await tutorService.checkTokenAndDelete(refreshToken);
  if (!isTokenPresent) console.log("token not present in database");

  // clear cookie from response
  res.clearCookie("refreshTokenTutor");
  res.clearCookie("accessTokenTutor");

  res.status(200).json({ message: "logout successful" });
});
module.exports = {
  handleSignIn,
  handleSignUp,
  handleSignOtp,
  handleLogout,
  refreshToken,
  restoreUserDetails,
};
