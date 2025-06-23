import React from "react";
import logo from "../../../assets/logo.png";

const ProFastLogo = () => {
  return (
    <div className="flex items-end">
      <img className="mb-2" src={logo} alt="" />
      <p className="text-3xl font-bold -ml-4">ProFast</p>
    </div>
  );
};

export default ProFastLogo;
