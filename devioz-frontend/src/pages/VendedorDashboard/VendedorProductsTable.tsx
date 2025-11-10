// En: VendedorDashboard/VendedorProductsTable.tsx
import React, { useState } from "react";
import Swal from "sweetalert2";

export interface VendedorProducto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

interface Props {
  productos: VendedorProducto[];
  setProductos: React.Dispatch<React.SetStateAction<VendedorProducto[]>>;
}

const VendedorProductsTable: React.FC<Props> = ({ productos, setProductos }) => {
  const [editing, setEditing] = useState<VendedorProducto | null>(null);
  const [loading, setLoading] = useState(false);

  // Guardar Stock (Estático)
  const handleSaveStock = async (productoEditado: VendedorProducto) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula red
    
    setProductos(prev => 
      prev.map(p => p.id === productoEditado.id ? productoEditado : p)
    );
    
    setLoading(false);
    setEditing(null);
    Swal.fire("✅ Stock Actualizado", "El stock fue actualizado (modo estático).", "success");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 relative">
      {loading && <div className="absolute inset-0 bg-white/70 z-50" />}

      <h2 className="text-xl font-semibold text-teal-600 mb-4">
        Mis Productos
      </h2>

      <table className="min-w-full text-sm text-gray-700 border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Categoría</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50 transition">
              <td className="p-2 font-medium">{p.nombre}</td>
              <td className="p-2">S/ {p.precio.toFixed(2)}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">{p.categoria}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => setEditing(p)}
                  className="text-blue-600 hover:underline"
                >
                  Actualizar Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Edición de Stock */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-teal-600">
              Actualizar Stock: {editing.nombre}
            </h3>
            
            <p className="text-sm text-gray-600 mb-2">Nuevo Stock:</p>
            <input
              type="number"
              value={editing.stock}
              onChange={(e) => setEditing({ ...editing, stock: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 px-3 py-2 mb-4 rounded focus:ring-2 focus:ring-teal-500"
            />
            
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setEditing(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSaveStock(editing)}
                className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendedorProductsTable;