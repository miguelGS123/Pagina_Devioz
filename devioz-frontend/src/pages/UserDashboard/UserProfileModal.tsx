import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface Props {
  user: {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
  };
  setUser: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
}

const UserProfileModal: React.FC<Props> = ({ user, setUser, onClose }) => {
  const [nombre, setNombre] = useState(user.nombre);
  const [telefono, setTelefono] = useState(user.telefono || "");
  const [password, setPassword] = useState("*****");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      // ✅ CAMBIO: URL DE PRODUCCIÓN (https://api.devioz.com)
      await axios.put(
        `https://api.devioz.com/api/usuarios/${user.id}`,
        {
          nombre,
          telefono,
          ...(password !== "*****" ? { password } : {}),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Datos actualizados correctamente");
      setUser((prev: any) => ({
        ...prev,
        nombre,
        telefono,
      }));
      onClose();
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      alert("Hubo un error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ ¿Seguro que deseas eliminar tu cuenta?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // ✅ CAMBIO: URL DE PRODUCCIÓN (https://api.devioz.com)
      await axios.delete(`https://api.devioz.com/api/usuarios/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Cuenta eliminada correctamente");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/productos";
    } catch (error) {
      console.error("❌ Error al eliminar cuenta:", error);
      alert("No se pudo eliminar la cuenta.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-lg w-96 text-gray-900 border border-gray-300 shadow-2xl relative"
      >
        <h2 className="text-2xl font-bold mb-4 text-teal-600 flex items-center gap-2">
          ⚙️ Perfil del Usuario
        </h2>

        <label className="block mb-2 text-gray-700">Nombre completo</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded mb-3 focus:ring-2 focus:ring-teal-500"
        />

        <label className="block mb-2 text-gray-700">Correo electrónico</label>
        <input
          type="email"
          value={user.email}
          readOnly
          disabled
          className="w-full border border-gray-300 bg-gray-100 text-gray-500 px-3 py-2 rounded mb-3 cursor-not-allowed"
        />

        <label className="block mb-2 text-gray-700">Teléfono</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded mb-3 focus:ring-2 focus:ring-teal-500"
        />

        <label className="block mb-2 text-gray-700">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded mb-3 focus:ring-2 focus:ring-teal-500"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-500 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Actualizar"}
          </button>

          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>
      </motion.div>
    </div>
  );
};

export default UserProfileModal;