import { RequestHandler } from "express";
import { expressjwt as jwt, Request as JWTRequest } from "express-jwt";
import { MyRequest } from "../controllers/auth";
import Course from "../models/course";
import User from "../models/user";
import { config } from "dotenv";

config();

export const requireSignin = jwt({
  getToken: (req: JWTRequest) => req.cookies.token,
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
  requestProperty: "user",
});

export const isInstructor: RequestHandler = async (
  req: MyRequest,
  res,
  next
) => {
  try {
    const user = await User.findById(req.user!._id).exec();
    if (!user?.role.includes("INSTRUCTOR")) {
      return res.sendStatus(403);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

export const isEnrolled: RequestHandler = async (req: MyRequest, res, next) => {
  try {
    const user = await User.findById(req.user!._id).exec();
    const course = await Course.findOne({ slug: req.params.slug }).exec();

    // check if course id is found in user courses array
    let ids = [];
    for (let i = 0; i < user!.courses.length; i++) {
      ids.push(user!.courses[i].toString());
    }

    if (!ids.includes(course!._id.toString())) {
      res.sendStatus(403);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
