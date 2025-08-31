import React from "react";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900">{name}</h2>
        <p className="text-gray-700 font-semibold">${price}</p>
        <button className="mt-2 w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
