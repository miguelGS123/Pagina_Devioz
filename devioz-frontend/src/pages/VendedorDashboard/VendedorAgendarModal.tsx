// En: VendedorDashboard/VendedorAgendarModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "../../api/axiosConfig"; 
import Swal from "sweetalert2";

// Interfaz del pedido
export interface PedidoPendiente {
    id: number;
    productoNombre: string;
    cantidad: number;
    clienteEmail: string;
    clienteNombre: string;
    clienteTelefono?: string;
}

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
    onUpdateSuccess: () => void;
}

const VendedorAgendarModal: React.FC<Props> = ({ pedido, vendedorNombre, onClose, onUpdateSuccess }) => {
    
    const [fechaEnvio, setFechaEnvio] = useState(new Date().toISOString().split('T')[0]);
    const [horaEnvio, setHoraEnvio] = useState(""); 
    const [direccionSelect, setDireccionSelect] = useState(estacionesLinea1[0]); 
    const [direccionPersonalizada, setDireccionPersonalizada] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleGuardar = async () => {
        const direccionFinal = (direccionSelect === 'Otra - Especificar') 
            ? direccionPersonalizada 
            : direccionSelect;

        if (!direccionFinal || !fechaEnvio || !horaEnvio) { 
            await Swal.fire("⚠️ Faltan Campos", "Por favor, completa la Fecha, la Hora y la Dirección.", "warning");
            return;
        }

        const datosEnvio = {
            direccion: direccionFinal,
            fecha: fechaEnvio,
            hora: horaEnvio, 
        };
        
        const token = localStorage.getItem("token");
        if (!token) {
            await Swal.fire("Error", "Sesión expirada. Por favor, vuelva a iniciar sesión.", "error");
            return;
        }

        try {
            setLoading(true);

            // 👇👇 CORRECCIÓN AQUÍ: Quitamos el "/api" del inicio
            // Antes: `/api/ventas/${pedido.id}/agendar` (Daba error /api/api/...)
            // Ahora: `/ventas/${pedido.id}/agendar` (Correcto)
            const API_URL = `/ventas/${pedido.id}/agendar`;
            
            await axios.put(API_URL, datosEnvio, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            await Swal.fire("✅ Agendado", `Envío coordinado para el ${fechaEnvio} a las ${horaEnvio}.`, "success");
            
            onClose(); 
            onUpdateSuccess(); 
            
        } catch (error: any) {
            console.error("Error al agendar:", error);
            const msg = error.response?.data || "Error de red o servidor.";
            await Swal.fire("❌ Error", msg, "error");
        } finally {
            setLoading(false);
        }
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
                    <h3 className="text-lg font-semibold text-teal-600">Agendar Envío</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">✕</button>
                </div>

                <div className="p-3 bg-gray-100 rounded-lg mb-4 text-sm">
                    <p><strong>Producto:</strong> {pedido.productoNombre} (x{pedido.cantidad})</p>
                    <p><strong>Email Cliente:</strong> {pedido.clienteEmail}</p>
                    <p className="flex items-center gap-2">
                        <strong>📞 Teléfono Cliente:</strong> 
                        <span className="font-medium text-gray-800">
                            {pedido.clienteTelefono || "No registrado"}
                        </span>
                    </p>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
                        <input type="text" value={pedido.clienteNombre} readOnly disabled className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mi Nombre (Vendedor)</label>
                        <input type="text" value={vendedorNombre} readOnly disabled className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Envío</label>
                        <input type="date" value={fechaEnvio} onChange={(e) => setFechaEnvio(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hora de Envío (Ej: 14:00)</label>
                        <input type="time" value={horaEnvio} onChange={(e) => setHoraEnvio(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500" required />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lugar de Entrega</label>
                        <select value={direccionSelect} onChange={(e) => setDireccionSelect(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500 bg-white">
                            {estacionesLinea1.map(estacion => (<option key={estacion} value={estacion}>{estacion}</option>))}
                            <option value="Otra - Especificar">Otra - Especificar</option>
                        </select>
                        {direccionSelect === 'Otra - Especificar' && (
                            <input type="text" placeholder="Especifique la dirección completa" value={direccionPersonalizada} onChange={(e) => setDireccionPersonalizada(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500 mt-2" />
                        )}
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded" disabled={loading}>Cancelar</button>
                    <button onClick={handleGuardar} className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Agendamiento'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default VendedorAgendarModal;