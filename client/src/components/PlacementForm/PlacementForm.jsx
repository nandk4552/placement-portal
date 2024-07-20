import React from "react";
import { Form, Input, DatePicker, Button, Select } from "antd";
import moment from "moment";

const PlacementForm = ({ initialValues, onFinish }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      // Convert date to moment object if it exists
      form.setFieldsValue({
        ...initialValues,
        date: initialValues.date ? moment(initialValues.date) : null,
      });
    }
  }, [initialValues, form]);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: "Please input the title!" }]}
      >
        <Input placeholder="Title" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please input the description!" }]}
      >
        <Input.TextArea rows={4} placeholder="Description" />
      </Form.Item>
      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: "Please select the date!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: "Please select the status!" }]}
      >
        <Select>
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="inactive">Inactive</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? "Update Placement" : "Add Placement"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PlacementForm;
