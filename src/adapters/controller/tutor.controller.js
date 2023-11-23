const objectIdSchema = require("../../entities/id.validator");
const tutorDetailsSchema = require("../../entities/tutor.details.validator");
const AppError = require("../../frameworks/web/utils/app.error.util");
const asyncHandler = require("../../frameworks/web/utils/async.handler.util");
const tutorService = require("../../usecases/tutor.service");

const getAllTutors = async (req, res) => {
  const tutors = await tutorService.getAllTutors();
  return res.status(200).json({ message: "tutors found", data: tutors });
};
const blockTutor = async (req, res) => {
  const isBlocked = await tutorService.blockTutor(req.body.userId);
  return res.status(200).json({ message: "Tutor Blocked Successfully" });
};
const unblockTutor = async (req, res) => {
  const isBlocked = await tutorService.unblockTutor(req.body.userId);
  return res.status(200).json({ message: "Tutor unBlocked successfully" });
};
const getTutorDetails = asyncHandler(async (req, res) => {
  const { value, error } = objectIdSchema.validate(req.tutor?._id);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const tutorDetails = await tutorService.getTutorDetails(value);
  return res.status(200).json({ message: "tutor details found", tutorDetails });
});
const updateTutorDetails = asyncHandler(async (req, res) => {
  const { value, error } = tutorDetailsSchema.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const tutorData = await tutorService.updateTutorDetails({
    ...value,
    _id: req.tutor._id,
  });
  res
    .status(200)
    .json({ message: "tutor details updated successfully", data: tutorData });
});
const getTopTutors = async (re, res) => {
  const topTutors = await tutorService.getTopTutors();
  return res.status(200).json({
    message: "Top tutors found",
    data: topTutors,
  });
};
module.exports = {
  getAllTutors,
  blockTutor,
  unblockTutor,
  getTutorDetails,
  updateTutorDetails,
  getTopTutors,
};
