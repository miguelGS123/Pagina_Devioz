import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ShoppingBag, PackageSearch, Edit3 } from "lucide-react";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen?: string;
  categoria?: string;
}

const VendorDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Producto | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8008/api/productos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductos(res.data);
      } catch (err) {
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [token]);

  const handleStockChange = async (id: number, nuevoStock: number) => {
    try {
      await axios.put(
        `http://localhost:8008/api/productos/${id}`,
        { stock: nuevoStock },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: nuevoStock } : p))
      );
      alert("✅ Stock actualizado correctamente");
    } catch {
      alert("❌ Error al actualizar el stock");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-gray-900 text-white py-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PackageSearch size={22} /> Panel de Vendedor
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag size={18} /> Mis Productos
        </h2>

        {loading ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
            {productos.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white border rounded-xl shadow-sm p-4 flex flex-col"
              >
                <img
                  src={p.imagen || "/placeholder.png"}
                  alt={p.nombre}
                  className="h-32 object-contain mb-3"
                />
                <h3 className="font-bold">{p.nombre}</h3>
                <p className="text-gray-600 text-sm mb-2">{p.descripcion}</p>
                <p className="font-semibold text-teal-600 mb-2">
                  S/ {p.precio.toFixed(2)}
                </p>

                <label className="text-sm text-gray-700">
                  Stock disponible:
                </label>
                <input
                  type="number"
                  min={0}
                  value={p.stock}
                  onChange={(e) =>
                    handleStockChange(p.id, Number(e.target.value))
                  }
                  className="w-full border rounded px-2 py-1 mt-1 text-sm"
                />

                <button
                  onClick={() => setEditing(p)}
                  className="mt-3 bg-gray-800 text-white py-1 rounded hover:bg-gray-700 flex items-center justify-center gap-1"
                >
                  <Edit3 size={16} /> Editar producto
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;
