import { Space, Table, Button, Modal, Form, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeFilled,
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

const DocumentsCV = () => {
  const [documentscv, setDocumentsCV] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading state

  const getDocumentsCV = async () => {
    setLoading(true); // Set loading state to true
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      fetch("http://localhost:5000/api/v1/documentscv", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setDocumentsCV(data); // Update employee state with fetched data
          setLoading(false); // Set loading state to false after data is fetched
        });
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading state to false if there's an error
    }
  };

  useEffect(() => {
    getDocumentsCV();
  }, []);

  // Delete hero content item
  const handleDelete = (id) => {
    setLoading(true); // Set loading state to true
    fetch(`http://localhost:5000/api/v1/documentscv/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Document & CV Deleted Successfully", {
          autoClose: 1000,
        });
        getDocumentsCV(); // Fetch updated list after successful deletion
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
            <h1>Documents & CV's Table</h1>
            <p>
              Documents & CV's are{" "}
              {documentscv.length > 0 ? "available." : "not available."}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button
              onClick={() => getDocumentsCV()}
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
              <Link to="/add_documentscv">
                <PlusOutlined style={{ marginRight: "5px" }} />
                Add Documents & CV
              </Link>
            </Button>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : documentscv.length > 0 ? (
          <Table dataSource={documentscv}>
            <Column
              title="Full Name"
              dataIndex="fullName"
              key="fullName"
              {...getColumnSearchProps("fullName")}
            />
            <Column
              title="Field"
              dataIndex="field"
              key="field"
              {...getColumnSearchProps("field")}
            />
            <Column
              title="Expertise Field"
              dataIndex="expertiseField"
              key="expertiseField"
              {...getColumnSearchProps("expertiseField")}
            />
            <Column
              title="CV Type"
              dataIndex="cvType"
              key="cvType"
              {...getColumnSearchProps("cvType")}
            />
            <Column
              title="Total Experience"
              dataIndex="totalExperience"
              key="totalExperience"
              {...getColumnSearchProps("totalExperience")}
            />
            <Column
              width={"100px"}
              title="Document/CV"
              dataIndex="cvDoc"
              key="cvDoc"
              render={(_, record) => (
                <Space
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {record?.cvDoc ? (
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
                      href={`http://localhost:5000${record?.cvDoc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CloudDownloadOutlined
                        style={{ fontSize: "22px", color: "#1890ff" }}
                      />
                    </Button>
                  ) : (
                    "No Document/CV"
                  )}
                </Space>
              )}
            />
            <Column
              title="Action"
              key="action"
              width="100px"
              render={(_, record) => (
                <Space size="middle">
                  <Link to={`/edit_documentscv/${record._id}`}>
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

export default DocumentsCV;
