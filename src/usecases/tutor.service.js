const otpRepository = require("../adapters/gateway/common.repository");
const tutorRepository = require("../adapters/gateway/tutor.repository");
const AppError = require("../frameworks/web/utils/app.error.util");
const verifyToken = require("../frameworks/web/utils/auth.util");
const {
  comparePasswords,
  createHashPassword,
} = require("../frameworks/web/utils/bcrypt.util");
const { generateOTP } = require("../frameworks/web/utils/generate.otp.util");
const {
  createAccessToken,
  createRefreshToken,
} = require("../frameworks/web/utils/generate.tokens.util");
/**
 * Handles tutor sign-in
 * @param {Object} credentials - Tutor credentials. {email: string, password: string}
 * @returns {Promise<Object>} - Object with tutor data, access token, and refresh token.
 */
const handleSignIn = async ({ email, password }) => {
  let tutor = await tutorRepository.findTutorByEmail(email);
  if (!tutor) throw AppError.validation("Email not registered");

  const isPasswordMatch = await comparePasswords(password, tutor.password);
  if (!isPasswordMatch) throw AppError.validation("Invalid Password");

  const isBlocked = await tutorRepository.checkIsBlocked(email);
  if (isBlocked) throw AppError.forbidden("Access denied");

  const { password: _, ...tutorWithoutPassword } = tutor.toObject();

  const accessToken = createAccessToken(tutorWithoutPassword, "tutor");
  const refreshToken = createRefreshToken(tutorWithoutPassword);

  // commented until until database refresh token cleanUp is implemented
  await tutorRepository.addRefreshTokenById(tutor._id, refreshToken);

  return {
    tutorData: tutorWithoutPassword,
    accessToken,
    refreshToken,
  };
};
const handleSignUp = async ({ name, password, phone, email, otp }) => {
  const isPhoneOtp = await otpRepository.findOtpByPhone(phone);
  if (!isPhoneOtp) {
    throw AppError.conflict("Try Again Otp TimeOut");
  }
  console.log(isPhoneOtp.otp, otp);
  if (isPhoneOtp.otp != otp) {
    throw AppError.conflict("Otp is Not Correct Try Again");
  }
  const isEmailTaken = await tutorRepository.findTutorByEmail(email);
  if (isEmailTaken) {
    throw AppError.conflict("Email is already taken");
  }
  const isPhoneTaken = await tutorRepository.findTutorByPhone(phone);
  if (isPhoneTaken) {
    throw AppError.conflict("Phone Number is already taken");
  }
  const hashedPassword = await createHashPassword(password);
  let tutorname = email.split("@")[0];
  const isTutornameUnique = await tutorRepository.findTutorByTutorName(
    tutorname
  );

  // Check if the tutorname is already unique
  if (isTutornameUnique) {
    // If the tutorname is not unique, add a numeric suffix to make it unique
    let suffix = 1;
    tutorname = tutorname + suffix;
    while (await tutorRepository.findTutorByTutorName(tutorname)) {
      suffix++;
      tutorname = tutorname + suffix;
    }
  }
  console.log(tutorname);
  const tutor = await tutorRepository.createTutor({
    name,
    password: hashedPassword,
    phone,
    email,
    tutorname,
  });
  return tutor;
};
const handleSignUpOtp = async ({ email, phone }) => {
  const isEmailTaken = await tutorRepository.findTutorByEmail(email);
  if (isEmailTaken) {
    throw AppError.conflict("Email is already taken");
  }
  const isPhoneTaken = await tutorRepository.findTutorByPhone(phone);
  if (isPhoneTaken) {
    throw AppError.conflict("Phone Number is already taken");
  }
  const isPhoneOtp = await otpRepository.findOtpByPhone(phone);
  let count = 0;
  let otp = generateOTP(6);
  if (isPhoneOtp) {
    if (isPhoneOtp.count > 6) {
      throw AppError.conflict("Done maximum otp on this Number");
    }
    isPhoneOtp.otp = otp;
    isPhoneOtp.count += 1;
    const tutor = await otpRepository.updateOtp({
      isPhoneOtp,
    });
    return tutor;
  } else {
    const tutor = await otpRepository.createOtp({
      phone,
      email,
      otp,
    });
    return tutor;
  }
};
module.exports = {
  handleSignIn,
  handleSignUp,
  handleSignUpOtp,
};
