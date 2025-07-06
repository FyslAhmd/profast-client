import React from "react";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import LoadingPage from "../Pages/Shared/LoadingPage";
import { Navigate } from "react-router";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useUserRole();

  if (loading || isLoading) {
    return <LoadingPage />;
  }

  if (!user || role !== "rider") {
    return <Navigate to="/forbidden" />;
  }
  return children;
};

export default RiderRoute;
