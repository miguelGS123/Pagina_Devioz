import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import type { CartItem } from "./ProductsPage";

interface Props {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  total: number;
  onCheckout: () => void;
}

const CartSidebar: React.FC<Props> = ({
  open, onClose, items, onQtyChange, onRemove, total, onCheckout
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* panel */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-[360px] max-w-[90vw] bg-white z-50 shadow-2xl flex flex-col"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Tu carrito</h2>
              <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 && <p className="text-gray-500">Aún no agregaste productos.</p>}
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 items-center">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border" />
                  <div className="flex-1 text-gray-900">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                    <div className="mt-2 inline-flex items-center gap-2">
                      <button className="p-1 rounded border" onClick={() => onQtyChange(product.id, qty - 1)}>
                        <Minus size={16} />
                      </button>
                      <span className="min-w-[2ch] text-center text-gray-900">{qty}</span>
                      <button className="p-1 rounded border" onClick={() => onQtyChange(product.id, qty + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => onRemove(product.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t text-gray-900">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-teal-600 text-white py-2 rounded-xl shadow hover:shadow-lg"
              >
                Finalizar compra
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
