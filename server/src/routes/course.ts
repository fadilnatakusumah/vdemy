import { Router } from "express";
import formidable from "express-formidable";

const CourseRouter = Router();

// middleware
import { requireSignin, isInstructor, isEnrolled } from "../middlewares/guard";

// controllers
import {
  uploadImage,
  // removeImage,
  create,
  read,
  // uploadVideo,
  // removeVideo,
  // addLesson,
  // update,
  removeLesson,
  // updateLesson,
  // publishCourse,
  // unpublishCourse,
  courses,
  deleteCourse,
  uploadVideo,
  addLesson,
  // checkEnrollment,
  // freeEnrollment,
  // paidEnrollment,
  // stripeSuccess,
  // userCourses,
  // markCompleted,
  // listCompleted,
  // markIncomplete,
} from "../controllers/course";

CourseRouter.get("/courses", courses);
// image
CourseRouter.post("/course/upload-image", uploadImage);
// CourseRouter.post("/course/remove-image", removeImage);
// // course
CourseRouter.post("/course", requireSignin, isInstructor, create);
CourseRouter.delete("/course/:id", requireSignin, isInstructor, deleteCourse);
// CourseRouter.put("/course/:slug", requireSignin, update);
CourseRouter.get("/course/:slug", read);
CourseRouter.post(
  "/course/video-upload/:instructorId",
  requireSignin,
  formidable(),
  uploadVideo
);
// CourseRouter.post(
//   "/course/video-remove/:instructorId",
//   requireSignin,
//   removeVideo
// );

// // publish unpublish
// CourseRouter.put("/course/publish/:courseId", requireSignin, publishCourse);
// CourseRouter.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);

// // `/api/course/lesson/${slug}/${course.instructor._id}`,
CourseRouter.post(
  "/course/lesson/:slug/:instructorId",
  requireSignin,
  addLesson
);
// CourseRouter.put(
//   "/course/lesson/:slug/:instructorId",
//   requireSignin,
//   updateLesson
// );
CourseRouter.put("/course/:slug/:lessonId", requireSignin, removeLesson);

// CourseRouter.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);

// // enrollment
// CourseRouter.post("/free-enrollment/:courseId", requireSignin, freeEnrollment);
// CourseRouter.post("/paid-enrollment/:courseId", requireSignin, paidEnrollment);
// CourseRouter.get("/stripe-success/:courseId", requireSignin, stripeSuccess);

// CourseRouter.get("/user-courses", requireSignin, userCourses);
// CourseRouter.get("/user/course/:slug", requireSignin, isEnrolled, read);

// // mark completed
// CourseRouter.post("/mark-completed", requireSignin, markCompleted);
// CourseRouter.post("/list-completed", requireSignin, listCompleted);
// CourseRouter.post("/mark-incomplete", requireSignin, markIncomplete);

export default CourseRouter;
