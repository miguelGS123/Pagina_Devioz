import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductsHeader from "./ProductsHeader";
import ProductsGrid from "./ProductsGrid";
import CartSidebar from "./CartSidebar";

// Tipos que coinciden con tu backend
export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  categoria: string;
  rating?: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Todos");
  const [sort, setSort] = useState<string>("relevance");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Redirección automática si ya hay sesión iniciada
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;

    if (token && user) {
      switch (user.rol) {
        case "ROL_ADMIN":
          navigate("/admin", { replace: true });
          break;
        case "ROL_VENDEDOR":
          navigate("/vendedor", { replace: true });
          break;
        default:
          navigate("/usuario", { replace: true });
          break;
      }
    }
  }, [navigate]);

  // ✅ Llamada a la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✅ ÚNICO CAMBIO: URL DE PRODUCCIÓN
        // Antes: http://localhost:8008/api/productos
        // Ahora: https://api.devioz.com/api/productos
        const res = await fetch("https://api.devioz.com/api/productos");
        
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filtros
  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase())
    );

    if (category !== "Todos") {
      list = list.filter((p) => p.categoria === category);
    }

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.precio - b.precio);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.precio - a.precio);
        break;
      default:
        break; // relevance = sin ordenar
    }
    return list;
  }, [search, category, sort, products]);

  // ✅ Agregar al carrito
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((ci) => ci.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const changeQty = (id: number, qty: number) => {
    setCart((prev) =>
      prev
        .map((ci) => (ci.product.id === id ? { ...ci, qty: Math.max(1, qty) } : ci))
        .filter((ci) => ci.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((ci) => ci.product.id !== id));
  };

  const total = cart.reduce((acc, it) => acc + it.product.precio * it.qty, 0);

  if (loading) return <p className="text-center mt-10">Cargando productos...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductsHeader
        itemsCount={cart.reduce((a, b) => a + b.qty, 0)}
        onCartClick={() => setCartOpen(true)}
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <ProductsGrid products={filtered} onAddToCart={addToCart} />
      </div>

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onQtyChange={changeQty}
        onRemove={removeItem}
        total={total}
        onCheckout={() => alert("proximamente")}
      />
    </div>
  );
};

export default ProductsPage;