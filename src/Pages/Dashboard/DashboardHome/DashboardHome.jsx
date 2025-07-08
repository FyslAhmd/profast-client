import React from "react";
import useUserRole from "../../../Hooks/useUserRole";
import LoadingPage from "../../Shared/LoadingPage";
import UserDashboard from "./UserDashboard";
import RiderDashboard from "./RiderDashboard";
import AdminDashboard from "./AdminDashboard";
import Forbidden from "../../Shared/Forbidden/Forbidden";

const DashboardHome = () => {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }

  if (role === "user") {
    return <UserDashboard></UserDashboard>;
  } else if (role === "rider") {
    return <RiderDashboard></RiderDashboard>;
  } else if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else {
    return <Forbidden></Forbidden>;
  }
};

export default DashboardHome;
