import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

const ChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://localhost:8008/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      // Agregar respuesta del bot
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error al conectar con el servidor 😓" }]);
    }

    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 right-6 transform -translate-y-1/2 p-3 rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 transition-all duration-300 z-50"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed top-1/2 right-20 transform -translate-y-1/2 w-80 h-96 bg-white rounded-2xl shadow-xl border flex flex-col z-50">
          {/* Header */}
          <div className="p-3 bg-teal-500 text-white font-semibold rounded-t-2xl">
            Chat Devioz
          </div>
          
          {/* Mensajes - Área de chat */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                ¡Hola! Soy el asistente de Devioz. ¿En qué puedo ayudarte?
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender === "user" 
                      ? "bg-teal-500 text-white ml-auto" 
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <div className="text-sm">{msg.text}</div>
                </div>
              ))
            )}
          </div>
          
          {/* Input y botón de enviar */}
          <div className="p-3 border-t bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder-gray-500 focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;