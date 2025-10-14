import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria?: string;
  imagen?: string;
}

interface Props {
  productos: Producto[];
}

const AdminProductsTable: React.FC<Props> = ({ productos }) => {
  const [items, setItems] = useState(productos);
  const [editing, setEditing] = useState<Producto | null>(null);
  

  const token = localStorage.getItem("token");

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8008/api/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((p) => p.id !== id));
      Swal.fire("Eliminado", "El producto fue eliminado", "success");
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  const handleSave = async (prod: Producto) => {
    try {
      if (prod.id) {
        await axios.put(
          `http://localhost:8008/api/productos/${prod.id}`,
          prod,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems(items.map((i) => (i.id === prod.id ? prod : i)));
        Swal.fire("Actualizado", "El producto fue actualizado", "success");
      } else {
        const res = await axios.post(
          `http://localhost:8008/api/productos`,
          prod,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems([...items, res.data]);
        Swal.fire("Creado", "El producto fue agregado", "success");
      }
      setEditing(null);
      
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }
  };

  const handleEdit = (p: Producto) => setEditing(p);
  const handleNew = () =>
    setEditing({
      id: 0,
      nombre: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      categoria: "",
      imagen: "",
    });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-teal-600">
          🛍️ Gestión de Productos
        </h2>
        <button
          onClick={handleNew}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg"
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
          {items.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">S/ {p.precio}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">{p.categoria || "—"}</td>
              <td className="p-2 text-center flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición / creación */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-teal-600">
              {editing.id ? "Editar producto" : "Nuevo producto"}
            </h3>

            {["nombre", "descripcion", "categoria", "imagen"].map((f) => (
              <input
                key={f}
                type="text"
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                value={(editing as any)[f]}
                onChange={(e) =>
                  setEditing({ ...editing, [f]: e.target.value })
                }
                className="w-full border px-3 py-2 mb-3 rounded"
              />
            ))}
            <input
              type="number"
              placeholder="Precio"
              value={editing.precio}
              onChange={(e) =>
                setEditing({ ...editing, precio: parseFloat(e.target.value) })
              }
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <input
              type="number"
              placeholder="Stock"
              value={editing.stock}
              onChange={(e) =>
                setEditing({ ...editing, stock: parseInt(e.target.value) })
              }
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <div className="flex justify-between">
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
