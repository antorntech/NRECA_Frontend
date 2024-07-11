import React, { useState } from "react";
import { Form, Button, message, Row, Col, Select, Input } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AddAccounts = () => {
  const navigate = useHistory();
  const [loading, setLoading] = useState(false);
  const [accountsType, setAccountsType] = useState("");
  const handleUpload = (values) => {
    console.log(values);

    // You can use any AJAX library you like
    fetch("http://localhost:5000/api/v1/accounts/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Accounts created successfully") {
          // Reset form
          message.success("Upload Successfully.");
          navigate.push("/accounts");
        } else if (
          data.message === "Accounts with this username already exists"
        ) {
          message.error("Accounts with this username already exists");
        } else if (data.message === "Accounts with this email already exists") {
          message.error("Accounts with this email already exists");
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

  const handleTypeChange = (value) => {
    setAccountsType(value);
    console.log(value);
  };

  return (
    <Row gutter={[24, 0]}>
      <Col xs={24} md={12} lg={12}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: "0px", fontSize: "22px", fontWeight: "bold" }}>
            Add Account
          </h1>
          <p>You can add Account from here.</p>
        </div>
        <Form onFinish={handleUpload} layout="vertical">
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="username"
                label="Username"
                placeholder="Enter accounts username"
                rules={[
                  {
                    required: true,
                    message: "Please enter accounts username",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="email"
                label="Email"
                placeholder="Enter accounts email"
                rules={[
                  {
                    required: true,
                    message: "Please enter accounts email",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="password"
                label="Password"
                placeholder="Enter accounts password"
                rules={[
                  {
                    required: true,
                    message: "Please enter accounts password",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                name="role"
                label="Account Type"
                placeholder="Enter account type"
                rules={[
                  {
                    required: true,
                    message: "Please enter account type",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select account type"
                  options={[
                    {
                      value: "admin",
                      label: "Admin",
                    },
                    {
                      value: "employee",
                      label: "Employee",
                    },
                  ]}
                  onChange={handleTypeChange}
                />
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

export default AddAccounts;
