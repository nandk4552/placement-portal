import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Modal,
  Table,
  notification as antNotification,
} from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import DefaultLayout from "../../../components/DefaultLayout/DefaultLayout";
import PlacementForm from "../../../components/PlacementForm/PlacementForm";
import moment from "moment";

const { Column } = Table;

const PlacementPage = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupModal, setPopupModal] = useState(false);
  const [editPlacement, setEditPlacement] = useState(null);

  useEffect(() => {
    fetchPlacements();
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
      title: "Title",
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

export default PlacementPage;
