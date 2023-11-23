const mongoose = require("mongoose");
const Admin = require("../data/models/admin.model");
const AppError = require("../../frameworks/web/utils/app.error.util");

const findAdminByEmail = async (email) =>
  await Admin.findOne({ email })
    .select({
      email: 1,
      name: 1,
      isBlocked: 1,
      password: 1,
      phone: 1,
    })
    .catch((err) =>
      console.log("error while quering database for admin with email", email)
    );
const findAdminByPhone = async (phone) => await Admin.findOne({ phone });
const findAdminById = async (_id) => await Admin.findOne({ _id });
const findAdminByAdminName = async (adminname) =>
  await Admin.findOne({ adminname });
const findAdminByToken = async (token) => {
  const adminData = Admin.findOne({ token }).select({
    email: 1,
    name: 1,
    isBlocked: 1,
  });
  return adminData;
};

const checkIsBlocked = async (email) => {
  const admin = await Admin.findOne({ email }).select({ isBlocked: 1 });
  return Admin.isBlocked;
};
const createAdmin = ({ name, password, phone, email, adminname }) => {
  const admin = new Admin({
    name,
    email,
    phone,
    password,
    adminname,
  });

  return admin
    .save()
    .then((response) => response)
    .catch((error) => {
      console.log("Error saving admin data to database - ", error);
      throw new AppError.database(
        "An error occured while processing your data"
      );
    });
};
const addRefreshTokenById = async (_id, token) => {
  await Admin.updateOne({ _id }, { $push: { token } });
};
const findByTokenAndDelete = async (token) => {
  const isTokenPresent = await Admin.findOneAndUpdate(
    { token },
    { $pull: { token } }
  );
  return isTokenPresent;
};
module.exports = {
  createAdmin,
  findAdminByEmail,
  findAdminByPhone,
  findAdminByToken,
  checkIsBlocked,
  findAdminById,
  findAdminByAdminName,
  addRefreshTokenById,
  findByTokenAndDelete,
};
