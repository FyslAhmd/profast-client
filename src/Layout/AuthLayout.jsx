import React from "react";
import { Outlet } from "react-router";
import authImage from "../assets/authImage.png";
import ProFastLogo from "../Pages/Shared/ProFastLogo/ProFastLogo";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden p-8">
      <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-[100vh] bg-[#FAFDF0] z-0" />
      <ProFastLogo className="absolute top-4 left-4 z-10" />
      <div className="flex flex-col lg:flex-row-reverse relative z-10 h-[80vh] mt-20 lg:mt-0">
        <div className="flex-1 hidden lg:flex justify-center items-start">
          <img src={authImage} className="max-w-md mt-40" alt="Auth Visual" />
        </div>
        <div className="flex-1 flex justify-center items-start mt-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
