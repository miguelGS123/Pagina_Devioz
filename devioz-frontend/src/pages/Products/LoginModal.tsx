import React, { useState } from "react";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Enviando login...");
      
      const res = await fetch("http://localhost:8008/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      console.log("Response status:", res.status);
      
      // Obtener la respuesta como texto primero para debuggear
      const responseText = await res.text();
      console.log("Raw response:", responseText);

      if (!res.ok) {
        // Intentar parsear como JSON, sino usar el texto plano
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `Error ${res.status}`);
        } catch {
          throw new Error(responseText || `Error ${res.status}: ${res.statusText}`);
        }
      }

      // Parsear la respuesta exitosa como JSON
      const data = JSON.parse(responseText);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("✅ Login exitoso");
        onClose();
        window.location.reload();
      } else {
        throw new Error("No se recibió token en la respuesta");
      }
      
    } catch (err: any) {
      console.error("Error completo:", err);
      setError(err.message || "Error en el proceso de login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 text-xl hover:text-gray-900"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Iniciar Sesión</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              <strong>Error 403:</strong> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿Problemas para iniciar sesión? Verifica:
          </p>
          <ul className="text-xs text-gray-500 mt-2">
            <li>• El backend está ejecutándose en puerto 8008</li>
            <li>• Las credenciales son correctas</li>
            <li>• La configuración CORS está correcta</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;