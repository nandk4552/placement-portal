import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Menu,
  Modal,
  message,
  Space,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import "./UserAvatar.css";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserCog } from "react-icons/fa";

const UserAvatar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const auth = localStorage.getItem("auth");
  const userType = auth ? JSON.parse(auth).usertype : null;
  const fetchUserDetails = async () => {
    try {
      if (userType == "student") {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/user/get-user`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserData(data.user);
      } else {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/admin/get-admin`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserData(data.admin);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmNewPassword) {
      message.error("Passwords do not match");
      return;
    }
    try {
      if (userType == "student") {
        await axios.post(
          `${import.meta.env.VITE_SERVER}/api/v1/user/update-password`,
          {
            oldPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_SERVER}/api/v1/admin/update-admin-password`,
          {
            oldPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      message.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update password");
      console.error(error);
    }
  };

  const handleAvatarClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const items = [
    {
      key: "profile",
      label: "Profile",
      icon: <FaUserCog />,
      onClick: handleAvatarClick,
    },
    {
      key: "logout",
      icon: <HiOutlineLogout />,
      label: `Logout`,
      onClick: () => {
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
        window.location.href = "/login";
      },
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <div onClick={(e) => e.preventDefault()}>
          <Avatar
            className="user-avatar"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 18px 50px -10px",
              width: "50px",
              height: "50px",
              cursor: "pointer",
            }}
            src={userData?.profile}
            icon={<UserOutlined />}
          />
        </div>
      </Dropdown>
      <Modal
        title={userType == "student" ? "User Profile" : "Admin Profile"}
        open={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        {userType == "student" && userData ? (
          <div className="user-avatar-modal">
            <p>
              <strong>Name:</strong> {userData?.name}
            </p>
            <p>
              <strong>Email:</strong> {userData?.email}
            </p>
            <p>
              <strong>Roll No:</strong> {userData?.rollno}
            </p>
            <p>
              <strong>Year:</strong> {userData?.year}
            </p>
            <p>
              <strong>Branch:</strong> {userData?.branch}
            </p>
            <div>
              <Input.Password
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{ marginBottom: "10px", marginTop: "10px" }}
              />
              <Input.Password
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <Input.Password
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <Button type="primary" onClick={handlePasswordUpdate}>
                Update Password
              </Button>
            </div>
          </div>
        ) : (
          <div className="user-avatar-modal">
            <p>
              <strong>Name:</strong> {userData?.name}
            </p>
            <p>
              <strong>Email:</strong> {userData?.email}
            </p>
            <p>
              <strong>Branch:</strong> {userData?.branch}
            </p>
            <div>
              <Input.Password
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{ marginBottom: "10px", marginTop: "10px" }}
              />
              <Input.Password
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <Input.Password
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <Button type="primary" onClick={handlePasswordUpdate}>
                Update Password
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UserAvatar;
