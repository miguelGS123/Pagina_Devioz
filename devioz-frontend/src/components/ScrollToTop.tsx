import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react"; // Icono flecha hacia arriba

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el botón solo cuando se hace scroll hacia abajo
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Función para volver arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Scroll suave
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-6 right-6 
            p-3 rounded-full 
            bg-teal-500 text-white 
            shadow-lg hover:bg-teal-600 
            transition-all duration-300 
            z-50
          "
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
