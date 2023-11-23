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
    .populate("lessons")
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
const getAllCourses = async () => {
  const courses = await Course.find();
  return courses;
};
const findCourseById = async (courseId) => {
  const course = await Course.findById({ _id: courseId }).select("-__v");
  if (!course) {
    return false;
  }
  return course;
};
const getAllCourseByFilter = async (query) => {
  const courses = await Course.find({
    title: { $regex: query.search.trim(), $options: "i" },
  })
    .select("-__v")
    .where("category")
    .in(query.category)
    .where("difficulty")
    .in(query.difficulty)
    .sort(query.sortBy)
    .skip(query.page * query.limit)
    .limit(query.limit);

  return courses;
};
const getCountByFilter = async ({ search, category, difficulty }) => {
  const total = await Course.countDocuments({
    category: { $in: [...category] },
    difficulty: { $in: [...difficulty] },
    title: { $regex: search, $options: "i" },
  });
  return total;
};

// const getCoursesCountByTutorId = async (tutorId) => {
//   const courses = await Course.find({ tutor: tutorId })..catch((err) => {
//     console.log(err);
//   });
//   return courses;
// };
module.exports = {
  getCountByFilter,
  getAllCourseByFilter,
  findCourseById,
  getAllCourses,
  createCourse,
  getCoursesByTutorId,
  getCourseById,
  addLessonToCourse,
};
