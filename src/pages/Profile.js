// import { SwapRightOutlined } from "@ant-design/icons";
// import React, { useEffect, useState } from "react";

// const Profile = () => {
//   const email = JSON.parse(localStorage.getItem("account")).email;
//   const [profileDetails, setProfileDetails] = useState({});

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/v1/employee/profile/${email}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Failed to fetch employee data");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setProfileDetails(data.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching employee data:", error);
//       });
//   }, [email]);
//   return (
//     <div className="profile-wrapper">
//       <div className="profile-header">
//         <h1>{profileDetails.name}</h1>
//         <p>Employee Profile</p>
//         <div className="underline"></div>
//       </div>
//       <div className="profile-body">
//         {/* <div>
//           <img
//             src={`http://localhost:5000${profileDetails.avatar}`}
//             alt="profile"
//           />
//         </div> */}
//         <div>
//           <h1 style={{ fontSize: "25px", fontWeight: "bold" }}>
//             Official Details
//           </h1>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 1fr 1fr",
//               gap: "30px",
//             }}
//           >
//             <p>
//               <strong>Office Id:</strong> <span>{profileDetails.officeId}</span>
//             </p>
//             <p>
//               <strong>Name:</strong> <span>{profileDetails.name}</span>
//             </p>
//             <p>
//               <strong>Designation:</strong>{" "}
//               <span>{profileDetails.designation}</span>
//             </p>
//             <p>
//               <strong>Email:</strong> <span>{profileDetails.officeEmail}</span>
//             </p>
//           </div>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 1fr 1fr",
//               gap: "30px",
//             }}
//           >
//             <p>
//               <strong>Phone:</strong> <span>0{profileDetails.phoneNumber}</span>
//             </p>
//             <p>
//               <strong>Gender:</strong> <span>{profileDetails.gender}</span>
//             </p>
//             <p>
//               <strong>Nationality:</strong>
//               <span>{profileDetails.nationality}</span>
//             </p>
//             <p>
//               <strong>Project Name:</strong>{" "}
//               <span>{profileDetails.projectName}</span>
//             </p>
//           </div>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 1fr 1fr",
//               gap: "30px",
//             }}
//           >
//             <p>
//               <strong>Department:</strong>{" "}
//               <span>{profileDetails.department}</span>
//             </p>
//             <p>
//               <strong>Date of Birth:</strong> <span>{profileDetails.dob}</span>
//             </p>
//             <p>
//               <strong>Joining Date:</strong>{" "}
//               <span>{profileDetails.joiningDate}</span>
//             </p>
//             <p>
//               <strong>End Date:</strong> <span>{profileDetails.endDate}</span>
//             </p>
//           </div>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 1fr 1fr",
//               gap: "30px",
//             }}
//           >
//             {" "}
//             <p>
//               <strong>Employee Type:</strong>{" "}
//               <span>{profileDetails.employeeType}</span>
//             </p>
//             <p>
//               <strong>Employee Status:</strong>{" "}
//               <span>{profileDetails.employeeStatus}</span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

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
} from "antd";
import { useHistory, useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const Profile = () => {
  const navigate = useHistory();
  const email = JSON.parse(localStorage.getItem("account")).email;
  const [form] = Form.useForm();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [uploading, setUploading] = useState(false);
  const [dob, setDOB] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [avatarFileList, setAvatarFileList] = useState([]);
  const [nidFileList, setNIDFileList] = useState([]);
  const [passportFileList, setPassportFileList] = useState([]);
  const [tinFileList, setTINFileList] = useState([]);
  const [signatureFileList, setSignatureFileList] = useState([]);
  console.log(employeeDetails);
  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/employee/profile/${email}`, {
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
  }, [email, form]);

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
    formData.append(
      "joiningDate",
      joiningDate ? joiningDate : employeeDetails?.joiningDate
    );
    formData.append("endDate", endDate ? endDate : employeeDetails?.endDate);
    formData.append("dob", dob ? dob : employeeDetails?.dob);
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
    fetch(`http://localhost:5000/api/v1/employee/${employeeDetails._id}`, {
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
      {/* Edit Office Information */}
      <Row gutter={[24, 0]}>
        <Col xs={24} md={16} lg={16}>
          <Form
            onFinish={handleUpload}
            layout="vertical"
            form={form}
            initialValues={employeeDetails}
          >
            {/* Office Information */}
            <div style={{ marginBottom: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Office Information
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

            {/* Personal Information */}
            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Personal Information
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
            {/* Bank Information */}
            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Bank Information
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

export default Profile;
