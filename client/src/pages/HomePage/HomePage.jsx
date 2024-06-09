import React, { useEffect } from "react";
import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { Button, Modal, Form, Input, Card, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Function to fetch all student data
  const getAllStudents = async () => {
    try {
      dispatch({
        type: "rootReducer/showLoading",
      });
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/student/get`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("User data fetched successfully");
      setStudent(data?.student || {});
      dispatch({
        type: "rootReducer/hideLoading",
      });
    } catch (error) {
      dispatch({
        type: "rootReducer/hideLoading",
      });
      console.error(error);
    }
  };

  // Function to handle the edit button click
  const handleEdit = () => {
    form.setFieldsValue(student);
    setIsModalVisible(true);
  };

  // Function to handle the OK button click in the modal
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        handleUpdateStudent(values);
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Function to handle the Cancel button click in the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to update the student data
  const handleUpdateStudent = async (values) => {
    try {
      dispatch({
        type: "rootReducer/showLoading",
      });
      await axios.put(
        `${import.meta.env.VITE_SERVER}/api/v1/student/update/only/details`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Student Updated Successfully");
      getAllStudents();
      dispatch({
        type: "rootReducer/hideLoading",
      });
    } catch (error) {
      dispatch({
        type: "rootReducer/hideLoading",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  return (
    <DefaultLayout>
      <Helmet>
        <title>Placement Portal | Home</title>
      </Helmet>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <div style={{ width: "450px" }}>
          <Card title="Student Details" bordered={false}>
            <p>
              <strong>Name:</strong> {student.name}
            </p>
            <p>
              <strong>Roll No:</strong> {student.rollNumber}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Alternate Email:</strong> {student.alternateEmail}
            </p>
            <p>
              <strong>Branch:</strong> {student.branch}
            </p>
            <Button type="primary" onClick={handleEdit}>
              Edit Details
            </Button>
          </Card>
          <Modal
            title="Edit Student Details"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input the email!" }]}
              >
                <Input type="email" placeholder="Update Email" />
              </Form.Item>
              <Form.Item
                label="Alternate Email"
                name="alternateEmail"
                rules={[
                  {
                    required: true,
                    message: "Please input the Alternate Email!",
                  },
                ]}
              >
                <Input type="email" placeholder="Update Alternate Email" />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="mobileNumber"
                rules={[
                  {
                    required: true,
                    message: "Please input the Mobile Number!",
                  },
                ]}
              >
                <Input type="number" placeholder="Update Mobile Number" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HomePage;
