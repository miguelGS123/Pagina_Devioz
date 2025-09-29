// src/pages/Products/ProductDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar el producto desde el backend
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8008/api/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el producto");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Cargando producto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Producto no encontrado 🚨</p>
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
            src={product.imagen ? `/${product.imagen}` : "/placeholder.png"}
            alt={product.nombre}
            className="object-contain w-full h-full"
          />
        </div>

        {/* Información */}
        <div className="flex flex-col justify-between text-gray-900">
          <div>
            <h1 className="text-2xl font-bold mb-4">{product.nombre}</h1>
            <p className="text-lg text-gray-700 mb-6">{product.descripcion}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-teal-600 font-bold text-3xl">
                S/ {product.precio.toFixed(2)}
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
