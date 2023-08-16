const courseRepository = require("../adapters/gateway/course.repository");
const AppError = require("../frameworks/web/utils/app.error.util");
const bucketService = require("./bucket.service");
const cloudinaryService = require("./cloudinary.service");
const courseCreate = async (file, value, tutor) => {
  let thumbnail;

  if (process.env.DATA_STORAGE == "s3bucket") {
    console.log("efcsjkdx");
    thumbnail = await bucketService.uploadThumbnailToBucket(value, file);
  } else {
    thumbnail = await cloudinaryService.uploaded(value, file);
  }

  if (!thumbnail) {
    throw AppError.database("Error while uploading thumbnail");
  }
  value.thumbnail = thumbnail;
  const isCourseCreated = await courseRepository.createCourse(value, tutor._id);
  if (!isCourseCreated) {
    throw AppError.validation("Course creation failed");
  }
  return isCourseCreated;
};
const getAllCourseByTutor = async (tutorId) => {
  console.log(tutorId);
  const courses = await courseRepository.getCoursesByTutorId(tutorId);
  for (let i = 0; i < courses.length; i++) {
    courses[i] = courses[i].toObject();
    console.log(courses[i].thumbnail, i);
    courses[i].thumbnailURL = await bucketService.getThumbnailURL(
      courses[i].thumbnail
    );
  }
  return courses;
};
module.exports = {
  courseCreate,
  getAllCourseByTutor,
};
