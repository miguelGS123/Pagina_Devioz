import React, { useState } from "react";
import ProductsHeader from "./ProductsHeader";
import ProductsGrid from "./ProductsGrid";
import CartSidebar from "./CartSidebar";
import LoginModal from "./LoginModal";

const ProductsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con título, categorías y botones */}
      <ProductsHeader
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onLoginClick={() => setIsLoginOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Grid de productos filtrado por categoría */}
      <ProductsGrid selectedCategory={selectedCategory} />

      {/* Modales flotantes */}
      {isCartOpen && <CartSidebar onClose={() => setIsCartOpen(false)} />}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
};

export default ProductsPage;
