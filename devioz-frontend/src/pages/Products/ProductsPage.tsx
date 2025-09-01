import React, { useMemo, useState } from "react";
import ProductsHeader from "./ProductsHeader";
import ProductsGrid from "./ProductsGrid";
import CartSidebar from "./CartSidebar";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Laptops" | "Periféricos" | "Accesorios" | "Monitores";
  rating: number; // 1..5
  image: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

// Datos demo (usa tus imágenes del folder /public)
const PRODUCTS: Product[] = [
  { id: "p1", name: "Laptop Devioz Pro 14”", price: 2999, category: "Laptops", rating: 5, image: "/imagen-laptop.png" },
  { id: "p2", name: "Mouse Inalámbrico", price: 89, category: "Periféricos", rating: 4, image: "/imagen-laptop.png" },
  { id: "p3", name: "Teclado Mecánico RGB", price: 199, category: "Periféricos", rating: 5, image: "/imagen-laptop.png" },
  { id: "p4", name: "Monitor 27” 144Hz", price: 1199, category: "Monitores", rating: 4, image: "/imagen-laptop.png" },
  { id: "p5", name: "Base Refrigerante", price: 129, category: "Accesorios", rating: 4, image: "/imagen-laptop.png" },
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
    if (category !== "Todos") list = list.filter(p => p.category === (category as Product["category"]));

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
    // ❌ Se eliminó setCartOpen(true)
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
