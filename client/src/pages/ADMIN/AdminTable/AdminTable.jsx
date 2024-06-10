import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Form, Input, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import DefaultLayout from "../../../components/DefaultLayout/DefaultLayout";

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/admin/get-all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAdmins(data.admins.map((admin) => ({ ...admin, key: admin._id })));
    } catch (error) {
      message.error("Failed to fetch admins");
      console.error(error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingAdmin(null);
    form.resetFields();
  };

  const handleFinish = async (values) => {
    try {
      if (editingAdmin) {
        // Update existing admin
        const { data } = await axios.put(
          `${import.meta.env.VITE_SERVER}/api/v1/admin/update/${
            editingAdmin._id
          }`,
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAdmins((prev) =>
          prev.map((admin) =>
            admin.key === editingAdmin.key ? { ...admin, ...data.admin } : admin
          )
        );
        message.success("Admin updated successfully");
      } else {
        // Add new admin
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/v1/admin/create`,
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAdmins((prev) => [...prev, { ...data.admin, key: data.admin._id }]);
        message.success("Admin added successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save admin");
      console.error(error);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    form.setFieldsValue(admin);
    showModal();
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER}/api/v1/admin/delete/${key}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAdmins((prev) => prev.filter((admin) => admin.key !== key));
      message.success("Admin deleted successfully");
    } catch (error) {
      message.error("Failed to delete admin");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Profile",
      dataIndex: "profile",
      key: "profile",
      render: (text) => (
        <img src={text} alt="Profile" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="w-100">
        <h1 className="header-title">Manage Admins</h1>
      </div>
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingAdmin(null);
            form.resetFields();
            showModal();
          }}
        >
          Add Admin
        </Button>
      </div>
      <Table columns={columns} dataSource={admins} />
      <Modal
        title={editingAdmin ? "Edit Admin" : "Add Admin"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={editingAdmin}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="branch"
            label="Branch"
            rules={[{ required: true, message: "Please input the branch!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="profile" label="Profile URL">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAdmin ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default AdminTable;
