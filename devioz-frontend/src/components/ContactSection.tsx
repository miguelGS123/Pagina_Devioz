import React, { useState } from "react";

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    asunto: "",
    correo: "",
    area: "",
    mensaje: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8008/api/formulario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Mensaje enviado correctamente ✅");
        setFormData({ asunto: "", correo: "", area: "", mensaje: "" });
      } else {
        alert("Error al enviar el formulario ❌");
      }
    } catch (error) {
      console.error("Error en fetch:", error);
      alert("No se pudo conectar con el servidor ❌");
    }
  };

  return (
    <section id="contacto" className="py-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Contáctanos
          </h2>
          <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
          
          {/* Asunto */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              Asunto
            </label>
            <input
              type="text"
              name="asunto"
              value={formData.asunto}
              onChange={handleInputChange}
              placeholder="Asunto"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black placeholder-gray-400"
              required
              maxLength={30}
            />
          </div>

          {/* Correo */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              Correo del Cliente
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black placeholder-gray-400"
              required
            />
          </div>

          {/* Área */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              Área de Interés
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-teal-500 bg-white text-black"
              required
            >
              <option value="">– Seleccione –</option>
              <option value="Desarrollo Web">Desarrollo Web</option>
              <option value="Desarrollo App">Desarrollo App</option>
              <option value="DevOps">DevOps</option>
              <option value="AWS">AWS</option>
              <option value="Data">Data</option>
            </select>
          </div>

          {/* Mensaje */}
          <div className="mb-8">
            <label className="block text-gray-700 font-semibold mb-3">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleInputChange}
              placeholder="Escribe tu mensaje aquí..."
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-teal-500 resize-none text-black placeholder-gray-400"
              required
            />
          </div>

          {/* Botón */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors duration-300 shadow-md"
            >
              Enviar
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            Devíoz © 2025. All Rights Reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
