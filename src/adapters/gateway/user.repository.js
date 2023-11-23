const mongoose = require("mongoose");
const User = require("../data/models/user.model");
const AppError = require("../../frameworks/web/utils/app.error.util");

const findUserByEmail = async (email) =>
  await User.findOne({ email })
    .select({
      email: 1,
      name: 1,
      isBlocked: 1,
      password: 1,
      phone: 1,
    })
    .catch((err) =>
      console.log("error while quering database for user with email", email)
    );
const findUserByPhone = async (phone) => await User.findOne({ phone });
const findUserById = async (_id) => await User.findOne({ _id });
const findUserByUserName = async (username) => await User.findOne({ username });
const findUserByToken = async (token) => {
  const userData = User.findOne({ token }).select({
    email: 1,
    name: 1,
    isBlocked: 1,
  });
  return userData;
};

const checkIsBlocked = async (email) => {
  const user = await User.findOne({ email }).select({ isBlocked: 1 });
  return user.isBlocked;
};
const createUser = ({ name, password, phone, email, username }) => {
  const user = new User({
    name,
    email,
    phone,
    password,
    username,
  });

  return user
    .save()
    .then((response) => response)
    .catch((error) => {
      console.log("Error saving user data to database - ", error);
      throw new AppError.database(
        "An error occured while processing your data"
      );
    });
};
const addRefreshTokenById = async (_id, token) => {
  await User.updateOne({ _id }, { $push: { token } });
};

const findByTokenAndDelete = async (token) => {
  const isTokenPresent = await User.findOneAndUpdate(
    { token },
    { $pull: { token } }
  );
  return isTokenPresent;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};
const blockUserById = async (_id) => {
  const isBlocked = await User.updateOne({ _id }, { isBlocked: true });
  return isBlocked;
};
const unblockUserById = async (_id) => {
  const isBlocked = await User.updateOne({ _id }, { isBlocked: false });
  return isBlocked;
};
const updateDetailsById = async (user) => {
  const updatedUser = await User.updateOne(
    { _id: user._id },
    {
      name: user.name,
      age: user.age,
      website: user.website,
      about: user.about,
      address: user.address,
      gitLink: user.gitLink,
      linkedinLink: user.linkedinLink,
      occupation: user.occupation,
      visible: user.visible,
    }
  );
  return updatedUser;
};
const getEnrolledCountById = async (courseId) => {
  const enrolledStudents = await User.countDocuments({
    enrolledCourses: { $in: [courseId] },
  });
  return enrolledStudents;
};
const findUserByCourseId = async ({ courseId, userId }) =>
  User.findOne({ _id: userId, enrolledCourses: { $in: [courseId] } });
const enrollInCourseById = async ({ courseId, userId }) => {
  const userData = await User.updateOne(
    { _id: userId },
    { $addToSet: { enrolledCourses: courseId } }
  );
  return userData;
};
const getCoursesEnrolled = async (userId) => {
  const coursesEnrolled = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    { $project: { enrolledCourses: 1, _id: 0 } },
    {
      $lookup: {
        from: "courses",
        localField: "enrolledCourses",
        foreignField: "_id",
        as: "details",
      },
    },
    { $project: { details: 1 } },
  ]);
  return coursesEnrolled[0].details;
};
module.exports = {
  createUser,
  findUserByEmail,
  findUserByPhone,
  findUserByToken,
  checkIsBlocked,
  findUserById,
  findUserByUserName,
  addRefreshTokenById,
  findByTokenAndDelete,
  getAllUsers,
  blockUserById,
  unblockUserById,
  updateDetailsById,
  getEnrolledCountById,
  findUserByCourseId,
  enrollInCourseById,
  getCoursesEnrolled,
};
