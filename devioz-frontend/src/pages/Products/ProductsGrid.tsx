import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductsGridProps {
  selectedCategory: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ selectedCategory, products, onAddToCart }) => {
  const filteredProducts =
    selectedCategory === "Todo"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
