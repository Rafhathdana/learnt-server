const router = require("express").Router();
const authRoute = require("./auth.route");

const userDetailsRoute = require("./user/profile.route");

const tutorDetailsRoute = require("./tutor/profile.route");
const tutorCourseRoute = require("./tutor/course.route");
const tutorLessonRoute = require("./tutor/lesson.route");
const adminUsersRoute = require("./admin/users.route");
const adminTutorsRoute = require("./admin/tutors.route");
const adminCategoryRoute = require('./admin/category.route')

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user/details",
    route: userDetailsRoute,
  },
  {
    path: "/tutor/details",
    route: tutorDetailsRoute,
  },
  {
    path: "/tutor/courses",
    route: tutorCourseRoute,
  },
  {
    path: "/tutor/lessons",
    route: tutorLessonRoute,
  },
  {
    path: "/admin/users",
    route: adminUsersRoute,
  },
  {
    path: "/admin/tutors",
    route: adminTutorsRoute,
  },
  {
    path: "/admin/category",
    route: adminCategoryRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
