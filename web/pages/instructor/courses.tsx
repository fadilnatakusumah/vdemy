import { Button, Spin } from "antd";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreateCourseModalForm from "../../components/Form/CreateCourseModalForm";
import Wrapper from "../../components/Layout";

export default function Courses() {
  const [isLoading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const getCourses = async () => {
    setLoading(true);
    const { data } = await axios.get("/api/courses");
    setCourses(data);
    setLoading(false);
  };

  const deleteCourse = async () => {
    if (!confirm("Are you sure?")) return;

    try {
      await axios.delete("/api/course/:id");
      toast.success("success deleting course");
      getCourses();
    } catch (error) {
      toast.error("success deleting course");
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <Wrapper contentProps={{ className: "px-52" }}>
      <div className="h-96 w-full bg-gray-50 p-24">
        <div className="bg-white border-dark-50 max-w-fit p-5 shadow-lg">
          <h1 className="text-3xl font-bold">Learn More about instructor</h1>
          <p className="text-xl">Make your own course and teach other people</p>
        </div>
        <Button className="mt-4 bg-blue-400" onClick={toggleModal}>
          Create Course
        </Button>
      </div>
      <div className="mt-14">
        {isLoading ? (
          <Spin />
        ) : (
          courses.map((course: any, idx) => (
            <div key={idx}>
              <h2 className="text-lg font-bold">
                <Link href={`/instructor/course/${course.slug}`}>{course?.name}</Link>
              </h2>
              <div className="flex">
                <img width="200" src={course?.image?.Location} />
                <p>{course?.description}</p>
                <Button danger onClick={deleteCourse}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateCourseModalForm
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        onSuccess={getCourses}
      />
    </Wrapper>
  );
}
