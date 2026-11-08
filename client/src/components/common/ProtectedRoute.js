// client/src/components/common/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

/**
 * ProtectedRoute - Wraps routes that require authentication
 * Redirects to /login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;