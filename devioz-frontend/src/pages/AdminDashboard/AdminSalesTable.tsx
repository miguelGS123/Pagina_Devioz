import React, { useState } from "react";

export interface Venta {
  id: number;
  producto: {
    nombre: string;
    categoria?: string;
  } | null;
  usuario: {
    nombre: string;
    email: string;
  } | null;
  cantidad: number;
  total: number;
  fecha: string;
}

interface Props {
  ventas: Venta[];
}

const AdminSalesTable: React.FC<Props> = ({ ventas }) => {
  const [search, setSearch] = useState("");

  const filtered = ventas.filter((v) =>
    (v.producto?.nombre || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-teal-600 mb-4">
        💰 Ventas Registradas
      </h2>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-gray-500 text-sm">
          Total: {filtered.length} registros
        </span>
      </div>

      {/* --- INICIO DE LA SOLUCIÓN --- */}
      {/* EL ÚNICO CAMBIO ESTÁ AQUÍ: 
        Cambiamos max-h-[600px] por max-h-[550px] 
      */}
      <div className="overflow-y-auto max-h-[550px] border rounded-lg">
        <table className="min-w-full text-sm text-gray-700 border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="text-left">
              <th className="p-2">Producto</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Total</th>
              <th className="p-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  {v.producto?.nombre || (
                    <span className="text-red-500 italic">Producto eliminado</span>
                  )}
                </td>
                <td className="p-2">
                  {v.usuario?.nombre || (
                    <span className="text-red-500 italic">Usuario eliminado</span>
                  )}
                </td>
                <td className="p-2">{v.cantidad}</td>
                <td className="p-2 font-semibold">S/ {v.total.toFixed(2)}</td>
                <td className="p-2">
                  {new Date(v.fecha).toLocaleDateString("es-PE")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* --- FIN DE LA SOLUCIÓN --- */}
    </div>
  );
};

export default AdminSalesTable;