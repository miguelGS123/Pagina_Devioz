import React, { useMemo, useState } from "react";
import ProductsHeader from "./ProductsHeader";
import ProductsGrid from "./ProductsGrid";
import CartSidebar from "./CartSidebar";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Teclados" | "Mouse" | "Monitores" | "Laptops" | "Case" | "Otros";
  rating: number; // 1..5
  image: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

// Datos de prueba (usa tus imágenes en /public/productos)
const PRODUCTS: Product[] = [
  {
    id: "t1",
    name: "Teclado Gamer Teros TE-GK650, Español, Multimedia, retro-iluminado, Negro, USB.",
    price: 58,
    category: "Teclados",
    rating: 4,
    image: "/productos/teclado01.png"
  },
  {
    id: "t2",
    name: "Teclado de membrana GAMER K500F HP",
    price: 69.9,
    category: "Teclados",
    rating: 5,
    image: "/productos/teclado02.png"
  },
  {
    id: "t3",
    name: "MINI TECLADO GAMER DE 1 MANO / CABLE 1.6 METROS / 35 TECLAS / A PRUEBA DE AGUA | YUS",
    price: 79,
    category: "Teclados",
    rating: 4,
    image: "/productos/teclado03.png"
  },
];

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Todos");
  const [sort, setSort] = useState<string>("relevance");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== "Todos") {
      list = list.filter(p => p.category === (category as Product["category"]));
    }

    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      default: break; // relevance = sin ordenar
    }
    return list;
  }, [search, category, sort]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(ci => ci.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { product, qty: 1 }];
    });
    // ❌ Ya no abrimos el carrito automáticamente
  };

  const changeQty = (id: string, qty: number) => {
    setCart(prev =>
      prev
        .map(ci => (ci.product.id === id ? { ...ci, qty: Math.max(1, qty) } : ci))
        .filter(ci => ci.qty > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(ci => ci.product.id !== id));
  };

  const total = cart.reduce((acc, it) => acc + it.product.price * it.qty, 0);

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
        onCheckout={() => alert("Checkout demo 🚀")}
      />
    </div>
  );
};

export default ProductsPage;
