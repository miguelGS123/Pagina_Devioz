import React from "react";
import ProductCard from "./ProductCard";

const products = [
  { id: 1, name: "Laptop Gamer", price: 2500, image: "/laptop1.jpg" },
  { id: 2, name: "Auriculares Bluetooth", price: 150, image: "/headphones.jpg" },
  { id: 3, name: "Smartphone Pro", price: 1200, image: "/smartphone.jpg" },
];

const ProductsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
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
