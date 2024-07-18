import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import DefaultLayout from "../../../components/DefaultLayout/DefaultLayout";
import {
  Button,
  Input,
  DatePicker,
  List,
  Card,
  notification as antNotification,
  Typography,
  Spin,
  Row,
  Col,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

const { Title } = Typography;

const socket = io("http://localhost:8080"); // Ensure the URL matches your server address

function Placement() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchPlacements();
  }, [page]);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/placements?page=${page}`
      );
      setPlacements((prevPlacements) => [...prevPlacements, ...res.data]);
      if (res.data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      antNotification.error({
        message: "Error",
        description: "Failed to fetch placements",
      });
    }
    setLoading(false);
  };

  const addPlacement = async () => {
    if (!title || !description || !date) {
      antNotification.warning({
        message: "Validation Error",
        description: "All fields are required",
      });
      return;
    }

    const newPlacement = { title, description, date };
    try {
      await axios.post("http://localhost:8080/api/v1/placements", newPlacement);
      antNotification.success({
        message: "Success",
        description: "Placement added successfully",
      });
      setPage(1);
      setPlacements([]);
      setHasMore(true);
      fetchPlacements();
      setTitle("");
      setDescription("");
      setDate("");
    } catch (error) {
      antNotification.error({
        message: "Error",
        description: "Failed to add placement",
      });
    }
  };

  const loadMoreData = () => {
    if (loading) return;
    setPage(page + 1);
  };

  return (
    <DefaultLayout>
      <Row gutter={16}>
        <Col span={12}>
          <Title level={2}>Placement Drives</Title>
          <Card title="Add New Placement">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            <DatePicker
              style={{ width: "100%", marginBottom: "10px" }}
              onChange={(date, dateString) => setDate(dateString)}
            />
            <Button type="primary" onClick={addPlacement} block>
              Add Placement
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <InfiniteScroll
            dataLength={placements.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={<Spin />}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={placements}
              renderItem={(placement) => (
                <List.Item>
                  <List.Item.Meta
                    title={placement.title}
                    description={`${placement.description} - ${new Date(
                      placement.date
                    ).toDateString()}`}
                  />
                </List.Item>
              )}
              style={{ marginTop: "20px" }}
            />
          </InfiniteScroll>
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default Placement;
