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
  return User.isBlocked;
};
const createUser = ({ name, password, phone, email }) => {
  const user = new User({
    name,
    email,
    phone,
    password,
  });
  return user
    .save()
    .then((response) => response)
    .catch((error) => {
      console.log("Error saving user data");
      throw new AppError.database(
        "An error occured while processing your data"
      );
    });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByPhone,
  findUserByToken,
  checkIsBlocked,
  findUserById,
};
