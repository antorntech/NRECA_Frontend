import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Row, Col, Select } from "antd";
import { useHistory, useParams } from "react-router-dom";

const EditAccounts = () => {
  const navigate = useHistory();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { id } = useParams();
  const [accountDetails, setAccountDetails] = useState({});
  const [accountsType, setAccountsType] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/accounts/${id}`, {
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
        setAccountDetails(data);
        form.setFieldsValue(data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        message.error("Failed to fetch employee data");
      });
  }, [id, form]);

  const handleUpload = (values) => {
    console.log(values);

    // You can use any AJAX library you like
    fetch(`http://localhost:5000/api/v1/accounts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Accounts updated successfully") {
          // Reset form
          message.success("Update Successfully.");
          navigate.push("/accounts");
        } else {
          message.error("Update Failed");
        }
      })
      .catch(() => {
        message.error("Update Failed.");
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
            Edit Account
          </h1>
          <p>You can edit Account from here.</p>
        </div>
        <Form
          onFinish={handleUpload}
          layout="vertical"
          form={form}
          initialValues={accountDetails}
        >
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

export default EditAccounts;
