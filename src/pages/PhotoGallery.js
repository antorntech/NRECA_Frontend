import React from "react";
import underMantenanceImg from "../assets/images/demo.png";

const PhotoGallery = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={underMantenanceImg} alt="demo.png" style={{ width: "40%" }} />
    </div>
  );
};

export default PhotoGallery;
