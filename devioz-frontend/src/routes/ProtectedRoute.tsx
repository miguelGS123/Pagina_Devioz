import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;

  if (!token || !user) return <Navigate to="/" replace />;

  if (role && user.rol !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
