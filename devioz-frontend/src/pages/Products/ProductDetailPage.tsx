import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Usamos la URL completa aquí por seguridad, o tu instancia 'api'
        const response = await axios.get(`http://localhost:8008/api/productos/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // --- 👇 FUNCIÓN PARA ARREGLAR LA URL DE LA IMAGEN ---
  const getImageUrl = (img: string) => {
    if (!img) return "https://via.placeholder.com/400"; // Imagen por defecto si no hay
    if (img.startsWith("http")) return img; // Si ya es una URL completa (ej. internet), la deja igual
    return `http://localhost:8008${img}`; // Si es local, le pega tu backend
  };
  // --- 👆 ------------------------------------------

  if (loading) return <div className="text-center p-10">Cargando...</div>;
  if (!product) return <div className="text-center p-10">Producto no encontrado</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-teal-600 hover:underline flex items-center gap-1"
      >
        ← Volver
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Sección de la Imagen */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
          <img
            // --- 👇 USAMOS LA FUNCIÓN AQUÍ ---
            src={getImageUrl(product.imagen)}
            alt={product.nombre}
            className="max-h-96 object-contain rounded-lg"
            onError={(e) => {
              // Fallback si la imagen falla al cargar
              e.currentTarget.src = "https://via.placeholder.com/400?text=Sin+Imagen";
            }}
          />
        </div>

        {/* Sección de Información */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.nombre}
            </h1>
            <span className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {product.categoria}
            </span>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {product.descripcion}
            </p>
            
            <div className="text-4xl font-bold text-teal-600 mb-2">
              S/ {product.precio.toFixed(2)}
            </div>
            <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"} font-medium`}>
              {product.stock > 0 ? `Stock disponible: ${product.stock}` : "Agotado"}
            </p>
          </div>

          <div className="mt-8">
            <button
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-colors ${
                product.stock > 0
                  ? "bg-teal-600 hover:bg-teal-700 shadow-md"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={product.stock === 0}
              onClick={() => alert("¡Añadido al carrito! (Lógica pendiente)")}
            >
              {product.stock > 0 ? "Añadir al carrito" : "Sin Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;