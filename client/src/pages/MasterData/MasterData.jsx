import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import "./MasterData.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const formatDate = (date) => {
  return date ? moment(date).format("YYYY-MM-DD") : null;
};
const formatYear = (date) => {
  return date ? moment(date).format("YYYY") : null;
};

const MasterData = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.rootReducer.user);
  const navigate = useNavigate();
  const [isMasterData, setIsMasterData] = useState(false);

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
      if (data?.student) {
        setIsMasterData(true);
        // Properly format the dates for the form
        const formattedStudentData = {
          ...data.student,
          dateOfBirth: data.student.dateOfBirth
            ? moment(data.student.dateOfBirth)
            : null,
          joinedBtech: data.student.joinedBtech
            ? moment(data.student.joinedBtech)
            : null,
          passoutBtech: data.student.passoutBtech
            ? moment(data.student.passoutBtech)
            : null,
        };
        console.log("Formatted Student Data:", formattedStudentData);
        form.setFieldsValue(formattedStudentData);
      } else {
        setIsMasterData(false);
        form.resetFields();
      }
      dispatch({ type: "rootReducer/hideLoading" });
    } catch (error) {
      dispatch({ type: "rootReducer/hideLoading" });
      console.error(error);
    }
  };

  const handleSubmit = async (value) => {
    // Ensure date fields are formatted correctly for submission

    const finalValues = {
      ...value,
      dateOfBirth: formatDate(value.dateOfBirth),
    };

    console.log("Final Values:", finalValues);

    try {
      dispatch({
        type: "rootReducer/showLoading",
      });
      const url = isMasterData
        ? `${import.meta.env.VITE_SERVER}/api/v1/student/update`
        : `${import.meta.env.VITE_SERVER}/api/v1/student/create`;

      const method = isMasterData ? "put" : "post";

      const { data } = await axios[method](url, finalValues, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      message.success(data?.message);
      getStudentData();
      dispatch({
        type: "rootReducer/hideLoading",
      });
    } catch (error) {
      dispatch({
        type: "rootReducer/hideLoading",
      });
      message.error("Something went wrong!");
      console.error(error);
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
                <Button type="primary" onClick={() => form.submit()}>
                  {isMasterData ? "Update Details" : "Add Details"}
                </Button>
              </div>
            }
            bordered={false}
            className="student-card"
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Row gutter={16}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      { required: true, message: "Please input the name!" },
                    ]}
                  >
                    <Input placeholder="Add Name" />
                  </Form.Item>
                  <Form.Item
                    label="Roll No"
                    name="rollNumber"
                    rules={[
                      { required: true, message: "Please input the Roll No!" },
                    ]}
                  >
                    <Input placeholder="Add Roll No" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input the email!" },
                    ]}
                  >
                    <Input type="email" placeholder="Add Email" />
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
                    <Input type="email" placeholder="Add Alternate Email" />
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
                    <Input placeholder="Add Mobile Number" />
                  </Form.Item>
                  <Form.Item
                    label="Branch"
                    name="branch"
                    rules={[
                      { required: true, message: "Please input the Branch!" },
                    ]}
                  >
                    <Input placeholder="Add Branch" />
                  </Form.Item>
                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[
                      { required: true, message: "Please input the Gender!" },
                    ]}
                  >
                    <Input placeholder="Add Gender" />
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
                    <DatePicker
                      format="DD/MM/YYYY"
                      placeholder="Select Date of Birth"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Caste"
                    name="caste"
                    rules={[
                      { required: true, message: "Please input the Caste!" },
                    ]}
                  >
                    <Input placeholder="Add Caste" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    label="SSC  CGPA"
                    name="sscCgpa"
                    rules={[
                      { required: true, message: "Please input the SSC CGPA!" },
                    ]}
                  >
                    <Input placeholder="Add SSC CGPA" />
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
                    <Input placeholder="Add SSC Board" />
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
                    <Input placeholder="Add Tenth Year of Pass" />
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
                    <Input placeholder="Add Intermediate Percentage" />
                  </Form.Item>
                  <Form.Item
                    label="Intermediate / Diploma"
                    name="intermediate"
                    rules={[
                      {
                        required: true,
                        message: "Please select the Intermediate or Diploma!",
                      },
                    ]}
                  >
                    <Select placeholder="Select Intermediate or Diploma">
                      <Select.Option value="Intermediate">
                        Intermediate
                      </Select.Option>
                      <Select.Option value="Diploma">Diploma</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Intermediate / Diploma Pass Out Year"
                    name="intermediatePassOutYear"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please input the Intermediate / Diploma Pass Out Year!",
                      },
                    ]}
                  >
                    <Input placeholder="Add Intermediate / Diploma Pass Out Year" />
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
                    <Input placeholder="Add B.Tech Course Joined Through" />
                  </Form.Item>
                  <Form.Item
                    label="EMCAT / ECET Rank"
                    name="emcatEcetRank"
                    rules={[
                      {
                        required: true,
                        message: "Please input the EMCAT / ECET Rank!",
                      },
                    ]}
                  >
                    <Input placeholder="Add EMCAT / ECET Rank" />
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
                    <Input placeholder="Add Current Backlogs" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    label="Btech Joined Year"
                    name="btechJoinedYear"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Btech Joined Year!",
                      },
                    ]}
                  >
                    <Input type="number" placeholder="Add Btech Joined Year" />
                  </Form.Item>
                  <Form.Item
                    label="Btech Pass Out Year"
                    name="btechPassOutYear"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Btech Pass Out Year!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Add Btech Pass Out Year"
                    />
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
                    <Input placeholder="Add B.Tech Percentage" />
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
                    <Input placeholder="Add B.Tech CGPA" />
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
                    <Input placeholder="Add Aadhar Card Number" />
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
                    <Input placeholder="Add Career Goal" />
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
                    <Input placeholder="Add Father's Name" />
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
                    <Input placeholder="Add Father's Mobile Number" />
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
                    <Input placeholder="Add Permanent Address" />
                  </Form.Item>
                 
                </Col>
                <Col xs={24} md={12} lg={8}>
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
                    <Input placeholder="Add Student Profile Image URL" />
                  </Form.Item>
                  <Form.Item
                    label="Student Resume URL"
                    name="resume"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Student resume URL!",
                      },
                    ]}
                  >
                    <Input placeholder="Add Student resume URL" />
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
