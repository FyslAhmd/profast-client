import React from "react";
import useAuth from "../Hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-ring loading-xl"></span>
        </div>
      </>
    );

  if (!user) {
    return <Navigate to="/login" state={location.pathname} />;
  }
  return children;
};

export default PrivateRoute;
