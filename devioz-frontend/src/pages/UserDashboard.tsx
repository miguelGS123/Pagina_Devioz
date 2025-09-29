import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ProductCard from "../pages/Products/ProductCard";
import { Product } from "../pages/Products/ProductCard";

import CartSidebar from "../pages/Products/CartSidebar";
import { CartItem } from "../pages/Products/CartSidebar";

// Interfaces
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
}

interface Venta {
  id: number;
  producto: Producto;
  cantidad: number;
  fecha: string;
}

const UserDashboardPage: React.FC = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [perfilOpen, setPerfilOpen] = useState(false);
  const [historialOpen, setHistorialOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/productos");
      return;
    }

    const parsedUser: Usuario = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchData = async () => {
      try {
        const userRes = await axios.get(
          `http://localhost:8008/api/usuarios/${parsedUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(userRes.data);

        const productosRes = await axios.get(
          "http://localhost:8008/api/productos",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProductos(productosRes.data);

        const ventasRes = await axios.get(
          "http://localhost:8008/api/ventas/mis-ventas",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVentas(ventasRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    fetchData();
  }, [navigate]);

  // --- Carrito ---
  const handleAddToCart = (producto: Producto) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === producto.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === producto.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { product: producto, qty: 1 }];
    });
  };

  const handleQtyChange = (id: number, qty: number) => {
    if (qty <= 0) {
      handleRemove(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.product.id === id ? { ...item, qty } : item))
    );
  };

  const handleRemove = (id: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
  };

  const handleCheckout = () => {
    alert("✅ Compra realizada!");
    setCartItems([]);
    setTotal(0);
  };

  useEffect(() => {
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.product.precio * item.qty,
      0
    );
    setTotal(totalAmount);
  }, [cartItems]);

  // --- Perfil ---
  const [nombrePerfil, setNombrePerfil] = useState("");
  const [telefonoPerfil, setTelefonoPerfil] = useState("");
  const [emailPerfil, setEmailPerfil] = useState("");
  const [passwordPerfil, setPasswordPerfil] = useState("");

  const openPerfilModal = () => {
    if (user) {
      setNombrePerfil(user.nombre);
      setTelefonoPerfil(user.telefono || "");
      setEmailPerfil(user.email);
      setPasswordPerfil("*****");
    }
    setPerfilOpen(true);
  };

  const handleUpdatePerfil = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!user || !token) return;

      await axios.put(
        `http://localhost:8008/api/usuarios/${user.id}`,
        {
          nombre: nombrePerfil,
          telefono: telefonoPerfil,
          email: emailPerfil,
          ...(passwordPerfil !== "*****" ? { password: passwordPerfil } : {})
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Datos actualizados");
      setUser(prev => prev && { ...prev, nombre: nombrePerfil, telefono: telefonoPerfil, email: emailPerfil });
      setPerfilOpen(false);
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar datos");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ ¿Estás seguro de eliminar tu cuenta?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!user || !token) return;

      await axios.delete(
        `http://localhost:8008/api/usuarios/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Cuenta eliminada");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/productos");
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar la cuenta");
    }
  };

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/productos");
  };

  if (!user) return <p className="p-4 text-center text-black">Cargando usuario...</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Navbar / Barra superior */}
      <header className="bg-gray-800 text-black p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="/logo-devioz.png" alt="Logo" className="h-10" />
        </div>
        <div className="relative">
          <button
            onClick={() => setPerfilOpen(prev => !prev)}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Menú
          </button>
          {perfilOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded z-50">
              <button onClick={openPerfilModal} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Perfil</button>
              <button onClick={() => setCartOpen(true)} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Carrito</button>
              <button onClick={() => setHistorialOpen(prev => !prev)} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Historial</button>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Cerrar sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 gap-6 auto-rows-min">
        {/* Productos */}
        <section className="col-span-full">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {productos.map(producto => (
              <ProductCard
                key={producto.id}
                product={producto}
                onAddToCart={() => handleAddToCart(producto)}
              />
            ))}
          </div>
        </section>

        {/* Historial de compras */}
        {historialOpen && (
          <section className="bg-white p-4 rounded shadow col-span-full">
            <h2 className="font-semibold text-lg mb-4">Historial de Compras</h2>
            {ventas.length === 0 ? (
              <p>No tienes compras aún.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {ventas.map((venta, idx) => (
                  <li key={idx} className="py-2 flex justify-between items-center">
                    <span>{venta.producto.nombre} x {venta.cantidad}</span>
                    <span>{new Date(venta.fecha).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      {/* Sidebar de carrito */}
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onQtyChange={handleQtyChange}
        onRemove={handleRemove}
        total={total}
        onCheckout={handleCheckout}
      />

      {/* Modal Perfil */}
      {perfilOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 text-black relative">
            <h2 className="text-2xl font-bold mb-4">Perfil</h2>
            <label className="block mb-2">Nombre completo</label>
            <input type="text" value={nombrePerfil} onChange={e => setNombrePerfil(e.target.value)} className="w-full border px-3 py-2 rounded mb-3" />
            <label className="block mb-2">Correo electrónico</label>
            <input type="email" value={emailPerfil} onChange={e => setEmailPerfil(e.target.value)} className="w-full border px-3 py-2 rounded mb-3" />
            <label className="block mb-2">Teléfono</label>
            <input type="text" value={telefonoPerfil} onChange={e => setTelefonoPerfil(e.target.value)} className="w-full border px-3 py-2 rounded mb-3" />
            <label className="block mb-2">Contraseña</label>
            <input type="password" value={passwordPerfil} onChange={e => setPasswordPerfil(e.target.value)} className="w-full border px-3 py-2 rounded mb-3" />

            <div className="flex justify-between mt-4">
              <button onClick={handleUpdatePerfil} className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700">Actualizar datos</button>
              <button onClick={handleDeleteAccount} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Eliminar cuenta</button>
            </div>
            <button onClick={() => setPerfilOpen(false)} className="absolute top-2 right-2 text-gray-700 text-xl hover:text-gray-900">✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
