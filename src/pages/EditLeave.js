import React, { useEffect, useState } from "react";
import { Form, Button, message, Row, Col, Select, Input } from "antd";
import { useHistory, useParams } from "react-router-dom";
import TextArea from "antd/lib/input/TextArea";

const EditLeave = () => {
  const navigate = useHistory();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { id } = useParams();
  const [leaveData, setLeaveData] = useState({});
  const [newDate, setNewDate] = useState("");
  const [leaveCategory, setLeaveCategory] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [status, setStatus] = useState("");
  const email = JSON.parse(localStorage.getItem("account")).email;
  const role = JSON.parse(localStorage.getItem("account")).role;

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/leave/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
        setLeaveData(data.data);
        form.setFieldsValue(data.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        message.error("Failed to fetch employee data");
      });
  }, [id, form]);

  const handleUpload = (values) => {
    console.log(values);
    setLoading(true);
    // You can use any AJAX library you like
    fetch(`http://localhost:5000/api/v1/leave/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Leave updated successfully!") {
          // Reset form
          message.success("Upload Successfully.");
          navigate.push("/leaves");
        } else {
          message.error("Upload Failed");
        }
      })
      .catch(() => {
        message.error("Upload Failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChange = (e) => {
    const dateValue = e.target.value;
    setNewDate(dateValue);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleCategoryChange = (value) => {
    setLeaveCategory(value);
  };

  const handleTypeChange = (value) => {
    setLeaveType(value);
  };
  return (
    <Row gutter={[24, 0]}>
      <Col xs={24} md={12} lg={12}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}>
            Edit Leave
          </h1>
          <p>You can edit Leave from here.</p>
        </div>
        <Form
          onFinish={handleUpload}
          layout="vertical"
          form={form}
          initialValues={leaveData}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="leaveCategory"
                label="Leave Category"
                placeholder="Enter leave category"
                rules={[
                  {
                    required: true,
                    message: "Please enter leave category",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select category"
                  options={[
                    {
                      value: "Sick Leave",
                      label: "Sick Leave (10 Days)",
                    },
                    {
                      value: "Casual Leave",
                      label: "Casual Leave (10 Days)",
                    },
                    {
                      value: "Marriage Leave",
                      label: "Marriage Leave (5 Days)",
                    },
                    {
                      value: "Paternity Leave",
                      label: "Paternity Leave (5 Days)",
                    },
                  ]}
                  onChange={handleCategoryChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="leaveType"
                label="Leave Type"
                placeholder="Enter leave type"
                rules={[
                  {
                    required: true,
                    message: "Please enter leave type",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select leave type"
                  options={[
                    {
                      value: "Pre Application",
                      label: "Pre Application",
                    },
                    {
                      value: "Post Application",
                      label: "Post Application",
                    },
                  ]}
                  onChange={handleTypeChange}
                />
              </Form.Item>
            </Col>
          </Row>
          {role === "superadmin" ? (
            <Row gutter={[24, 0]}>
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  name="status"
                  label="Leave Status"
                  placeholder="Enter leave status"
                  rules={[
                    {
                      required: true,
                      message: "Please enter leave status",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    style={{
                      width: "100%",
                    }}
                    placeholder="Please leave status"
                    options={[
                      {
                        value: "pending",
                        label: "Pending",
                      },
                      {
                        value: "approved_by_superadmin",
                        label: "Approved",
                      },
                    ]}
                    onChange={handleStatusChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : role === "admin" ? (
            <Row gutter={[24, 0]}>
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  name="status"
                  label="Leave Status"
                  placeholder="Enter leave status"
                  rules={[
                    {
                      required: true,
                      message: "Please enter leave status",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    style={{
                      width: "100%",
                    }}
                    placeholder="Please leave status"
                    options={[
                      {
                        value: "pending",
                        label: "Pending",
                      },
                      {
                        value: "approved_by_admin",
                        label: "Approved",
                      },
                    ]}
                    onChange={handleStatusChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : null}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={24} lg={24}>
              <Form.Item
                name="date"
                label="Date"
                placeholder="Enter leave date"
              >
                <Input onChange={onChange} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={24} lg={24}>
              <Form.Item
                name="reason"
                label="Reason"
                placeholder="Enter reason"
              >
                <TextArea rows={6} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={24} lg={24}>
              <Form.Item
                name="remark"
                label="Remark"
                placeholder="Enter remark"
              >
                <TextArea rows={6} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label=" ">
            <Button className="primary-btn" type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default EditLeave;
