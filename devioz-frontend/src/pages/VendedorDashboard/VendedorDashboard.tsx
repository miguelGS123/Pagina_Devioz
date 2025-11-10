// En: VendedorDashboard/VendedorDashboard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import VendedorHeader, { Notificacion } from "./VendedorHeader";
import VendedorNotificationModal from "./VendedorNotificationModal";
import VendedorProductsTable, { VendedorProducto } from "./VendedorProductsTable";

// --- Datos de Prueba Estáticos ---
const MOCK_NOTIFICACIONES: Notificacion[] = [
  {
    id: 1,
    asunto: "¡Nueva Venta! - iPhone 15 Pro",
    cuerpo: "Hola Vendedor, ¡felicidades! Has vendido 1 unidad del iPhone 15 Pro. El cliente es Miguel Gamarra.",
    leido: false,
    fecha: "hace 5 minutos"
  },
  {
    id: 2,
    asunto: "¡Nueva Venta! - Laptop Lenovo Legion",
    cuerpo: "Hola Vendedor, has vendido 1 unidad de la Laptop Lenovo Legion. Prepara el envío.",
    leido: false,
    fecha: "hace 1 hora"
  },
  {
    id: 3,
    asunto: "Bajo Stock - Laptop ASUS ROG",
    cuerpo: "Atención: Tu producto 'Laptop ASUS ROG' tiene solo 2 unidades restantes en stock.",
    leido: true,
    fecha: "hace 1 día"
  },
];

const MOCK_PRODUCTOS_VENDEDOR: VendedorProducto[] = [
  { id: 101, nombre: "Laptop ASUS ROG", precio: 5200, stock: 2, categoria: "Laptops" },
  { id: 102, nombre: "iPhone 15 Pro", precio: 6200, stock: 5, categoria: "Celulares" },
  { id: 103, nombre: "Laptop Lenovo Legion", precio: 4800, stock: 10, categoria: "Laptops" },
];
// --- Fin de Datos de Prueba ---

const VendedorDashboard: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState(MOCK_NOTIFICACIONES);
  const [productos, setProductos] = useState(MOCK_PRODUCTOS_VENDEDOR);
  const [notificacionAbierta, setNotificacionAbierta] = useState<Notificacion | null>(null);
  
  // Simulación de "Marcar como leída"
  const handleMarcarLeida = (id: number) => {
    setNotificaciones(prev => 
      prev.map(n => (n.id === id ? { ...n, leido: true } : n))
    );
  };
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/productos"; // O a "/"
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <VendedorHeader
        vendedorNombre="Vendedor Estático"
        notificaciones={notificaciones}
        onLogout={handleLogout}
        onNotificacionLeida={handleMarcarLeida}
        onNotificacionClick={(n) => setNotificacionAbierta(n)}
      />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Aquí va la tabla de productos del vendedor */}
          <VendedorProductsTable 
            productos={productos} 
            setProductos={setProductos} 
          />
        </motion.div>
      </div>

      {/* --- El Modal para "Ver el Correo" --- */}
      {notificacionAbierta && (
        <VendedorNotificationModal
          notificacion={notificacionAbierta}
          onClose={() => setNotificacionAbierta(null)}
        />
      )} 
    </div>
  );
};

export default VendedorDashboard;