import React, { useState, useMemo } from "react";
import api from "../../api/axiosConfig"; // <-- Tu config de Axios
import Swal, { SweetAlertResult } from "sweetalert2";

interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: string;
  password?: string;
}

interface Props {
  usuarios: Usuario[];
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
  currentAdminId?: number;
}

const AdminUsersTable: React.FC<Props> = ({ usuarios, setUsuarios, currentAdminId }) => {
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  const { vendedores, clientes } = useMemo(() => {
    const otrosUsuarios = usuarios.filter(u => u.id !== currentAdminId);
    return {
      vendedores: otrosUsuarios.filter(u => u.rol === 'ROL_VENDEDOR'),
      clientes: otrosUsuarios.filter(u => u.rol === 'ROL_USUARIO')
    };
  }, [usuarios, currentAdminId]);

  const [search, setSearch] = useState("");
  const clientesFiltrados = useMemo(() => {
    return clientes.filter(c => 
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [clientes, search]);

  // --- LÓGICA DE GUARDADO ---
  const handleSave = async (user: Usuario) => {
    try {
      if (!user.nombre || !user.email) {
        Swal.fire("⚠️ Campos inválidos", "Nombre y Email son requeridos.", "warning");
        return;
      }
      if (!user.id && !user.password) {
        Swal.fire("⚠️ Contraseña requerida", "La contraseña es requerida para usuarios nuevos.", "warning");
        return;
      }

      setLoading(true);
      const payload = { ...user };
      if (!payload.password) delete payload.password;

      if (user.id) {
        // --- 👇 CORRECCIÓN AQUÍ (quitado /api) ---
        const response = await api.put(`/usuarios/${user.id}`, payload);
        setUsuarios((prev) =>
          prev.map((u) => (u.id === user.id ? response.data : u))
        );
        Swal.fire("✅ Vendedor Actualizado", "", "success");
      } else {
        // --- 👇 CORRECCIÓN AQUÍ (quitado /api) ---
        const response = await api.post("/usuarios", { ...payload, rol: "ROL_VENDEDOR" });
        setUsuarios((prev) => [...prev, response.data]);
        Swal.fire("✅ Vendedor Creado", "", "success");
      }
      setEditing(null);
    } catch (error: any) {
      console.error("❌ Error al guardar:", error);
      Swal.fire("Error", "No se pudo guardar el usuario.", "error");
    } finally {
      setLoading(false);
    }
  };
  
  // --- LÓGICA DE ELIMINAR ---
  const handleDeleteVendedor = async (id: number) => {
    const confirm: SweetAlertResult = await Swal.fire({
      title: "¿Eliminar Vendedor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      // --- 👇 CORRECCIÓN AQUÍ (quitado /api) ---
      await api.delete(`/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      Swal.fire("Eliminado", "El vendedor fue eliminado.", "success");
    } catch (error: any) {
      console.error("❌ Error al eliminar:", error);
      Swal.fire("Error", "No se pudo eliminar el vendedor.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNewVendedor = () => {
    setEditing({
      nombre: "",
      email: "",
      telefono: "",
      rol: "ROL_VENDEDOR",
      password: ""
    });
  };

  const handleEditVendedor = (user: Usuario) => {
    setEditing({ ...user, password: "" }); 
  };

  return (
    <>
      {/* --- TABLA DE VENDEDORES (ARRIBA) --- */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 relative mb-6">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
            <div className="text-gray-700 font-semibold animate-pulse">
              Procesando...
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-teal-600">
            Gestión de Vendedores ({vendedores.length})
          </h2>
          <button
            onClick={handleNewVendedor}
            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg shadow transition"
          >
            + Nuevo Vendedor
          </button>
        </div>

        <table className="min-w-full text-sm text-gray-700 border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Nombre</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-2 font-medium">{u.nombre}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.telefono || "—"}</td>
                <td className="p-2 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleEditVendedor(u)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteVendedor(u.id!)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- TABLA DE USUARIOS (ABAJO) --- */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-teal-600">
            Lista de Clientes ({clientesFiltrados.length})
          </h2>
          <input
            type="text"
            placeholder="Buscar cliente por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>

        <table className="min-w-full text-sm text-gray-700 border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Nombre</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No se encontraron clientes.
                </td>
              </tr>
            )}
            {clientesFiltrados.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-2 font-medium">{u.nombre}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.telefono || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* --- MODAL DE EDICIÓN/CREACIÓN (SOLO PARA VENDEDORES) --- */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-teal-600">
              {editing.id ? "Editar Usuario" : "Nuevo Vendedor"}
            </h3>

            <input
              type="text" placeholder="Nombre" value={editing.nombre}
              onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="email" placeholder="Email" value={editing.email}
              onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text" placeholder="Teléfono (Opcional)" value={editing.telefono || ''}
              onChange={(e) => setEditing({ ...editing, telefono: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="password" placeholder={editing.id ? "Dejar en blanco para no cambiar" : "Contraseña"}
              value={editing.password || ''}
              onChange={(e) => setEditing({ ...editing, password: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:ring-2 focus:ring-teal-500"
            />

            {/* Si estás editando, permite cambiar entre Vendedor y Usuario */}
            {editing.id && (
              <select
                value={editing.rol}
                onChange={(e) => setEditing({ ...editing, rol: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 mb-4 rounded focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="ROL_VENDEDOR">VENDEDOR</option>
                <option value="ROL_USUARIO">USUARIO</option>
              </select>
            )}

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
    </>
  );
};

export default AdminUsersTable;