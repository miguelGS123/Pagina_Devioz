// En: VendedorDashboard/VendedorHeader.tsx
import React, { useState } from "react";
import { Bell, LogOut } from "lucide-react";

export interface Notificacion {
  id: number;
  asunto: string;
  cuerpo: string;
  leido: boolean;
  fecha: string;
}

interface Props {
  vendedorNombre: string;
  notificaciones: Notificacion[];
  onLogout: () => void;
  onNotificacionLeida: (id: number) => void;
  onNotificacionClick: (notificacion: Notificacion) => void;
}

const VendedorHeader: React.FC<Props> = ({
  vendedorNombre,
  notificaciones,
  onLogout,
  onNotificacionLeida,
  onNotificacionClick,
}) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const noLeidas = notificaciones.filter(n => !n.leido).length;

  return (
    <header className="bg-gray-900 text-white p-4 shadow flex justify-between items-center">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold">Panel de Vendedor</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)} 
            className="relative text-gray-300 hover:text-white"
          >
            <Bell size={24} />
            {noLeidas > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs">
                {noLeidas}
              </span>
            )}
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-gray-900 rounded-lg shadow-xl z-50">
              <div className="p-3 font-semibold border-b">Notificaciones</div>
              {notificaciones.length === 0 ? (
                <p className="p-3 text-sm text-gray-600">No hay notificaciones.</p>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notificaciones.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNotificacionClick(n);
                        onNotificacionLeida(n.id);
                        setMenuAbierto(false);
                      }}
                      className={`p-3 border-b hover:bg-gray-100 cursor-pointer ${!n.leido ? 'bg-blue-50' : ''}`}
                    >
                      <p className={`font-semibold ${!n.leido ? 'text-blue-700' : ''}`}>{n.asunto}</p>
                      <p className="text-sm text-gray-500 truncate">{n.cuerpo}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.fecha}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <span className="font-semibold">{vendedorNombre}</span>
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

export default VendedorHeader;