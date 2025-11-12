// En: VendedorDashboard/VendedorAgendarModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

// Definimos los tipos de pedidos
export interface PedidoPendiente {
  id: number;
  productoNombre: string;
  cantidad: number;
  clienteEmail: string;
}

export interface PedidoAgendado {
  id: number;
  productoNombre: string;
  clienteNombre: string;
  fechaEnvio: string;
  direccion: string;
  vendedor: string;
}

// Lista de estaciones (como pediste)
const estacionesLinea1 = [
  "Villa El Salvador", "Parque Industrial", "Pumacahua", "Villa María",
  "María Auxiliadora", "San Juan", "Atocongo", "Jorge Chávez",
  "Ayacucho", "Cabitos", "Angamos", "San Borja Sur", "La Cultura",
  "Arriola", "Gamarra", "28 de Julio", "Miguel Grau", "El Ángel",
  "Presbítero Maestro", "Caja de Agua", "Pirámide del Sol", 
  "Los Jardines", "Los Postes", "San Carlos", "San Martín", "Santa Rosa", "Bayóvar"
];

interface Props {
  pedido: PedidoPendiente;
  vendedorNombre: string;
  onClose: () => void;
  onSave: (agendado: PedidoAgendado) => void;
}

const VendedorAgendarModal: React.FC<Props> = ({ pedido, vendedorNombre, onClose, onSave }) => {
  // Estado local del formulario
  const [clienteNombre, setClienteNombre] = useState("");
  const [fechaEnvio, setFechaEnvio] = useState(new Date().toISOString().split('T')[0]); // Default hoy
  
  // --- CAMBIOS PARA DIRECCIÓN PERSONALIZADA ---
  const [direccionSelect, setDireccionSelect] = useState(estacionesLinea1[0]); // Default
  const [direccionPersonalizada, setDireccionPersonalizada] = useState("");
  // --- Fin Cambios ---

  const handleGuardar = () => {
    // Determina la dirección final que se guardará
    const direccionFinal = (direccionSelect === 'Otra - Especificar') 
      ? direccionPersonalizada 
      : direccionSelect;

    if (!clienteNombre || !direccionFinal || !fechaEnvio) {
      alert("Por favor, completa todos los campos (Cliente, Fecha y Dirección).");
      return;
    }
    
    // Creamos el nuevo objeto de Pedido Agendado
    const pedidoAgendado: PedidoAgendado = {
      id: pedido.id,
      productoNombre: pedido.productoNombre,
      clienteNombre: clienteNombre,
      fechaEnvio: fechaEnvio,
      direccion: direccionFinal, // <-- Guarda la dirección final
      vendedor: vendedorNombre,
    };
    
    onSave(pedidoAgendado);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-teal-600">
            Agendar Envío
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">
            ✕
          </button>
        </div>

        {/* Info del Pedido */}
        <div className="p-3 bg-gray-100 rounded-lg mb-4">
          <p><strong>Producto:</strong> {pedido.productoNombre} (x{pedido.cantidad})</p>
          <p><strong>Email Cliente:</strong> {pedido.clienteEmail}</p>
        </div>

        {/* Formulario */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
            <input
              type="text"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* --- CAMBIO: CAMPO DE VENDEDOR AÑADIDO --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mi Nombre (Vendedor)</label>
            <input
              type="text"
              value={vendedorNombre}
              readOnly  
              disabled
              className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          {/* --- Fin Cambio --- */}

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Envío</label>
            <input
              type="date"
              value={fechaEnvio}
              onChange={(e) => setFechaEnvio(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lugar de Entrega (Estación)</label>
            <select
              value={direccionSelect}
              onChange={(e) => setDireccionSelect(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {estacionesLinea1.map(estacion => (
                <option key={estacion} value={estacion}>{estacion}</option>
              ))}
              <option value="Otra - Especificar">Otra - Especificar</option>
            </select>
            
            {/* --- CAMBIO: CAMPO CONDICIONAL AÑADIDO --- */}
            {direccionSelect === 'Otra - Especificar' && (
              <input
                type="text"
                placeholder="Especifique la dirección completa"
                value={direccionPersonalizada}
                onChange={(e) => setDireccionPersonalizada(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500 mt-2"
              />
            )}
            {/* --- Fin Cambio --- */}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded"
          >
            Guardar Agendamiento
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VendedorAgendarModal;