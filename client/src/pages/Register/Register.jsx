import { Button, Form, Input, Layout, Typography, message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { FaUserCheck } from "react-icons/fa";

const { Title } = Typography;
const { Content } = Layout;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      dispatch({
        type: "rootReducer/showLoading",
      });
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/auth/student/register`,
        values
      );
      message.success(data?.message);
      dispatch({
        type: "rootReducer/hideLoading",
      });
      navigate("/login");
    } catch (error) {
      dispatch({
        type: "rootReducer/hideLoading",
      });
      message.error("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Layout className="register-layout">
      <Helmet>
        <title>Placement Portal | Student Register</title>
      </Helmet>
      <Content className="register-content">
        <Form
          name="register"
          layout="vertical"
          className="register-form"
          onFinish={handleSubmit}
        >
          <Form.Item style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title level={3}>Student Registration</Title>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Roll Number"
            name="rollno"
            rules={[
              {
                required: true,
                message: "Please input your roll number!",
              },
            ]}
          >
            <Input placeholder="Enter your roll number" />
          </Form.Item>
          <Form.Item
            label="Year"
            name="year"
            rules={[
              {
                required: true,
                message: "Please input your year!",
              },
            ]}
          >
            <Input placeholder="Enter your year" />
          </Form.Item>
          <Form.Item
            label="Branch"
            name="branch"
            rules={[
              {
                required: true,
                message: "Please input your branch!",
              },
            ]}
          >
            <Input placeholder="Enter your branch" />
          </Form.Item>
          <div className="form-footer">
            <p>
              Already registered? Please{" "}
              <Link to="/login" className="link">
                Login Here!
              </Link>
            </p>
            <Button
              type="primary"
              htmlType="submit"
              className="register-button"
              icon={<FaUserCheck />}
            >
              Register
            </Button>
          </div>
        </Form>
      </Content>
    </Layout>
  );
};

export default Register;
