import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Product } from "./ProductCard";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  total: number;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  open,
  onClose,
  items,
  onQtyChange,
  onRemove,
  total,
  onCheckout,
}) => {
  // 🔹 URL base del backend
  const API_BASE_URL = "http://localhost:8008";

  // 🔹 Función para construir la URL correcta de imagen
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/images/no-image.png"; // imagen de respaldo
    if (imagePath.startsWith("http")) return imagePath; // ya es URL completa
    if (imagePath.startsWith("/")) return `${API_BASE_URL}${imagePath}`;
    return `${API_BASE_URL}/${imagePath}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed right-0 top-0 w-80 sm:w-96 h-full bg-white shadow-xl z-50 flex flex-col"
        >
          {/* 🛒 Cabecera */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              🛒 Tu carrito
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
          </div>

          {/* 🧾 Lista de productos */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">
                No tienes productos en el carrito.
              </p>
            ) : (
              items.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b pb-3 mb-3"
                >
                  <div className="flex items-center gap-3">
                    {/* 🖼️ Imagen del producto */}
                    <img
                      src={getImageUrl(product.imagen)}
                      alt={product.nombre}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/no-image.png";
                      }}
                      className="w-14 h-14 object-cover rounded-md border"
                    />

                    {/* 🏷️ Detalles */}
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {product.nombre}
                      </p>
                      <p className="text-teal-600 font-semibold text-sm">
                        S/ {product.precio.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ➕➖ Controles de cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onQtyChange(product.id, qty - 1)}
                      disabled={qty <= 1}
                      className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="min-w-[20px] text-center">{qty}</span>
                    <button
                      onClick={() => onQtyChange(product.id, qty + 1)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>

                    {/* 🗑️ Eliminar */}
                    <button
                      onClick={() => onRemove(product.id)}
                      className="text-red-500 hover:text-red-600 ml-2"
                      title="Eliminar producto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 💰 Total y botón de compra */}
          <div className="p-4 border-t">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-lg font-bold text-gray-900">
                S/ {total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              Finalizar compra
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
