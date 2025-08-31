import React from "react";

interface ProductsHeaderProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onLoginClick: () => void;
  onCartClick: () => void;
  cartCount: number;
}

const categories = ["Todo", "Teclados", "Mouse", "Monitores", "Escritorios"];

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  onLoginClick,
  onCartClick,
  cartCount,
}) => {
  return (
    <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tienda de Productos</h1>
        <div className="flex gap-4 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded ${
                selectedCategory === cat ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-800"
              } hover:bg-teal-400 transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Botones Login y Carrito */}
      <div className="flex gap-4 relative">
        <button
          onClick={onLoginClick}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Login
        </button>

        <button
          onClick={onCartClick}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors relative"
        >
          Carrito
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductsHeader;
