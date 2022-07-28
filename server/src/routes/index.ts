import { Router } from "express";

import AuthRouter from "./auth";
import CourseRouter from "./course";
import InstructorRoute from "./instructor";

const APIRoutes = Router();

APIRoutes.use(AuthRouter);
APIRoutes.use(InstructorRoute);
APIRoutes.use(CourseRouter);

export default APIRoutes;
