import { Space, Table, Button, Modal, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/shared/loader/Loader";
import Highlighter from "react-highlight-words";
import refreshIcon from "../assets/images/refresh.png";

const { confirm } = Modal;
const { Column } = Table;

const CompanyPolicy = () => {
  const [companypolicy, setCompanyPolicy] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading state
  const role = JSON.parse(localStorage.getItem("account")).role;

  const getCompanyPolicy = async () => {
    setLoading(true); // Set loading state to true
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      fetch("http://localhost:5000/api/v1/companypolicy", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCompanyPolicy(data); // Update employee state with fetched data
          setLoading(false); // Set loading state to false after data is fetched
        });
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading state to false if there's an error
    }
  };

  useEffect(() => {
    getCompanyPolicy();
  }, []);

  // Delete hero content item
  const handleDelete = (id) => {
    setLoading(true); // Set loading state to true
    fetch(`http://localhost:5000/api/v1/companypolicy/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Company Policy Deleted Successfully", {
          autoClose: 1000,
        });
        getCompanyPolicy(); // Fetch updated list after successful deletion
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
            <h1>Company Policy Table</h1>
            <p>
              Company Policy are{" "}
              {companypolicy.length > 0 ? "available." : "not available."}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button
              onClick={() => getCompanyPolicy()}
              className="primary-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={refreshIcon} alt="refresh.png" />
            </Button>
            {role === "superadmin" || role === "admin" ? (
              <Button type="primary" className="primary-btn">
                <Link to="/add_companypolicy">
                  <PlusOutlined style={{ marginRight: "5px" }} />
                  Add Company Policy
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : companypolicy.length > 0 ? (
          <Table dataSource={companypolicy}>
            <Column
              title="Policy Number"
              dataIndex="policyNumber"
              key="policyNumber"
              {...getColumnSearchProps("policyNumber")}
            />
            <Column
              title="Policy Name"
              dataIndex="policyName"
              key="policyName"
              {...getColumnSearchProps("policyName")}
            />
            <Column
              title="Project Name"
              dataIndex="projectName"
              key="projectName"
              {...getColumnSearchProps("projectName")}
            />
            <Column
              width={"100px"}
              title="Document"
              dataIndex="policyDoc"
              key="policyDoc"
              render={(_, record) => (
                <Space
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {record?.policyDoc ? (
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        border: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "50px",
                      }}
                      href={`http://localhost:5000${record?.policyDoc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CloudDownloadOutlined
                        style={{ fontSize: "22px", color: "#1890ff" }}
                      />
                    </Button>
                  ) : (
                    "No Document"
                  )}
                </Space>
              )}
            />
            {role === "superadmin" || role === "admin" ? (
              <Column
                title="Action"
                key="action"
                width="100px"
                render={(_, record) => (
                  <Space size="middle">
                    <Link to={`/edit_companypolicy/${record._id}`}>
                      <Button type="primary">
                        <EditOutlined />
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
            ) : null}
          </Table>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default CompanyPolicy;
