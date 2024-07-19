import { Button, Card, Col, Form, Input, message, Modal, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import "./HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const [student, setStudent] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Function to fetch student data
  const getStudentData = async () => {
    try {
      dispatch({ type: "rootReducer/showLoading" });
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
      dispatch({ type: "rootReducer/hideLoading" });
    } catch (error) {
      dispatch({ type: "rootReducer/hideLoading" });
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
      dispatch({ type: "rootReducer/showLoading" });
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
      getStudentData();
      dispatch({ type: "rootReducer/hideLoading" });
    } catch (error) {
      dispatch({ type: "rootReducer/hideLoading" });
      console.error(error);
    }
  };

  useEffect(() => {
    getStudentData();
  }, []);

  return (
    <DefaultLayout>
      <Helmet>
        <title>Placement Portal | Home</title>
      </Helmet>
      <div className="home-page">
        <div className="student-details-container">
          <Card
            title="Student Details"
            bordered={false}
            className="student-card"
          >
            <Row gutter={16}>
              <Col span={12}>
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
                  <strong>Mobile Number:</strong> {student.mobileNumber}
                </p>
                <p>
                  <strong>Branch:</strong> {student.branch}
                </p>
                <p>
                  <strong>Gender:</strong> {student.gender}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>SSC CGPA:</strong> {student.sscCgpa}
                </p>
                <p>
                  <strong>SSC Board:</strong> {student.sscBoard}
                </p>
                <p>
                  <strong>Tenth Year of Pass:</strong> {student.tenthYearOfPass}
                </p>
                <p>
                  <strong>Intermediate Percentage:</strong>{" "}
                  {student.intermediatePercentage}
                </p>
                <p>
                  <strong>Intermediate:</strong> {student.intermediate}
                </p>
                <p>
                  <strong>Intermediate Pass Out Year:</strong>{" "}
                  {student.intermediatePassOutYear}
                </p>
                <p>
                  <strong>B.Tech Course Joined Through:</strong>{" "}
                  {student.btechCourseJoinedThrough}
                </p>
                <p>
                  <strong>EMCAT ECET Rank:</strong> {student.emcatEcetRank}
                </p>
                <p>
                  <strong>B.Tech Percentage:</strong> {student.btechPercentage}
                </p>
                <p>
                  <strong>B.Tech CGPA:</strong> {student.btechCgpa}
                </p>
                <p>
                  <strong>Current Backlogs:</strong> {student.currentBacklogs}
                </p>
                <p>
                  <strong>Caste:</strong> {student.caste}
                </p>
                <p>
                  <strong>Aadhar Card Number:</strong>{" "}
                  {student.aadharCardNumber}
                </p>
                <p>
                  <strong>Career Goal:</strong> {student.careerGoal}
                </p>
                <p>
                  <strong>Passport Photo:</strong>{" "}
                  <a
                    href={student.passportPhoto}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Photo
                  </a>
                </p>
                <p>
                  <strong>Interested In:</strong> {student.interestedIn}
                </p>
                <p>
                  <strong>Father's Name:</strong> {student.fatherName}
                </p>
                <p>
                  <strong>Mother's Name:</strong> {student.motherName}
                </p>
                <p>
                  <strong>Parent Contact No:</strong> {student.parentContactNo}
                </p>
                <p>
                  <strong>Parent Profession:</strong> {student.parentProfession}
                </p>
                <p>
                  <strong>Permanent Address:</strong> {student.permanentAddress}
                </p>
              </Col>
            </Row>
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
              <Form.Item
                label="Permanent Address"
                name="permanentAddress"
                rules={[
                  {
                    required: true,
                    message: "Please input the Permanent Address!",
                  },
                ]}
              >
                <Input placeholder="Update Permanent Address" />
              </Form.Item>
              <Form.Item
                label="Career Goal"
                name="careerGoal"
                rules={[
                  { required: true, message: "Please input the Career Goal!" },
                ]}
              >
                <Input placeholder="Update Career Goal" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HomePage;
