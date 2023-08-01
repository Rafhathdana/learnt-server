const otpRepository = require("../adapters/gateway/common.repository");
const userRepository = require("../adapters/gateway/user.repository");
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
 * Handles user sign-in
 * @param {Object} credentials - User credentials. {email: string, password: string}
 * @returns {Promise<Object>} - Object with user data, access token, and refresh token.
 */
const handleSignIn = async ({ email, password }) => {
  let user = await userRepository.findUserByEmail(email);
  if (!user) throw AppError.validation("Email not registered");

  const isPasswordMatch = await comparePasswords(password, user.password);
  if (!isPasswordMatch) throw AppError.validation("Invalid Password");

  const isBlocked = await userRepository.checkIsBlocked(email);
  if (isBlocked) throw AppError.forbidden("Access denied");

  const { password: _, ...userWithoutPassword } = user.toObject();

  const accessToken = createAccessToken(userWithoutPassword);
  const refreshToken = createRefreshToken(userWithoutPassword);

  // commented until until database refresh token cleanUp is implemented
  await userRepository.addRefreshTokenById(user._id, refreshToken);

  return {
    user: userWithoutPassword,
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
  const isEmailTaken = await userRepository.findUserByEmail(email);
  if (isEmailTaken) {
    throw AppError.conflict("Email is already taken");
  }
  const isPhoneTaken = await userRepository.findUserByPhone(phone);
  if (isPhoneTaken) {
    throw AppError.conflict("Phone Number is already taken");
  }
  const hashedPassword = await createHashPassword(password);
  let username = email.split("@")[0];
  const isUsernameUnique = await userRepository.findUserByUserName(username);

  // Check if the username is already unique
  if (isUsernameUnique) {
    // If the username is not unique, add a numeric suffix to make it unique
    let suffix = 1;
    username = username + suffix;
    while (await userRepository.findUserByUserName(username)) {
      suffix++;
      username = username + suffix;
    }
  }
  console.log(username);
  const user = await userRepository.createUser({
    name,
    password: hashedPassword,
    phone,
    email,
    username,
  });
  return user;
};
const handleSignUpOtp = async ({ email, phone }) => {
  console.log("rafhath raf");
  const isEmailTaken = await userRepository.findUserByEmail(email);
  if (isEmailTaken) {
    throw AppError.conflict("Email is already taken");
  }
  const isPhoneTaken = await userRepository.findUserByPhone(phone);
  if (isPhoneTaken) {
    throw AppError.conflict("Phone Number is already taken");
  }
  const isPhoneOtp = await otpRepository.findOtpByPhone(phone);
  let count = 0;
  let otp = generateOTP(6);
  console.log(otp);
  if (isPhoneOtp) {
    console.log(otp);
    if (isPhoneOtp.count > 6) {
      throw AppError.conflict("Done maximum otp on this Number");
    }
    console.log(isPhoneOtp, otp);
    isPhoneOtp.otp = otp;
    const user = await otpRepository.updateOtp({
      isPhoneOtp,
    });
    return user;
  } else {
    console.log(otp);
    const user = await otpRepository.createOtp({
      phone,
      email,
      otp,
    });
    return user;
  }
};
module.exports = {
  handleSignIn,
  handleSignUp,
  handleSignUpOtp,
};
