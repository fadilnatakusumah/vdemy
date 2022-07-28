import {
  BellOutlined,
  GlobalOutlined,
  HeartOutlined,
  LogoutOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Button, Dropdown, Input, Menu } from "antd";
// import { Header } from "antd/lib/layout/layout";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes, useContext } from "react";
import toast from "react-hot-toast";
import UserAPI from "../../api/user";

import { ACTION_TYPE } from "../../context/actions";
import { StoreContext } from "../../context/store";

const { Header } = Layout;
export default function TopNavigation(props: HTMLAttributes<HTMLDivElement>) {
  const { state, dispatch } = useContext(StoreContext);
  const { className, ...restProps } = props;
  const router = useRouter();

  const leftMenus = [
    {
      label: "Categories",
      key: "categories",
      children: [{ label: "Category 1", key: "submenu-item-1" }],
    },
  ];

  const rightMenus = [
    {
      label: "Vdemy Business",
      key: "vdemy_business",
    },
    {
      label: "Teach on Vdemy",
      key: "teach_vdemy",
      children: state.user?.role?.includes("INSTRUCTOR")
        ? [
            {
              key: "learn_more",
              label: (
                <div>
                  <Link href="/instructor">Learn More</Link>
                </div>
              ),
            },
            {
              key: "create_course",
              label: (
                <div>
                  <Link href="/instructor/create-course">Create Course</Link>
                </div>
              ),
            },
          ]
        : [
            {
              key: "become_instructor",
              label: (
                <div>
                  <Link href="/become-instructor">Become Instructor</Link>
                </div>
              ),
            },
          ],
    },
    {
      label: "My Learning",
      key: "my_learning",
    },
  ];

  const isAuthenticated = Boolean(state.user);

  const logout = async () => {
    try {
      await UserAPI.logout();
      dispatch({ type: ACTION_TYPE.LOGOUT });

      // save in local storage
      window.localStorage.removeItem("user");

      toast.success("Successfully logged out");
      // redirect
      router.push("/");
    } catch (error: any) {
      toast.error(error.response.data);
      console.error(error);
    }
  };

  const profileMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: (
            <Link href="/me">
              <div className="p-2 flex items-center gap-2">
                <UserOutlined /> Profile
              </div>
            </Link>
          ),
        },
        {
          key: "logout",
          label: (
            <div onClick={logout} className="p-2 flex items-center gap-2">
              <LogoutOutlined /> Log out
            </div>
          ),
        },
      ]}
    />
  );

  return (
    <Header
      className={classNames("flex bg-white items-center border-b", className)}
      {...restProps}
    >
      <div className="logo mr-8">
        <Link href="/">
          <span className="text-lg mr-0 font-bold cursor-pointer">Vdemy</span>
        </Link>
      </div>
      <Menu mode="horizontal" items={leftMenus} />
      <Input
        className="rounded-lg max-w-2xl h-12"
        placeholder="Search fpr anything"
        prefix={<SearchOutlined />}
      />
      <Menu mode="horizontal" items={rightMenus} />

      <div className="flex items-center flex-1 justify-end gap-2">
        {isAuthenticated ? (
          <>
            <Button
              type="text"
              shape="circle"
              size="large"
              icon={<HeartOutlined />}
            />
            <Button
              type="text"
              shape="circle"
              size="large"
              icon={<ShoppingCartOutlined />}
            />
            <Button
              type="text"
              shape="circle"
              size="large"
              icon={<BellOutlined />}
            />
            {/* <ProfileMenu /> */}
            <Dropdown overlay={profileMenu}>
              <a onClick={(e) => e.preventDefault()}>
                <span className="rounded-full bg-black font-bold text-white h-8 w-8 flex items-center justify-center">
                  FN
                </span>
              </a>
            </Dropdown>
          </>
        ) : (
          <>
            <Button
              type="text"
              shape="circle"
              size="large"
              icon={<ShoppingCartOutlined />}
            />
            <Link href={"/join/login"}>
              <Button>Log in</Button>
            </Link>
            <Link href={"/join/signup"}>
              <Button type="primary" className="bg-blue-400">
                Sign up
              </Button>
            </Link>
            <Button
              type="text"
              shape="circle"
              size="large"
              icon={<GlobalOutlined />}
            />
          </>
        )}
      </div>
    </Header>
  );
}
