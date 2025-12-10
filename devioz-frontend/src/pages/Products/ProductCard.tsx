import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ✅ Definición del tipo Product
export interface Product {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    categoria?: string;
    rating?: number;
    imagen?: string;
}

interface Props {
    product: Product;
    onAddToCart: () => void;
}

// 🚀 CONSTANTE BASE DE IMAGEN
const IMAGE_BASE_URL = "https://api.devioz.com/uploads/";

const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
    // Definimos el fallback usando la imagen que el Backend serviría si no existe
    const [fallback, setFallback] = useState(`${IMAGE_BASE_URL}no-image.png`); 

    // ✅ FUNCIÓN CORREGIDA: Determinar correctamente la ruta de imagen
    const getImageUrl = () => {
        // 1. Si no hay nombre de imagen o es nulo/vacío, usar el fallback
        if (!product.imagen) return fallback; 

        // 2. Si ya es una URL completa (ej: http o https), usarla (por si acaso)
        if (product.imagen.startsWith("http")) return product.imagen;

        // 🚀 CORRECCIÓN CRÍTICA: Construir la URL completa
        // Se asume que product.imagen es solo el nombre del archivo (ej: "2.png")
        return `${IMAGE_BASE_URL}${product.imagen}`;
    };

    const imgSrc = getImageUrl();

    const nombre = product.nombre ?? "Producto sin nombre";
    const categoria = product.categoria ?? "General";
    const precio = product.precio != null ? Number(product.precio) : 0;
    const rating = product.rating != null ? product.rating : 0;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition flex flex-col text-black"
        >
            <Link to={`/producto/${product.id}`}>
                <div className="relative w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer">
                    <img
                        src={imgSrc}
                        alt={nombre}
                        className="w-full h-full object-contain"
                        // El onError ahora usa el fallback, que es una URL completa
                        onError={() => setFallback(`${IMAGE_BASE_URL}no-image.png`)} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
            </Link>

            <div className="p-4 flex flex-col gap-2 text-black flex-1">
                <h3 className="font-semibold text-lg leading-tight line-clamp-2 min-h-[3.5rem]">
                    {nombre}
                </h3>

                <p className="text-sm text-gray-600">{categoria}</p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-teal-600 font-bold text-xl">
                        S/ {precio.toFixed(2)}
                    </span>
                    <span className="text-yellow-500" aria-label={`rating ${rating}`}>
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