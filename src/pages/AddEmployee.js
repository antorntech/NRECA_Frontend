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
  Select,
  DatePicker,
} from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AddEmployee = () => {
  const navigate = useHistory();
  const [dob, setDOB] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [endDate, setEndDate] = useState("Running");
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
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("name", values.name);
    formData.append("gender", values.gender);
    formData.append("nationality", values.nationality);
    formData.append("projectName", values.projectName);
    formData.append("department", values.department);
    formData.append("joiningDate", joiningDate);
    formData.append("endDate", endDate);
    formData.append("employeeType", values.employeeType);
    formData.append("employeeStatus", values.employeeStatus);
    formData.append("designation", values.designation);
    formData.append("dob", dob);
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
      <Col xs={24} md={16} lg={16}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}>
            Add Employee Details
          </h1>
          <p>You can add employee details from here.</p>
        </div>
        <Form onFinish={handleUpload} layout="vertical">
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8} lg={8}>
              <Form.Item
                name="officeId"
                label="OfficeId"
                placeholder="Enter officeId"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item
                name="officeEmail"
                label="Office Email"
                placeholder="Enter officeEmail"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item name="name" label="Name" placeholder="Enter name">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8} lg={8}>
              <Form.Item name="phoneNumber" label="Phone Number">
                <InputNumber
                  prefix="+880"
                  type="number"
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "4px",
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item
                name="gender"
                label="Gender"
                placeholder="Enter gender"
                rules={[
                  {
                    required: true,
                    message: "Please enter gender",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select gender"
                  options={[
                    {
                      value: "male",
                      label: "Male",
                    },
                    {
                      value: "female",
                      label: "Female",
                    },
                    {
                      value: "others",
                      label: "Others",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item
                name="nationality"
                label="Nationality"
                placeholder="Enter nationality"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8} lg={8}>
              <Form.Item
                name="projectName"
                label="Project Name"
                placeholder="Enter project name"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item
                name="designation"
                label="Designation"
                placeholder="Enter designation"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item
                name="department"
                label="Department"
                placeholder="Enter department"
                rules={[
                  {
                    required: true,
                    message: "Please enter department",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select department type"
                  options={[
                    {
                      value: "sales",
                      label: "Sales",
                    },
                    {
                      value: "business",
                      label: "Business",
                    },
                    {
                      value: "software",
                      label: "Software",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8} lg={8}>
              <Form.Item name="dob" label="Date of Birth">
                <DatePicker
                  onChange={(date, dateString) => setDOB(dateString)}
                  style={{ width: "100%", height: "40px", borderRadius: "4px" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item name="joiningDate" label="Joining Date">
                <DatePicker
                  onChange={(date, dateString) => {
                    setJoiningDate(dateString);
                  }}
                  style={{ width: "100%", height: "40px", borderRadius: "4px" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item name="endDate" label="End Date">
                <DatePicker
                  onChange={(date, dateString) => {
                    setEndDate(dateString);
                  }}
                  style={{ width: "100%", height: "40px", borderRadius: "4px" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8} lg={8}>
              <Form.Item
                name="employeeType"
                label="Employee Type"
                placeholder="Enter employee type"
                rules={[
                  {
                    required: true,
                    message: "Please enter employee type",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select employee type"
                  options={[
                    {
                      value: "fulltime",
                      label: "Full Time",
                    },
                    {
                      value: "shorttime",
                      label: "Short Time",
                    },
                    {
                      value: "contractual",
                      label: "Contractual",
                    },
                    {
                      value: "consultant",
                      label: "Consultant",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item
                name="employeeStatus"
                label="Employee Status"
                placeholder="Enter employee status"
                rules={[
                  {
                    required: true,
                    message: "Please enter employee status",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select employee status"
                  options={[
                    {
                      value: "active",
                      label: "Active",
                    },
                    {
                      value: "inactive",
                      label: "Inactive",
                    },
                    {
                      value: "terminated",
                      label: "Terminated",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
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
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8} lg={8}>
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
