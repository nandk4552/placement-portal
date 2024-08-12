import { DeleteFilled, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { FaEdit } from "react-icons/fa";
import { MdPersonAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx"; // Importing xlsx for Excel export
import DefaultLayout from "../../../components/DefaultLayout/DefaultLayout";
import StudentForm from "../../../components/StudentForm/StudentForm";
import "./StudentsPage.css";
import { useNavigate } from "react-router-dom";

const confirm = Modal.confirm;
const { Column } = Table;

const StudentsPage = () => {
  const loading = useSelector((state) => state.rootReducer.loading);
  const dispatch = useDispatch();
  const [studentsData, setStudentsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const searchInput = useRef(null);

  const getAllStudents = async () => {
    try {
      dispatch({
        type: "rootReducer/showLoading",
      });
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/student/get-all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch({
        type: "rootReducer/hideLoading",
      });
      setStudentsData(data?.students);
      setFilteredData(data?.students); // Initialize filteredData
    } catch (error) {
      dispatch({
        type: "rootReducer/hideLoading",
      });
      console.log(error);
    }
  };
  const user = useSelector((state) => state.rootReducer.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.usertype !== "tpo") {
      navigate("/student/placements");
      return;
    }
    getAllStudents();
  }, []);

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchText ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleSubmit = async (value) => {
    if (editStudent === null) {
      try {
        dispatch({
          type: "rootReducer/showLoading",
        });
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/v1/student/create`,
          value,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        message.success(data?.message);
        setPopupModal(false);
        getAllStudents();
        dispatch({
          type: "rootReducer/hideLoading",
        });
      } catch (error) {
        dispatch({
          type: "rootReducer/hideLoading",
        });
        message.error("Something went wrong!");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "rootReducer/showLoading",
        });
        const { data } = await axios.put(
          `${import.meta.env.VITE_SERVER}/api/v1/student/update/${
            editStudent._id
          }`,
          value,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        message.success(data?.message);
        setPopupModal(false);
        getAllStudents();
        dispatch({
          type: "rootReducer/hideLoading",
        });
      } catch (error) {
        dispatch({
          type: "rootReducer/hideLoading",
        });
        message.error("Something went wrong!");
        console.log(error);
      }
    }
  };

  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "rootReducer/showLoading",
      });
      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER}/api/v1/student/delete/${record._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success(data?.message);
      getAllStudents();
      dispatch({
        type: "rootReducer/hideLoading",
      });
    } catch (error) {
      dispatch({
        type: "rootReducer/hideLoading",
      });
      message.error("Something went wrong!");
      console.log(error);
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
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      ...getColumnSearchProps("mobileNumber"),
    },
    {
      title: "Roll Number",
      dataIndex: "rollNumber",
      key: "rollNumber",
      ...getColumnSearchProps("rollNumber"),
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      ...getColumnSearchProps("branch"),
    },
    {
      title: "Interested In",
      dataIndex: "interestedIn",
      key: "interestedIn",
      ...getColumnSearchProps("interestedIn"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="d-flex align-items-center justify-content-center">
          {/* <FaEdit
            style={{
              cursor: "pointer",
              color: "green",
              fontSize: "20px",
              marginRight: "0.5rem",
            }}
            onClick={() => {
              setEditStudent(record);
              setPopupModal(true);
            }}
          /> */}
          <DeleteFilled
            style={{
              cursor: "pointer",
              color: "red",
              fontSize: "20px",
            }}
            onClick={() => {
              showDeleteConfirm(record);
            }}
          />
        </div>
      ),
    },
  ];

  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure delete this student?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(record);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "StudentsData.xlsx");
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between align-items-center">
        <div className="w-100">
          <h1 className="header-title">Manage Students</h1>
        </div>
        <div style={{ marginRight: 8, marginBottom: 8 }}>
          <Button type="primary" onClick={exportToExcel}>
            Export to Excel
          </Button>
        </div>
      </div>
      <Table
        size="small"
        dataSource={studentsData}
        columns={columns}
        rowKey="_id"
        bordered
        loading={loading}
        onChange={handleTableChange}
      />
    </DefaultLayout>
  );
};

export default StudentsPage;
