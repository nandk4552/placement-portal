import React, { useState, useEffect } from "react";
import axios from "axios";
import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import { useSelector } from "react-redux";
import {
  Badge,
  Button,
  Card,
  Row,
  Col,
  Typography,
  notification as antNotification,
  Spin,
  Tabs,
} from "antd";
import { FileDoneOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function StudentDashboard() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.rootReducer.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.usertype !== "student") {
      navigate("/admin/dashboard");
    }
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      // Fetch placements with user ID to check application status
      const res = await axios.get(
        `http://localhost:8080/api/v1/placements/${user?._id}`
      );
      setPlacements(res.data);
    } catch (error) {
      console.error("Error fetching placements:", error);
    }
    setLoading(false);
  };

  const applyForPlacement = async (placementId) => {
    const userId = user?._id;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/application/placement-applications",
        {
          userId,
          placementId,
        }
      );

      const successMessage = response.data.message || "Application Submitted";
      antNotification.success({
        message: "Success",
        description: successMessage,
      });

      // Refresh placements after successful application
      fetchPlacements();
    } catch (error) {
      console.error("Error submitting application:", error);
      let errorMessage =
        error.response?.data?.error ||
        "Failed to submit your application. Please try again later.";

      if (error.response?.status === 409) {
        errorMessage = error.response?.data?.message;
      }

      antNotification.error({
        message: "Error",
        description: errorMessage,
      });
    }
  };

  // Filter active placements
  const activePlacements = placements.filter(
    (placement) => placement.status === "active" && !placement.applied
  );

  // Filter applied placements
  const appliedPlacements = placements.filter((placement) => placement.applied);

  return (
    <DefaultLayout>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Placement Opportunities
      </Title>
      <Spin spinning={loading}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: (
                <span>
                  <UnorderedListOutlined
                    style={{
                      marginRight: "8px",
                    }}
                  />
                  Available Placements
                </span>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  {activePlacements.map((placement) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={6}
                      xl={6}
                      xxl={4}
                      key={placement._id}
                    >
                      <Badge.Ribbon
                        text={placement.title.toUpperCase()}
                        color="blue"
                      >
                        <Card
                          hoverable
                          size="small"
                          title={placement.title.toUpperCase()}
                          actions={[
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => applyForPlacement(placement._id)}
                            >
                              Apply
                            </Button>,
                          ]}
                        >
                          Description:{" "}
                          <Text
                            style={{
                              marginBottom: "10px",
                              lineHeight: "1.5",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                            }}
                          >
                            {placement.description}
                          </Text>
                          <br />
                          Date:{" "}
                          <Text
                            style={{
                              marginBottom: "10px",
                              lineHeight: "1.5",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                            }}
                          >
                            {new Date(placement.date).toLocaleDateString()}
                          </Text>
                        </Card>
                      </Badge.Ribbon>
                    </Col>
                  ))}
                </Row>
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  <FileDoneOutlined
                    style={{
                      marginRight: "8px",
                    }}
                  />
                  Applied Placements
                </span>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  {appliedPlacements.map((placement) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={6}
                      xl={6}
                      xxl={4}
                      key={placement._id}
                    >
                      <Badge.Ribbon
                        text={placement.title.toUpperCase()}
                        color="green"
                      >
                        <Card
                          hoverable
                          size="small"
                          title={placement.title.toUpperCase()}
                        >
                          Description:{" "}
                          <Text
                            style={{
                              marginBottom: "10px",
                              lineHeight: "1.5",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                            }}
                          >
                            {placement.description}
                          </Text>
                          <br />
                          Date:{" "}
                          <Text
                            style={{
                              marginBottom: "10px",
                              lineHeight: "1.5",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                            }}
                          >
                            {new Date(placement.date).toLocaleDateString()}
                          </Text>
                        </Card>
                      </Badge.Ribbon>
                    </Col>
                  ))}
                </Row>
              ),
            },
          ]}
        />
      </Spin>
    </DefaultLayout>
  );
}

export default StudentDashboard;
