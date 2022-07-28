import { Button } from "antd";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import AddLessonForm from "../../../components/Form/AddLessonForm";

import Layout from "../../../components/Layout";

export default function Course({ course }: any) {
  const [isLoading, setLoading] = useState(true);
  const [courseData, setCoursesData] = useState(course);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const refreshDetailCourse = async () => {
    const { data } = await axios.get(`/api/course/${router.query.slug}`);
    setCoursesData(data);
  };

  const deleteLesson = async () => {
    if (!confirm("Are you sure?")) return;

    const { data } = await axios.get(`/api/course/${router.query.slug}`);
    setCoursesData(data);
  };

  return (
    <Layout contentProps={{ className: "px-52" }}>
      <div className="h-96 w-full bg-gray-50 p-24">
        <div className="bg-white border-dark-50 max-w-fit p-5 shadow-lg">
          <h1 className="text-3xl font-bold">Course: {courseData?.name}</h1>
          <p className="text-xl">Make your own course and teach other people</p>
        </div>
      </div>
      <div className="mt-16">
        <div className="flex justify-between">
          <h2 className="text-lg">Lessons</h2>
          <Button className="bg-blue-400" onClick={toggleModal}>
            Add Lesson
          </Button>
        </div>
        <div>
          {course?.lessons.map((lesson: any) => (
            <div className="flex justify-between mt-5" key={lesson?._id}>
              <div>
                <h1>{lesson.title}</h1>
                <p>{lesson.content}</p>
              </div>
              <Button danger onClick={deleteLesson}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>

      <AddLessonForm
        isVisible={isModalVisible}
        course={courseData}
        toggleModal={toggleModal}
        onSuccess={refreshDetailCourse}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data } = await axios.get(
    `${process.env.API}/course/${context.query.slug}`
  );
  return {
    props: {
      course: data,
    }, // will be passed to the page component as props
  };
};
