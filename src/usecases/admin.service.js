const otpRepository = require("../adapters/gateway/common.repository");
const adminRepository = require("../adapters/gateway/admin.repository");
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
 * Handles admin sign-in
 * @param {Object} credentials - Admin credentials. {email: string, password: string}
 * @returns {Promise<Object>} - Object with admin data, access token, and refresh token.
 */
const handleSignIn = async ({ email, password }) => {
  let admin = await adminRepository.findAdminByEmail(email);
  if (!admin) throw AppError.validation("Email not registered");

  const isPasswordMatch = await comparePasswords(password, admin.password);
  if (!isPasswordMatch) throw AppError.validation("Invalid Password");

  const isBlocked = await adminRepository.checkIsBlocked(email);
  if (isBlocked) throw AppError.forbidden("Access denied");

  const { password: _, ...adminWithoutPassword } = admin.toObject();

  const accessToken = createAccessToken(
    adminWithoutPassword,
    (adminBool = false),
    (adminBool = true)
  );
  const refreshToken = createRefreshToken(adminWithoutPassword);

  // commented until until database refresh token cleanUp is implemented
  await adminRepository.addRefreshTokenById(admin._id, refreshToken);
  return {
    adminData: adminWithoutPassword,
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
  const isEmailTaken = await adminRepository.findAdminByEmail(email);
  if (isEmailTaken) {
    throw AppError.conflict("Email is already taken");
  }
  const isPhoneTaken = await adminRepository.findAdminByPhone(phone);
  if (isPhoneTaken) {
    throw AppError.conflict("Phone Number is already taken");
  }
  const hashedPassword = await createHashPassword(password);
  let adminname = email.split("@")[0];
  const isAdminnameUnique = await adminRepository.findAdminByAdminName(
    adminname
  );

  // Check if the adminname is already unique
  if (isAdminnameUnique) {
    // If the adminname is not unique, add a numeric suffix to make it unique
    let suffix = 1;
    adminname = adminname + suffix;
    while (await adminRepository.findAdminByAdminName(adminname)) {
      suffix++;
      adminname = adminname + suffix;
    }
  }
  const admin = await adminRepository.createAdmin({
    name,
    password: hashedPassword,
    phone,
    email,
    adminname,
  });
  return admin;
};
const handleSignUpOtp = async ({ email, phone }) => {
  const isEmailTaken = await adminRepository.findAdminByEmail(email);
  if (isEmailTaken) {
    throw AppError.conflict("Email is already taken");
  }
  const isPhoneTaken = await adminRepository.findAdminByPhone(phone);
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
    const admin = await otpRepository.updateOtp({
      isPhoneOtp,
    });
    return admin;
  } else {
    const admin = await otpRepository.createOtp({
      phone,
      email,
      otp,
    });
    return admin;
  }
};

const getAdminFromToken = async (accessTokenAdmin) => {
  return verifyToken(accessTokenAdmin, process.env.ACCESS_TOKEN_SECRET)
    .then(
      async (data) => await adminRepository.findAdminByEmail(data?.user.email)
    )
    .catch((err) => {
      console.log("error while decoding access token", err);
      return false;
    });
};
const getAccessTokenByRefreshToken = async (refreshTokenAdmin) => {
  const user = await adminRepository.findAdminByToken(refreshTokenAdmin);
  if (!user) {
    throw AppError.authentication("Invalid refresh token! please login again");
  }

  return verifyToken(refreshTokenAdmin, process.env.REFRESH_TOKEN_SECRET)
    .then((data) => {
      const accessTokenAdmin = createAccessToken(data);
      return accessTokenAdmin;
    })
    .catch((err) => {
      console.log("error verifying refresh token - ", err);
      throw AppError.authentication(err.message);
    });
};
const checkTokenAndDelete = async (token) => {
  // const isTokenPresent = User.findOneAndUpdate({ token }, { $pull: { token } })
  const isTokenPresent = adminRepository.findByTokenAndDelete(token);
  return isTokenPresent;
};
module.exports = {
  handleSignIn,
  handleSignUp,
  handleSignUpOtp,
  getAdminFromToken,
  getAccessTokenByRefreshToken,
  checkTokenAndDelete,
};
