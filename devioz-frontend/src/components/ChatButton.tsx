import React, { useState } from "react";
import { MessageCircle } from "lucide-react"; // ícono de chat

const ChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante en el lado derecho, centrado */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed top-1/2 right-6 transform -translate-y-1/2
          p-3 rounded-full 
          bg-teal-500 text-white 
          shadow-lg hover:bg-teal-600 
          transition-all duration-300 
          z-50
        "
      >
        <MessageCircle size={24} />
      </button>

      {/* Mini chat desplegable */}
      {isOpen && (
        <div
          className="
            fixed top-1/2 right-20 transform -translate-y-1/2
            w-72 h-96
            bg-white rounded-2xl shadow-xl border 
            flex flex-col
            z-50
          "
        >
          <div className="p-3 bg-teal-500 text-white font-semibold rounded-t-2xl">
            Chat Devioz
          </div>
          <div className="flex-1 p-3 overflow-y-auto text-sm">
            <p className="text-gray-500 italic">
              Aquí se mostrará el chatbot próximamente...
            </p>
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 px-2 py-1 border rounded-lg text-sm text-black placeholder-gray-400"
            />
            <button className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600">
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
