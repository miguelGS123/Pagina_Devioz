import React, { useState } from "react";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const PortfolioSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const projectsPerPage = 6;

  // Todos tus proyectos (los 54 que ya tienes)
  const projects: Project[] = [
    // Web Projects
    { id: 1, title: "Proyecto Web 1", category: "web", image: "/portafolio/dw1.png", description: "Aqui deberia ir texto xd" },
    { id: 2, title: "Proyecto Web 2", category: "web", image: "/portafolio/dw2.png", description: "Aqui deberia ir texto xd" },
    { id: 3, title: "Proyecto Web 3", category: "web", image: "/portafolio/dw3.png", description: "Aqui deberia ir texto xd" },
    { id: 4, title: "Proyecto Web 4", category: "web", image: "/portafolio/dw4.png", description: "Aqui deberia ir texto xd" },
    { id: 5, title: "Proyecto Web 5", category: "web", image: "/portafolio/dw5.png", description: "Aqui deberia ir texto xd" },
    { id: 6, title: "Proyecto Web 6", category: "web", image: "/portafolio/dw6.png", description: "Aqui deberia ir texto xd" },
    { id: 7, title: "Proyecto Web 7", category: "web", image: "/portafolio/dw7.png", description: "Aqui deberia ir texto xd" },
    { id: 8, title: "Proyecto Web 8", category: "web", image: "/portafolio/dw8.png", description: "Aqui deberia ir texto xd" },
    { id: 9, title: "Proyecto Web 9", category: "web", image: "/portafolio/dw9.png", description: "Aqui deberia ir texto xd" },

    // App Projects
    { id: 10, title: "Proyecto App 1", category: "app", image: "/portafolio/da1.png", description: "Aqui deberia ir texto xd" },
    { id: 11, title: "Proyecto App 2", category: "app", image: "/portafolio/da2.png", description: "Aqui deberia ir texto xd" },
    { id: 12, title: "Proyecto App 3", category: "app", image: "/portafolio/da3.png", description: "Aqui deberia ir texto xd" },
    { id: 13, title: "Proyecto App 4", category: "app", image: "/portafolio/da4.png", description: "Aqui deberia ir texto xd" },
    { id: 14, title: "Proyecto App 5", category: "app", image: "/portafolio/da5.png", description: "Aqui deberia ir texto xd" },
    { id: 15, title: "Proyecto App 6", category: "app", image: "/portafolio/da6.png", description: "Aqui deberia ir texto xd" },
    { id: 16, title: "Proyecto App 7", category: "app", image: "/portafolio/da7.png", description: "Aqui deberia ir texto xd" },
    { id: 17, title: "Proyecto App 8", category: "app", image: "/portafolio/da8.png", description: "Aqui deberia ir texto xd" },
    { id: 18, title: "Proyecto App 9", category: "app", image: "/portafolio/da9.png", description: "Aqui deberia ir texto xd" },

    // BI Projects
    { id: 19, title: "Proyecto BI 1", category: "bi", image: "/portafolio/bi1.png", description: "Aqui deberia ir texto xd" },
    { id: 20, title: "Proyecto BI 2", category: "bi", image: "/portafolio/bi2.png", description: "Aqui deberia ir texto xd" },
    { id: 21, title: "Proyecto BI 3", category: "bi", image: "/portafolio/bi3.png", description: "Aqui deberia ir texto xd" },
    { id: 22, title: "Proyecto BI 4", category: "bi", image: "/portafolio/bi4.png", description: "Aqui deberia ir texto xd" },
    { id: 23, title: "Proyecto BI 5", category: "bi", image: "/portafolio/bi5.png", description: "Aqui deberia ir texto xd" },
    { id: 24, title: "Proyecto BI 6", category: "bi", image: "/portafolio/bi6.png", description: "Aqui deberia ir texto xd" },
    { id: 25, title: "Proyecto BI 7", category: "bi", image: "/portafolio/bi7.png", description: "Aqui deberia ir texto xd" },
    { id: 26, title: "Proyecto BI 8", category: "bi", image: "/portafolio/bi8.png", description: "Aqui deberia ir texto xd" },
    { id: 27, title: "Proyecto BI 9", category: "bi", image: "/portafolio/bi9.png", description: "Aqui deberia ir texto xd" },

    // RPA Projects
    { id: 28, title: "Proyecto RPA 1", category: "rpa", image: "/portafolio/rpa1.png", description: "Aqui deberia ir texto xd" },
    { id: 29, title: "Proyecto RPA 2", category: "rpa", image: "/portafolio/rpa2.png", description: "Aqui deberia ir texto xd" },
    { id: 30, title: "Proyecto RPA 3", category: "rpa", image: "/portafolio/rpa3.png", description: "Aqui deberia ir texto xd" },
    { id: 31, title: "Proyecto RPA 4", category: "rpa", image: "/portafolio/rpa4.png", description: "Aqui deberia ir texto xd" },
    { id: 32, title: "Proyecto RPA 5", category: "rpa", image: "/portafolio/rpa5.png", description: "Aqui deberia ir texto xd" },
    { id: 33, title: "Proyecto RPA 6", category: "rpa", image: "/portafolio/rpa6.png", description: "Aqui deberia ir texto xd" },
    { id: 34, title: "Proyecto RPA 7", category: "rpa", image: "/portafolio/rpa7.png", description: "Aqui deberia ir texto xd" },
    { id: 35, title: "Proyecto RPA 8", category: "rpa", image: "/portafolio/rpa8.png", description: "Aqui deberia ir texto xd" },
    { id: 36, title: "Proyecto RPA 9", category: "rpa", image: "/portafolio/rpa9.png", description: "Aqui deberia ir texto xd" },

    // Cloud Projects
    { id: 37, title: "Proyecto CLOUD 1", category: "cloud", image: "/portafolio/cloud1.png", description: "Aqui deberia ir texto xd" },
    { id: 38, title: "Proyecto CLOUD 2", category: "cloud", image: "/portafolio/cloud2.png", description: "Aqui deberia ir texto xd" },
    { id: 39, title: "Proyecto CLOUD 3", category: "cloud", image: "/portafolio/cloud3.png", description: "Aqui deberia ir texto xd" },
    { id: 40, title: "Proyecto CLOUD 4", category: "cloud", image: "/portafolio/cloud4.png", description: "Aqui deberia ir texto xd" },
    { id: 41, title: "Proyecto CLOUD 5", category: "cloud", image: "/portafolio/cloud5.png", description: "Aqui deberia ir texto xd" },
    { id: 42, title: "Proyecto CLOUD 6", category: "cloud", image: "/portafolio/cloud6.png", description: "Aqui deberia ir texto xd" },
    { id: 43, title: "Proyecto CLOUD 7", category: "cloud", image: "/portafolio/cloud7.png", description: "Aqui deberia ir texto xd" },
    { id: 44, title: "Proyecto CLOUD 8", category: "cloud", image: "/portafolio/cloud8.png", description: "Aqui deberia ir texto xd" },
    { id: 45, title: "Proyecto CLOUD 9", category: "cloud", image: "/portafolio/cloud9.png", description: "Aqui deberia ir texto xd" },

    // DevOps Projects
    { id: 46, title: "Proyecto DevOps 1", category: "devops", image: "/portafolio/devops1.png", description: "Aqui deberia ir texto xd" },
    { id: 47, title: "Proyecto DevOps 2", category: "devops", image: "/portafolio/devops2.png", description: "Aqui deberia ir texto xd" },
    { id: 48, title: "Proyecto DevOps 3", category: "devops", image: "/portafolio/devops3.png", description: "Aqui deberia ir texto xd" },
    { id: 49, title: "Proyecto DevOps 4", category: "devops", image: "/portafolio/devops4.png", description: "Aqui deberia ir texto xd" },
    { id: 50, title: "Proyecto DevOps 5", category: "devops", image: "/portafolio/devops5.png", description: "Aqui deberia ir texto xd" },
    { id: 51, title: "Proyecto DevOps 6", category: "devops", image: "/portafolio/devops6.png", description: "Aqui deberia ir texto xd" },
    { id: 52, title: "Proyecto DevOps 7", category: "devops", image: "/portafolio/devops7.png", description: "Aqui deberia ir texto xd" },
    { id: 53, title: "Proyecto DevOps 8", category: "devops", image: "/portafolio/devops8.png", description: "Aqui deberia ir texto xd" },
    { id: 54, title: "Proyecto DevOps 9", category: "devops", image: "/portafolio/devops9.png", description: "Aqui deberia ir texto xd" },
  ];

  const filters = [
    { key: "all", label: "Todos" },
    { key: "web", label: "Web" },
    { key: "app", label: "App" },
    { key: "bi", label: "BI" },
    { key: "rpa", label: "RPA" },
    { key: "cloud", label: "Cloud" },
    { key: "devops", label: "DevOps" },
  ];

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const currentProjects = filteredProjects.slice(
    currentIndex * projectsPerPage,
    (currentIndex + 1) * projectsPerPage
  );

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setCurrentIndex(0);
  };

  const nextPage = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDetailsClick = (projectId: number) => {
    alert(`Redirigiendo a detalles del proyecto ${projectId} (funcionalidad en desarrollo)`);
  };

  return (
    <section id="portafolio" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        {/* Título principal */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Portafolio Devioz
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Seleccionar una o varias categorías para explorar el contenido del entorno digital
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => handleFilterClick(filter.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid de proyectos con flip */}
        <div className="relative">
          {/* Flecha izquierda */}
          {totalPages > 1 && currentIndex > 0 && (
            <button
              onClick={prevPage}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 bg-teal-400 p-4 rounded-full shadow-lg hover:bg-teal-500 z-10 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map(project => (
              <div key={project.id} className="group [perspective:1000px] h-64">
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* Frente */}
                  <div className="absolute inset-0 [backface-visibility:hidden]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-xl shadow-md"
                    />
                    {/* Título del proyecto en la parte inferior */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-white/70 backdrop-blur-sm rounded-b-xl">
                      <h3 className="text-lg font-bold text-gray-800">{project.title}</h3>
                    </div>
                  </div>

                  {/* Reverso */}
                  <div className="absolute inset-0 bg-gray-900 text-white rounded-xl p-4 flex flex-col justify-center items-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                    <p className="mb-4 text-center text-sm">{project.description}</p>
                    <button
                      onClick={() => handleDetailsClick(project.id)}
                      className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                      Más detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Flecha derecha */}
          {totalPages > 1 && currentIndex < totalPages - 1 && (
            <button
              onClick={nextPage}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8 bg-teal-400 p-4 rounded-full shadow-lg hover:bg-teal-500 z-10 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Indicadores de página */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full ${
                    currentIndex === i ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;