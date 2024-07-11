import { Space, Table, Button, Modal, Form, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeFilled,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/shared/loader/Loader";

const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log("search:", value);
};

const { confirm } = Modal;
const { Column } = Table;

const Leave = () => {
  const [leaves, setLeave] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading state

  const getLeave = async () => {
    setLoading(true); // Set loading state to true
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      fetch("http://localhost:5000/api/v1/leave", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setLeave(data); // Update leave state with fetched data
          setLoading(false); // Set loading state to false after data is fetched
        });
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading state to false if there's an error
    }
  };

  useEffect(() => {
    getLeave();
  }, []);

  // Delete hero content item
  const handleDelete = (id) => {
    setLoading(true); // Set loading state to true
    fetch(`http://localhost:5000/api/v1/leave/delete/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Leave Request Deleted Successfully", {
          autoClose: 1000,
        });
        getLeave(); // Fetch updated list after successful deletion
      })
      .catch((error) => {
        console.error("Error deleting hero content:", error);
        setLoading(false); // Set loading state to false if there's an error
      });
  };

  // Confirm delete modal
  const showConfirm = (id) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleOutlined />,
      content:
        "After click on delete then your item will be delete permanently.",
      okText: "Delete",
      okType: "danger",
      onOk() {
        handleDelete(id); // Call handleDelete function on OK
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  let dateProperty = "2024/07/11,2024/07/13";

  // Split the string by comma
  let dates = dateProperty.split(",");

  // Convert dates to JavaScript Date objects
  let date1 = new Date(dates[0]);
  let date2 = new Date(dates[1]);

  // Calculate the difference in days
  let difference = Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)) + 1; // Adding 1 to include both start and end dates

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1>Leave</h1>
            <p>
              Leaves are {leaves.length > 0 ? "available." : "not available."}
            </p>
          </div>
          <div>
            <Button type="primary" className="primary-btn">
              <Link to="/add_leave">
                <PlusOutlined style={{ marginRight: "5px" }} />
                Add Leave
              </Link>
            </Button>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : leaves.length > 0 ? (
          <Table dataSource={leaves}>
            <Column title="User Id" dataIndex="userId" key="userId" />
            <Column
              title="Category"
              dataIndex="leaveCategory"
              key="leaveCategory"
            />
            <Column title="Type" dataIndex="leaveType" key="leaveType" />
            <Column title="Status" dataIndex="status" key="status" />
            <Column
              title="Days"
              render={(_, record) => <Space>{difference}</Space>}
            />
            <Column
              title="Action"
              key="action"
              width="100px"
              render={(_, record) => (
                <Space size="middle">
                  <Link to={`/edit_leave/${record._id}`}>
                    <Button type="primary">
                      <EditOutlined />
                    </Button>
                  </Link>
                  <Link to={`/view_leave/${record._id}`}>
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "orange",
                        border: "1px solid orange",
                      }}
                    >
                      <EyeFilled />
                    </Button>
                  </Link>
                  <Button type="danger" onClick={() => showConfirm(record._id)}>
                    <DeleteOutlined />
                  </Button>
                </Space>
              )}
            />
          </Table>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default Leave;
