import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "./ProductsPage";

interface Props {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
  const [imgSrc, setImgSrc] = useState(product.image);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition"
    >
      <div className="relative">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-56 object-cover"
          onError={() => setImgSrc("/logo-devioz.png")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      <div className="p-4 flex flex-col gap-2 text-gray-900">
        <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-teal-600 font-bold text-xl">${product.price.toFixed(2)}</span>
          <span className="text-yellow-500" aria-label={`rating ${product.rating}`}>
            {"★".repeat(product.rating)}{"☆".repeat(5 - product.rating)}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="mt-2 bg-teal-600 text-white w-full py-2 rounded-xl shadow hover:shadow-lg"
          onClick={onAddToCart}
        >
          Añadir al carrito
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
