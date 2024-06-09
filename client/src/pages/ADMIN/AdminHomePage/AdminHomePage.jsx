import React from "react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../../components/DefaultLayout/DefaultLayout";

const AdminHomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <DefaultLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card title="Admin Dashboard" style={{ width: 400 }}>
          <p>Welcome to the Admin Dashboard</p>
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default AdminHomePage;
