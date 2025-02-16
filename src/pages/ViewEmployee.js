import { SwapRightOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState({});

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
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, [id]);
  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <h1>{employeeDetails.name}</h1>
        <p>Employee Profile</p>
        <div className="underline"></div>
      </div>
      <div className="profile-body">
        <div>
          <img
            src={`http://localhost:5000${employeeDetails.avatar}`}
            alt="profile"
          />
        </div>
        <div style={{ display: "flex", gap: "30px" }}>
          <div>
            <p>
              <strong>Office Id:</strong>
              <p>
                <SwapRightOutlined style={{ marginRight: "5px" }} />
                {employeeDetails.officeId}
              </p>
            </p>
            <p>
              <strong>Name:</strong>
              <p>
                <SwapRightOutlined style={{ marginRight: "5px" }} />
                {employeeDetails.name}
              </p>
            </p>

            <p>
              <strong>Office Email:</strong>
              <p>
                <SwapRightOutlined style={{ marginRight: "5px" }} />
                {employeeDetails.officeEmail}
              </p>
            </p>

            <p>
              <strong>Designation:</strong>
              <p>
                <SwapRightOutlined style={{ marginRight: "5px" }} />
                {employeeDetails.designation}
              </p>
            </p>
          </div>

          <div>
            <p>
              <strong>Department:</strong>
              <p style={{ textTransform: "capitalize" }}>
                <SwapRightOutlined style={{ marginRight: "5px" }} />
                {employeeDetails.department}
              </p>
            </p>

            <p>
              <strong>Employee Type:</strong>
              <p style={{ textTransform: "capitalize" }}>
                <SwapRightOutlined style={{ marginRight: "5px" }} />
                {employeeDetails.employeeType}
              </p>
            </p>

            <p>
              <strong>Employee Status:</strong>
              <p style={{ textTransform: "capitalize" }}>
                <SwapRightOutlined style={{ marginRight: "5px" }} />
                {employeeDetails.employeeStatus}
              </p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
