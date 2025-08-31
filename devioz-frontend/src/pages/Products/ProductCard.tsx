import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
        <p className="text-gray-700 font-semibold">${product.price}</p>
        <button
          onClick={onAddToCart}
          className="mt-2 w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
