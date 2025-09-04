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
      const res = await fetch("http://localhost:8080/api/chat", {
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
          <div className="p-3 bg-teal-500 text-white font-semibold rounded-t-2xl">Chat Devioz</div>
          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[70%] ${
                  msg.sender === "user" ? "bg-teal-100 ml-auto" : "bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-2 py-1 border rounded-lg text-sm text-black placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
