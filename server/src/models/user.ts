import mongoose, { Document, Schema } from "mongoose";
import { CourseModel } from "./course";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    role: {
      type: [String],
      default: ["SUBSCRIBER"],
      enum: ["SUBSCRIBER", "INSTRUCTOR", "ADMIN"],
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripe_session: {},
    password_reset_code: {
      data: String,
      default: "",
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export type UserModel = Document & {
  name: string;
  email: string;
  password: string | undefined;
  picture: string;
  role: string[];
  stripe_account_id: string;
  stripe_seller: { id: string };
  stripe_session: { id: string };
  password_reset_code: string;
  courses: CourseModel[];
};

const User = mongoose.model<UserModel>("User", userSchema);

export default User;
