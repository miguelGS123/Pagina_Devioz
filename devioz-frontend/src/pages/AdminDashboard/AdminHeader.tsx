import React from "react";
import { LogOut, Shield } from "lucide-react";

interface Props {
  user: any;
  onLogout: () => void;
}

const AdminHeader: React.FC<Props> = ({ user, onLogout }) => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Shield className="text-teal-400" size={26} />
        <h1 className="text-xl font-bold">Panel de Administración</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold">{user?.nombre || "Administrador"}</span>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg text-sm flex items-center gap-1"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
