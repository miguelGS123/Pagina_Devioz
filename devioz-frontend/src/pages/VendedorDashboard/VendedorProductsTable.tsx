// En: src/pages/VendedorDashboard/VendedorProductsTable.tsx
import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import api from "../../api/axiosConfig";

export interface VendedorProducto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
}

interface Props {
  productos: VendedorProducto[];
  setProductos: React.Dispatch<React.SetStateAction<VendedorProducto[]>>;
}

const VendedorProductsTable: React.FC<Props> = ({ productos, setProductos }) => {
  const [editing, setEditing] = useState<VendedorProducto | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  const categoriasUnicas = ["Todas", ...new Set(productos.map(p => p.categoria))];

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
      const matchCategoria = (categoriaFiltro === "Todas") || (p.categoria === categoriaFiltro);
      return matchSearch && matchCategoria;
    });
  }, [productos, search, categoriaFiltro]);

  // --- LOGICA DE SUBIDA DE IMAGEN ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await api.post('/productos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (editing) {
          setEditing({ ...editing, imagen: response.data });
      }
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (prod: VendedorProducto) => {
    try {
      if (!prod.nombre || prod.precio <= 0 || prod.stock < 0) {
        Swal.fire("⚠️ Campos inválidos", "Verifica los datos ingresados.", "warning");
        return;
      }

      setLoading(true);

      if (prod.id) {
        const res = await api.put(`/productos/${prod.id}`, prod);
        setProductos(prev => prev.map(p => (p.id === prod.id ? res.data : p)));
        Swal.fire("✅ Actualizado", "Producto actualizado correctamente.", "success");
      } else {
        const res = await api.post("/productos", prod);
        setProductos(prev => [...prev, res.data]);
        Swal.fire("✅ Creado", "Producto creado correctamente.", "success");
      }
      setEditing(null);
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Hubo un error al guardar el producto.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setEditing({
      nombre: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      categoria: "Laptops",
      imagen: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
            <p className="font-semibold text-teal-600 animate-pulse">Procesando...</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-teal-600">
          Gestión de Mis Productos
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          <select
            value={categoriaFiltro}
            onChange={e => setCategoriaFiltro(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg bg-white"
          >
            {categoriasUnicas.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={handleNew}
            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg shadow transition w-full md:w-auto"
          >
            + Nuevo Producto
          </button>
        </div>
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
          {productosFiltrados.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No tienes productos aún.</td></tr>
          )}
          {productosFiltrados.map((p) => (
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
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL DE EDICIÓN */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-teal-600">
              {editing.id ? "Editar Producto" : "Nuevo Producto"}
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

            <select
              value={editing.categoria}
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
            
            {/* SECCIÓN DE IMAGEN */}
            <div className="mb-3">
                <label className="block text-xs font-bold mb-1 text-gray-600">Imagen del Producto</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-teal-50 file:text-teal-700
                        hover:file:bg-teal-100"
                />
                
                {uploading && <p className="text-blue-500 text-xs mt-1">Subiendo imagen...</p>}
                
                {editing.imagen && !uploading && (
                    <div className="mt-2 border rounded p-2 text-center bg-gray-50">
                        <p className="text-xs text-gray-400 mb-1">Vista previa:</p>
                        <img 
                            // ✅ CAMBIO CLAVE: USAR URL DE PRODUCCIÓN (https)
                            src={editing.imagen.startsWith('http') 
                                ? editing.imagen 
                                : `https://api.devioz.com${editing.imagen}`} 
                            alt="Preview" 
                            className="h-32 mx-auto object-contain rounded"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Error+Img'; }}
                        />
                        <input type="hidden" value={editing.imagen} />
                    </div>
                )}
            </div>

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
                disabled={uploading}
              >
                {uploading ? "Subiendo..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendedorProductsTable;