import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Button,
  Input,
  Modal,
  Table,
  Tag,
  notification as antNotification,
} from "antd";
import {
  CheckCircleOutlined,
  DeleteFilled,
  EditFilled,
} from "@ant-design/icons";
import DefaultLayout from "../../../components/DefaultLayout/DefaultLayout";
import PlacementForm from "../../../components/PlacementForm/PlacementForm";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Column } = Table;

const ManagePlacement = () => {
  const [placements, setPlacements] = useState([]);
  const [applicationCounts, setApplicationCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [popupModal, setPopupModal] = useState(false);
  const [editPlacement, setEditPlacement] = useState(null);
  const user = useSelector((state) => state.rootReducer.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.usertype !== "tpo") {
      navigate("/student/placements");
      return;
    }
    fetchPlacements();
    fetchApplicationCounts();
  }, []);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/placements");
      setPlacements(res.data);
    } catch (error) {
      antNotification.error({
        message: "Error",
        description: "Failed to fetch placements",
      });
    }
    setLoading(false);
  };

  const fetchApplicationCounts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/placements/applications-count"
      );
      const counts = res.data.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
      setApplicationCounts(counts);
    } catch (error) {}
  };

  const handleSubmit = async (values) => {
    try {
      if (editPlacement) {
        await axios.put(
          `http://localhost:8080/api/v1/placements/${editPlacement._id}`,
          values
        );
        antNotification.success({
          message: "Success",
          description: "Placement updated successfully",
        });
      } else {
        await axios.post("http://localhost:8080/api/v1/placements", values);
        antNotification.success({
          message: "Success",
          description: "Placement added successfully",
        });
      }
      setPopupModal(false);
      setEditPlacement(null);
      fetchPlacements();
      fetchApplicationCounts(); // Refresh the counts
    } catch (error) {
      antNotification.error({
        message: "Error",
        description: "Failed to save placement",
      });
    }
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/placements/${record._id}`
      );
      antNotification.success({
        message: "Success",
        description: "Placement deleted successfully",
      });
      fetchPlacements();
      fetchApplicationCounts(); // Refresh the counts
    } catch (error) {
      antNotification.error({
        message: "Error",
        description: "Failed to delete placement",
      });
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Company",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === "active" ? "Active" : "Inactive"),
    },
    {
      title: "Applications",
      key: "applications",
      render: (text, record) => (
        <Link to={`/admin/placements/${record._id}/applicants`}>
          <Tag
            icon={<CheckCircleOutlined />}
            color="success"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "3px 5px",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
          >
            {applicationCounts[record._id] || 0} applicants
          </Tag>
        </Link>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EditFilled
            style={{
              color: "green",
              fontSize: "20px",
              marginRight: "8px",
              cursor: "pointer",
            }}
            onClick={() => {
              // Convert the date to a moment object
              setEditPlacement({
                ...record,
                date: moment(record.date),
              });
              setPopupModal(true);
            }}
          />
          <DeleteFilled
            style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h1>Placement Drives</h1>
        <Button
          type="primary"
          onClick={() => setPopupModal(true)}
          style={{ marginBottom: "16px" }}
        >
          Add Placement
        </Button>
      </div>
      <Table
        dataSource={placements}
        columns={columns}
        rowKey="_id"
        loading={loading}
        bordered
      />
      {popupModal && (
        <Modal
          title={`${editPlacement ? "Edit Placement" : "Add New Placement"}`}
          open={popupModal}
          onCancel={() => {
            setEditPlacement(null);
            setPopupModal(false);
          }}
          footer={null}
          width="60%"
        >
          <PlacementForm
            initialValues={editPlacement}
            onFinish={handleSubmit}
          />
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ManagePlacement;
