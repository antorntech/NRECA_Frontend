import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const { Option } = Select;

function calculateExperience(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate difference in years and months
  const yearsDiff = end.getFullYear() - start.getFullYear();
  const monthsDiff = end.getMonth() - start.getMonth();

  // Adjust years and months based on day difference
  if (monthsDiff < 0) {
    yearsDiff--;
    monthsDiff += 12;
  }

  // Construct the experience string
  let experienceString = "";
  if (yearsDiff > 0) {
    experienceString += `${yearsDiff} ${yearsDiff === 1 ? "year" : "years"}`;
    if (monthsDiff > 0) {
      experienceString += `, ${monthsDiff} ${
        monthsDiff === 1 ? "month" : "months"
      }`;
    }
  } else {
    experienceString = `${monthsDiff} ${monthsDiff === 1 ? "month" : "months"}`;
  }

  return experienceString;
}

const AddDocumentsCV = () => {
  const navigate = useHistory();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("Running");
  const [cvDocFileList, setCvDocFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const totalExperience = calculateExperience(startDate, endDate);

  const handleUpload = (values) => {
    const formData = new FormData();

    // Append user photo file to formData
    cvDocFileList.forEach((file) => {
      formData.append("cvDoc", file);
    });

    // Append documents & cv information
    formData.append("fullName", values.fullName);
    formData.append("field", values.field);
    formData.append("expertiseField", values.expertiseField);
    formData.append("startDate", startDate ? startDate : "YYYY-MM-DD");
    formData.append("endDate", endDate ? endDate : "Running");
    formData.append("totalExperience", totalExperience);
    formData.append("lastWorkstation", values.lastWorkstation);
    formData.append("shortNote", values.shortNote);
    formData.append("cvType", values.cvType);

    setUploading(true);

    // You can use any AJAX library you like
    fetch("http://localhost:5000/api/v1/documentscv", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Document CV created successfully!") {
          // Reset form
          setCvDocFileList([]);
          message.success("Document CV created successfully!");
          navigate.push("/documentscv");
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

  const cvDocFileProps = {
    onRemove: (file) => {
      const index = cvDocFileList.indexOf(file);
      const newFileList = cvDocFileList.slice();
      newFileList.splice(index, 1);
      setCvDocFileList(newFileList);
    },
    beforeUpload: (file) => {
      setCvDocFileList([...cvDocFileList, file]);
      return false; // Prevent default upload behavior
    },
    fileList: cvDocFileList,
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
                Add Documents & CV
              </h1>
              <p>You can add documents & CV from here.</p>
            </div>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[
                    { required: true, message: "Please input your full name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="Field"
                  name="field"
                  rules={[
                    { required: true, message: "Please select your field!" },
                  ]}
                >
                  <Select>
                    <Option value="MIS & IT">MIS & IT</Option>
                    <Option value="GIS">GIS</Option>
                    <Option value="Environment and Gender">
                      Environment and Gender
                    </Option>
                    <Option value="Economist & Finance">
                      Economist & Finance
                    </Option>
                    <Option value="Capacity Building & Training">
                      Capacity Building & Training
                    </Option>
                    <Option value="Administration & Finance">
                      Administration & Finance
                    </Option>
                    <Option value="Consultant">Consultant</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="Expertise Field"
                  name="expertiseField"
                  rules={[
                    {
                      required: true,
                      message: "Please select your expertise field!",
                    },
                  ]}
                >
                  <Select>
                    <Option value="Civil Engineering">Civil Engineering</Option>
                    <Option value="Electrical Engineering">
                      Electrical Engineering
                    </Option>
                    <Option value="Computer Engineering">
                      Computer Engineering
                    </Option>
                    <Option value="SCADA (Supervisory Control and Data Acquisition)">
                      SCADA (Supervisory Control and Data Acquisition)
                    </Option>
                    <Option value="Automation Engineering">
                      Automation Engineering
                    </Option>
                    <Option value="Design Engineering">
                      Design Engineering
                    </Option>
                    <Option value="Installation Engineering">
                      Installation Engineering
                    </Option>
                    <Option value="Testing Engineering">
                      Testing Engineering
                    </Option>
                    <Option value="Commissioning Engineering">
                      Commissioning Engineering
                    </Option>
                    <Option value="Project Management (Technical)">
                      Project Management (Technical)
                    </Option>
                    <Option value="General & Management">
                      General & Management
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item name="startDate" label="Start Date">
                  <DatePicker
                    onChange={(date, dateString) => {
                      setStartDate(dateString);
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
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="Last Workstation"
                  name="lastWorkstation"
                  rules={[
                    {
                      required: true,
                      message: "Please input your last workstation!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8} lg={8}>
                <Form.Item label="Short Note" name="shortNote">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item
                  label="CV Type"
                  name="cvType"
                  rules={[
                    {
                      required: true,
                      message: "Please select cv type!",
                    },
                  ]}
                >
                  <Select>
                    <Option value="Other Resources CV's">
                      Other Resources CV's
                    </Option>
                    <Option value="NRECA Employee CV's">
                      NRECA Employee CV's
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item name="cvDoc" label="Upload Photo">
                  <Upload {...cvDocFileProps}>
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

export default AddDocumentsCV;
