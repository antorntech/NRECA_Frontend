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
import { useHistory } from "react-router-dom";

const AddEmployee = () => {
  const navigate = useHistory();
  const [dob, setDOB] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [endDate, setEndDate] = useState("Running");
  const [avatarFileList, setAvatarFileList] = useState([]);
  const [nidFileList, setNIDFileList] = useState([]);
  const [passportFileList, setPassportFileList] = useState([]);
  const [tinFileList, setTINFileList] = useState([]);
  const [signatureFileList, setSignatureFileList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [uploading, setUploading] = useState(false);

  const handleUpload = (values) => {
    const formData = new FormData();

    // Append user photo file to formData
    avatarFileList.forEach((file) => {
      formData.append("avatar", file);
    });

    // Append office information
    formData.append("officeId", values.officeId);
    formData.append("officeEmail", values.officeEmail);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("name", values.name);
    formData.append("gender", values.gender);
    formData.append("nationality", values.nationality);
    formData.append("projectName", values.projectName);
    formData.append("department", values.department);
    formData.append("joiningDate", joiningDate ? joiningDate : "YYYY-MM-DD");
    formData.append("endDate", endDate ? endDate : "Running");
    formData.append("dob", dob ? dob : "YYYY-MM-DD");
    formData.append(
      "employeeType",
      values.employeeType ? values.employeeType : "Full Time"
    );
    formData.append(
      "employeeStatus",
      values.employeeStatus ? values.employeeStatus : "Active"
    );
    formData.append("designation", values.designation);

    // Append NID photo file to formData
    nidFileList.forEach((file) => {
      formData.append("nidDoc", file);
    });

    // Append passport photo file to formData
    passportFileList.forEach((file) => {
      formData.append("passportDoc", file);
    });

    // Append TIN photo file to formData
    tinFileList.forEach((file) => {
      formData.append("tinDoc", file);
    });

    // Append signature photo file to formData
    signatureFileList.forEach((file) => {
      formData.append("signatureDoc", file);
    });

    // Append other form data
    formData.append("personalPhoneNumber", values.personalPhoneNumber);
    formData.append("emergencyNumber", values.emergencyNumber);
    formData.append("relationShipNumber", values.relationShipNumber);
    formData.append("personalEmail", values.personalEmail);
    formData.append("presentAddress", values.presentAddress);
    formData.append("permanentAddress", values.permanentAddress);
    formData.append("nid", values.nid);
    formData.append("passport", values.passport);
    formData.append("tin", values.tin);

    // Append bank information
    formData.append("bankName", values.bankName);
    formData.append("bankBranch", values.bankBranch);
    formData.append("accountNumber", values.accountNumber);
    formData.append("routingNumber", values.routingNumber);
    formData.append("accountTitle", values.accountTitle);
    formData.append("accountEmail", values.accountEmail);

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

  const nidFileProps = {
    onRemove: (file) => {
      const index = nidFileList.indexOf(file);
      const newFileList = nidFileList.slice();
      newFileList.splice(index, 1);
      setNIDFileList(newFileList);
    },
    beforeUpload: (file) => {
      setNIDFileList([...nidFileList, file]);
      return false; // Prevent default upload behavior
    },
    fileList: nidFileList,
  };

  const passportFileProps = {
    onRemove: (file) => {
      const index = passportFileList.indexOf(file);
      const newFileList = passportFileList.slice();
      newFileList.splice(index, 1);
      setPassportFileList(newFileList);
    },
    beforeUpload: (file) => {
      setPassportFileList([...passportFileList, file]);
      return false; // Prevent default upload behavior
    },
    fileList: passportFileList,
  };

  const tinFileProps = {
    onRemove: (file) => {
      const index = tinFileList.indexOf(file);
      const newFileList = tinFileList.slice();
      newFileList.splice(index, 1);
      setTINFileList(newFileList);
    },
    beforeUpload: (file) => {
      setTINFileList([...tinFileList, file]);
      return false; // Prevent default upload behavior
    },
    fileList: tinFileList,
  };

  const signatureFileProps = {
    onRemove: (file) => {
      const index = signatureFileList.indexOf(file);
      const newFileList = signatureFileList.slice();
      newFileList.splice(index, 1);
      setSignatureFileList(newFileList);
    },
    beforeUpload: (file) => {
      setSignatureFileList([...signatureFileList, file]);
      return false; // Prevent default upload behavior
    },
    fileList: signatureFileList,
  };

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs={24} md={16} lg={16}>
          <Form onFinish={handleUpload} layout="vertical">
            {/* Add Office Information */}
            <div style={{ marginBottom: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Add Office Information
              </h1>
              <p>You can add office information from here.</p>
            </div>
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
                      padding: "4px",
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
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "4px",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item name="joiningDate" label="Joining Date">
                  <DatePicker
                    onChange={(date, dateString) => {
                      setJoiningDate(dateString);
                    }}
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "4px",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item name="endDate" label="End Date">
                  <DatePicker
                    onChange={(date, dateString) => {
                      setEndDate(dateString);
                    }}
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "4px",
                    }}
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
                <Form.Item name="avatar" label="Upload Employee Photo">
                  <Upload {...avatarFileProps}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            {/* Add Personal Information */}
            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Add Personal Information
              </h1>
              <p>You can add personal information from here.</p>
            </div>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="personalPhoneNumber"
                  label="Personal Phone Number"
                >
                  <InputNumber
                    prefix="+880"
                    type="number"
                    style={{
                      width: "100%",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="emergencyNumber"
                  label="Emergency Phone Number"
                >
                  <InputNumber
                    prefix="+880"
                    type="number"
                    style={{
                      width: "100%",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="relationShipNumber"
                  label="Relationship of Emergency Contact"
                >
                  <InputNumber
                    prefix="+880"
                    type="number"
                    style={{
                      width: "100%",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item name="nid" label="NID" placeholder="Enter nid">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="passport"
                  label="Passport No"
                  placeholder="Enter passport"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item name="tin" label="TIN" placeholder="Enter tin">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="personalEmail"
                  label="Personal Email"
                  placeholder="Enter personal email"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="presentAddress"
                  label="Present Address"
                  placeholder="Enter present address"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="permanentAddress"
                  label="Permanent Address"
                  placeholder="Enter permanent address"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={6} lg={6}>
                <Form.Item name="nidDoc" label="Upload NID">
                  <Upload {...nidFileProps}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col xs={24} md={6} lg={6}>
                <Form.Item name="passportDoc" label="Upload Passport">
                  <Upload {...passportFileProps}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col xs={24} md={6} lg={6}>
                <Form.Item name="tinDoc" label="Upload TIN Certificate">
                  <Upload {...tinFileProps}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col xs={24} md={6} lg={6}>
                <Form.Item name="signatureDoc" label="Upload Signature">
                  <Upload {...signatureFileProps}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            {/* Add Bank Information */}
            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Add Bank Information
              </h1>
              <p>You can add bank information from here.</p>
            </div>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="accountTitle"
                  label="Account Title"
                  placeholder="Enter account title"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="accountEmail"
                  label="Account Email"
                  placeholder="Enter account email"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="bankName"
                  label="Bank Name"
                  placeholder="Enter bank name"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  name="bankBranch"
                  label="Branch Name"
                  placeholder="Enter bank branch"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item name="accountNumber" label="Account Number">
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={8} lg={8}>
                <Form.Item name="routingNumber" label="Routing Number">
                  <Input />
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

export default AddEmployee;
