import React from "react";

interface CartSidebarProps {
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ onClose }) => {
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Carrito</h2>
        <button onClick={onClose} className="text-gray-700 text-xl">✕</button>
      </div>
      <p className="text-gray-700">Aquí aparecerán los productos agregados.</p>
    </div>
  );
};

export default CartSidebar;
