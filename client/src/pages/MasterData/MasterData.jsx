import { Button, Card, Col, Form, Input, message, Row } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import "./MasterData.css";
import { useNavigate } from "react-router-dom";

const MasterData = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.rootReducer.user);
  const navigate = useNavigate();

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
      form.setFieldsValue(data?.student || {});
      dispatch({ type: "rootReducer/hideLoading" });
    } catch (error) {
      dispatch({ type: "rootReducer/hideLoading" });
      console.error(error);
    }
  };

  // Function to handle the update button click
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
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
      message.error("Failed to update student data. Please try again.");
    }
  };

  useEffect(() => {
    if (user?.usertype !== "student") {
      navigate("/admin/dashboard");
      return;
    }
    getStudentData();
  }, [user, navigate]);

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
                <Button type="primary" onClick={handleUpdate}>
                  Update Details
                </Button>
              </div>
            }
            bordered={false}
            className="student-card"
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
                  <Form.Item
                    label="Caste"
                    name="caste"
                    rules={[
                      { required: true, message: "Please input the Caste!" },
                    ]}
                  >
                    <Input placeholder="Update Caste" />
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
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    label="B.Tech joined Year"
                    name="joined"
                    rules={[
                      {
                        required: true,
                        message: "Please input the B.Tech joined Year!",
                      },
                    ]}
                  >
                    <Input placeholder="Update B.Tech joined Year" />
                  </Form.Item>
                  <Form.Item
                    label="B.Tech passout Year"
                    name="passout"
                    rules={[
                      {
                        required: true,
                        message: "Please input the B.Tech passout Year!",
                      },
                    ]}
                  >
                    <Input placeholder="Update B.Tech passout Year" />
                  </Form.Item>
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
                    label="Father's Mobile Number"
                    name="parentContactNo"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Father's Mobile Number!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Father's Mobile Number" />
                  </Form.Item>
                  <Form.Item
                    label="permanentAddress"
                    name="permanentAddress"
                    rules={[
                      {
                        required: true,
                        message: "Please input the permanentAddress!",
                      },
                    ]}
                  >
                    <Input placeholder="Update permanentAddress" />
                  </Form.Item>
                  <Form.Item
                    label="Student Profile Image URL"
                    name="passportPhoto"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Student Profile Image URL!",
                      },
                    ]}
                  >
                    <Input placeholder="Update Student Profile Image URL" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default MasterData;
