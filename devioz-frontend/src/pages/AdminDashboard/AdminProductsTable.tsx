import React, { useState } from "react";
import api from "../../api/axiosConfig";
import Swal, { SweetAlertResult } from "sweetalert2";
import { AxiosResponse } from "axios";

interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria?: string;
  imagen?: string;
}

interface Props {
  productos: Producto[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}

const AdminProductsTable: React.FC<Props> = ({ productos, setProductos }) => {
  const [editing, setEditing] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    const confirm: SweetAlertResult = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await api.delete(`/productos/${id}`);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      Swal.fire("Eliminado", "El producto fue eliminado correctamente.", "success");
    } catch (error: any) {
      console.error("❌ Error al eliminar producto:", error);
      Swal.fire("Error", "No se pudo eliminar el producto.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (prod: Producto) => {
    try {
      if (!prod.nombre || prod.precio <= 0 || prod.stock < 0) {
        Swal.fire("⚠️ Campos inválidos", "Verifica los datos ingresados.", "warning");
        return;
      }

      setLoading(true);
      let response: AxiosResponse<Producto>;

      if (prod.id) {
        response = await api.put(`/productos/${prod.id}`, prod);
        setProductos((prev) =>
          prev.map((p) => (p.id === prod.id ? response.data : p))
        );
        Swal.fire("✅ Actualizado", "Producto actualizado.", "success");
      } else {
        const { id, ...nuevoProducto } = prod;
        response = await api.post(`/productos`, nuevoProducto);
        setProductos((prev) => [...prev, response.data]);
        Swal.fire("✅ Creado", "Producto creado.", "success");
      }

      setEditing(null);
    } catch (error: any) {
      console.error("❌ Error al guardar producto:", error);
      Swal.fire("Error", "Error al guardar el producto.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto: Producto) => setEditing(producto);

  const handleNew = () =>
    setEditing({
      nombre: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      categoria: "Laptops", // Valor por defecto
      imagen: "",
    });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-gray-700 font-semibold animate-pulse">
            Procesando...
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-teal-600">
          🛍️ Gestión de Productos
        </h2>
        <button
          onClick={handleNew}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg shadow transition"
        >
          + Nuevo producto
        </button>
      </div>

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
              <td className="p-2">{p.categoria || "—"}</td>
              <td className="p-2 text-center flex justify-center gap-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id!)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-teal-600">
              {editing.id ? "Editar producto" : "Nuevo producto"}
            </h3>

            <input
              type="text" placeholder="Nombre" value={editing.nombre}
              onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:ring-2 focus:ring-teal-500"
            />
            <textarea
              placeholder="Descripción" value={editing.descripcion}
              onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:ring-2 focus:ring-teal-500"
            />

            {/* --- 👇 CATEGORÍAS ACTUALIZADAS --- */}
            <select
              value={editing.categoria || ""}
              onChange={(e) => setEditing({ ...editing, categoria: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="Laptops">Laptops</option>
              <option value="Celulares">Celulares</option>
              <option value="Teclados">Teclados</option>
              <option value="Mouse">Mouse</option>
              <option value="Monitores">Monitores</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Audio">Audio</option>
              <option value="Otros">Otros</option>
            </select>
            {/* --- 👆 FIN ACTUALIZACIÓN --- */}

            <input
              type="text" placeholder="URL de Imagen" value={editing.imagen || ""}
              onChange={(e) => setEditing({ ...editing, imagen: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:ring-2 focus:ring-teal-500"
            />
            
            <div className="flex gap-2 mb-3">
                <input
                type="number" placeholder="Precio" value={editing.precio}
                onChange={(e) => setEditing({ ...editing, precio: parseFloat(e.target.value) || 0 })}
                className="w-1/2 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
                />
                <input
                type="number" placeholder="Stock" value={editing.stock}
                onChange={(e) => setEditing({ ...editing, stock: parseInt(e.target.value) || 0 })}
                className="w-1/2 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
                />
            </div>

            <div className="flex justify-between mt-2">
              <button
                onClick={() => setEditing(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSave(editing)}
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

export default AdminProductsTable;