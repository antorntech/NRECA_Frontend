import { Space, Table, Button, Modal, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/shared/loader/Loader";
import Highlighter from "react-highlight-words";
import refreshIcon from "../assets/images/refresh.png";

const { confirm } = Modal;
const { Column } = Table;

const Leave = () => {
  const [leaves, setLeave] = useState([]);
  const email = JSON.parse(localStorage.getItem("account")).email;
  const role = JSON.parse(localStorage.getItem("account")).role;

  // Function to filter leaves by email
  const filterLeavesByEmail = (leaves, email) => {
    return leaves.filter((leave) => leave.email === email);
  };

  // Example: Filter leaves for email
  const filteredLeaves = filterLeavesByEmail(leaves, email);

  const leaveForAdmin = leaves.filter((leave) => leave.role === "employee");

  // formateDate.map((item) => console.log(item));
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

  // search field
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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
            {role === "superadmin" ? null : (
              <Button type="primary" className="primary-btn">
                <Link to="/add_leave">
                  <PlusOutlined style={{ marginRight: "5px" }} />
                  Add Leave
                </Link>
              </Button>
            )}
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : leaves.length > 0 && role === "superadmin" ? (
          <Table dataSource={leaves}>
            <Column
              title="Email"
              dataIndex="email"
              key="email"
              {...getColumnSearchProps("email")}
            />
            <Column
              title="Category"
              dataIndex="leaveCategory"
              key="leaveCategory"
            />
            <Column title="Type" dataIndex="leaveType" key="leaveType" />
            <Column
              title="Status"
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
                  <Link to={`/edit_leave/${record._id}`}>
                    <Button type="primary">
                      <EditOutlined />
                    </Button>
                  </Link>
                  <Button type="danger" onClick={() => showConfirm(record._id)}>
                    <DeleteOutlined />
                  </Button>
                </Space>
              )}
            />
          </Table>
        ) : leaves.length > 0 && role === "admin" ? (
          <Table dataSource={leaveForAdmin}>
            <Column
              title="Email"
              dataIndex="email"
              key="email"
              {...getColumnSearchProps("email")}
            />
            <Column
              title="Category"
              dataIndex="leaveCategory"
              key="leaveCategory"
            />
            <Column title="Type" dataIndex="leaveType" key="leaveType" />
            <Column
              title="Status"
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
                  <Link to={`/edit_leave/${record._id}`}>
                    <Button type="primary">
                      <EditOutlined />
                    </Button>
                  </Link>
                  <Button type="danger" onClick={() => showConfirm(record._id)}>
                    <DeleteOutlined />
                  </Button>
                </Space>
              )}
            />
          </Table>
        ) : leaves.length > 0 ? (
          <Table dataSource={filteredLeaves}>
            <Column
              title="Email"
              dataIndex="email"
              key="email"
              {...getColumnSearchProps("email")}
            />
            <Column
              title="Category"
              dataIndex="leaveCategory"
              key="leaveCategory"
            />
            <Column title="Type" dataIndex="leaveType" key="leaveType" />
            <Column
              title="Status"
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
                  <Link to={`/edit_leave/${record._id}`}>
                    <Button type="primary">
                      <EditOutlined />
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
