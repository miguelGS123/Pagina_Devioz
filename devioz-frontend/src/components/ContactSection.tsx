import React, { useState } from "react";
import Modal from "./Modal"; // ✅ Importar el modal

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    asunto: "",
    correo: "",
    telefono: "", 
    area: "",
    mensaje: ""
  });

  // ✅ Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error"
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const showModal = (title: string, message: string, type: "success" | "error") => {
    setModalData({ title, message, type });
    setModalOpen(true);
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
        // ✅ Mostrar modal de éxito
        showModal(
          "¡Mensaje Enviado!", 
          "Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.", 
          "success"
        );
        setFormData({ asunto: "", correo: "", telefono: "", area: "", mensaje: "" });
      } else {
        // ✅ Mostrar modal de error
        showModal(
          "Error al Enviar", 
          "Hubo un problema al enviar el formulario. Por favor, intenta nuevamente.", 
          "error"
        );
      }
    } catch (error) {
      console.error("Error en fetch:", error);
      // ✅ Mostrar modal de error de conexión
      showModal(
        "Error de Conexión", 
        "No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.", 
        "error"
      );
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

          {/* ... (tus campos del formulario se mantienen igual) ... */}
          
          {/* Asunto */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">Asunto</label>
            <input
              type="text"
              name="asunto"
              value={formData.asunto}
              onChange={handleInputChange}
              placeholder="Asunto"
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black placeholder-gray-400"
              required
              maxLength={30}
            />
          </div>

          {/* Correo */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">Correo del Cliente</label>
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

          {/* Teléfono */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">Teléfono o Celular</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="Ej: +51 987654321"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black placeholder-gray-400"
              required
            />
          </div>

          {/* Área */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">Área de Interés</label>
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
            <label className="block text-gray-700 font-semibold mb-3">Mensaje</label>
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
          <p className="text-gray-600 text-sm">Devíoz © 2025. All Rights Reserved.</p>
        </div>

        {/* ✅ Modal Flotante */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalData.title}
          message={modalData.message}
          type={modalData.type}
        />

      </div>
    </section>
  );
};

export default ContactSection;