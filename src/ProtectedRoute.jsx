import React from "react";
import { useActiveAccount } from "thirdweb/react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const account = useActiveAccount();

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;