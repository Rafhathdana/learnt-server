const courseRepository = require("../adapters/gateway/course.repository");
const AppError = require("../frameworks/web/utils/app.error.util");
const bucketService = require("./bucket.service");
const cloudinaryService = require("./cloudinary.service");
const categoryRepository = require("../adapters/gateway/category.repository");

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
    console.log("gvjhbkn");
  }
  return courses;
};
const getCourseDetails = async (courseId) => {
  let course = await courseRepository.getCourseById(courseId);
  course = course.toObject();
  console.log("gfxcvbn ");
  course.thumbnailURL = await bucketService.getThumbnailURL(course.thumbnail);
  console.log(course, "dxgfchvjb");
  return course;
};
const addLessonToCourse = async (lessonId, courseId) => {
  let course = await courseRepository.addLessonToCourse(lessonId, courseId);
  return true;
};
const getAllCourses = async () => {
  const courses = await courseRepository.getAllCourses();
  for (let i = 0; i < courses.length; i++) {
    courses[i] = courses[i].toObject();
    courses[i].thumbnailURL = await bucketService.getThumbnailURL(
      courses[i].thumbnail
    );
  }
  return courses;
};
const getAllCourseByFilter = async (query) => {
  query.difficulty =
    query.difficulty === "all"
      ? ["beginner", "intermediate", "advanced", "expert"]
      : query.difficulty.split(",");
  query.category =
    query.category === "all"
      ? await categoryRepository.getAllCategoriesTitle()
      : query.category.split(",");
  query.sort = query.reqSort ? query.reqSort.split(",") : [query.sort];
  query.sortBy = {};

  if (query.sort[1]) {
    query.sortBy[query.sort[0]] = query.sort[1];
  } else {
    query.sortBy[query.sort[0]] = "asc";
  }
  const total = await courseRepository.getCountByFilter(query);
  const courses = await courseRepository.getAllCourseByFilter(query);
  const coursesWithURL = await bucketService.attachThumbnailURLToCourses(
    courses
  );
  console.log(total, "ycfhjbtfjgbhmftugykm");
  console.log(courses, "ycfhjbtfjgbhmftudscdagykm");

  return { total, courses: coursesWithURL };
};
module.exports = {
  getAllCourseByFilter,
  getAllCourses,
  courseCreate,
  getAllCourseByTutor,
  getCourseDetails,
  addLessonToCourse,
};
