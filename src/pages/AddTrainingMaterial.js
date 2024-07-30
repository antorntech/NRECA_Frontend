import React, { useState } from "react";
import { Form, Input, Upload, Button, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const AddTrainingMaterial = () => {
  const navigate = useHistory();
  const [trainingDocFileList, setTrainingDocFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (values) => {
    const formData = new FormData();

    // Append user photo file to formData
    trainingDocFileList.forEach((file) => {
      formData.append("trainingDoc", file);
    });

    // Append documents & cv information
    formData.append("trainingDocName", values.trainingDocName);
    formData.append("projectName", values.projectName);

    setUploading(true);

    // You can use any AJAX library you like
    fetch("http://localhost:5000/api/v1/trainingmaterials", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Training Material created successfully!") {
          // Reset form
          setTrainingDocFileList([]);
          message.success("Training Material created successfully!");
          navigate.push("/documentscv/training-materials");
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

  const trainingDocFileProps = {
    onRemove: (file) => {
      const index = trainingDocFileList.indexOf(file);
      const newFileList = trainingDocFileList.slice();
      newFileList.splice(index, 1);
      setTrainingDocFileList(newFileList);
    },
    beforeUpload: (file) => {
      setTrainingDocFileList([...trainingDocFileList, file]);
      return false; // Prevent default upload behavior
    },
    fileList: trainingDocFileList,
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
                Add Training Material
              </h1>
              <p>You can add training material from here.</p>
            </div>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="Training Document Name"
                  name="trainingDocName"
                  rules={[
                    {
                      required: true,
                      message: "Please input training document name!",
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
                <Form.Item
                  name="trainingDoc"
                  label="Upload Training Material Document"
                >
                  <Upload {...trainingDocFileProps}>
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

export default AddTrainingMaterial;
