import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";

const ProFastLogo = () => {
  return (
    <Link to="/">
      <div className="flex items-end">
        <img className="mb-2" src={logo} alt="" />
        <p className="text-3xl font-bold -ml-4">ProFast</p>
      </div>
    </Link>
  );
};

export default ProFastLogo;
