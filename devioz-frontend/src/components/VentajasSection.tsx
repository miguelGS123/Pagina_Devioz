import React from "react";

const VentajasSection: React.FC = () => {
  const ventajas = [
    {
      titulo: "Acelera tu desarrollo",
      descripcion: "Acelere el desarrollo de su proyecto en 2 o incluso 3 veces usando esta plantilla.",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      titulo: "Reduzca su control de calidad",
      descripcion: "Gracias a nosotros, las correcciones de tu proyecto se realizarán en un abrir y cerrar de ojos.",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      titulo: "Ahora tu dinero",
      descripcion: "Un desarrollo acelerado le permite ahorrar miles de dolores en la creación de sus proyectos.",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 极速0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      titulo: "Sugerir y estar satisfecho",
      descripcion: "La idea principal es crear un producto hecho por personas para la gente.",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="ventajas" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        {/* Título principal */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ventajas de usar Devioz
          </h2>
          <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
        </div>

        {/* Grid de ventajas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ventajas.map((ventaja, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              
              {/* Icono */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-full mb-6">
                {ventaja.icono}
              </div>
              
              {/* Título */}
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {ventaja.titulo}
              </h3>
              
              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed">
                {ventaja.descripcion}
              </p>
            </div>
          ))}
        </div>

        {/* Llamada a la acción */}
        {/* <div className="text-center mt-16">
          <button className="bg-teal-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-teal-700 transition-colors duration-300 shadow-md hover:shadow-lg">
            Comenzar ahora
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default VentajasSection;