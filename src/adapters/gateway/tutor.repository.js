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

const getAllTutors = async () => {
  const tutors = await Tutor.find();
  return tutors;
};
const blockTutorById = async (_id) => {
  const isBlocked = await Tutor.updateOne({ _id }, { isBlocked: true });
  return isBlocked;
};
const unblockTutorById = async (_id) => {
  const isBlocked = await Tutor.updateOne({ _id }, { isBlocked: false });
  return isBlocked;
};
const updateDetailsById = async (tutor) => {
  const updatedTutor = await Tutor.updateOne(
    { _id: tutor._id },
    {
      name: tutor.name,
      age: tutor.age,
      website: tutor.website,
      about: tutor.about,
      address: tutor.address,
      gitLink: tutor.gitLink,
      linkedinLink: tutor.linkedinLink,
      occupation: tutor.occupation,
      qualification: tutor.qualification,
      skills: tutor.skills,
    }
  );
  return updatedTutor;
};
const getTutors = async (limit) => {
  const topTutors = await Tutor.find({}).limit(limit).select("name email");
  return topTutors;
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
  getAllTutors,
  blockTutorById,
  unblockTutorById,
  updateDetailsById,
  getTutors,
};
