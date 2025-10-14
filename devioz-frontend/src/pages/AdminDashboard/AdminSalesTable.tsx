import React, { useState } from "react";

export interface Venta {
  id: number;
  producto: {
    nombre: string;
    categoria?: string;   // ✅ Agregado
  };
  usuario: {
    nombre: string;
    email: string;
  };
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
    v.producto.nombre.toLowerCase().includes(search.toLowerCase())
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

      <table className="min-w-full text-sm text-gray-700 border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
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
              <td className="p-2">{v.producto.nombre}</td>
              <td className="p-2">{v.usuario.nombre}</td>
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
  );
};

export default AdminSalesTable;
