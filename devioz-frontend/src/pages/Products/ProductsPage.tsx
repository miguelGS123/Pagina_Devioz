import React, { useState } from "react";
import ProductsGrid from "./ProductsGrid";
import LoginModal from "./LoginModal";
import CartSidebar from "./CartSidebar";

const ProductsPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header propio del módulo */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tienda de Productos</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowLogin(true)}
            className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => setShowCart(true)}
            className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
          >
            Carrito
          </button>
        </div>
      </header>

      {/* Grid de productos */}
      <ProductsGrid />

      {/* Modales */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showCart && <CartSidebar onClose={() => setShowCart(false)} />}
    </div>
  );
};

export default ProductsPage;
