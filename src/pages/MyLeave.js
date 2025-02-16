import { Space, Table, Button, Modal, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/shared/loader/Loader";
import refreshIcon from "../assets/images/refresh.png";

const { confirm } = Modal;
const { Column } = Table;

const MyLeave = () => {
  const [leaves, setLeave] = useState([]);
  const email = JSON.parse(localStorage.getItem("account")).email;

  // formateDate.map((item) => console.log(item));
  const [loading, setLoading] = useState(false); // State to manage loading state

  const getLeave = async () => {
    setLoading(true); // Set loading state to true
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      fetch(`http://localhost:5000/api/v1/leave/myLeaves/${email}`, {
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button
              onClick={() => getLeave()}
              className="primary-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={refreshIcon} alt="refresh.png" />
            </Button>
            <Button type="primary" className="primary-btn">
              <Link to="/add_my_leave">
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
            <Column
              title="Email"
              width={"250px"}
              dataIndex="email"
              key="email"
            />
            <Column
              title="Category"
              width={"170px"}
              dataIndex="leaveCategory"
              key="leaveCategory"
            />
            <Column
              title="Type"
              width={"150px"}
              dataIndex="leaveType"
              key="leaveType"
            />
            <Column
              title="Reason"
              key="reason"
              render={(_, record) => (
                <Tooltip title={record?.reason}>
                  <span>{record?.reason.slice(0, 40)}...</span>
                </Tooltip>
              )}
            />
            <Column
              title="Status"
              width={"250px"}
              render={(_, record) => (
                <Space>
                  <span
                    style={{
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      color:
                        record.status === "approved_by_superadmin"
                          ? "green"
                          : record.status === "approved_by_admin"
                          ? "orange"
                          : "skyblue",
                    }}
                  >
                    {record.status === "approved_by_superadmin"
                      ? "Approved By Super Admin"
                      : record.status === "approved_by_admin"
                      ? "Approved By Admin"
                      : "Pending"}
                  </span>
                </Space>
              )}
            />
            <Column
              title="Days"
              width={"80px"}
              render={(_, record) => (
                <Space>
                  <span>{record.days}</span>
                </Space>
              )}
            />
            <Column
              title="Action"
              key="action"
              width="100px"
              render={(_, record) => (
                <Space size="middle">
                  {record.status === "approved_by_superadmin" ||
                  record.status === "approved_by_admin" ? (
                    <Link to={`/edit_leave/${record._id}`}>
                      <Button type="primary" disabled>
                        <EditOutlined />
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/edit_my_leave/${record._id}`}>
                      <Button type="primary">
                        <EditOutlined />
                      </Button>
                    </Link>
                  )}
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

export default MyLeave;
