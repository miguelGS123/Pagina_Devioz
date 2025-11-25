import React, { useState } from 'react';
import axios from '../../api/axiosConfig'; // Ruta al axiosConfig
import Swal from 'sweetalert2';

// 🛑 CORRECCIÓN CLAVE: Importar CartItem desde su origen
import { CartItem } from '../Products/CartSidebar'; 

// Interfaz para los datos del formulario (debe coincidir con VentaRequestDTO)
interface FormState {
    nombre: string;
    telefono: string;
    tipoEntrega: 'ESTACION_TREN' | 'OTRA_DIRECCION';
    direccion: string;
}

// 🛑 CORRECCIÓN CLAVE: Definición de las Props (Resuelve el error de TypeScript)
interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[]; // Lista de items del carrito
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>; // Función para limpiar el carrito
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, items, setCartItems }) => {
    const [formData, setFormData] = useState<FormState>({
        nombre: '',
        telefono: '',
        tipoEntrega: 'ESTACION_TREN',
        direccion: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire("⚠️ Error de autenticación", "Debes iniciar sesión para completar la compra.", "warning");
            setLoading(false);
            return;
        }

        // Mapeo al DTO que espera el Backend: VentaRequestDTO
        const itemsPayload = items.map((item) => ({
            productoId: item.product.id,
            cantidad: item.qty,
        }));
        
        const payload = {
            nombreCliente: formData.nombre,
            telefonoCliente: formData.telefono,
            tipoEntrega: formData.tipoEntrega,
            direccionEntrega: formData.direccion, 
            items: itemsPayload,
        };

        try {
            // NOTA: Ajustar URL si está probando en GCP (IP:8008)
            const API_URL = 'http://localhost:8008/api/ventas/crear-checkout'; 
            
            await axios.post(API_URL, payload, {
                 headers: { Authorization: `Bearer ${token}` }
            });

            // Éxito: Limpieza del carrito y mensaje formal
            await Swal.fire("✅ Pedido Confirmado", "En breve se comunicarán contigo para la contra entrega.", "success");
            
            setCartItems([]); // Limpieza del estado principal del carrito
            onClose();

        } catch (error: any) {
            const msg = error.response?.data || "Error de servidor inesperado.";
            Swal.fire("❌ Error en la compra", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        // JSX del Modal (Usando estilos básicos Tailwind - Ajustar si usa CSS modular)
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">📍 Datos de Entrega</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Por favor, ingrese sus datos para coordinar la contra entrega.
                </p>

                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Nombre Completo:</label>
                        <input className="w-full border p-2 rounded" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Teléfono de Contacto:</label>
                        <input className="w-full border p-2 rounded" type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Método de Entrega:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input type="radio" name="tipoEntrega" value="ESTACION_TREN" checked={formData.tipoEntrega === 'ESTACION_TREN'} onChange={handleChange} className="mr-2" /> Estación de Tren
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="tipoEntrega" value="OTRA_DIRECCION" checked={formData.tipoEntrega === 'OTRA_DIRECCION'} onChange={handleChange} className="mr-2" /> Otra Dirección
                            </label>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium">
                            {formData.tipoEntrega === 'ESTACION_TREN' ? 'Estación Específica:' : 'Dirección Exacta (Casa/Oficina):'}
                        </label>
                        <input className="w-full border p-2 rounded" type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                    </div>

                    <p className="text-sm text-green-700 font-semibold mb-4">
                        * Mensaje: En breve se comunicarán contigo al teléfono {formData.telefono} para la contra entrega.
                    </p>
                    
                    <div className="flex justify-between gap-3">
                        <button type="button" onClick={onClose} className="w-full bg-gray-300 text-gray-800 py-2 rounded">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded transition disabled:opacity-50">
                            {loading ? 'Procesando...' : 'Confirmar Pedido'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;