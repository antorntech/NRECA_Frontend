import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Row,
  Col,
  Table,
  Space,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import Column from "antd/lib/table/Column";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const { confirm } = Modal;
const { Option } = Select;

const AddFormTemplate = () => {
  const navigate = useHistory();
  const [form] = Form.useForm();
  const [formCategory, setFormCategory] = useState([]);
  const [fileDocFileList, setFileDocFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const role = JSON.parse(localStorage.getItem("account")).role;

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
    getFormCategory();
  }, []);

  const formCategoryOptions = formCategory.map((category) => (
    <Option key={category._id} value={category.formCategory}>
      {category.formCategory}
    </Option>
  ));

  const handleUpload = (values) => {
    const formData = new FormData();

    // Append user photo file to formData
    fileDocFileList.forEach((file) => {
      formData.append("fileDoc", file);
    });

    // Append documents & cv information
    formData.append("fileName", values.fileName);
    formData.append("fileCategory", values.fileCategory);

    setUploading(true);

    // You can use any AJAX library you like
    fetch("http://localhost:5000/api/v1/formtemplate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Form Template created successfully!") {
          // Reset form
          setFileDocFileList([]);
          message.success("Form Template created successfully!");
          navigate.push("/formtemplate");
        } else {
          message.error("Upload Failed");
        }
      })
      .catch(() => {
        message.error("Upload Failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const fileDocFileProps = {
    onRemove: (file) => {
      const index = fileDocFileList.indexOf(file);
      const newFileList = fileDocFileList.slice();
      newFileList.splice(index, 1);
      setFileDocFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileDocFileList([...fileDocFileList, file]);
      return false; // Prevent default upload behavior
    },
    fileList: fileDocFileList,
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/v1/formcategory/${id}`, {
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
        getFormCategory();
      })
      .catch((error) => {
        console.error("Error deleting form template:", error);
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = JSON.parse(localStorage.getItem("token"));
      setLoading(true);
      fetch("http://localhost:5000/api/v1/formcategory", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success("Form Category Added Successfully", {
            autoClose: 1000,
          });
          getFormCategory();
          setIsModalOpen(false);
          form.resetFields();
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error adding form category:", error);
          setLoading(false);
        });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs={24} md={16} lg={16}>
          <Form onFinish={handleUpload} layout="vertical">
            <div style={{ marginBottom: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Add Form & Template
              </h1>
              <p>You can add form & template from here.</p>
            </div>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="File Type"
                  name="fileCategory"
                  rules={[
                    {
                      required: true,
                      message: "Please select file type!",
                    },
                  ]}
                >
                  <Select placeholder="Select Form Category">
                    {formCategoryOptions}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="File Name"
                  name="fileName"
                  rules={[
                    { required: true, message: "Please input your file name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={8} lg={8}>
                <Form.Item name="fileDoc" label="Upload File">
                  <Upload {...fileDocFileProps}>
                    <Button
                      icon={<UploadOutlined />}
                      style={{ width: "210px" }}
                    >
                      Select File
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Button
              className="primary-btn"
              type="primary"
              htmlType="submit"
              loading={uploading}
            >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Form Category */}
      <Row gutter={[24, 0]} style={{ marginTop: "40px" }}>
        <Col xs={24} md={14} lg={14}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ marginBottom: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Form Category
              </h1>
              <p>You can delete form category from here.</p>
            </div>
            <Button type="primary" className="primary-btn" onClick={showModal}>
              <PlusOutlined style={{ marginRight: "5px" }} />
              Add Form Category
            </Button>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <Form form={form} layout="vertical">
                <div style={{ marginBottom: "20px" }}>
                  <h1
                    style={{
                      margin: "0px",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    Add Form Category
                  </h1>
                  <p>You can add form category from here.</p>
                </div>
                <Form.Item
                  label="Form Category Name"
                  name="formCategory"
                  rules={[
                    {
                      required: true,
                      message: "Please input form category name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </div>
          <Table dataSource={formCategory}>
            <Column
              title="File Category"
              dataIndex="formCategory"
              key="formCategory"
            />
            {role === "superadmin" || role === "admin" ? (
              <Column
                title="Action"
                key="action"
                width="100px"
                render={(_, record) => (
                  <Space size="middle">
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
        </Col>
      </Row>
    </>
  );
};

export default AddFormTemplate;
