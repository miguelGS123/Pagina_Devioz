import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "./ProductsPage";

// 🔹 Reutilizamos los mismos productos de prueba
const PRODUCTS: Product[] = [
  {
    id: "t1",
    name: "Teclado Gamer Teros TE-GK650, Español, Multimedia, retro-iluminado, Negro, USB.",
    price: 58,
    category: "Teclados",
    rating: 4,
    image: "/productos/teclado01.png",
  },
  {
    id: "t2",
    name: "Teclado de membrana GAMER K500F HP",
    price: 69.9,
    category: "Teclados",
    rating: 5,
    image: "/productos/teclado02.png",
  },
  {
    id: "t3",
    name: "MINI TECLADO GAMER DE 1 MANO / CABLE 1.6 METROS / 35 TECLAS / A PRUEBA DE AGUA | YUS",
    price: 79,
    category: "Teclados",
    rating: 4,
    image: "/productos/teclado03.png",
  },
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-900">
        <p>Producto no encontrado 🚨</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-teal-600 hover:underline"
      >
        ← Volver
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-2xl shadow-md">
        {/* Imagen */}
        <div className="flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden h-[400px]">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain w-full h-full"
          />
        </div>

        {/* Información */}
        <div className="flex flex-col justify-between text-gray-900">
          <div>
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg text-gray-700 mb-6">
              Aquí puedes añadir una descripción detallada del producto, sus
              características, compatibilidad y beneficios. 📝
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-teal-600 font-bold text-3xl">
                S/ {product.price.toFixed(2)}
              </span>
              <span className="text-yellow-500 text-lg">
                {"★".repeat(product.rating)}{"☆".repeat(5 - product.rating)}
              </span>
            </div>
          </div>

          <button
            className="bg-teal-600 text-white py-3 rounded-xl shadow hover:shadow-lg hover:bg-teal-700 transition"
            onClick={() => alert("Añadido al carrito 🚀")}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
