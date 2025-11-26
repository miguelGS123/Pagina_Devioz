import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

// Importaciones (Asegúrate que estas rutas sean correctas en tu proyecto)
import { Product } from "../Products/ProductCard";
import { CartItem } from "../Products/CartSidebar";
import CartSidebar from "../Products/CartSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardFilters from "./DashboardFilters";
import DashboardProducts from "./DashboardProducts";
import UserProfileModal from "./UserProfileModal";
import HistorialModal from "./HistorialModal"; 

interface Usuario {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    rol: string;
}

interface Venta {
    id: number;
    producto: Product;
    cantidad: number;
    fecha: string;
    estado: string; // Agregado para ver el estado en el historial si lo necesitas
}

const UserDashboardPage: React.FC = () => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [productos, setProductos] = useState<Product[]>([]);
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);

    const [cartOpen, setCartOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [perfilOpen, setPerfilOpen] = useState(false);
    const [historialOpen, setHistorialOpen] = useState(false);

    // Filtros
    const [search, setSearch] = useState("");
    const [categoria, setCategoria] = useState("Todos");
    const [orden, setOrden] = useState("relevancia");

    const navigate = useNavigate();

    // 📌 FUNCIÓN REUTILIZABLE PARA CARGAR DATOS
    const fetchData = async (parsedUser: Usuario, token: string) => {
        try {
            // Cargar usuario actualizado
            const userRes = await axios.get(
                `http://localhost:8008/api/usuarios/${parsedUser.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(userRes.data);

            // Cargar productos
            const productosRes = await axios.get(
                "http://localhost:8008/api/productos"
            );
            setProductos(productosRes.data);

            // Cargar historial de ventas
            const ventasRes = await axios.get(
                "http://localhost:8008/api/ventas/mis-ventas",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVentas(ventasRes.data);
        } catch (err) {
            console.error("Error al cargar datos:", err);
        }
    };
    
    // Cargar datos iniciales al montar
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (!storedUser || !token) {
            navigate("/productos", { replace: true });
            return;
        }

        const parsedUser: Usuario = JSON.parse(storedUser);
        setUser(parsedUser);
        
        fetchData(parsedUser, token);
        
    }, [navigate]);

    // --- Carrito ---
    const handleAddToCart = (producto: Product) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.product.id === producto.id);
            return existing
                ? prev.map((i) =>
                    i.product.id === producto.id ? { ...i, qty: i.qty + 1 } : i
                )
                : [...prev, { product: producto, qty: 1 }];
        });
    };

    const handleQtyChange = (id: number, qty: number) =>
        setCartItems((prev) =>
            qty <= 0
                ? prev.filter((i) => i.product.id !== id)
                : prev.map((i) => (i.product.id === id ? { ...i, qty } : i))
        );

    // --- 🛒 CHECKOUT / COMPRAR (LÓGICA ACTUALIZADA) ---
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            await Swal.fire("🛒 Tu carrito está vacío", "", "info");
            return;
        }
        
        const confirmacion = await Swal.fire({
            title: "¿Confirmar compra?",
            text: "¿Deseas continuar con el pago de tus productos?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0d9488",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, comprar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            if (!token || !user) {
                await Swal.fire("⚠️ Debes iniciar sesión", "", "warning");
                return;
            }
            
            // 🔄 Procesar cada ítem del carrito
            for (const item of cartItems) {
                
                // Preparar el cuerpo JSON que exige el Backend (VentaRequestDTO)
                const payload = {
                    productoId: item.product.id,
                    cantidad: item.qty,
                    total: item.product.precio * item.qty, // Calculamos el total por ítem
                    // Enviamos "A coordinar" porque el backend lo exige @NotBlank, 
                    // pero la dirección real se define cuando el vendedor llama.
                    direccionEnvio: "A coordinar con vendedor", 
                    // Enviamos el teléfono del usuario o un texto por defecto si no tiene
                    telefonoCliente: user.telefono || "No registrado en perfil"
                };

                // 👇 LLAMADA AL NUEVO ENDPOINT
                await axios.post(
                    "http://localhost:8008/api/ventas/checkout", 
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            
            // ✅ MENSAJE ACTUALIZADO SOLICITADO
            await Swal.fire(
                "✅ ¡Pedido realizado!",
                "Uno de nuestros vendedores se comunicará contigo para agendar el envío del pedido.",
                "success"
            );
            
            // Limpiar carrito y actualizar datos
            setCartItems([]);
            setTotal(0);
            setCartOpen(false);
            
            // Recargar historial para ver la nueva compra
            await fetchData(user, token); 
            
        } catch (error: any) {
            console.error("❌ Error al procesar la compra:", error);
            const msg = error.response?.data || "Error inesperado. Por favor, intenta nuevamente.";
            await Swal.fire("❌ Error", msg, "error");
        }
    };

    // --- Calcular total ---
    useEffect(() => {
        const nuevoTotal = cartItems.reduce((acumulador, item) => {
            return acumulador + (item.product.precio * item.qty);
        }, 0);
        setTotal(nuevoTotal);
    }, [cartItems]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/productos", { replace: true });
    };

    // Filtros de productos
    const filtered = useMemo(() => {
        let list = productos.filter((p) =>
            p.nombre.toLowerCase().includes(search.toLowerCase())
        );
        if (categoria !== "Todos")
            list = list.filter((p) => p.categoria === categoria);
        
        if (orden === "precio-asc") list.sort((a, b) => a.precio - b.precio);
        if (orden === "precio-desc") list.sort((a, b) => b.precio - a.precio);
        return list;
    }, [productos, search, categoria, orden]);

    if (!user) return <p className="text-center mt-8">Cargando...</p>;

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header */}
            <DashboardHeader
                user={user}
                cartItems={cartItems}
                onCartClick={() => setCartOpen(true)}
                onPerfilClick={() => setPerfilOpen(true)}
                onHistorialClick={() => setHistorialOpen(true)}
                onLogout={handleLogout}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />

            {/* Contenido Principal (Productos y Filtros) */}
            <motion.div
                key="productos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <DashboardFilters
                    search={search}
                    categoria={categoria}
                    orden={orden}
                    setSearch={setSearch}
                    setCategoria={setCategoria}
                    setOrden={setOrden}
                />
                <DashboardProducts productos={filtered} onAddToCart={handleAddToCart} />
            </motion.div>

            {/* Sidebar del Carrito */}
            <CartSidebar
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                items={cartItems}
                onQtyChange={handleQtyChange}
                onRemove={(id) =>
                    setCartItems((prev) => prev.filter((i) => i.product.id !== id))
                }
                total={total}
                onCheckout={handleCheckout}
            />

            {/* Modales */}
            {perfilOpen && (
                <UserProfileModal
                    user={user}
                    setUser={setUser}
                    onClose={() => setPerfilOpen(false)}
                />
            )}

            {historialOpen && (
                <HistorialModal
                    ventas={ventas}
                    onClose={() => setHistorialOpen(false)}
                />
            )}
        </div>
    );
};

export default UserDashboardPage;