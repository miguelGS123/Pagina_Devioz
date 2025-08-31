import React, { useState } from "react";
import ProductsHeader from "./ProductsHeader";
import ProductsGrid from "./ProductsGrid";
import CartSidebar from "./CartSidebar";
import LoginModal from "./LoginModal";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const allProducts: Product[] = [
  { id: 1, name: "Teclado Mecánico", price: 120, category: "Teclados", image: "/productos/teclado01.png" },
  // Puedes agregar más productos aquí
];

interface CartItem extends Product {
  quantity: number;
}

const ProductsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Agregar al carrito
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Aumentar cantidad
  const increaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Disminuir cantidad
  const decreaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Total de productos para el contador
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductsHeader
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onLoginClick={() => setIsLoginOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        cartCount={totalItems} // contador en el icono
      />

      <ProductsGrid
        selectedCategory={selectedCategory}
        products={allProducts}
        onAddToCart={addToCart}
      />

      {isCartOpen && (
        <CartSidebar
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
        />
      )}

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
};

export default ProductsPage;
