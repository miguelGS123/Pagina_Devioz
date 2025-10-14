import React from "react";
import ProductCard from "../Products/ProductCard";
import type { Product } from "../Products/ProductCard";

interface DashboardProductsProps {
  productos: Product[];
  onAddToCart: (producto: Product) => void;
}

const DashboardProducts: React.FC<DashboardProductsProps> = ({
  productos,
  onAddToCart,
}) => {
  if (!productos || productos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-10 text-center text-gray-600">
        No hay productos disponibles actualmente.
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 gap-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        {productos.map((producto) => (
          <ProductCard
            key={producto.id}
            product={producto}
            onAddToCart={() => onAddToCart(producto)}
          />
        ))}
      </div>
    </main>
  );
};

export default DashboardProducts;
