import mongoose, { Schema } from "mongoose";
import { LessonModel } from "./course";

const completedSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    lessons: [],
  },
  { timestamps: true }
);
export type CompletedModel = Document & {
  user: string;
  course: string;
  lessons: LessonModel[];
};

const Completed = mongoose.model<CompletedModel>("Completed", completedSchema);

export default Completed;
