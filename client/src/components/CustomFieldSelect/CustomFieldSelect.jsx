// CustomFieldSelect.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";

const { Option } = Select;

const CustomFieldSelect = () => {
  const [schemaKeys, setSchemaKeys] = useState([]);

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

  return (
    <Select
      mode="multiple"
      placeholder="Select criteria"
      style={{ width: "100%" }}
    >
      {schemaKeys.map((key, index) => (
        <Option key={index} value={key}>
          {key}
        </Option>
      ))}
    </Select>
  );
};

export default CustomFieldSelect;
