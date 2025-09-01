import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, User } from "lucide-react";
import LoginModal from "./LoginModal";

interface Props {
  itemsCount: number;
  onCartClick: () => void;

  search: string;
  onSearchChange: (v: string) => void;

  category: string;
  onCategoryChange: (v: string) => void;

  sort: string;
  onSortChange: (v: string) => void;
}

const ProductsHeader: React.FC<Props> = ({
  itemsCount, onCartClick,
  search, onSearchChange,
  category, onCategoryChange,
  sort, onSortChange
}) => {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="bg-white border-b text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-gray-900"
        >
          Productos Devíoz
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full md:w-64 rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-teal-600"
          />

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-xl border px-3 py-2"
          >
            <option>Todos</option>
            <option>Laptops</option>
            <option>Periféricos</option>
            <option>Accesorios</option>
            <option>Monitores</option>
          </select>

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border px-3 py-2"
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
            <option value="rating">Mejor valorados</option>
          </select>

          {/* Botón Login */}
          <button
            onClick={() => setLoginOpen(true)}
            className="inline-flex items-center gap-2 bg-gray-200 text-gray-900 px-4 py-2 rounded-xl shadow hover:bg-gray-300 transition"
          >
            <User size={18} />
            Login
          </button>

          {/* Botón Carrito */}
          <button
            onClick={onCartClick}
            className="relative inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <ShoppingCart size={20} />
            Carrito
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-teal-600 text-xs font-bold px-2 py-0.5 rounded-full shadow">
                {itemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  );
};

export default ProductsHeader;
