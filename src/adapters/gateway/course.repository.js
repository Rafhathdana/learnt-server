const AppError = require("../../frameworks/web/utils/app.error.util");
const Course = require("../data/models/course.model");

const createCourse = async (courseData, tutorId) => {
  const course = new Course({
    title: courseData.title,
    about: courseData.about,
    tutor: tutorId,
    category: courseData.category,
    difficulty: courseData.difficulty,
    tagline: courseData.tagline,
    thumbnail: courseData.thumbnail,
    price: courseData.price,
  });
  return course
    .save()
    .then((response) => response)
    .catch((error) => {
      console.log("Error saving course data to database - ", error);
      throw new AppError.database(
        "An error occured while processing your data"
      );
    });
};
const getCoursesByTutorId = async (tutorId) => {
  const courses = await Course.find({ tutor: tutorId }).catch((err) => {
    console.log(err);
  });
  return courses;
};
const getCourseById = async (courseId) => {
  const courses = await Course.findOne({ _id: courseId })
    // .populate("lessons")
    .populate("tutor", "name")
    .catch((err) => {
      console.log(err);
    });
  return courses;
};
const addLessonToCourse = async (lessonId, courseId) => {
  await Course.findOneAndUpdate(
    { _id: courseId },
    { $push: { lessons: lessonId } }
  );
  return true;
};
module.exports = {
  createCourse,
  getCoursesByTutorId,
  getCourseById,
  addLessonToCourse,
};
