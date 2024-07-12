import React, { useState } from "react";
import { Form, Button, message, Row, Col, Select, DatePicker } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import TextArea from "antd/lib/input/TextArea";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

const AddLeave = () => {
  const navigate = useHistory();
  const [loading, setLoading] = useState(false);
  const [leaveCategory, setLeaveCategory] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [date, setDate] = useState("");
  const email = JSON.parse(localStorage.getItem("account")).email;

  const handleUpload = (values) => {
    const formData = new FormData();

    // Append other form data
    formData.append("email", email);
    formData.append("leaveType", leaveType);
    formData.append("leaveCategory", leaveCategory);
    formData.append("date", date);
    formData.append("reason", values.reason);
    formData.append("remark", values.remark);
    console.log(formData);
    // You can use any AJAX library you like
    fetch("http://localhost:5000/api/v1/leave/addLeaves", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Leave added successfully!") {
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

  // Assuming onChange function
  const onChange = (dates, dateStrings) => {
    // Handle your date change logic here
    setDate(dateStrings);
  };

  const handleCategoryChange = (value) => {
    setLeaveCategory(value);
    console.log(value);
  };
  const handleTypeChange = (value) => {
    setLeaveType(value);
    console.log(value);
  };

  //   const defaultValue = moment();

  return (
    <Row gutter={[24, 0]}>
      <Col xs={24} md={12} lg={12}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}>
            Add Leave
          </h1>
          <p>You can add Leave from here.</p>
        </div>
        <Form onFinish={handleUpload} layout="vertical">
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="category"
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
                name="type"
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
          <Row gutter={[24, 0]}>
            <Col xs={24} md={24} lg={24}>
              <Form.Item
                name="date"
                label="Date"
                placeholder="Enter leave date"
              >
                <RangePicker format={dateFormat} onChange={onChange} />
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

export default AddLeave;
