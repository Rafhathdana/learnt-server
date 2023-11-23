const otpRepository = require("../adapters/gateway/common.repository");
const userRepository = require("../adapters/gateway/user.repository");
const AppError = require("../frameworks/web/utils/app.error.util");
const verifyToken = require("../frameworks/web/utils/auth.util");
const firbaseService = require("./firebase.service");
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
  if (isPhoneOtp) {
    if (isPhoneOtp.count > 6) {
      throw AppError.conflict("Done maximum otp on this Number");
    }
    isPhoneOtp.otp = otp;
    const user = await otpRepository.updateOtp({
      isPhoneOtp,
    });
    return user;
  } else {
    const user = await otpRepository.createOtp({
      phone,
      email,
      otp,
    });
    return user;
  }
};
const handleFirebaseSignIn = async (token) => {
  const { email } = await firbaseService.verifyToken(token);

  const user = await userRepository.findUserByEmail(email);
  if (!user)
    throw AppError.validation(
      "Email not registered. Please create a new account"
    );

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
const getUserFromToken = async (accessToken) => {
  return verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
    .then(
      async (data) => await userRepository.findUserByEmail(data?.user.email)
    )
    .catch((err) => {
      console.log("error while decoding access token", err);
      return false;
    });
};
const getAccessTokenByRefreshToken = async (refreshToken) => {
  const user = await userRepository.findUserByToken(refreshToken);
  if (!user) {
    throw AppError.authentication("Invalid refresh token! please login again");
  }

  return verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    .then((data) => {
      const accessToken = createAccessToken(data);
      return accessToken;
    })
    .catch((err) => {
      console.log("error verifying refresh token - ", err);
      throw AppError.authentication(err.message);
    });
};
const checkTokenAndDelete = async (token) => {
  // const isTokenPresent = User.findOneAndUpdate({ token }, { $pull: { token } })
  const isTokenPresent = userRepository.findByTokenAndDelete(token);
  return isTokenPresent;
};
const getAllUsers = async () => {
  const users = await userRepository.getAllUsers();
  return users;
};
const blockUser = async (userId) => {
  const isBlocked = await userRepository.blockUserById(userId);
  return isBlocked;
};
const unblockUser = async (userId) => {
  const isBlocked = await userRepository.unblockUserById(userId);
  return isBlocked;
};
const getUserDetails = async (userId) => {
  const userDetails = await userRepository.findUserById(userId);
  if (!userDetails) {
    throw AppError.validation("User Details was not found in database");
  }
  return userDetails;
};
const updateUserDetails = async (userDetails) => {
  const updatedUserDetails = await userRepository.updateDetailsById(
    userDetails
  );

  return updatedUserDetails;
};
const getEnrolledStudentsCount = async (courseId) => {
  const enrolledStudentsCount = await userRepository.getEnrolledCountById(
    courseId
  );
  return enrolledStudentsCount;
};
const isEnrolledForCourse = async ({ courseId, userId }) => {
  const userData = await userRepository.findUserByCourseId({
    courseId,
    userId,
  });
  if (userData) {
    return true;
  }
  return false;
};
module.exports = {
  handleSignIn,
  handleSignUp,
  handleSignUpOtp,
  getUserFromToken,
  getAccessTokenByRefreshToken,
  checkTokenAndDelete,
  getAllUsers,
  blockUser,
  unblockUser,
  getUserDetails,
  updateUserDetails,
  getEnrolledStudentsCount,
  isEnrolledForCourse,
  handleFirebaseSignIn,
};
