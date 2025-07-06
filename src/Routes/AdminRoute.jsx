import React from "react";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useUserRole();

  if (loading || isLoading) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-ring loading-xl"></span>
        </div>
      </>
    );
  }

  if (!user || role !== "admin") {
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default AdminRoute;
