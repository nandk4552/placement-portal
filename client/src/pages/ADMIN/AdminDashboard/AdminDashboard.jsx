import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Divider, Table, Progress } from "antd";
import { Column, Pie } from "@ant-design/charts";
import {
  FaUserGraduate,
  FaRegFileAlt,
  FaThumbsUp,
  FaGraduationCap,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import DefaultLayout from "../../../components/DefaultLayout/DefaultLayout";

const { Header, Content } = Layout;

const AdminDashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [placedCount, setPlacedCount] = useState(0);
  const [notPlacedCount, setNotPlacedCount] = useState(0);
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/v1/student/count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched student count:", response.data.count);
        setStudentCount(response.data.count);

        // Fetch the number of placed students
        const placedResponse = await axios.get(
          "http://localhost:8080/api/v1/student/placed-count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched placed count:", placedResponse.data.count);
        setPlacedCount(placedResponse.data.count);
        setNotPlacedCount(response.data.count - placedResponse.data.count);
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };

    const fetchPlacements = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/v1/placements",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched placements:", response.data);
        setPlacements(response.data);
      } catch (error) {
        console.error("Error fetching placements:", error);
      }
    };

    fetchStudentCount();
    fetchPlacements();
  }, []);

  const columnData = [
    { department: "Dept 1", category: "Category 1", value: 38 },
    { department: "Dept 1", category: "Category 2", value: 28 },
    { department: "Dept 2", category: "Category 1", value: 52 },
    { department: "Dept 2", category: "Category 2", value: 42 },
    { department: "Dept 3", category: "Category 1", value: 61 },
    { department: "Dept 3", category: "Category 2", value: 51 },
    { department: "Dept 4", category: "Category 1", value: 45 },
    { department: "Dept 4", category: "Category 2", value: 35 },
    { department: "Dept 5", category: "Category 1", value: 48 },
    { department: "Dept 5", category: "Category 2", value: 38 },
  ];

  const columnConfig = {
    data: columnData,
    isGroup: true,
    xField: "department",
    yField: "value",
    seriesField: "category",
    legend: { position: "top-left" },
  };

  const pieData = [
    { type: "Placed", value: placedCount },
    { type: "Not Placed", value: notPlacedCount },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [{ type: "element-active" }],
  };

  const placementColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Number of Students Applied",
      dataIndex: "studentsApplied",
      key: "studentsApplied",
      render: () => <span>{Math.floor(Math.random() * 50) + 10}</span>, // Dummy values
    },
  ];

  return (
    <DefaultLayout>
      <Header style={{ backgroundColor: "#fff" }}>
        <h1>Admin Stats</h1>
      </Header>
      <Content style={{ padding: "20px" }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card
              className="dashboard-card"
              style={{ backgroundColor: "#60b7e6" }}
            >
              <div className="card-content">
                <div className="card-icon">
                  <FaUserGraduate size={48} />
                </div>
                <Link to="/admin/manage-students">
                  <div className="card-details">
                    <div className="card-number">{studentCount}</div>
                    <div className="card-title">STUDENTS</div>
                  </div>
                </Link>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Link to="/admin/manage-placements">
              <Card
                className="dashboard-card"
                style={{ backgroundColor: "#2dbfab", cursor: "pointer" }}
              >
                <div className="card-content">
                  <div className="card-icon">
                    <FaRegFileAlt size={48} />
                  </div>
                  <div className="card-details">
                    <div className="card-number">38</div>
                    <div className="card-title">JOB PROFILES</div>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
          <Col span={6}>
            <Card
              className="dashboard-card"
              style={{ backgroundColor: "#f3a33c" }}
            >
              <div className="card-content">
                <div className="card-icon">
                  <FaThumbsUp size={48} />
                </div>
                <div className="card-details">
                  <div className="card-number">526</div>
                  <div className="card-title">OFFERS</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              className="dashboard-card"
              style={{ backgroundColor: "#5599e5" }}
            >
              <div className="card-content">
                <div className="card-icon">
                  <FaGraduationCap size={48} />
                </div>
                <div className="card-details">
                  <div className="card-number">490</div>
                  <div className="card-title">PLACED</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Column {...columnConfig} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <h3>Recent Placement Drives</h3>
              <Table
                columns={placementColumns}
                dataSource={placements.map((placement) => ({
                  ...placement,
                  key: placement._id,
                }))}
                pagination={false}
                bordered
                style={{ overflowX: "auto" }}
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <h3>Students Placed Status</h3>
              <Pie {...pieConfig} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <h3>Companies</h3>
              <Progress type="circle" percent={50} />
            </Card>
          </Col>
        </Row>
      </Content>
    </DefaultLayout>
  );
};

export default AdminDashboard;
