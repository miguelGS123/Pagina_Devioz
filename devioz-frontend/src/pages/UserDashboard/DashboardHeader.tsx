import React from "react";
import { LogOut, Shield, ShoppingCart, User } from "lucide-react";
// IMPORTANTE: Asegúrate de que esta ruta sea correcta según tu proyecto
import { CartItem } from "../Products/CartSidebar"; 

interface Usuario {
  nombre: string;
  // ... otros campos
}

interface Props {
  user: Usuario;
  cartItems: CartItem[]; // ✅ Usamos la interfaz correcta
  onCartClick: () => void;
  onPerfilClick: () => void;
  onHistorialClick: () => void;
  onLogout: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const DashboardHeader: React.FC<Props> = ({ 
  user, 
  cartItems, 
  onCartClick, 
  onPerfilClick, 
  onHistorialClick, 
  onLogout, 
  menuOpen, 
  setMenuOpen 
}) => {
  return (
    <header className="bg-white text-gray-800 p-4 shadow flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-teal-600">Mi Tienda</h1>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onCartClick} className="relative p-2 hover:bg-gray-100 rounded-full">
          <ShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>

        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition"
          >
            <User size={24} />
            <span className="font-semibold">{user?.nombre || "Usuario"}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
              <button 
                onClick={() => { onPerfilClick(); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
              >
                <User size={16} /> Perfil
              </button>
              <button 
                onClick={() => { onHistorialClick(); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
              >
                <Shield size={16} /> Historial
              </button>
              <div className="border-t my-1"></div>
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;