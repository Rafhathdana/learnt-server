const mongoose = require("mongoose");
const AppError = require("../../frameworks/web/utils/app.error.util");
const OTP = require("../../frameworks/config/otp");
const Otptemp = require("../data/models/otptemp.model");
const findOtpByPhone = async (phone) => await Otptemp.findOne({ phone });
const createOtp = ({ email, phone, otp, count = 0 }) => {
  const otptemp = new Otptemp({
    email,
    phone,
    otp,
    count,
  });
  // Assuming 'OTP' is a function that returns a promise with 'otptemp' value
  return OTP(phone, otp) // Corrected 'data.phone' to 'phone'
    .then(() => {
      return otptemp
        .save()
        .then((response) => response)
        .catch((error) => {
          console.log("Error saving otp data to the database - ", error);
          throw new AppError.database(
            "An error occurred while processing your data"
          );
        });
    })
    .catch((error) => {
      console.log("Error sending otp", error);
      throw new AppError.database(
        "An error occurred while processing your data"
      );
    });
};
const updateOtp = ({ isPhoneOtp }) => {// Increment count by the 'count' parameter
  // Assuming 'OTP' is a function that returns a promise with 'otptemp' value
  return OTP(isPhoneOtp.phone, isPhoneOtp.otp) // Assuming 'data.phone' contains the user's phone number
    .then(() => {
      return Otptemp.findOneAndUpdate(
        { phone: isPhoneOtp.phone },
        { $set: { count: isPhoneOtp.count, otp: isPhoneOtp.otp } },
        { new: true } // Return the updated document instead of the old one
      );
    })
    .then((response) => response)
    .catch((error) => {
      console.log("Error saving OTP data to database - ", error);
      throw new AppError.database(
        "An error occurred while processing your data"
      );
    });
};

module.exports = {
  findOtpByPhone,
  createOtp,
  updateOtp,
};
