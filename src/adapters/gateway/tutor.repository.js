const mongoose = require("mongoose");
const Tutor = require("../data/models/tutor.model");
const AppError = require("../../frameworks/web/utils/app.error.util");

const findTutorByEmail = async (email) =>
  await Tutor.findOne({ email })
    .select({
      email: 1,
      name: 1,
      isBlocked: 1,
      password: 1,
      phone: 1,
    })
    .catch((err) =>
      console.log("error while quering database for tutor with email", email)
    );
const findTutorByPhone = async (phone) => await Tutor.findOne({ phone });
const findTutorById = async (_id) => await Tutor.findOne({ _id });
const findTutorByTutorName = async (tutorname) =>
  await Tutor.findOne({ tutorname });
const findTutorByToken = async (token) => {
  const tutorData = Tutor.findOne({ token }).select({
    email: 1,
    name: 1,
    isBlocked: 1,
  });
  return tutorData;
};

const checkIsBlocked = async (email) => {
  const tutor = await Tutor.findOne({ email }).select({ isBlocked: 1 });
  return Tutor.isBlocked;
};
const createTutor = ({ name, password, phone, email, tutorname }) => {
  console.log(tutorname);
  const tutor = new Tutor({
    name,
    email,
    phone,
    password,
    tutorname,
  });

  return tutor
    .save()
    .then((response) => response)
    .catch((error) => {
      console.log("Error saving tutor data to database - ", error);
      throw new AppError.database(
        "An error occured while processing your data"
      );
    });
};
const addRefreshTokenById = async (_id, token) => {
  await Tutor.updateOne({ _id }, { $push: { token } });
};

const findByTokenAndDelete = async (token) => {
  const isTokenPresent = await Tutor.findOneAndUpdate(
    { token },
    { $pull: { token } }
  );
  return isTokenPresent;
};
module.exports = {
  createTutor,
  findTutorByEmail,
  findTutorByPhone,
  findTutorByToken,
  checkIsBlocked,
  findTutorById,
  findTutorByTutorName,
  addRefreshTokenById,
  findByTokenAndDelete,
};
