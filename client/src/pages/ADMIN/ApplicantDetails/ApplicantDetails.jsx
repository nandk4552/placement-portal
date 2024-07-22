import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  notification as antNotification,
  Spin,
  Button,
  Input,
  Space,
} from "antd";
import DefaultLayout from "../../../components/DefaultLayout/DefaultLayout";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx"; // Importing xlsx for Excel export
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { useSelector } from "react-redux";

const { Column } = Table;
const { Search } = Input;

const ApplicantDetails = () => {
  const { placementId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placementTitle, setPlacementTitle] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const user = useSelector((state) => state.rootReducer.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.usertype !== "tpo") {
      navigate("/student/placements");
      return;
    }
    fetchPlacementDetails();
    fetchApplicants();
  }, [placementId]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/application/placement-applications/placement/${placementId}`
      );
      const formattedData = res.data.map((applicant) => ({
        userId: applicant.userId,
        rollNumber: applicant.rollNumber,
        name: applicant.name,
        branch: applicant.branch,
        email: applicant.email,
        alternateEmail: applicant.alternateEmail,
        mobileNumber: applicant.mobileNumber,
        dateOfBirth: applicant.dateOfBirth
          ? moment(applicant.dateOfBirth).format("DD/MM/YYYY")
          : "",
        gender: applicant.gender,
        firstName: applicant.firstName,
        middleName: applicant.middleName,
        lastName: applicant.lastName,
        sscCgpa: applicant.sscCgpa,
        sscBoard: applicant.sscBoard,
        tenthYearOfPass: applicant.tenthYearOfPass,
        intermediatePercentage: applicant.intermediatePercentage,
        intermediate: applicant.intermediate,
        intermediatePassOutYear: applicant.intermediatePassOutYear,
        btechCourseJoinedThrough: applicant.btechCourseJoinedThrough,
        emcatEcetRank: applicant.emcatEcetRank,
        btechPercentage: applicant.btechPercentage,
        btechCgpa: applicant.btechCgpa,
        currentBacklogs: applicant.currentBacklogs,
        caste: applicant.caste,
        aadharCardNumber: applicant.aadharCardNumber,
        careerGoal: applicant.careerGoal,
        passportPhoto: applicant.passportPhoto,
        interestedIn: applicant.interestedIn,
        fatherName: applicant.fatherName,
        motherName: applicant.motherName,
        parentContactNo: applicant.parentContactNo,
        parentProfession: applicant.parentProfession,
        permanentAddress: applicant.permanentAddress,
        appliedDate: applicant.appliedDate,
      }));
      setApplicants(formattedData);
      setFilteredData(formattedData); // Initialize filteredData
    } catch (error) {
      antNotification.error({
        message: "Error",
        description: "Failed to fetch applicants",
      });
    }
    setLoading(false);
  };

  const fetchPlacementDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/application/placements/${placementId}`
      );
      setPlacementTitle(res.data.title.toUpperCase());
    } catch (error) {
      antNotification.error({
        message: "Error",
        description: "Failed to fetch placement details",
      });
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = applicants.filter((applicant) =>
      Object.values(applicant).some((val) =>
        val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");
    const fileName = `${placementTitle}_Applicants.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    render: (text) => text,
  });

  const columns = [
    {
      title: "S.No",
      key: "index",
      fixed: "left",
      width: 60,
      render: (text, record, index) => index + 1,
      responsive: ["lg"],
    },
    {
      title: "Roll Number",
      dataIndex: "rollNumber",
      key: "rollNumber",
      fixed: "left",
      width: 150,
      ...getColumnSearchProps("rollNumber"),
      responsive: ["md"],
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 150,
      ...getColumnSearchProps("name"),
      responsive: ["md"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      fixed: "left",
      width: 200,
      ...getColumnSearchProps("email"),
      responsive: ["lg"],
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      width: 150,
      ...getColumnSearchProps("branch"),
      responsive: ["md"],
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 150,
      ...getColumnSearchProps("mobileNumber"),
      responsive: ["lg"],
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 150,
      render: (dateOfBirth) =>
        dateOfBirth ? moment(dateOfBirth).format("DD/MM/YYYY") : "",
      ...getColumnSearchProps("dateOfBirth"),
      responsive: ["lg"],
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      ...getColumnSearchProps("gender"),
      responsive: ["md"],
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      width: 150,
      ...getColumnSearchProps("firstName"),
      responsive: ["lg"],
    },
    {
      title: "Middle Name",
      dataIndex: "middleName",
      key: "middleName",
      width: 150,
      ...getColumnSearchProps("middleName"),
      responsive: ["lg"],
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      width: 150,
      ...getColumnSearchProps("lastName"),
      responsive: ["lg"],
    },
    {
      title: "SSC CGPA",
      dataIndex: "sscCgpa",
      key: "sscCgpa",
      width: 120,
      ...getColumnSearchProps("sscCgpa"),
      responsive: ["lg"],
    },
    {
      title: "SSC Board",
      dataIndex: "sscBoard",
      key: "sscBoard",
      width: 150,
      ...getColumnSearchProps("sscBoard"),
      responsive: ["lg"],
    },
    {
      title: "10th Year of Pass",
      dataIndex: "tenthYearOfPass",
      key: "tenthYearOfPass",
      width: 150,
      ...getColumnSearchProps("tenthYearOfPass"),
      responsive: ["lg"],
    },
    {
      title: "Intermediate Percentage",
      dataIndex: "intermediatePercentage",
      key: "intermediatePercentage",
      width: 180,
      ...getColumnSearchProps("intermediatePercentage"),
      responsive: ["lg"],
    },
    {
      title: "Intermediate",
      dataIndex: "intermediate",
      key: "intermediate",
      width: 150,
      ...getColumnSearchProps("intermediate"),
      responsive: ["lg"],
    },
    {
      title: "Intermediate Pass Out Year",
      dataIndex: "intermediatePassOutYear",
      key: "intermediatePassOutYear",
      width: 200,
      ...getColumnSearchProps("intermediatePassOutYear"),
      responsive: ["lg"],
    },
    {
      title: "BTech Course Joined Through",
      dataIndex: "btechCourseJoinedThrough",
      key: "btechCourseJoinedThrough",
      width: 200,
      ...getColumnSearchProps("btechCourseJoinedThrough"),
      responsive: ["lg"],
    },
    {
      title: "EMCAT/ECET Rank",
      dataIndex: "emcatEcetRank",
      key: "emcatEcetRank",
      width: 150,
      ...getColumnSearchProps("emcatEcetRank"),
      responsive: ["lg"],
    },
    {
      title: "BTech Percentage",
      dataIndex: "btechPercentage",
      key: "btechPercentage",
      width: 150,
      ...getColumnSearchProps("btechPercentage"),
      responsive: ["lg"],
    },
    {
      title: "BTech CGPA",
      dataIndex: "btechCgpa",
      key: "btechCgpa",
      width: 120,
      ...getColumnSearchProps("btechCgpa"),
      responsive: ["lg"],
    },
    {
      title: "Current Backlogs",
      dataIndex: "currentBacklogs",
      key: "currentBacklogs",
      width: 150,
      ...getColumnSearchProps("currentBacklogs"),
      responsive: ["lg"],
    },
    {
      title: "Caste",
      dataIndex: "caste",
      key: "caste",
      width: 120,
      ...getColumnSearchProps("caste"),
      responsive: ["lg"],
    },
    {
      title: "Aadhar Card Number",
      dataIndex: "aadharCardNumber",
      key: "aadharCardNumber",
      width: 200,
      ...getColumnSearchProps("aadharCardNumber"),
      responsive: ["lg"],
    },
    {
      title: "Career Goal",
      dataIndex: "careerGoal",
      key: "careerGoal",
      width: 200,
      ...getColumnSearchProps("careerGoal"),
      responsive: ["lg"],
    },
    {
      title: "Passport Photo",
      dataIndex: "passportPhoto",
      key: "passportPhoto",
      width: 150,
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          View Photo
        </a>
      ),
      ...getColumnSearchProps("passportPhoto"),
      responsive: ["lg"],
    },
    {
      title: "Interested In",
      dataIndex: "interestedIn",
      key: "interestedIn",
      width: 200,
      ...getColumnSearchProps("interestedIn"),
      responsive: ["lg"],
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      key: "fatherName",
      width: 150,
      ...getColumnSearchProps("fatherName"),
      responsive: ["lg"],
    },
    {
      title: "Mother Name",
      dataIndex: "motherName",
      key: "motherName",
      width: 150,
      ...getColumnSearchProps("motherName"),
      responsive: ["lg"],
    },
    {
      title: "Parent Contact No",
      dataIndex: "parentContactNo",
      key: "parentContactNo",
      width: 150,
      ...getColumnSearchProps("parentContactNo"),
      responsive: ["lg"],
    },
    {
      title: "Parent Profession",
      dataIndex: "parentProfession",
      key: "parentProfession",
      width: 180,
      ...getColumnSearchProps("parentProfession"),
      responsive: ["lg"],
    },
    {
      title: "Permanent Address",
      dataIndex: "permanentAddress",
      key: "permanentAddress",
      width: 250,
      ...getColumnSearchProps("permanentAddress"),
      responsive: ["lg"],
    },
  ];

  return (
    <DefaultLayout>
      <h1>{placementTitle} Placement Drive - Applicant Details</h1>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search applicants"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button onClick={handleExport} type="primary">
          Export to Excel
        </Button>
      </Space>
      <Spin spinning={loading}>
        <Table
          size="small"
          dataSource={filteredData}
          columns={columns}
          rowKey="userId"
          bordered
          scroll={{ x: 1500, y: "calc(100vh - 80px)" }} // Adjust width for horizontal scrolling
        />
      </Spin>
    </DefaultLayout>
  );
};

export default ApplicantDetails;
