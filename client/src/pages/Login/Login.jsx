import { Button, Form, Input, Layout, Switch, Typography, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isStudentLogin, setIsStudentLogin] = useState(true); // State to toggle between student and admin login

  const handleSubmit = async (values) => {
    console.log("submit");
    try {
      dispatch({
        type: "rootReducer/showLoading",
      });
      const url = isStudentLogin
        ? `${import.meta.env.VITE_SERVER}/api/v1/auth/student/login`
        : `${import.meta.env.VITE_SERVER}/api/v1/auth/admin/login`; // Change URL based on login type
      const { data } = await axios.post(url, values);
      console.log(data);
      message.success(data?.message);
      dispatch({
        type: "rootReducer/hideLoading",
      });
      localStorage.setItem(
        "auth",
        JSON.stringify(isStudentLogin ? data?.user : data?.admin)
      );
      localStorage.setItem("token", data?.token);
      if (isStudentLogin) {
        return navigate("/");
      } else {
        return navigate("/admin/");
      }
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
    <Layout className="login-layout">
      <Helmet>
        <title>
          Placement Portal | {isStudentLogin ? "Student Login" : "Admin Login"}
        </title>
      </Helmet>
      <Content className="login-content">
        <Form
          name="login"
          initialValues={{ remember: true }}
          layout="vertical"
          className="login-form"
          onFinish={handleSubmit}
        >
          <Form.Item style={{ textAlign: "right" }}>
            <Switch
              checkedChildren="Student"
              unCheckedChildren="Admin"
              defaultChecked={!isStudentLogin}
              onChange={() => setIsStudentLogin(!isStudentLogin)}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title level={3}>
              {isStudentLogin ? "Student Login" : "Admin Login"}
            </Title>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Valid Email ID" className="login-input" />
          </Form.Item>
          {isStudentLogin && (
            <Form.Item
              name="rollno"
              rules={[
                { required: true, message: "Please input your roll number!" },
              ]}
            >
              <Input placeholder="Roll No" className="login-input" />
            </Form.Item>
          )}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password placeholder="Password" className="login-input" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default Login;
