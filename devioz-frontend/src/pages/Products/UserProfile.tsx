import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, User } from "lucide-react";
import LoginModal from "./LoginModal";

interface Props {
  itemsCount: number;
  onCartClick: () => void;

  search: string;
  onSearchChange: (v: string) => void;

  category: string;
  onCategoryChange: (v: string) => void;

  sort: string;
  onSortChange: (v: string) => void;
}

const ProductsHeader: React.FC<Props> = ({
  itemsCount,
  onCartClick,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="bg-white border-b text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-gray-900"
        >
          Productos Devíoz
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* 🔍 Buscador */}
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full md:w-64 rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-teal-600"
          />

          {/* 📂 Categorías */}
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-xl border px-3 py-2"
          >
            <option>Todos</option>
            <option>Teclados</option>
            <option>Mouse</option>
            <option>Monitores</option>
            <option>Laptops</option>
            <option>Case</option>
            <option>Otros</option>
          </select>

          {/* ↕️ Orden */}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border px-3 py-2"
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
            <option value="rating">Mejor valorados</option>
          </select>

          {/* 👤 Sesión */}
          {!user ? (
            <button
              onClick={() => setLoginOpen(true)}
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-900 px-4 py-2 rounded-xl shadow hover:bg-gray-300 transition"
            >
              <User size={18} />
              Login
            </button>
          ) : (
            <div className="relative group">
              <button className="inline-flex items-center gap-2 bg-gray-200 text-gray-900 px-4 py-2 rounded-xl shadow">
                <User size={18} />
                {user.name || "Usuario"}
              </button>
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md hidden group-hover:block z-50 w-48">
                {/* Menú dinámico por rol */}
                {user.role === "USER" && (
                  <>
                    <button
                      onClick={() => alert("Actualizar datos próximamente")}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Actualizar datos
                    </button>
                    <button
                      onClick={() => alert("Eliminar cuenta próximamente")}
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                      Eliminar cuenta
                    </button>
                  </>
                )}

                {user.role === "ADMIN" && (
                  <>
                    <button
                      onClick={() => alert("Gestión de productos")}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Administrar productos
                    </button>
                    <button
                      onClick={() => alert("Gestión de usuarios")}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Administrar usuarios
                    </button>
                  </>
                )}

                {user.role === "VENDEDOR" && (
                  <button
                    onClick={() => alert("Mis productos")}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Mis productos
                  </button>
                )}

                {/* 🚪 Cerrar sesión */}
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}

          {/* 🛒 Carrito */}
          <button
            onClick={onCartClick}
            className="relative inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <ShoppingCart size={20} />
            Carrito
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-teal-600 text-xs font-bold px-2 py-0.5 rounded-full shadow">
                {itemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  );
};

export default ProductsHeader;
