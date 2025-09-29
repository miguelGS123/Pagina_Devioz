import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  let user = null;

  try {
    if (userStr && userStr !== "undefined") {
      user = JSON.parse(userStr);
    }
  } catch (err) {
    console.error("Error al parsear el usuario:", err);
  }

  // ❌ Si no hay token o usuario -> redirigir al login
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Si se requiere un rol y no coincide -> acceso denegado
  if (role && user.rol !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
