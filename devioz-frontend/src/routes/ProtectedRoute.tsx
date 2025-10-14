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

  // Si no hay sesión → redirigir a inicio
  if (!token || !user) return <Navigate to="/productos" replace />;

  // Si el rol no coincide con el requerido
  if (role && user.rol !== role) return <Navigate to="/productos" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
