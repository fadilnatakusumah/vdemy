import { Router } from "express";
import { makeAsInstructor } from "../controllers/instructor";
import { requireSignin } from "../middlewares/guard";

const InstructorRoute = Router();

// middleware

InstructorRoute.post("/make-instructor", requireSignin, makeAsInstructor);
// InstructorRoute.post("/get-account-status", requireSignin, getAccountStatus);
// InstructorRoute.get("/current-instructor", requireSignin, currentInstructor);

// InstructorRoute.get("/instructor-courses", requireSignin, instructorCourses);

// InstructorRoute.post("/instructor/student-count", requireSignin, studentCount);

// InstructorRoute.get("/instructor/balance", requireSignin, instructorBalance);

// InstructorRoute.get(
//   "/instructor/payout-settings",
//   requireSignin,
//   instructorPayoutSettings
// );

export default InstructorRoute;
