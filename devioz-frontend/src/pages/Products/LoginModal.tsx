import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isRegister
        ? "http://localhost:8008/auth/register"
        : "http://localhost:8008/auth/login";

      const body = isRegister
        ? { email, password, nombre: name, telefono: phone }
        : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const responseText = await res.text();

      if (!res.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `Error ${res.status}`);
        } catch {
          throw new Error(
            responseText || `Error ${res.status}: ${res.statusText}`
          );
        }
      }

      const data = JSON.parse(responseText);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 🔹 Disparar evento para refrescar otros componentes
        window.dispatchEvent(new Event("storage"));

        alert(isRegister ? "✅ Registro exitoso" : "✅ Login exitoso");

        onClose();

        // 🔹 Redirigir siempre al perfil de usuario
        navigate("/productos");
      } else {
        throw new Error("No se recibió token en la respuesta");
      }
    } catch (err: any) {
      console.error("Error completo:", err);
      setError(err.message || "Error en el proceso");
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

        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          {isRegister ? "Crear cuenta" : "Iniciar Sesión"}
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Nombres completos"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
                required
              />
              <input
                type="tel"
                placeholder="Número de teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
            required
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Procesando..."
              : isRegister
              ? "Registrarse"
              : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-teal-600 hover:underline"
            >
              {isRegister ? "Inicia sesión" : "Regístrate aquí"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
