import { Form, Input, Layout, Menu, Modal, Select } from "antd";
import Link from "next/link";
import { useState } from "react";
import CreateCourseModalForm from "../Form/CreateCourseModalForm";

const { Sider } = Layout;

export default function Sidenav() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const INSTRUCTOR_SIDE_MENU = [
    {
      key: "course",
      label: (
        <Link href="/instructor/courses">
          <div>Courses</div>
        </Link>
      ),
    },
  ];

  return (
    <Sider>
      <Menu
        className="bg-gray-50"
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
        items={INSTRUCTOR_SIDE_MENU}
      />
    </Sider>
  );
}
