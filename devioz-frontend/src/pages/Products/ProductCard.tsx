// ProductCard.tsx
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
      className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition flex flex-col"
    >
      {/* Contenedor imagen (alto fijo, centrado siempre) */}
      <div className="relative w-full h-60 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
          onError={() => setImgSrc("/logo-devioz.png")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Información */}
      <div className="p-4 flex flex-col gap-2 text-gray-900 flex-1">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-teal-600 font-bold text-xl">
            S/ {product.price.toFixed(2)}
          </span>
          <span
            className="text-yellow-500"
            aria-label={`rating ${product.rating}`}
          >
            {"★".repeat(product.rating)}
            {"☆".repeat(5 - product.rating)}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="mt-3 bg-teal-600 text-white w-full py-2 rounded-xl shadow hover:shadow-lg"
          onClick={onAddToCart}
        >
          Añadir al carrito
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
