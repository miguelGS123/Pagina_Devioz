// En: VendedorDashboard/VendedorNotificationModal.tsx
import React from "react";
import { motion } from "framer-motion";
import { Notificacion } from "./VendedorHeader";

interface Props {
  notificacion: Notificacion;
  onClose: () => void;
}

const VendedorNotificationModal: React.FC<Props> = ({ notificacion, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg w-full max-w-lg text-gray-900 border border-gray-300 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-2 text-teal-600">
          {notificacion.asunto}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {notificacion.fecha}
        </p>
        
        <div className="text-gray-700 whitespace-pre-wrap">
          {notificacion.cuerpo}
        </div>
        
        <button
          onClick={onClose}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded mt-6"
        >
          Cerrar
        </button>
      </motion.div>
    </div>
  );
};

export default VendedorNotificationModal;