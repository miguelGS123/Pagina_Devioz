import React from "react";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Login</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuario"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            className="bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
