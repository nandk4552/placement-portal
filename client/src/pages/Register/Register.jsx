import { Button, Form, Input, message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { FaRegUser, FaRegUserCircle, FaUserCheck } from "react-icons/fa";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      dispatch({
        type: "rootReducer/showLoading",
      });
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/auth/register`,
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
    <div className="register">
      <div className="register-form">
        <h3>Register with MobyLcare</h3>
        <hr className="divider" />
        <Form layout="vertical" autoComplete="on" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input username!",
              },
            ]}
          >
            <Input type="text" placeholder="Enter Username" />
          </Form.Item>
          <Form.Item
            label="Valid Email ID"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input email!",
              },
            ]}
          >
            <Input type="email" placeholder="Enter Valid Email ID" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input phone!",
              },
            ]}
          >
            <Input type="number" placeholder="Enter Phone Number" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input password!",
              },
            ]}
          >
            <Input type="password" placeholder="Enter a Valid Password" />
          </Form.Item>
          <Form.Item
            label="Secret Answer"
            name="answer"
            rules={[
              {
                required: true,
                message: "Please input answer!",
              },
            ]}
          >
            <Input type="text" placeholder="Enter Secret Answer" />
          </Form.Item>
          <div className="form-footer">
            <p>
              Already registered? Please{" "}
              <Link to="/login" className="link">
                Login Here!
              </Link>
            </p>
            <Button type="primary" htmlType="submit" icon={<FaUserCheck />}>
              Register
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
