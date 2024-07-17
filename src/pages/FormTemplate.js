import { Button, Modal, Card, Col, Row } from "antd";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  CloudDownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/shared/loader/Loader";
import refreshIcon from "../assets/images/refresh.png";
import checkMarkIcon from "../assets/images/check_mark.png";

const { confirm } = Modal;

const FormTemplate = () => {
  const [formCategory, setFormCategory] = useState([]);
  const [formTemplate, setFormTemplate] = useState([]);
  const [loading, setLoading] = useState(false);

  const role = JSON.parse(localStorage.getItem("account")).role;

  const getFormTemplate = async () => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/formtemplate",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setFormTemplate(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching form templates:", error);
      setLoading(false);
    }
  };

  const getFormCategory = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/formcategory",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setFormCategory(data);
    } catch (error) {
      console.error("Error fetching form categories:", error);
    }
  };

  useEffect(() => {
    getFormTemplate();
    getFormCategory();
  }, []);

  const handleDelete = (id) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/v1/formtemplate/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Form Template Deleted Successfully", {
          autoClose: 1000,
        });
        getFormTemplate();
      })
      .catch((error) => {
        console.error("Error deleting form template:", error);
        setLoading(false);
      });
  };

  const showConfirm = (id) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleOutlined />,
      content: "After clicking delete, your item will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // Group form templates by fileCategory
  const groupedFormTemplates = formTemplate.reduce((acc, template) => {
    if (!acc[template.fileCategory]) {
      acc[template.fileCategory] = [];
    }
    acc[template.fileCategory].push({
      _id: template._id, // Include _id in the grouped structure
      fileName: template.fileName,
      fileDoc: template.fileDoc,
    });
    return acc;
  }, {});

  const matchedFormCategories = formCategory.filter((category) =>
    Object.keys(groupedFormTemplates).includes(category.formCategory)
  );

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
            <h1 style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}>
              Form Template
            </h1>
            <p>
              Form Templates are{" "}
              {formTemplate.length > 0 ? "available." : "not available."}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button
              onClick={() => getFormTemplate()}
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
              <>
                <Button type="primary" className="primary-btn">
                  <Link to="/add_formtemplate">
                    <PlusOutlined style={{ marginRight: "5px" }} />
                    Add Form Template
                  </Link>
                </Button>
              </>
            ) : null}
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : matchedFormCategories.length > 0 ? (
          <>
            <Row gutter={16}>
              {matchedFormCategories.map((category) => (
                <Col span={8} key={category.formCategory}>
                  <Card
                    title={category.formCategory}
                    bordered={false}
                    style={{ marginBottom: "20px" }}
                  >
                    {groupedFormTemplates[category.formCategory].map(
                      (file, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          <div style={{ display: "flex", gap: "5px" }}>
                            <img src={checkMarkIcon} alt="checkMarkIcon.png" />
                            <p
                              style={{
                                margin: "0px",
                                fontWeight: "bold",
                                color: "#138551",
                                fontSize: "16px",
                              }}
                            >
                              {file.fileName}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: "10px" }}>
                            {file?.fileDoc ? (
                              <Button
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  border: "1px solid skyblue",
                                }}
                                href={`http://localhost:5000${file.fileDoc}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <CloudDownloadOutlined
                                  style={{ fontSize: "17px", color: "skyblue" }}
                                />
                              </Button>
                            ) : (
                              <Button
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  border: "1px solid skyblue",
                                }}
                                disabled
                              >
                                <FilePdfOutlined
                                  style={{ fontSize: "17px", color: "skyblue" }}
                                />
                              </Button>
                            )}

                            {role === "superadmin" || role === "admin" ? (
                              <>
                                <Link
                                  to={`/edit_formtemplate/${file._id}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Button
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      color: "orange",
                                      border: "1px solid orange",
                                      boxShadow: "0 2px 0 rgb(0 0 0 / 5%)",
                                    }}
                                  >
                                    <EditOutlined />
                                  </Button>
                                </Link>
                                <Button
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#f5222d",
                                    border: "1px solid #f5222d",
                                    boxShadow: "0 2px 0 rgb(0 0 0 / 5%)",
                                  }}
                                  type="link"
                                  onClick={() => showConfirm(file._id)}
                                >
                                  <DeleteOutlined />
                                </Button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      )
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default FormTemplate;
