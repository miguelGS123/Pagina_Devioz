import React from "react";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        <input type="text" placeholder="Usuario" className="w-full mb-2 p-2 border rounded"/>
        <input type="password" placeholder="Contraseña" className="w-full mb-4 p-2 border rounded"/>
        <button className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors">Entrar</button>
        <button onClick={onClose} className="mt-4 w-full py-2 border rounded hover:bg-gray-100">Cancelar</button>
      </div>
    </div>
  );
};

export default LoginModal;
