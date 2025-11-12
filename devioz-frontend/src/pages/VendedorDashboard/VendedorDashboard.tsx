// En: VendedorDashboard/VendedorDashboard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2"; 
import VendedorHeader, { Notificacion } from "./VendedorHeader";
import VendedorNotificationModal from "./VendedorNotificationModal";
import VendedorProductsTable, { VendedorProducto } from "./VendedorProductsTable";
import VendedorAgendarModal, { PedidoPendiente, PedidoAgendado } from "./VendedorAgendarModal";

// --- DATOS DE PRUEBA (MOCKS) ---

const MOCK_PRODUCTOS_VENDEDOR: VendedorProducto[] = [
  { id: 101, nombre: "Laptop ASUS ROG", descripcion: "...", precio: 5200, stock: 2, categoria: "Laptops", imagen: "" },
  { id: 102, nombre: "iPhone 15 Pro", descripcion: "...", precio: 6200, stock: 5, categoria: "Celulares", imagen: "" },
  { id: 103, nombre: "Laptop Lenovo Legion", descripcion: "...", precio: 4800, stock: 10, categoria: "Laptops", imagen: "" },
  { id: 104, nombre: "Teclado Mecánico RGB", descripcion: "...", precio: 350, stock: 25, categoria: "Periféricos", imagen: "" },
  { id: 105, nombre: "Mouse Inalámbrico", descripcion: "...", precio: 120, stock: 8, categoria: "Periféricos", imagen: "" },
];

const MOCK_NOTIFICACIONES: Notificacion[] = MOCK_PRODUCTOS_VENDEDOR
  .filter(p => p.stock < 10) 
  .map((p, index) => ({
    id: index + 1,
    asunto: `¡Bajo Stock! - ${p.nombre}`,
    cuerpo: `Atención: Tu producto '${p.nombre}' tiene solo ${p.stock} unidades restantes.`,
    leido: index % 2 === 1, 
    fecha: `hace ${ (index + 1) * 3 } horas`
  }));

const MOCK_PEDIDOS_PENDIENTES: PedidoPendiente[] = [
  { id: 1, productoNombre: "iPhone 15 Pro", cantidad: 1, clienteEmail: "miguel@gmail.com" },
  { id: 2, productoNombre: "Mouse Inalámbrico", cantidad: 2, clienteEmail: "kevin@gmail.com" },
];

const MOCK_PEDIDOS_AGENDADOS: PedidoAgendado[] = [
  { id: 101, productoNombre: "Laptop Lenovo Legion", clienteNombre: "Diego Rojas", fechaEnvio: "2025-11-12", direccion: "Estación Atocongo", vendedor: "miguel" } // <-- CAMBIADO AQUÍ TAMBIÉN
];
// --- Fin Mocks ---

const VendedorDashboard: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState(MOCK_NOTIFICACIONES);
  const [productos, setProductos] = useState(MOCK_PRODUCTOS_VENDEDOR);
  const [notificacionAbierta, setNotificacionAbierta] = useState<Notificacion | null>(null);
  
  const [tab, setTab] = useState("pedidos");
  
  const [pedidosPendientes, setPedidosPendientes] = useState(MOCK_PEDIDOS_PENDIENTES);
  const [pedidosAgendados, setPedidosAgendados] = useState(MOCK_PEDIDOS_AGENDADOS);
  const [agendando, setAgendando] = useState<PedidoPendiente | null>(null);

  const handleMarcarLeida = (id: number) => {
    setNotificaciones(prev => prev.map(n => (n.id === id ? { ...n, leido: true } : n)));
  };
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  
  const handleSaveAgendamiento = (pedidoAgendado: PedidoAgendado) => {
    setPedidosPendientes(prev => prev.filter(p => p.id !== agendando!.id));
    setPedidosAgendados(prev => [pedidoAgendado, ...prev]);
    setAgendando(null);
    Swal.fire("✅ Envío Agendado", "El pedido ha sido agendado para su envío.", "success");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <VendedorHeader
        // --- 👇 CAMBIO 1 AQUÍ ---
        vendedorNombre="miguel" 
        notificaciones={notificaciones}
        onLogout={handleLogout}
        onNotificacionLeida={handleMarcarLeida}
        onNotificacionClick={(n) => setNotificacionAbierta(n)}
      />

      <div className="max-w-7xl mx-auto px-6 py-6">
        
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => setTab("pedidos")}
            className={`px-5 py-2 rounded-lg transition ${
              tab === "pedidos" ? "bg-teal-600 text-white" : "bg-white hover:bg-gray-100 border"
            }`}
          >
            Gestión de Pedidos
          </button>
          <button
            onClick={() => setTab("productos")}
            className={`px-5 py-2 rounded-lg transition ${
              tab === "productos" ? "bg-teal-600 text-white" : "bg-white hover:bg-gray-100 border"
            }`}
          >
            Mis Productos
          </button>
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tab === "pedidos" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Columna 1: Pedidos por Enviar */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">
                  Pedidos por Enviar ({pedidosPendientes.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pedidosPendientes.length === 0 && <p className="text-gray-500">No hay pedidos pendientes.</p>}
                  {pedidosPendientes.map(pedido => (
                    <div key={pedido.id} className="p-4 border rounded-lg">
                      <p className="font-semibold">{pedido.productoNombre} (x{pedido.cantidad})</p>
                      <p className="text-sm text-gray-600">Cliente: {pedido.clienteEmail}</p>
                      <button 
                        onClick={() => setAgendando(pedido)}
                        className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Agendar Envío
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna 2: Pedidos Agendados */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">
                  Pedidos Agendados ({pedidosAgendados.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pedidosAgendados.length === 0 && <p className="text-gray-500">No hay envíos agendados.</p>}
                  {pedidosAgendados.map(pedido => (
                    <div key={pedido.id} className="p-4 border rounded-lg bg-green-50">
                      <p className="font-semibold">{pedido.productoNombre}</p>
                      <p className="text-sm text-gray-700">Cliente: {pedido.clienteNombre}</p>
                      <p className="text-sm text-gray-700">Lugar: {pedido.direccion}</p>
                      <p className="text-sm text-gray-700">Fecha: {pedido.fechaEnvio}</p>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          )}
          
          {tab === "productos" && (
            <VendedorProductsTable 
              productos={productos} 
              setProductos={setProductos} 
            />
          )}
        </motion.div>
      </div>

      {notificacionAbierta && (
        <VendedorNotificationModal
          notificacion={notificacionAbierta}
          onClose={() => setNotificacionAbierta(null)}
        />
      )} 
      
      {agendando && (
        <VendedorAgendarModal
          pedido={agendando}
          // --- 👇 CAMBIO 2 AQUÍ ---
          vendedorNombre="miguel"
          onClose={() => setAgendando(null)}
          onSave={handleSaveAgendamiento}
        />
      )}
    </div>
  );
};

export default VendedorDashboard;