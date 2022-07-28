import { Button, Checkbox, Form, Input, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import UserAPI from "../../api/user";

import Wrapper from "../../components/Layout";

export default function Signup() {
  const [isLoading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await UserAPI.register(values);

      setLoading(false);
      toast.success("Success registering user");
      router.push("/join/login");
    } catch (error: any) {
      toast.error(error.response.data);
      console.error(error);
      setLoading(false);
    }
  };

  // const onFinishFailed = (values: any) => {
  //   console.log(
  //     "🚀 ~ file: signup.tsx ~ line 7 ~ onFinishFailed ~ values",
  //     values
  //   );
  // };

  return (
    <Wrapper contentProps={{ className: "px-52" }}>
      <div className="mx-auto max-w-lg pt-14">
        <h2 className="text-lg font-bold mb-4">Sign up and start learning</h2>
        <hr />
        <br />
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            className="mb-5"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Full Name" size="large" className="p-3" />
          </Form.Item>
          <Form.Item
            name="email"
            className="mb-5"
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
                {isLoading ? <Spin /> : "Sign up"}
              </Button>
            </Form.Item>
          </div>

          <div className="text-center">
            Already have an account?{" "}
            <span className="font-bold">
              <Link href="/join/login">Log In</Link>
            </span>
          </div>
        </Form>
      </div>
    </Wrapper>
  );
}
