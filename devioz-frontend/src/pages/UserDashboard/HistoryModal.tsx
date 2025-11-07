import React from "react";
import { motion } from "framer-motion";
import { Product } from "../Products/ProductCard";

// Definimos la interfaz Venta aquí para que el componente sepa qué recibe
interface Venta {
  id: number;
  producto: Product;
  cantidad: number;
  fecha: string;
}

interface Props {
  ventas: Venta[];
  onClose: () => void;
}

const HistorialModal: React.FC<Props> = ({ ventas, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-lg w-full max-w-3xl text-gray-900 border border-gray-300 shadow-2xl relative"
      >
        <h2 className="text-2xl font-bold mb-4 text-teal-600 flex items-center gap-2">
          🧾 Historial de Compras
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        {/* Contenedor de la tabla con scroll */}
        <div className="max-h-[70vh] overflow-y-auto">
          {ventas.length === 0 ? (
            <p className="text-gray-600">No tienes compras aún.</p>
          ) : (
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
                  <tr key={i} className="border-b">
                    <td className="p-2">{v.producto.nombre}</td>
                    <td className="p-2">{v.cantidad}</td>
                    <td className="p-2">
                      {new Date(v.fecha).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HistorialModal;