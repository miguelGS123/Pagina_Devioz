import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/productos");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-900">
        <p>Cargando datos del usuario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">
          👤 Bienvenido, {user.nombre}
        </h1>

        <div className="space-y-4">
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {user.telefono}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
        </div>

        <div className="mt-6 border-t pt-6 space-y-3">
          <button className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600">
            ✏️ Actualizar mis datos
          </button>
          <button className="w-full bg-gray-200 text-gray-900 py-2 rounded hover:bg-gray-300">
            📜 Ver historial de compras
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
