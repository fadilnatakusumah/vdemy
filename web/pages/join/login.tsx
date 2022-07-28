import { Button, Checkbox, Form, Input, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

import Wrapper from "../../components/Layout";

import UserAPI from "../../api/user";
import { ACTION_TYPE } from "../../context/actions";
import { StoreContext } from "../../context/store";

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const { dispatch } = useContext(StoreContext);
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const { data } = await UserAPI.login(values);
      dispatch({ type: ACTION_TYPE.LOGIN, payload: data });

      // save in local storage
      window.localStorage.setItem("user", JSON.stringify(data));

      toast.success("Successfully logged in");
      // redirect
      router.push("/me");

      setLoading(false);
    } catch (error: any) {
      toast.error(error.response.data);
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Wrapper contentProps={{ className: "px-52" }}>
      <div className="mx-auto max-w-lg pt-14">
        <h2 className="text-lg font-bold mb-4">
          Log In to Your Vdemy Account!
        </h2>
        <hr />
        <br />
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            className="mb-5"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" size="large" className="p-3" />
          </Form.Item>

          <Form.Item
            className="mb-5"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              className="p-3"
            />
          </Form.Item>

          <div>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                size="large"
                type="primary"
                className="bg-blue-400 w-full"
                htmlType="submit"
              >
                {isLoading ? <Spin /> : "Log In"}
              </Button>
              <div className="text-center mt-4">
                or{" "}
                <span className="text-blue-500">
                  <Link href="/forgot-password">Forgot Password</Link>
                </span>
              </div>
            </Form.Item>
          </div>
          <div className="text-center">
            Don&apos;t have an account?{" "}
            <span className="font-bold">
              <Link href="/join/signup">Sign Up </Link>
            </span>
          </div>
        </Form>
      </div>
    </Wrapper>
  );
}
