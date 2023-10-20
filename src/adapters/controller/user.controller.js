const objectIdSchema = require("../../entities/id.validator");
const userDetailsSchema = require("../../entities/user.details.validator");
const AppError = require("../../frameworks/web/utils/app.error.util");
const asyncHandler = require("../../frameworks/web/utils/async.handler.util");
const userService = require("../../usecases/user.service");

const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  return res.status(200).json({ message: "users found", data: users });
};
const blockUser = async (req, res) => {
  const isBlocked = await userService.blockUser(req.body.userId);
  return res.status(200).json({ message: "User Blocked Successfully" });
};
const unblockUser = async (req, res) => {
  const isBlocked = await userService.unblockUser(req.body.userId);
  return res.status(200).json({ message: "User unBlocked successfully" });
};
const getUserDetails = asyncHandler(async (req, res) => {
  const { value, error } = objectIdSchema.validate(req.user?._id);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const userDetails = await userService.getUserDetails(value);
  return res.status(200).json({ message: "user details found", userDetails });
});
const updateUserDetails = asyncHandler(async (req, res) => {
  const { value, error } = userDetailsSchema.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const userData = await userService.updateUserDetails({
    ...value,
    _id: req.user._id,
  });
  res
    .status(200)
    .json({ message: "user details updated successfully", data: userData });
});
const checkCourseEnrolled = async (req, res) => {
  if (!req.user) {
    return res
      .status(200)
      .json({ message: "user is not logged in", enrolled: false });
  }
  const params = {
    courseId: req.params.id,
    userId: req.user._id,
  };
  const isEnrolled = await userService.isEnrolledForCourse(params);
  return res.status(200).json({
    message: isEnrolled
      ? "user is already enrolled for this course"
      : "user is not enrolled for this course",
    enrolled: isEnrolled,
  });
};
module.exports = {
  getAllUsers,
  blockUser,
  unblockUser,
  getUserDetails,
  updateUserDetails,
  checkCourseEnrolled,
};
