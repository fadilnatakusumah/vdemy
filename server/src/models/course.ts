import mongoose, { Schema, Types } from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    content: {
      type: {},
      minlength: 200,
    },
    video: {},
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export type LessonModel = {
  title: string;
  slug: string;
  content: string;
  video: {};
  free_preview?: boolean;
};

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: {},
      minlength: 200,
      required: true,
    },
    price: {
      type: Number,
      default: 9.99,
    },
    image: {},
    category: String,
    published: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessons: {
      type: [lessonSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export type CourseModel = Document & {
  name: string;
  slug: string;
  description: string;
  price: string;
  image: {};
  category: string;
  published: boolean;
  paid: boolean;
  instructor: Types.ObjectId;
  lessons: LessonModel[];
};

const Course = mongoose.model<CourseModel>("Course", courseSchema);

export default Course;
