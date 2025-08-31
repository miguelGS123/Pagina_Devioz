import React from "react";
import ProductCard from "./ProductCard";

interface ProductsGridProps {
  selectedCategory: string;
}

const allProducts = [
  { id: 1, name: "Teclado Mecánico", price: 120, category: "Teclados", image: "/productos/teclado01.png" },
  // Más productos aquí, por ejemplo:
  // { id: 2, name: "Mouse Gamer", price: 60, category: "Mouse", image: "/productos/mouse01.png" },
];

const ProductsGrid: React.FC<ProductsGridProps> = ({ selectedCategory }) => {
  const filteredProducts =
    selectedCategory === "Todo"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
