import React, { useState } from "react";
import { Form, Input, Upload, Button, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const AddCompanyPolicy = () => {
  const navigate = useHistory();
  const [policyDocFileList, setPolicyDocFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (values) => {
    const formData = new FormData();

    // Append user photo file to formData
    policyDocFileList.forEach((file) => {
      formData.append("policyDoc", file);
    });

    // Append documents & cv information
    formData.append("policyNumber", values.policyNumber);
    formData.append("policyName", values.policyName);
    formData.append("projectName", values.projectName);

    setUploading(true);

    // You can use any AJAX library you like
    fetch("http://localhost:5000/api/v1/companypolicy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Company Policy created successfully!") {
          // Reset form
          setPolicyDocFileList([]);
          message.success("Company Policy created successfully!");
          navigate.push("/documentscv/company-policy");
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

  const policyDocFileProps = {
    onRemove: (file) => {
      const index = policyDocFileList.indexOf(file);
      const newFileList = policyDocFileList.slice();
      newFileList.splice(index, 1);
      setPolicyDocFileList(newFileList);
    },
    beforeUpload: (file) => {
      setPolicyDocFileList([...policyDocFileList, file]);
      return false; // Prevent default upload behavior
    },
    fileList: policyDocFileList,
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
                Add Company Policy
              </h1>
              <p>You can add company policy from here.</p>
            </div>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="Policy Number"
                  name="policyNumber"
                  rules={[
                    { required: true, message: "Please input policy number!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="Policy Name"
                  name="policyName"
                  rules={[
                    {
                      required: true,
                      message: "Please input policy name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="Project Name"
                  name="projectName"
                  rules={[
                    { required: true, message: "Please input project name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item name="policyDoc" label="Upload Policy Document">
                  <Upload {...policyDocFileProps}>
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

export default AddCompanyPolicy;
