import React from "react";

const FooterSection: React.FC = () => {
  // Función para hacer scroll suave al formulario de contacto
  const scrollToContact = () => {
    const contactSection = document.getElementById("contacto");
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="bg-teal-400 py-12">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-white">
          {/* Contenedor del texto */}
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-normal mb-2">
              <span className="font-bold">Devioz</span> Innovación tecnológica para un futuro mejor.
            </h2>
            <p className="text-white/90 text-lg max-w-3xl">
              Desarrollamos nuestras aplicaciones web con las últimas investigaciones y mejores prácticas de UX.
            </p>
          </div>

          {/* Botón a la derecha */}
          <div className="flex-shrink-0">
            <button
              onClick={scrollToContact}
              className="bg-white text-teal-400 px-6 py-2 rounded font-semibold text-base hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              SOLICITAR
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;