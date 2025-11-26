import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import Swal from "sweetalert2"; // Ya no se usa aquí, el modal lo maneja
import VendedorHeader, { Notificacion } from "./VendedorHeader";
import VendedorNotificationModal from "./VendedorNotificationModal";
import VendedorProductsTable, { VendedorProducto } from "./VendedorProductsTable";
import VendedorAgendarModal, { PedidoPendiente } from "./VendedorAgendarModal"; // Importamos la interfaz correcta
import api from "../../api/axiosConfig";

const VendedorDashboard: React.FC = () => {
  const [productos, setProductos] = useState<VendedorProducto[]>([]);
  const [ventasReales, setVentasReales] = useState<any[]>([]);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [notificacionAbierta, setNotificacionAbierta] = useState<Notificacion | null>(null);
  const [tab, setTab] = useState("pedidos");
  
  // Estado para el modal (tipo PedidoPendiente o null)
  const [agendando, setAgendando] = useState<PedidoPendiente | null>(null);

  const userStr = localStorage.getItem("user");
  const userObj = userStr ? JSON.parse(userStr) : { nombre: "Vendedor" };

  // Función para cargar datos (Productos y Ventas)
  const fetchData = async () => {
    try {
      const [prodRes, ventasRes] = await Promise.all([
        api.get("/productos", { headers: { "Cache-Control": "no-cache" } }),
        api.get("/ventas/vendedor", { headers: { "Cache-Control": "no-cache" } })
      ]);

      setProductos(prodRes.data);
      setVentasReales(ventasRes.data);

      // Generar notificaciones de stock bajo
      const nuevasNotificaciones = prodRes.data
        .filter((p: any) => p.stock < 10)
        .map((p: any, index: number) => ({
          id: index,
          asunto: `¡Bajo Stock! - ${p.nombre}`,
          cuerpo: `Atención: Quedan solo ${p.stock} unidades en el inventario.`,
          leido: false,
          fecha: "Alerta del sistema"
        }));
      setNotificaciones(nuevasNotificaciones);

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtros
  const pedidosPendientes = ventasReales.filter(v => !v.estado || v.estado === "PENDIENTE");
  const pedidosAgendados = ventasReales.filter(v => v.estado === "AGENDADO");

  const handleMarcarLeida = (id: number) => {
    setNotificaciones(prev => prev.map(n => (n.id === id ? { ...n, leido: true } : n)));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/productos";
  };

  // 👇 FUNCIÓN CLAVE: Prepara los datos para el Modal
  const abrirModalAgendar = (ventaReal: any) => {
    setAgendando({
      id: ventaReal.id,
      productoNombre: ventaReal.producto?.nombre,
      cantidad: ventaReal.cantidad,
      // Datos del Cliente
      clienteEmail: ventaReal.usuario?.email || ventaReal.usuarioNombre || "No registrado",
      clienteNombre: ventaReal.usuario?.nombre || "Cliente", // Nuevo campo requerido
      // ✅ AQUÍ PASAMOS EL TELÉFONO (Prioridad: Guardado > Perfil Usuario)
      clienteTelefono: ventaReal.telefonoCliente || ventaReal.usuario?.telefono 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <VendedorHeader
        vendedorNombre={userObj.nombre}
        notificaciones={notificaciones}
        onLogout={handleLogout}
        onNotificacionLeida={handleMarcarLeida}
        onNotificacionClick={(n) => setNotificacionAbierta(n)}
      />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Pestañas */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button onClick={() => setTab("pedidos")} className={`px-5 py-2 rounded-lg transition ${tab === "pedidos" ? "bg-teal-600 text-white" : "bg-white hover:bg-gray-100 border"}`}>Gestión de Pedidos</button>
          <button onClick={() => setTab("productos")} className={`px-5 py-2 rounded-lg transition ${tab === "productos" ? "bg-teal-600 text-white" : "bg-white hover:bg-gray-100 border"}`}>Inventario</button>
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          
          {tab === "pedidos" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* TARJETA PENDIENTES */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Pedidos por Enviar ({pedidosPendientes.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pedidosPendientes.length === 0 && <p className="text-gray-500">No hay pedidos pendientes.</p>}
                  {pedidosPendientes.map(v => (
                    <div key={v.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                      <p className="font-semibold">{v.producto?.nombre} (x{v.cantidad})</p>
                      <p className="text-sm text-gray-600">Cliente: {v.usuario?.nombre || "Desconocido"}</p>
                      <p className="text-xs text-gray-400">Fecha: {new Date(v.fecha).toLocaleDateString()}</p>
                      <button 
                        onClick={() => abrirModalAgendar(v)}
                        className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm w-full sm:w-auto"
                      >
                        Agendar Envío
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* TARJETA AGENDADOS */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Pedidos Agendados ({pedidosAgendados.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pedidosAgendados.length === 0 && <p className="text-gray-500">No hay envíos agendados.</p>}
                  {pedidosAgendados.map(v => (
                    <div key={v.id} className="p-4 border rounded-lg bg-green-50">
                      <p className="font-semibold">{v.producto?.nombre}</p>
                      <p className="text-sm text-gray-700">Destino: <strong>{v.direccionEnvio}</strong></p>
                      <p className="text-sm text-gray-700">
                        Programado: {v.fechaEnvioProgramada} - {v.horaEnvioProgramada || "Hora no def."}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Cliente: {v.usuario?.nombre}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {tab === "productos" && (
            <VendedorProductsTable productos={productos} setProductos={setProductos} />
          )}
        </motion.div>
      </div>

      {/* MODAL DE NOTIFICACIONES */}
      {notificacionAbierta && (
          <VendedorNotificationModal 
            notificacion={notificacionAbierta} 
            onClose={() => setNotificacionAbierta(null)} 
          />
      )} 
      
      {/* MODAL DE AGENDAR (Conectado correctamente) */}
      {agendando && (
        <VendedorAgendarModal
          pedido={agendando}
          vendedorNombre={userObj.nombre}
          onClose={() => setAgendando(null)}
          onUpdateSuccess={() => {
            // Esta función se ejecuta cuando el modal guarda con éxito
            setAgendando(null);
            fetchData(); // Recargamos la tabla para ver el cambio a "AGENDADO"
          }}
        />
      )}
    </div>
  );
};

export default VendedorDashboard;