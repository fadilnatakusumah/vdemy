import { Alert, Button, Spin } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import UserAPI from "../api/user";
import Wrapper from "../components/Layout";
import { ACTION_TYPE } from "../context/actions";
import { useStore } from "../context/hooks";

function Becomeinstructor() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { state, dispatch } = useStore();

  const requestToBeInstructor = async () => {
    try {
      setIsLoading(true);
      await UserAPI.requestToBeInstructor();
      const { data } = await UserAPI.me();
      console.log("🚀 ~ file: become-instructor.tsx ~ line 20 ~ requestToBeInstructor ~ data", data)
      dispatch({ type: ACTION_TYPE.LOGIN, payload: data });

      // save in local storage
      window.localStorage.setItem("user", JSON.stringify(data));

      setIsSuccess(true);
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data);
      setIsLoading(false);
    }
  };

  return (
    <Wrapper contentProps={{ className: "px-52" }}>
      <div className="h-96 w-full bg-gray-50 p-24">
        <div className="bg-white border-dark-50 max-w-fit p-5 shadow-lg">
          {isSuccess || state.user?.role?.includes("INSTRUCTOR") ? (
            <Alert
              className="mb-2"
              message="You have become instructor!"
              type="success"
            />
          ) : (
            <h1 className="text-3xl font-bold">
              Become Instructor and teach people
            </h1>
          )}
          <p className="text-xl">Make your own course and teach other people</p>
        </div>
        {state.user?.role?.includes("INSTRUCTOR") ? (
          <Link href="/create-course">
            <Button type="primary" className="bg-blue-500 mt-5">
              Create course now
            </Button>
          </Link>
        ) : (
          <Button
            onClick={requestToBeInstructor}
            type="primary"
            className="bg-blue-500 mt-5"
          >
            {isLoading ? <Spin /> : "Request to become Instructor"}
          </Button>
        )}
      </div>
      {/* <div className="mt-10">
        <h2 className="text-3xl font-bold">
          Let&apos;s start learning, {state.user?.name}
        </h2>
      </div> */}
    </Wrapper>
  );
}

export default Becomeinstructor;
