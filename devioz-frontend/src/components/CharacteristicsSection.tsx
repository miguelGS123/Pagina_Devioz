import React from "react";

interface HoverCharacteristicProps {
  normalImage: string;
  hoverImage: string;
}

const HoverCharacteristic: React.FC<HoverCharacteristicProps> = ({
  normalImage,
  hoverImage,
}) => {
  return (
    <div className="relative group flex flex-col items-center text-center cursor-pointer">
      {/* Contenedor tipo card con marco delgado */}
      <div className="relative inline-flex items-center justify-center p-1.5 bg-white border-gray-300 border-[1px] rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
        
        {/* Imagen normal */}
        <img
          src={normalImage}
          alt=""
          className="w-full max-w-[325px] max-h-[325px] object-contain transition-opacity duration-300 group-hover:opacity-0"
        />
        
        {/* Imagen hover */}
        <img
          src={hoverImage}
          alt=""
          className="w-full max-w-[325px] max-h-[325px] object-contain absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
    </div>
  );
};

const CharacteristicsSection: React.FC = () => {
  return (
    <section id="caracteristicas" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        {/* Título principal */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Características
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
            Frameworks modernos te ofrecen múltiples opciones personalizables para crear 
            soluciones robustas y escalables en el desarrollo de software.
          </p>
          <div className="w-20 h-1 bg-teal-500 mx-auto mt-6"></div>
        </div>

        {/* Grid 4x2 con separación mínima y centrado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4 justify-items-center">
          <HoverCharacteristic normalImage="/caracteristicas/SoftDev.png" hoverImage="/caracteristicas/SoftDevInt.png" />
          <HoverCharacteristic normalImage="/caracteristicas/CloudComp.png" hoverImage="/caracteristicas/CloudCompInt.png" />
          <HoverCharacteristic normalImage="/caracteristicas/ProjectManag.png" hoverImage="/caracteristicas/ProjectManagInt.png" />
          <HoverCharacteristic normalImage="/caracteristicas/BaseDatos.png" hoverImage="/caracteristicas/BaseDatosInt.png" />
          <HoverCharacteristic normalImage="/caracteristicas/RPA.png" hoverImage="/caracteristicas/RPAInt.png" />
          <HoverCharacteristic normalImage="/caracteristicas/IoT.png" hoverImage="/caracteristicas/IoTInt.png" />
          <HoverCharacteristic normalImage="/caracteristicas/ContCenter.png" hoverImage="/caracteristicas/ContCenterInt.png" />
          <HoverCharacteristic normalImage="/caracteristicas/Design.png" hoverImage="/caracteristicas/DesignInt.png" />
        </div>
      </div>
    </section>
  );
};

export default CharacteristicsSection;
