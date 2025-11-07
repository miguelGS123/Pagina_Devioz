import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, UserCircle2, User, ListOrdered, LogOut } from "lucide-react";
import type { CartItem } from "../Products/CartSidebar";

interface Props {
  user: { nombre: string };
  cartItems: CartItem[];
  isHistorialOpen: boolean; // Le pasamos el estado actual
  onCartClick: () => void;
  onPerfilClick: () => void;
  onHistorialClick: () => void; // Este es el toggle
  onLogout: () => void;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardHeader: React.FC<Props> = ({
  user,
  cartItems,
  isHistorialOpen, // No se usa para el título en esta versión
  onCartClick,
  onPerfilClick,
  onHistorialClick,
  onLogout,
  menuOpen,
  setMenuOpen,
}) => (
  <header className="bg-gray-900 text-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
    <img
      src="/logo-devioz.png"
      alt="Logo"
      className="h-14 w-auto object-contain"
    />

    <h1 className="text-lg sm:text-xl font-semibold text-center flex-1">
      {/* Título Fijo como lo tenías */}
      🛍️ Tus Productos Disponibles
    </h1>

    <div className="flex items-center gap-4 relative">
      <motion.button
        onClick={onCartClick}
        whileTap={{ scale: 0.95 }}
        className="relative bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md"
      >
        <ShoppingCart size={20} />
        <span>Carrito</span>
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {cartItems.reduce((a, b) => a + b.qty, 0)}
          </span>
        )}
      </motion.button>

      <button
        onClick={() => setMenuOpen((p) => !p)}
        className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl flex items-center gap-2"
      >
        <UserCircle2 size={20} />
        {user.nombre.split(" ")[0]}
      </button>

      {/* --- MENÚ CORREGIDO (COMO TÚ QUERÍAS) --- */}
      {menuOpen && (
        <div className="absolute right-0 top-14 w-56 bg-white text-gray-800 shadow-xl rounded-xl border overflow-hidden py-1">
          <button
            onClick={() => {
              onPerfilClick();
              setMenuOpen(false);
            }}
            className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          >
            <User size={16} /> Perfil
          </button>
          <button
            onClick={() => {
              onHistorialClick(); // <-- Llama al toggle
              setMenuOpen(false);
            }}
            className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          >
            <ListOrdered size={16} /> Historial
          </button>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  </header>
);

export default DashboardHeader;