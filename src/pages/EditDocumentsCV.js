import React, { useEffect, useState } from "react";
import { Form, Input, Select, Upload, Button, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";

const { Option } = Select;

function calculateExperience(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate difference in years and months
  const yearsDiff = end.getFullYear() - start.getFullYear();
  const monthsDiff = end.getMonth() - start.getMonth();

  // Adjust years and months based on day difference
  if (monthsDiff < 0) {
    if (yearsDiff) {
      yearsDiff--;
      monthsDiff += 12;
    } else {
      monthsDiff += 12;
    }
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

const EditDocumentsCV = () => {
  const { id } = useParams();
  const navigate = useHistory();
  const [form] = Form.useForm();
  const [documentscvDetails, setDocumentsCVDetails] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cvDocFileList, setCvDocFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  console.log(documentscvDetails.startDate, documentscvDetails.endDate);

  const totalExperience = calculateExperience(
    startDate ? startDate : documentscvDetails?.startDate,
    endDate ? endDate : documentscvDetails?.endDate
  );

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/documentscv/${id}`, {
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
        setDocumentsCVDetails(data);
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
    cvDocFileList.forEach((file) => {
      formData.append("cvDoc", file);
    });

    // Append documents & cv information
    formData.append("fullName", values.fullName);
    formData.append("field", values.field);
    formData.append("expertiseField", values.expertiseField);
    formData.append(
      "startDate",
      startDate ? startDate : documentscvDetails?.startDate
    );
    formData.append("endDate", endDate ? endDate : documentscvDetails?.endDate);
    formData.append(
      "totalExperience",
      totalExperience ? totalExperience : documentscvDetails?.totalExperience
    );
    formData.append("lastWorkstation", values.lastWorkstation);
    formData.append("shortNote", values.shortNote);
    formData.append("cvType", values.cvType);

    setUploading(true);

    // You can use any AJAX library you like
    fetch(`http://localhost:5000/api/v1/documentscv/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Document CV updated successfully!") {
          // Reset form
          setCvDocFileList([]);
          message.success("Document CV updated successfully!");
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
          <Form
            onFinish={handleUpload}
            layout="vertical"
            form={form}
            initialValues={documentscvDetails}
          >
            <div style={{ marginBottom: "20px" }}>
              <h1
                style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}
              >
                Edit Documents & CV
              </h1>
              <p>You can edit documents & CV from here.</p>
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
                  <Input onChange={(e) => setStartDate(e.target.value)} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Form.Item name="endDate" label="End Date">
                  <Input onChange={(e) => setEndDate(e.target.value)} />
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
                <Form.Item name="cvDoc" label="Upload Document & CV File">
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

export default EditDocumentsCV;
