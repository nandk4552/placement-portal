import React from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";

dayjs.extend(customParseFormat);

const { Option } = Select;

const StudentForm = ({ initialValues, onFinish }) => {
  const formattedInitialValues = {
    ...initialValues,
    dateOfBirth: initialValues?.dateOfBirth ? moment(initialValues.dateOfBirth) : null,
  };

  return (
    <Form
      size="small"
      initialValues={formattedInitialValues}
      layout="vertical"
      autoComplete="on"
      onFinish={onFinish}
    >
      <Form.Item
        label="Roll Number"
        name="rollNumber"
        rules={[{ required: true, message: "Please input roll number!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: "Please input first name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Middle Name" name="middleName">
        <Input />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: "Please input last name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Branch" name="branch">
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input type="email" />
      </Form.Item>
      <Form.Item label="Alternate Email" name="alternateEmail">
        <Input type="email" />
      </Form.Item>
      <Form.Item label="Mobile Number" name="mobileNumber">
        <Input />
      </Form.Item>
      <Form.Item
        label="Date of Birth"
        name="dateOfBirth"
        rules={[{ required: true, message: "Please select date of birth!" }]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item label="Gender" name="gender">
        <Select placeholder="Select gender">
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
          <Option value="Other">Other</Option>
        </Select>
      </Form.Item>
      <Form.Item label="SSC CGPA" name="sscCgpa">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="SSC Board" name="sscBoard">
        <Input />
      </Form.Item>
      <Form.Item label="10th Year of Passing" name="tenthYearOfPass">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Intermediate Percentage" name="intermediatePercentage">
        <Input />
      </Form.Item>
      <Form.Item label="Intermediate Board" name="intermediate">
        <Input />
      </Form.Item>
      <Form.Item label="Intermediate Pass Out Year" name="intermediatePassOutYear">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="B.Tech Course Joined Through" name="btechCourseJoinedThrough">
        <Input />
      </Form.Item>
      <Form.Item label="EMCAT/ECET Rank" name="emcatEcetRank">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="B.Tech Percentage" name="btechPercentage">
        <Input />
      </Form.Item>
      <Form.Item label="B.Tech CGPA" name="btechCgpa">
        <Input />
      </Form.Item>
      <Form.Item label="Current Backlogs" name="currentBacklogs">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Caste" name="caste">
        <Input />
      </Form.Item>
      <Form.Item label="Aadhar Card Number" name="aadharCardNumber">
        <Input />
      </Form.Item>
      <Form.Item label="Career Goal" name="careerGoal">
        <Input />
      </Form.Item>
      <Form.Item label="Passport Photo" name="passportPhoto">
        <Input />
      </Form.Item>
      <Form.Item label="Interested In" name="interestedIn">
        <Input />
      </Form.Item>
      <Form.Item label="Father's Name" name="fatherName">
        <Input />
      </Form.Item>
      <Form.Item label="Mother's Name" name="motherName">
        <Input />
      </Form.Item>
      <Form.Item label="Parent Contact Number" name="parentContactNo">
        <Input />
      </Form.Item>
      <Form.Item label="Parent Profession" name="parentProfession">
        <Input />
      </Form.Item>
      <Form.Item label="Permanent Address" name="permanentAddress">
        <Input />
      </Form.Item>

      <div className="d-flex justify-content-end">
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default StudentForm;
