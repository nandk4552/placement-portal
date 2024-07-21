import { BellOutlined } from "@ant-design/icons";
import { Badge, Button, Layout, List, Menu, Popover, theme } from "antd";
import axios from "axios";
import { lazy, useEffect, useState } from "react";
import { FaTable, FaUserGraduate } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { LuArrowLeftFromLine, LuArrowRightFromLine } from "react-icons/lu";
import { RiShieldUserFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Title from "../Title/Title";
import "./DefaultLayout.css";
// Lazy load UserAvatar component
const UserAvatar = lazy(() => import("../UserAvatar/UserAvatar"));

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  // Fetch usertype from local storage
  const auth = localStorage.getItem("auth");
  const userType = auth ? JSON.parse(auth).usertype : null;

  const { loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(true);
  const [placements, setPlacements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    // Fetch placements data
    const fetchPlacements = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/placements");
        setPlacements(res.data);
      } catch (error) {
        console.error("Error fetching placements:", error);
      }
    };

    fetchPlacements();

    // Fetch notifications data if the user is a student
    if (userType === "student") {
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "http://localhost:8080/api/v1/user/notifications",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const fetchedNotifications = response.data;
          setNotifications(fetchedNotifications);
          // Calculate unread notifications count
          const countUnread = fetchedNotifications.filter(
            (notification) => !notification.read
          ).length;
          setUnreadCount(countUnread);
        } catch (error) {
          setError("Error fetching notifications.");
          console.error("Error fetching notifications:", error);
        } finally {
          setLoadingNotifications(false);
        }
      };

      fetchNotifications();
    }
  }, []);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8080/api/v1/user/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local notifications state
      const updatedNotifications = notifications.map((notification) =>
        notification._id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      setNotifications(updatedNotifications);

      // Update unread notifications count
      const countUnread = updatedNotifications.filter(
        (notification) => !notification.read
      ).length;
      setUnreadCount(countUnread);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Error marking notification as read.");
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
          className="d-flex align-items-center justify-content-between"
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
                  renderItem={(notification) => (
                    <List.Item key={notification._id}>
                      {notification.title} -{" "}
                      {new Date(notification.date).toDateString()}
                      {!notification.read && (
                        <Button
                          type="link"
                          onClick={() => markAsRead(notification._id)}
                        >
                          Mark as Read
                        </Button>
                      )}
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
              <Badge count={unreadCount}>
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
