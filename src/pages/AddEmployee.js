import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AddEmployee = () => {
  const navigate = useHistory();
  const [avatarFileList, setAvatarFileList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [uploading, setUploading] = useState(false);

  const handleUpload = (values) => {
    const formData = new FormData();

    // Append user photo file to formData
    avatarFileList.forEach((file) => {
      formData.append("avatar", file);
    });

    // Append other form data
    formData.append("officeId", values.officeId);
    formData.append("officeEmail", values.officeEmail);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("designation", values.designation);
    formData.append("primaryMobNumber", values.primaryMobNumber);
    formData.append("secondaryMobNumber", values.secondaryMobNumber);
    setUploading(true);
    // You can use any AJAX library you like
    fetch("http://localhost:5000/api/v1/employee/addEmployee", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Employee created successfully!") {
          // Reset form
          setAvatarFileList([]);
          message.success("Upload Successfully.");
          navigate.push("/employee");
        } else if (data.message === "Invalid email address") {
          message.error("Invalid Email Address");
        } else if (data.message === "Office Id already exists") {
          message.error("Office Id Already Exists");
        } else if (data.message === "Email already exists") {
          message.error("Email Already Exists");
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

  const avatarFileProps = {
    onRemove: (file) => {
      const index = avatarFileList.indexOf(file);
      const newFileList = avatarFileList.slice();
      newFileList.splice(index, 1);
      setAvatarFileList(newFileList);
    },
    beforeUpload: (file) => {
      setAvatarFileList([...avatarFileList, file]);
      return false; // Prevent default upload behavior
    },
    fileList: avatarFileList,
  };

  return (
    <Row gutter={[24, 0]}>
      <Col xs={24} md={12} lg={12}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}>
            Add Employee Details
          </h1>
          <p>You can add employee details from here.</p>
        </div>
        <Form onFinish={handleUpload} layout="vertical">
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="officeId"
                label="OfficeId"
                placeholder="Enter officeId"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="officeEmail"
                label="Office Email"
                placeholder="Enter officeEmail"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                placeholder="Enter firstName"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                placeholder="Enter lastName"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={24} lg={24}>
              <Form.Item
                name="designation"
                label="Designation"
                placeholder="Enter designation"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item name="primaryMobNumber" label="Primary Mobile Number">
                <InputNumber
                  prefix="+880"
                  type="number"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="secondaryMobNumber"
                label="Secondary Mobile Number"
              >
                <InputNumber
                  prefix="+880"
                  type="number"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="avatar"
                label="Upload Employee Photo"
                rules={[
                  {
                    required: true,
                    message: "Please upload employee photo",
                  },
                ]}
              >
                <Upload {...avatarFileProps}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12}>
              <Form.Item label=" ">
                <Button
                  className="primary-btn"
                  type="primary"
                  htmlType="submit"
                  loading={uploading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default AddEmployee;
