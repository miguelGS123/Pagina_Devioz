import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import AdminHeader from "./AdminHeader";
import AdminProductsTable from "./AdminProductsTable";
import AdminUsersTable from "./AdminUsersTable";
import AdminSalesTable from "./AdminSalesTable";
import AdminSalesDashboard from "./AdminSalesDashboard";
import api from "../../api/axiosConfig"; // <-- Usa tu 'api' configurada

// --- CORRECCIÓN: Interfaces opcionales ---
interface Usuario {
  id?: number; // <-- 'id' debe ser opcional
  nombre: string;
  email: string;
  telefono?: string;
  rol: string;
}

interface Producto {
  id?: number; // <-- 'id' debe ser opcional
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria?: string;
}

interface Venta {
  id: number;
  producto: Producto;
  cantidad: number;
  total: number;
  fecha: string;
  usuario: Usuario;
}

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [tab, setTab] = useState("productos");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token"); // El interceptor de 'api' lo usará

    if (!storedUser || !token) {
      Swal.fire("Sesión expirada", "Inicia sesión nuevamente", "warning");
      window.location.href = "/"; // Redirige a la raíz
      return;
    }

    const parsedUser: Usuario = JSON.parse(storedUser);
    if (parsedUser.rol !== "ROL_ADMIN") {
      Swal.fire("Acceso denegado", "No tienes permisos de administrador", "error");
      window.location.href = "/";
      return;
    }
    setUser(parsedUser);

    const loadData = async () => {
      try {
        const [prodRes, usersRes, salesRes] = await Promise.all([
          // --- ESTA ES LA LLAMADA QUE FALLA ---
          // Arreglada para no tener /api y SÍ tener no-cache
          api.get("/productos", {
            headers: {
              "Cache-Control": "no-cache",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          }),
          api.get("/usuarios"), // Ruta relativa (sin /api)
          api.get("/ventas"),   // Ruta relativa (sin /api)
        ]);
        setProductos(prodRes.data);
        setUsuarios(usersRes.data);
        setVentas(salesRes.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <AdminHeader user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {[
            { id: "productos", label: "Productos" },
            { id: "usuarios", label: "Usuarios" },
            { id: "ventas", label: "Ventas" },
            { id: "dashboard", label: "Dashboard" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg transition ${
                tab === t.id
                  ? "bg-teal-600 text-white"
                  : "bg-white hover:bg-gray-100 border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Secciones */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Estos 'setProductos' y 'setUsuarios' arreglan los TypeErrors */}
          {tab === "productos" && (
            <AdminProductsTable
              productos={productos}
              setProductos={setProductos}
            />
          )}
          
          {tab === "usuarios" && (
            <AdminUsersTable usuarios={usuarios} setUsuarios={setUsuarios} />
          )}
          
          {tab === "ventas" && <AdminSalesTable ventas={ventas} />}
          {tab === "dashboard" && <AdminSalesDashboard ventas={ventas} />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;