import React, { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Función para hacer scroll suave al formulario de contacto
  const scrollToContact = () => {
    const contactSection = document.getElementById("contacto");
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
    setIsOpen(false); // Cerrar menú móvil si está abierto
  };

  // Detectar si es móvil y scroll
  useEffect(() => {
    // Detectar tamaño de pantalla
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint de Tailwind
    };

    // Detectar scroll solo si no es móvil con menú abierto
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Verificar inicialmente y agregar listener de resize
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Solo agregar scroll listener si no es móvil con menú abierto
    if (!(isMobile && isOpen)) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile, isOpen]); // Dependencias

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        // Condicional: si es móvil y menú abierto, fondo sólido; sino, comportamiento normal
        (isMobile && isOpen) 
          ? "bg-gray-900" // Fondo sólido cuando menú abierto en móvil
          : isScrolled 
            ? "bg-gray-900/80 backdrop-blur-md" 
            : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#inicio">
              <img
                src="/logo-devioz.png"
                alt="Devioz"
                className="h-10 w-auto md:h-12 brightness-110 contrast-125"
              />
            </a>
          </div>

          {/* Menú en escritorio */}
          <nav className="hidden lg:block flex-1 mx-8">
            <ul className="flex justify-center items-center gap-4 xl:gap-6 text-white font-medium tracking-wide text-sm xl:text-base">
              <li><a href="#inicio" className="hover:text-teal-300 transition-colors py-2">INICIO</a></li>
              <li><a href="#servicios" className="hover:text-teal-300 transition-colors py-2">SERVICIOS</a></li>
              <li><a href="#caracteristicas" className="hover:text-teal-300 transition-colors py-2">CARACTERÍSTICAS</a></li>
              <li><a href="#portafolio" className="hover:text-teal-300 transition-colors py-2">PORTAFOLIO</a></li>
              <li><a href="#ventajas" className="hover:text-teal-300 transition-colors py-2">VENTAJAS</a></li>
              <li><a href="#contacto" className="hover:text-teal-300 transition-colors py-2">CONTÁCTANOS</a></li>
            </ul>
          </nav>

          {/* Botón escritorio - ACTUALIZADO */}
          <div className="hidden xl:flex justify-end flex-shrink-0">
            <button
              onClick={scrollToContact}
              className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors font-medium text-sm"
            >
              SOLICITAR DEVIOZ
            </button>
          </div>

          {/* Botón hamburguesa */}
          <button
            className="lg:hidden text-white focus:outline-none p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {isOpen ? (
                <span className="text-2xl">✕</span>
              ) : (
                <span className="text-2xl">☰</span>
              )}
            </div>
          </button>
        </div>

        {/* Menú móvil/tablet */}
        {isOpen && (
          <div className="lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-70 z-40"
              onClick={() => setIsOpen(false)}
            ></div>
            <nav className="fixed right-0 top-0 h-full w-80 bg-gray-900 shadow-2xl z-50 transform transition-transform">
              <div className="flex flex-col h-full p-6 bg-gray-900">
                
                {/* Botón cerrar */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white text-2xl p-2 hover:text-teal-300 transition-colors"
                    aria-label="Cerrar menú"
                  >
                    ✕
                  </button>
                </div>

                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <img
                    src="/logo-devioz.png"
                    alt="Devioz"
                    className="h-12 w-auto brightness-110 contrast-125"
                  />
                </div>

                {/* Enlaces de navegación */}
                <ul className="flex flex-col gap-4 text-white font-medium text-lg">
                  <li>
                    <a 
                      href="#inicio" 
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 hover:text-teal-300 transition-colors border-b border-gray-700"
                    >
                      INICIO
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#servicios" 
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 hover:text-teal-300 transition-colors border-b border-gray-700"
                    >
                      SERVICIOS
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#caracteristicas" 
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 hover:text-teal-300 transition-colors border-b border-gray-700"
                    >
                      CARACTERÍSTICAS
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#portafolio" 
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 hover:text-teal-300 transition-colors border-b border-gray-700"
                    >
                      PORTAFOLIO
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#ventajas" 
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 hover:text-teal-300 transition-colors border-b border-gray-700"
                    >
                      VENTAJAS
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#contacto" 
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 hover:text-teal-300 transition-colors border-b border-gray-700"
                    >
                      CONTÁCTANOS
                    </a>
                  </li>
                </ul>

                {/* SOLICITAR DEVIOZ - ACTUALIZADO */}
                <div className="mt-auto pt-8 border-t border-gray-700">
                  <button
                    onClick={scrollToContact}
                    className="block w-full py-3 px-4 text-teal-400 hover:text-teal-300 transition-colors font-medium text-center border-b border-gray-700"
                  >
                    SOLICITAR DEVIOZ
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;