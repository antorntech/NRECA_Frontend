import React, { useState } from "react";
import { Form, Input, Select, Upload, Button, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const { Option } = Select;

const AddFormTemplate = () => {
  const navigate = useHistory();
  const [fileDocFileList, setFileDocFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

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

export default AddFormTemplate;
