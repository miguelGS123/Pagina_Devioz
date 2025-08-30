import React from "react";

const FooterSection2: React.FC = () => {
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
    <section className="py-16 bg-teal-400 text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        {/* Contenedor flex: texto a la izquierda - botón a la derecha */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10">
          
          {/* Bloque de texto */}
          <div className="text-center lg:text-left max-w-4xl">
            {/* Párrafo principal */}
            <p className="text-3xl md:text-4xl leading-snug mb-4">
              <span className="font-extrabold">Devioz</span> Es la solución flexible que necesitas para impulsar tu negocio y maximizar tus resultados.
            </p>

            {/* Segundo párrafo */}
            <p className="text-xl md:text-2xl text-white/90">
              Proporciona una amplia gama de elementos para crear soluciones a medida.
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

export default FooterSection2;