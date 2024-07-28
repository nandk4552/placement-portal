import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axios from "axios";

const { Option } = Select;

const PlacementForm = ({ initialValues, onFinish }) => {
  const [form] = Form.useForm();
  const [schemaKeys, setSchemaKeys] = useState([]);
  const [criteriaTypes, setCriteriaTypes] = useState({});

  useEffect(() => {
    if (initialValues) {
      // Convert date to moment object if it exists
      form.setFieldsValue({
        ...initialValues,
        date: initialValues.date ? moment(initialValues.date) : null,
      });
    }
  }, [initialValues, form]);

  useEffect(() => {
    const fetchSchemaKeys = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/admin/schema-keys`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSchemaKeys(response.data);
      } catch (error) {
        console.error("Error fetching schema keys:", error);
      }
    };

    fetchSchemaKeys();
  }, []);

  const handleKeyChange = (key, name) => {
    const selectedKey = schemaKeys.find((item) => item.key === key);
    const updatedCriteriaTypes = { ...criteriaTypes, [name]: selectedKey.type };
    setCriteriaTypes(updatedCriteriaTypes);
  };

  const renderInputByType = (type, restField, name) => {
    switch (type) {
      case "String":
        return (
          <Input
            {...restField}
            name={[name, "value"]}
            placeholder="Criteria Value"
          />
        );
      case "Number":
        return (
          <Input
            type="number"
            {...restField}
            name={[name, "value"]}
            placeholder="Criteria Value"
          />
        );
      case "Date":
        return (
          <DatePicker
            {...restField}
            name={[name, "value"]}
            style={{ width: "100%" }}
          />
        );
      default:
        return (
          <Input
            {...restField}
            name={[name, "value"]}
            placeholder="Criteria Value"
          />
        );
    }
  };

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
      <Form.Item label="Eligibility Criteria" name="customCriteria">
        <Form.List name="eligibilityCriteria">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "key"]}
                    rules={[{ required: true, message: "Missing key" }]}
                  >
                    <Select
                      placeholder="Select a criteria key"
                      style={{ width: "100%" }}
                      onChange={(value) => handleKeyChange(value, name)}
                    >
                      {schemaKeys.map(({ key, type }) => (
                        <Option key={key} value={key}>
                          {key}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "operator"]}
                    rules={[{ required: true, message: "Missing operator" }]}
                  >
                    <Select placeholder="Operator" style={{ width: 100 }}>
                      <Option value="eq">=</Option>
                      <Option value="gt">{">"}</Option>
                      <Option value="lt">{"<"}</Option>
                      <Option value="gte">{"≥"}</Option>
                      <Option value="lte">{"≤"}</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[{ required: true, message: "Missing value" }]}
                  >
                    {renderInputByType(criteriaTypes[name], restField, name)}
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Criteria
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
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
