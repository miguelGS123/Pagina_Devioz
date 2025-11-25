import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

// Importaciones
import { Product } from "../Products/ProductCard";
import { CartItem } from "../Products/CartSidebar";
import CartSidebar from "../Products/CartSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardFilters from "./DashboardFilters";
import DashboardProducts from "./DashboardProducts";
import UserProfileModal from "./UserProfileModal";
import HistorialModal from "./HistorialModal"; 
import CheckoutModal from "./CheckoutModal"; // <--- Importación del Modal

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
    const [checkoutOpen, setCheckoutOpen] = useState(false); // <--- NUEVO ESTADO DEL MODAL

    // Filtros
    const [search, setSearch] = useState("");
    const [categoria, setCategoria] = useState("Todos");
    const [orden, setOrden] = useState("relevancia");

    const navigate = useNavigate();

    // Cargar datos iniciales
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!storedUser || !token) {
            navigate("/productos", { replace: true });
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
                    "http://localhost:8008/api/productos"
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

    // --- Checkout / Comprar (MODIFICADA para abrir el modal) ---
    const handleCheckout = () => { 
        if (cartItems.length === 0) {
            Swal.fire("🛒 Tu carrito está vacío", "", "info");
            return;
        }
        setCheckoutOpen(true); // Abrimos el modal de checkout formal
    };
    // El código antiguo de llamadas a axios fue eliminado.

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

            <CartSidebar
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                items={cartItems}
                onQtyChange={handleQtyChange}
                onRemove={(id) =>
                    setCartItems((prev) => prev.filter((i) => i.product.id !== id))
                }
                total={total}
                onCheckout={handleCheckout} // <--- Llama a la función que abre el modal
            />

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
            
            {/* 4. RENDERIZAR EL MODAL DE CHECKOUT */}
            {checkoutOpen && (
                <CheckoutModal
                    isOpen={checkoutOpen}
                    onClose={() => setCheckoutOpen(false)}
                    items={cartItems}
                    setCartItems={setCartItems} // <-- Prop de limpieza (FIXED)
                />
            )}
        </div>
    );
};

export default UserDashboardPage;