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
  Select,
  DatePicker,
} from "antd";
import { useHistory, useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const EditEmployeeDetails = () => {
  const navigate = useHistory();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [uploading, setUploading] = useState(false);
  const [dob, setDOB] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [endDate, setEndDate] = useState("Running");
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
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("name", values.name);
    formData.append("gender", values.gender);
    formData.append("nationality", values.nationality);
    formData.append("projectName", values.projectName);
    formData.append("department", values.department);
    formData.append(
      "joiningDate",
      joiningDate ? joiningDate : employeeDetails.joiningDate
    );
    formData.append("endDate", endDate ? endDate : employeeDetails.endDate);
    formData.append("dob", dob ? dob : employeeDetails.dob);
    formData.append("employeeType", values.employeeType);
    formData.append("employeeStatus", values.employeeStatus);
    formData.append("designation", values.designation);
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
          onFinish={handleUpload}
          layout="vertical"
          form={form}
          initialValues={employeeDetails}
        >
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
                <Input onChange={(e) => setDOB(e.target.value)} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item name="joiningDate" label="Joining Date">
                <Input onChange={(e) => setJoiningDate(e.target.value)} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item name="endDate" label="End Date">
                <Input onChange={(e) => setEndDate(e.target.value)} />
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

export default EditEmployeeDetails;
