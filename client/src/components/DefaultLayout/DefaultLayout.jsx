import { BellOutlined } from "@ant-design/icons";
import {
  notification as antNotification,
  Badge,
  Button,
  Layout,
  List,
  Menu,
  Popover,
  theme,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaTable, FaUserGraduate } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { LuArrowLeftFromLine, LuArrowRightFromLine } from "react-icons/lu";
import { RiShieldUserFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Title from "../Title/Title";
import UserAvatar from "../UserAvatar/UserAvatar";
import "./DefaultLayout.css";
const socket = io("http://localhost:8080"); // Ensure the URL matches your server address

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(true);
  const [placements, setPlacements] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchPlacements();
    socket.on("new-placement", (placement) => {
      setNotifications((prev) => [...prev, placement]);
      antNotification.info({
        message: "New Placement Drive",
        description: `${placement.title} on ${new Date(
          placement.date
        ).toDateString()}`,
      });
    });

    return () => {
      socket.off("new-placement");
    };
  }, []);

  const fetchPlacements = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/placements");
    setPlacements(res.data);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // Fetch usertype from local storage
  const auth = localStorage.getItem("auth");
  const userType = auth ? JSON.parse(auth).usertype : null;

  const [visible, setVisible] = useState(false);

  // Toggle popover visibility
  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

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
          {/* <h1>PP</h1> */}
          <img
            src="https://vjit.ac.in/wp-content/uploads/2023/05/favicon.png"
            alt="vjit logo"
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
        >
          {userType === "student" ? (
            <>
              <Menu.Item key="/" icon={<IoHome size={"1.5rem"} color="#ccc" />}>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item
                key="/student/placements"
                icon={<FaTable size={"1.5rem"} color="#ccc" />}
              >
                <Link to="/student/placements">Placements</Link>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item
                key="/admin/manage-admins"
                icon={<RiShieldUserFill size={"1.5rem"} color="#ccc" />}
              >
                <Link to="/admin/manage-admins">Admins</Link>
              </Menu.Item>
              <Menu.Item
                key="/admin/manage-students"
                icon={<FaUserGraduate size={"1.3rem"} color="#ccc" />}
              >
                <Link to="/admin/manage-students">Students</Link>
              </Menu.Item>
              <Menu.Item
                key="/admin/manage-placements"
                icon={<FaTable size={"1.3rem"} color="#ccc" />}
              >
                <Link to="/admin/manage-placements">Placements</Link>
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
          <div
            className="me-3"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "1rem",
            }}
          >
            <Popover
              content={
                <List
                  size="small"
                  dataSource={notifications}
                  renderItem={(notification, index) => (
                    <List.Item key={index}>
                      {notification.title} -{" "}
                      {new Date(notification.date).toDateString()}
                    </List.Item>
                  )}
                />
              }
              title="Notifications"
              trigger="click"
              open={visible}
              onOpenChange={handleVisibleChange}
              style={{
                marginRight: "2rem",
              }}
            >
              <Badge count={notifications.length}>
                <Button shape="circle" icon={<BellOutlined />} />
              </Badge>
            </Popover>
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
