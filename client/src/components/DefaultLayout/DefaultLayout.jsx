import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { FaUsersGear } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { LuArrowLeftFromLine, LuArrowRightFromLine } from "react-icons/lu";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Title from "../Title/Title";
import UserAvatar from "../UserAvatar/UserAvatar";
import "./DefaultLayout.css";

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // Fetch usertype from local storage
  const auth = localStorage.getItem("auth");
  const userType = auth ? JSON.parse(auth).usertype : null;
  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      {/* {loading && <Spinner />} */}
      <Title />

      <Sider
        className="side-bar-menu"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ overflow: "visible" }}
      >
        <div className="demo-logo-vertical">
          <h1>PP</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
        >
          {userType === "student" ? (
            <Menu.Item key="/" icon={<IoHome size={"1.5rem"} color="#ccc" />}>
              <Link to="/">Home</Link>
            </Menu.Item>
          ) : (
            <>
              <Menu.Item
                key="/admin/manage-admin"
                icon={<FaUsersGear size={"1.5rem"} color="#ccc" />}
              >
                <Link to="/admin/manage-admin">Admins</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer, padding: 0 }}
          className="d-flex  align-items-center justify-content-between"
        >
          <div>
            <Button
              type="text"
              icon={
                collapsed ? (
                  <LuArrowRightFromLine color="#001529" size="1.5rem" />
                ) : (
                  <LuArrowLeftFromLine color="#001529" size="1.5rem" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: "white",
              }}
            />
          </div>
          <div className="me-3">
            <UserAvatar />
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
