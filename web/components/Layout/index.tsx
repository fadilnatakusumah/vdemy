import {
  HTMLAttributes,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Breadcrumb, Layout as Wrapper, Menu, MenuProps } from "antd";
import classNames from "classnames";
import TopNavigation from "../TopNaviation";
import { StoreContext } from "../../context/store";
import { useRouter } from "next/router";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React from "react";
import Sidenav from "../Sidenav";

const { Content, Footer, Sider } = Wrapper;

type LayoutProps = {
  headerProps?: HTMLAttributes<HTMLDivElement>;
  contentProps?: HTMLAttributes<HTMLDivElement>;
  footerProps?: HTMLAttributes<HTMLDivElement>;
};

const REDIRECT_TO_HOME_PAGE_AUTH = [
  "/join/login",
  "/join/signup",
  "/forgot-password",
];

export default function Layout({
  children,
  headerProps = {},
  contentProps = {},
  footerProps = {},
}: PropsWithChildren<LayoutProps>) {
  const { className: contentClass, ...restContentProps } = contentProps;
  const { state } = useContext(StoreContext);
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);

  type MenuItem = Required<MenuProps>["items"][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }
  useEffect(() => {
    if (state.user && REDIRECT_TO_HOME_PAGE_AUTH.includes(router.pathname))
      router.push("/user");
  }, [state.user, router.pathname]);

  const isRoleInstructor = state.user?.role?.includes("INSTRUCTOR");

  if (isRoleInstructor) {
    return (
      <Wrapper className="block h-screen">
        <TopNavigation {...headerProps} />
        <div className="flex h-full">
          <Sidenav />
          <Content
            className={classNames("h-full bg-white", contentClass)}
            {...restContentProps}
          >
            {children}
          </Content>
        </div>
        <Footer {...footerProps}>Footer</Footer>
      </Wrapper>
    );

    // return (
    //   <Wrapper>
    //     <Header className="header">
    //       <div className="logo" />
    //       <Menu
    //         theme="dark"
    //         mode="horizontal"
    //         defaultSelectedKeys={["2"]}
    //         items={items1}
    //       />
    //     </Header>
    //     <Wrapper>
    //       <Sider width={200} className="site-layout-background">
    //         <Menu
    //           mode="inline"
    //           defaultSelectedKeys={["1"]}
    //           defaultOpenKeys={["sub1"]}
    //           style={{ height: "100%", borderRight: 0 }}
    //           items={items2}
    //         />
    //       </Sider>
    //       <Wrapper style={{ padding: "0 24px 24px" }}>
    //         <Breadcrumb style={{ margin: "16px 0" }}>
    //           <Breadcrumb.Item>Home</Breadcrumb.Item>
    //           <Breadcrumb.Item>List</Breadcrumb.Item>
    //           <Breadcrumb.Item>App</Breadcrumb.Item>
    //         </Breadcrumb>
    //         <Content
    //           className="site-layout-background"
    //           style={{
    //             padding: 24,
    //             margin: 0,
    //             minHeight: 280,
    //           }}
    //         >
    //           Content
    //         </Content>
    //       </Wrapper>
    //     </Wrapper>
    //   </Wrapper>
    // );
    // return (
    //   <Wrapper className="h-screen">
    //     <TopNavigation {...headerProps} />
    //     <Wrapper>
    //       <Sider width={200} className="site-layout-background">
    //         <Menu
    //           mode="inline"
    //           defaultSelectedKeys={["1"]}
    //           defaultOpenKeys={["sub1"]}
    //           style={{ height: "100%", borderRight: 0 }}
    //           items={items1}
    //         />
    //       </Sider>
    //       <Wrapper>
    //         <Content
    //           className={classNames("h-full bg-white", contentClass)}
    //           {...restContentProps}
    //         >
    //           {children}
    //         </Content>
    //       </Wrapper>
    //     </Wrapper>
    //     <Footer {...footerProps}>Footer</Footer>
    //   </Wrapper>
    // );
  }

  return (
    <Wrapper className="block h-screen">
      <TopNavigation {...headerProps} />
      <Content
        className={classNames("h-full bg-white", contentClass)}
        {...restContentProps}
      >
        {children}
      </Content>
      <Footer {...footerProps}>Footer</Footer>
    </Wrapper>
  );
}

// import {
//   LaptopOutlined,
//   NotificationOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import type { MenuProps } from "antd";
// import { Breadcrumb, Layout as Wrapper, Menu } from "antd";
// import React from "react";

// const { Header, Content, Sider } = Wrapper;

// const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
//   key,
//   label: `nav ${key}`,
// }));

// const items2: MenuProps["items"] = [
//   UserOutlined,
//   LaptopOutlined,
//   NotificationOutlined,
// ].map((icon, index) => {
//   const key = String(index + 1);

//   return {
//     key: `sub${key}`,
//     icon: React.createElement(icon),
//     label: `subnav ${key}`,

//     children: new Array(4).fill(null).map((_, j) => {
//       const subKey: any = index * 4 + j + 1;
//       return {
//         key: subKey,
//         label: `option${subKey}`,
//       };
//     }),
//   };
// });

// const Layout: React.FC = () => (
//   <Wrapper>
//     <Header className="header">
//       <div className="logo" />
//       <Menu
//         theme="dark"
//         mode="horizontal"
//         defaultSelectedKeys={["2"]}
//         items={items1}
//       />
//     </Header>
//     <Wrapper>
//       <Sider width={200} className="site-layout-background">
//         <Menu
//           mode="inline"
//           defaultSelectedKeys={["1"]}
//           defaultOpenKeys={["sub1"]}
//           style={{ height: "100%", borderRight: 0 }}
//           items={items2}
//         />
//       </Sider>
//       <Wrapper style={{ padding: "0 24px 24px" }}>
//         <Breadcrumb style={{ margin: "16px 0" }}>
//           <Breadcrumb.Item>Home</Breadcrumb.Item>
//           <Breadcrumb.Item>List</Breadcrumb.Item>
//           <Breadcrumb.Item>App</Breadcrumb.Item>
//         </Breadcrumb>
//         <Content
//           className="site-layout-background"
//           style={{
//             padding: 24,
//             margin: 0,
//             minHeight: 280,
//           }}
//         >
//           Content
//         </Content>
//       </Wrapper>
//     </Wrapper>
//   </Wrapper>
// );

// export default Layout;
