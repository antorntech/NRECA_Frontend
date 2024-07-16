import React, { useEffect, useState } from "react";
import { Form, Input, Select, Upload, Button, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";

const { Option } = Select;

const EditFormTemplate = () => {
  const { id } = useParams();
  const navigate = useHistory();
  const [form] = Form.useForm();
  const [formTemplateDetails, setFormTemplateDetails] = useState({});
  const [fileDocFileList, setFileDocFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/formtemplate/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch document & cv data");
        }
        return res.json();
      })
      .then((data) => {
        setFormTemplateDetails(data);
        form.setFieldsValue(data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        message.error("Failed to fetch employee data");
      });
  }, [id, form]);

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
    fetch(`http://localhost:5000/api/v1/formtemplate/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Form Template updated successfully!") {
          // Reset form
          setFileDocFileList([]);
          message.success("Form Template updated successfully!");
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

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs={24} md={16} lg={16}>
          <Form
            onFinish={handleUpload}
            layout="vertical"
            form={form}
            formTemplateDetails={formTemplateDetails}
          >
            <div style={{ marginBottom: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Edit Form & Template
              </h1>
              <p>You can edit form & template from here.</p>
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
                  <Select>
                    <Option value="File Category 1">File Category 1</Option>
                    <Option value="File Category 2">File Category 2</Option>
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
                    <Button icon={<UploadOutlined />}>Select File</Button>
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
    </>
  );
};

export default EditFormTemplate;
