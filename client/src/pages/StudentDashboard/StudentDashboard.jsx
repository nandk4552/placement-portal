import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
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
} from "antd";

const { Title, Text } = Typography;

const socket = io("http://localhost:8080"); // Ensure URL matches server

function StudentDashboard() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.rootReducer.user);
  console.log(user);
  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/placements");
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

      // Assuming your backend sends back a message in the response
      const successMessage = response.data.message || "Application Submitted";
      antNotification.success({
        message: "Success",
        description: successMessage,
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      let errorMessage =
        error.response?.data?.error ||
        "Failed to submit your application. Please try again later.";

      // Check if the error message is "Application already exists"
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
    (placement) => placement.status === "active"
  );

  return (
    <DefaultLayout>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Available Placements
      </Title>
      <Spin spinning={loading}>
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
              <Badge.Ribbon text={placement.title.toUpperCase()} color="blue">
                <Card
                  hoverable
                  size="small"
                  title={placement.title.toUpperCase()}
                  actions={[
                    <Button
                      type="primary"
                      size="small" // Set button size to small
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
      </Spin>
    </DefaultLayout>
  );
}

export default StudentDashboard;
