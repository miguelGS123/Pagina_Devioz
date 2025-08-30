import React, { useState, useEffect, useRef } from "react";

const ServicesSection: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["Flexible", "Preparado para Usar", "Personalizable", "Tecnología", "Waaazaaaa"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  // Lista de servicios para mapear
  const services = [
    { image: "/servicios/ArqSoftware.png", number: 150, title: "Arq. de Software" },
    { image: "/servicios/GestionDatos.png", number: 120, title: "Gestion de Datos" },
    { image: "/servicios/RPA.png", number: 150, title: "RPA" },
    { image: "/servicios/IoT.png", number: 120, title: "IoT" },
    { image: "/servicios/ContacCenter.png", number: 100, title: "Contact Center" },
    { image: "/servicios/CloudComp.png", number: 150, title: "Cloud Computing" },
    { image: "/servicios/GestionProyec.png", number: 250, title: "Gestion de Proyecto" },
    { image: "/servicios/DiseñoMarketing.png", number: 100, title: "Diseño y Marketing" }
  ];

  return (
    <section id="servicios" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Nuestros Servicios
          </h2>
          <div className="h-1 w-20 bg-teal-500 mx-auto mb-6"></div>

          <div className="text-teal-600 text-xl font-semibold h-8 transition-all duration-500">
            <strong>{words[currentWordIndex]}</strong>
          </div>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceItem 
              key={index}
              image={service.image}
              number={service.number}
              title={service.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente hijo con contador animado
const ServiceItem: React.FC<{ image: string; number: number; title: string }> = ({ 
  image, 
  number, 
  title 
}) => {
  const [imageError, setImageError] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1500; // 1.5s
          const stepTime = 20; // cada 20ms
          const steps = duration / stepTime;
          const increment = number / steps;

          const interval = setInterval(() => {
            start += increment;
            if (start >= number) {
              clearInterval(interval);
              setCount(number);
            } else {
              setCount(Math.floor(start));
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 } // empieza la animación cuando 30% del bloque es visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [number, hasAnimated]);

  return (
    <div ref={ref} className="bg-white p-4 text-center">
      {!imageError ? (
        <img 
          src={image} 
          alt={title} 
          className="w-20 h-20 object-contain mx-auto mb-3"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
          <span className="text-gray-500 text-sm">{title.charAt(0)}</span>
        </div>
      )}
        <div className="text-4xl font-bold text-black mb-1">
          {count} +
        </div>

      <div className="text-gray-800 font-medium">{title}</div>
    </div>
  );
};

export default ServicesSection;
