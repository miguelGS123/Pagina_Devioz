import React from "react";
import { motion } from "framer-motion";

// Importamos las interfaces que necesitamos
import { Venta } from "./UserDashboard";

interface Props {
  ventas: Venta[];
  onClose: () => void;
}

const UserHistoryModal: React.FC<Props> = ({ ventas, onClose }) => {
  return (
    // --- 1. COPIADO EXACTO DE UserProfileModal ---
    // Este es el fondo oscuro (backdrop)
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <motion.div
        // --- 2. COPIADO EXACTO DE UserProfileModal ---
        // Animación de aparición
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        // Evita que el clic dentro cierre el modal
        onClick={(e) => e.stopPropagation()}
        // --- 3. ESTILOS COMBINADOS ---
        // Es la caja blanca, pero con el ancho de tu tabla (max-w-4xl)
        className="bg-white p-6 rounded-lg w-full max-w-4xl text-gray-900 border border-gray-300 shadow-2xl relative"
      >
        {/* --- 4. COPIADO EXACTO DE UserProfileModal --- */}
        {/* Botón de cerrar "X" */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        {/* --- 5. TU CONTENIDO DE HISTORIAL --- */}
        {/* Este es el código que ya tenías */}
        <h2 className="mb-4 text-xl font-semibold text-teal-600">
          🧾 Historial de Compras
        </h2>
        {ventas.length === 0 ? (
          <p className="text-gray-600">No tienes compras aún.</p>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            {" "}
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Producto</th>
                  <th className="p-2">Cantidad</th>
                  <th className="p-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((v, i) => (
                  <tr key={v.id || i} className="border-b">
                    <td className="p-2">{v.producto?.nombre}</td>
                    <td className="p-2">{v.cantidad}</td>
                    <td className="p-2">
                      {new Date(v.fecha).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserHistoryModal;