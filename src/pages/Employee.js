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

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading state

  const getEmployee = async () => {
    setLoading(true); // Set loading state to true
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      fetch("http://localhost:5000/api/v1/employee", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setEmployees(data); // Update employee state with fetched data
          setLoading(false); // Set loading state to false after data is fetched
        });
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading state to false if there's an error
    }
  };

  useEffect(() => {
    getEmployee();
  }, []);

  // Delete hero content item
  const handleDelete = (id) => {
    setLoading(true); // Set loading state to true
    fetch(`http://localhost:5000/api/v1/employee/delete/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Free Resource Deleted Successfully", {
          autoClose: 1000,
        });
        getEmployee(); // Fetch updated list after successful deletion
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
      {employees && employees.length > 0 ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Employee Table
              </h1>
              <p>
                Employee are{" "}
                {employees.length > 0 ? "available." : "not available."}
              </p>
            </div>
            <div>
              <div style={{ marginRight: "10px" }}>
                <Button type="primary" className="primary-btn">
                  <Link to="/add_employee">
                    <PlusOutlined style={{ marginRight: "5px" }} />
                    Add Employee
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "10px", overflowX: "auto" }}>
            <Table dataSource={employees}>
              <Column
                title="Avatar"
                dataIndex="avatar"
                key="avatar"
                render={(_, record) => (
                  <img
                    src={`http://localhost:5000${record.avatar}`}
                    style={{ width: "50px", height: "50px" }}
                  />
                )}
              />
              <Column title="Office ID" dataIndex="officeId" key="officeId" />
              <Column
                title="First Name"
                dataIndex="firstName"
                key="firstName"
              />
              <Column title="Last Name" dataIndex="lastName" key="lastName" />
              <Column
                title="Designation"
                dataIndex="designation"
                key="designation"
              />
              <Column
                title="Office Email"
                dataIndex="officeEmail"
                key="officeEmail"
              />
              <Column
                title="Action"
                key="action"
                width="100px"
                render={(_, record) => (
                  <Space size="middle">
                    <Link to={`/edit_employee/${record._id}`}>
                      <Button type="primary">
                        <EditOutlined />
                      </Button>
                    </Link>
                    <Link to={`/view_employee/${record._id}`}>
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
                    <Button
                      type="danger"
                      onClick={() => showConfirm(record._id)}
                    >
                      <DeleteOutlined />
                    </Button>
                  </Space>
                )}
              />
            </Table>
          </div>
        </div>
      ) : (
        <div style={{ height: "80%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div>
              <h1>Employee Table</h1>
              <p>Employee not available.</p>
            </div>
            <div>
              <div style={{ marginRight: "10px" }}>
                <Button type="primary" className="primary-btn">
                  <Link to="/add_employee">
                    <PlusOutlined style={{ marginRight: "5px" }} />
                    Add Employee
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="loader_position">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};

export default Employee;
