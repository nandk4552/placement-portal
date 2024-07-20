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
        `${import.meta.env.VITE_SERVER}/api/v1/student/update`,
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
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Student Details</span>
                <Button type="primary" onClick={handleEdit}>
                  Edit Details
                </Button>
              </div>
            }
            bordered={false}
            className="student-card"
          >
            <Row gutter={16}>
              <Col xs={24} md={12} lg={8}>
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
              <Col xs={24} md={12} lg={8}>
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
              </Col>
              <Col xs={24} md={12} lg={8}>
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
          </Card>
          <Modal
            title="Edit Student Details"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      { required: true, message: "Please input the name!" },
                    ]}
                  >
                    <Input placeholder="Update Name" />
                  </Form.Item>
                  <Form.Item
                    label="Roll No"
                    name="rollNumber"
                    rules={[
                      { required: true, message: "Please input the Roll No!" },
                    ]}
                  >
                    <Input placeholder="Update Roll No" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input the email!" },
                    ]}
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
                    <Input placeholder="Update Mobile Number" />
                  </Form.Item>
                  <Form.Item
                    label="Branch"
                    name="branch"
                    rules={[
                      { required: true, message: "Please input the Branch!" },
                    ]}
                  >
                    <Input placeholder="Update Branch" />
                  </Form.Item>
                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[
                      { required: true, message: "Please input the Gender!" },
                    ]}
                  >
                    <Input placeholder="Update Gender" />
                  </Form.Item>
                  <Form.Item
                    label="Date of Birth"
                    name="dateOfBirth"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Date of Birth!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Date of Birth" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    label="SSC CGPA"
                    name="sscCgpa"
                    rules={[
                      { required: true, message: "Please input the SSC CGPA!" },
                    ]}
                  >
                    <Input placeholder="Update SSC CGPA" />
                  </Form.Item>
                  <Form.Item
                    label="SSC Board"
                    name="sscBoard"
                    rules={[
                      {
                        required: true,
                        message: "Please input the SSC Board!",
                      },
                    ]}
                  >
                    <Input placeholder="Update SSC Board" />
                  </Form.Item>
                  <Form.Item
                    label="Tenth Year of Pass"
                    name="tenthYearOfPass"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Tenth Year of Pass!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Tenth Year of Pass" />
                  </Form.Item>
                  <Form.Item
                    label="Intermediate Percentage"
                    name="intermediatePercentage"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Intermediate Percentage!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Intermediate Percentage" />
                  </Form.Item>
                  <Form.Item
                    label="Intermediate"
                    name="intermediate"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Intermediate!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Intermediate" />
                  </Form.Item>
                  <Form.Item
                    label="Intermediate Pass Out Year"
                    name="intermediatePassOutYear"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Intermediate Pass Out Year!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Intermediate Pass Out Year" />
                  </Form.Item>
                  <Form.Item
                    label="B.Tech Course Joined Through"
                    name="btechCourseJoinedThrough"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please input the B.Tech Course Joined Through!",
                      },
                    ]}
                  >
                    <Input placeholder="Update B.Tech Course Joined Through" />
                  </Form.Item>
                  <Form.Item
                    label="EMCAT ECET Rank"
                    name="emcatEcetRank"
                    rules={[
                      {
                        required: true,
                        message: "Please input the EMCAT ECET Rank!",
                      },
                    ]}
                  >
                    <Input placeholder="Update EMCAT ECET Rank" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    label="B.Tech Percentage"
                    name="btechPercentage"
                    rules={[
                      {
                        required: true,
                        message: "Please input the B.Tech Percentage!",
                      },
                    ]}
                  >
                    <Input placeholder="Update B.Tech Percentage" />
                  </Form.Item>
                  <Form.Item
                    label="B.Tech CGPA"
                    name="btechCgpa"
                    rules={[
                      {
                        required: true,
                        message: "Please input the B.Tech CGPA!",
                      },
                    ]}
                  >
                    <Input placeholder="Update B.Tech CGPA" />
                  </Form.Item>
                  <Form.Item
                    label="Current Backlogs"
                    name="currentBacklogs"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Current Backlogs!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Current Backlogs" />
                  </Form.Item>
                  <Form.Item
                    label="Caste"
                    name="caste"
                    rules={[
                      { required: true, message: "Please input the Caste!" },
                    ]}
                  >
                    <Input placeholder="Update Caste" />
                  </Form.Item>
                  <Form.Item
                    label="Aadhar Card Number"
                    name="aadharCardNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Aadhar Card Number!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Aadhar Card Number" />
                  </Form.Item>
                  <Form.Item
                    label="Career Goal"
                    name="careerGoal"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Career Goal!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Career Goal" />
                  </Form.Item>
                  <Form.Item
                    label="Passport Photo"
                    name="passportPhoto"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Passport Photo URL!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Passport Photo URL" />
                  </Form.Item>
                  <Form.Item
                    label="Interested In"
                    name="interestedIn"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Interested In!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Interested In" />
                  </Form.Item>
                  <Form.Item
                    label="Father's Name"
                    name="fatherName"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Father's Name!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Father's Name" />
                  </Form.Item>
                  <Form.Item
                    label="Mother's Name"
                    name="motherName"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Mother's Name!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Mother's Name" />
                  </Form.Item>
                  <Form.Item
                    label="Parent Contact No"
                    name="parentContactNo"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Parent Contact No!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Parent Contact No" />
                  </Form.Item>
                  <Form.Item
                    label="Parent Profession"
                    name="parentProfession"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Parent Profession!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Parent Profession" />
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
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HomePage;
