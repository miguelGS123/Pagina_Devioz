import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "./ProductsPage";
import { Link } from "react-router-dom";

interface Props {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
  // Usa el campo correcto que viene del backend
  const [imgSrc, setImgSrc] = useState(product.imagen || "/logo-devioz.png");

  // Normaliza los valores para evitar errores en el render
  const nombre = product.nombre ?? "Producto sin nombre";
  const categoria = product.categoria ?? "General";
  const precio = product.precio != null ? Number(product.precio) : 0;
  const rating = product.rating != null ? product.rating : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition flex flex-col"
    >
      {/* Imagen clickeable */}
      <Link to={`/producto/${product.id}`}>
        <div className="relative w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer">
          <img
            src={imgSrc}
            alt={nombre}
            className="w-full h-full object-contain"
            onError={() => setImgSrc("/logo-devioz.png")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </Link>

      {/* Información */}
      <div className="p-4 flex flex-col gap-2 text-gray-900 flex-1">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 min-h-[3.5rem]">
          {nombre}
        </h3>

        <p className="text-sm text-gray-500">{categoria}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-teal-600 font-bold text-xl">
            S/ {precio.toFixed(2)}
          </span>
          <span
            className="text-yellow-500"
            aria-label={`rating ${rating}`}
          >
            {"★".repeat(rating)}{"☆".repeat(5 - rating)}
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
