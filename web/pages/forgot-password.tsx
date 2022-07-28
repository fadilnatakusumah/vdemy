import { Alert, Button, Checkbox, Form, Input, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

import UserAPI from "../api/user";
import Wrapper from "../components/Layout";
import { ACTION_TYPE } from "../context/actions";
import { StoreContext } from "../context/store";

export default function ForgotPassword() {
  const [isLoading, setLoading] = useState(false);
  const [isSuccessSendRequest, setSuccessSendRequest] = useState(false);
  const { dispatch } = useContext(StoreContext);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await UserAPI.requestPasswordChangesVerificationCode(values);

      setLoading(false);
      setSuccessSendRequest(true);
    } catch (error: any) {
      toast.error(error.response.data);
      console.error(error);
      setLoading(false);
    }
  };

  const onFinishChangingPassword = async (values: any) => {
    try {
      setLoading(true);
      await UserAPI.requestPasswordChanges({
        ...values,
        email: form.getFieldValue("email"),
      });

      // save in local storage
      // window.localStorage.setItem("user", JSON.stringify(data));

      setSuccessSendRequest(false);
      toast.success("Password successfully changed");
      setLoading(false);

      // redirect
      router.push("/join/login");

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
        <h2 className="text-lg font-bold mb-4">Reset password request</h2>
        <hr />
        <br />
        {isSuccessSendRequest && (
          <Alert
            className="mb-2"
            message="Request password changes is success. Please check your email and type the code verification below."
            type="success"
          />
        )}
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={!isSuccessSendRequest ? onFinish : onFinishChangingPassword}
          autoComplete="off"
        >
          {isSuccessSendRequest ? (
            <>
              <Form.Item
                name="code"
                rules={[
                  { required: true, message: "Please input the verification code!" },
                ]}
                className="mb-5"
              >
                <Input
                  placeholder="Type the verification code"
                  size="large"
                  className="p-3"
                />
              </Form.Item>
              <Form.Item
                className="mb-5"
                name="new_password"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Type your new password"
                  size="large"
                  className="p-3"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  className="bg-blue-400 w-full"
                  htmlType="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : "Send Request"}
                </Button>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                className="mb-5"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder="Email" size="large" className="p-3" />
              </Form.Item>
              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  className="bg-blue-400 w-full"
                  htmlType="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spin />
                  ) : !isSuccessSendRequest ? (
                    "Send Request"
                  ) : (
                    "Request Changes"
                  )}
                </Button>
              </Form.Item>
            </>
          )}

          {/* <div className="text-center">
            Don&apos;t have an account?{" "}
            <span className="font-bold">
              <Link href="/join/signup">Sign Up </Link>
            </span>
          </div> */}
        </Form>
      </div>
    </Wrapper>
  );
}
