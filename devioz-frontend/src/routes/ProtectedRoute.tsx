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
    // ✅ Solo parseamos si existe y no es "undefined" o vacío
    if (userStr && userStr !== "undefined") {
      user = JSON.parse(userStr);
    }
  } catch (err) {
    console.error("Error al parsear el usuario:", err);
  }

  // 🔒 Si no hay token o no hay usuario -> redirige al login
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // 🔒 Si hay rol definido y no coincide -> acceso denegado
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si pasa todo, renderiza el componente protegido
  return <>{children}</>;
};

export default ProtectedRoute;
