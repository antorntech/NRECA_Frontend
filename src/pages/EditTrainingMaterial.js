import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Button, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";

const EditTrainingMaterial = () => {
  const navigate = useHistory();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [trainingMaterialDetails, setTrainingMaterialDetails] = useState({});
  const [trainingDocFileList, setTrainingDocFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/trainingmaterials/${id}`, {
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
        setTrainingMaterialDetails(data);
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
    trainingDocFileList.forEach((file) => {
      formData.append("trainingDoc", file);
    });

    // Append documents & cv information
    formData.append("trainingDocName", values.trainingDocName);
    formData.append("projectName", values.projectName);

    setUploading(true);

    // You can use any AJAX library you like
    fetch(`http://localhost:5000/api/v1/trainingmaterials/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Training Material updated successfully!") {
          // Reset form
          setTrainingDocFileList([]);
          message.success("Training Material updated successfully!");
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
          <Form
            onFinish={handleUpload}
            layout="vertical"
            form={form}
            initialValues={trainingMaterialDetails}
          >
            <div style={{ marginBottom: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Edit Training Material
              </h1>
              <p>You can edit training material from here.</p>
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

export default EditTrainingMaterial;
