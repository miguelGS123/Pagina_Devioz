import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [ventas, setVentas] = useState<any[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // 🔹 Traer info del backend para tener datos actualizados
      axios
        .get(`http://localhost:8080/api/usuarios/${parsedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Error al obtener usuario:", err));

      // 🔹 Traer historial de compras
      axios
        .get("http://localhost:8080/api/ventas/mis-ventas", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setVentas(res.data))
        .catch((err) => console.error("Error al obtener ventas:", err));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/productos");
  };

  const handleActualizarDatos = () => {
    // Aquí podrías abrir un modal o redirigir a un formulario para actualizar datos
    navigate("/user/actualizar"); 
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
        <h1 className="text-2xl font-bold mb-6">👤 Bienvenido, {user.nombre}</h1>

        <div className="space-y-4">
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {user.telefono || "No registrado"}</p>
          <p>
            <strong>Rol:</strong> {user.rol}
          </p>
        </div>

        <div className="mt-6 border-t pt-6 space-y-3">
          <button
            onClick={handleActualizarDatos}
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
          >
            ✏️ Actualizar mis datos
          </button>

          <div>
            <h2 className="font-semibold mb-2">📜 Historial de compras:</h2>
            {ventas.length === 0 ? (
              <p>No tienes compras aún.</p>
            ) : (
              <ul className="list-disc pl-5">
                {ventas.map((venta) => (
                  <li key={venta.id}>
                    Producto: {venta.producto.nombre} | Cantidad: {venta.cantidad} | Fecha: {new Date(venta.fecha).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>

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
