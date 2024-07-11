import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Upload,
  InputNumber,
} from "antd";
import { useHistory, useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const EditEmployeeDetails = () => {
  const navigate = useHistory();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [uploading, setUploading] = useState(false);
  const [avatarFileList, setAvatarFileList] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/employee/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch employee data");
        }
        return res.json();
      })
      .then((data) => {
        setEmployeeDetails(data.data);
        form.setFieldsValue(data.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        message.error("Failed to fetch employee data");
      });
  }, [id, form]);

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
    fetch(`http://localhost:5000/api/v1/employee/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update Employee data");
        }
        return res.json();
      })
      .then(() => {
        message.success("Employee data updated successfully.");
        navigate.push("/employee");
      })
      .catch((error) => {
        console.error(error);
        message.error("Failed to update Employee data");
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
            Edit Employee Details
          </h1>
          <p>You can edit employee details from here.</p>
        </div>
        <Form
          form={form}
          onFinish={handleUpload}
          layout="vertical"
          initialValues={employeeDetails}
        >
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
                <Input disabled />
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
                  prefix="+88"
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
                  prefix="+88"
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

export default EditEmployeeDetails;
