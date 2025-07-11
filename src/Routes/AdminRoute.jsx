import React from "react";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import { Navigate } from "react-router";
import LoadingPage from "../Pages/Shared/LoadingPage";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useUserRole();

  if (loading || isLoading) {
    return <LoadingPage />;
  }

  if (!user || role !== "admin") {
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default AdminRoute;
