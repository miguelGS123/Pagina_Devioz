import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import AdminHeader from "./AdminHeader";
import AdminProductsTable from "./AdminProductsTable";
import AdminUsersTable from "./AdminUsersTable";
import AdminSalesTable from "./AdminSalesTable";
import AdminSalesDashboard from "./AdminSalesDashboard";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: string;
}

interface Producto {
  id: number;
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
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      Swal.fire("Sesión expirada", "Inicia sesión nuevamente", "warning");
      window.location.href = "/productos";
      return;
    }

    const parsedUser: Usuario = JSON.parse(storedUser);
    if (parsedUser.rol !== "ROL_ADMIN") {
      Swal.fire("Acceso denegado", "No tienes permisos de administrador", "error");
      window.location.href = "/productos";
      return;
    }

    setUser(parsedUser);

    const loadData = async () => {
      try {
        const [prod, users, sales] = await Promise.all([
          axios.get("http://localhost:8008/api/productos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8008/api/usuarios", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8008/api/ventas", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProductos(prod.data);
        setUsuarios(users.data);
        setVentas(sales.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/productos";
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
          {tab === "productos" && <AdminProductsTable productos={productos} />}
          {tab === "usuarios" && <AdminUsersTable usuarios={usuarios} />}
          {tab === "ventas" && <AdminSalesTable ventas={ventas} />}
          {tab === "dashboard" && <AdminSalesDashboard ventas={ventas} />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
