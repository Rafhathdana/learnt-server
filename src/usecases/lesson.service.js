const bucketService = require("./bucket.service");
const courseService = require("./course.service");
const lessonRepository = require("../adapters/gateway/lesson.repository");

const addLessonToCourse = async (lesson) => {
  const lessonKey = await bucketService.uploadLesson(lesson);
  if (!lessonKey) {
    console.log("error while uploading lesson to bucket");
    return false;
  }
  const lessonData = await lessonRepository.addLessonToService(
    lesson,
    lessonKey
  );
  const data = await courseService.addLessonToCourse(
    lessonData._id,
    lesson.data.courseId
  );

  if (!data) {
    console.log("error while adding lesson to course");
    return false;
  }

  return "success";
};
const getLesson = async (lessonId) => {
  let lesson = await lessonRepository.findLessonById(lessonId);
  lesson = lesson.toObject();
  lesson.videoFormat = lesson.videoKey.split(".")[1];
  lesson.videoURL = await bucketService.getVideoURL(lesson.videoKey);
  return lesson;
};
module.exports = { addLessonToCourse, getLesson };
