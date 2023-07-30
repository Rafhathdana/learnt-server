const mongoose = require("mongoose");
const User = require("../data/models/user.model");
const AppError = require("../../frameworks/web/utils/app.error.util");

const findUserByEmail = async (email) =>
  await User.findOne({ email })
    .select({
      mail: 1,
      name: 1,
      isBlocked: 1,
      password: 1,
      phone: 1,
    })
    .catch((err) =>
      console.log("error while quering database for user with email", email)
    );
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
};
