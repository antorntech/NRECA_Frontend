import React from "react";
import underMantenanceImg from "../assets/images/demo.png";

const NoticeBoard = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "50px",
      }}
    >
      <h1
        style={{
          margin: "0px",
          fontSize: "32px",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        Notice Board
      </h1>
      <img src={underMantenanceImg} alt="demo.png" style={{ width: "40%" }} />
    </div>
  );
};

export default NoticeBoard;
