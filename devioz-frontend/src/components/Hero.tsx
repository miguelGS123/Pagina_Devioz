import React from "react";



const Hero: React.FC = () => {

  return (

    <>

      {/* Versión Desktop - Mantenida exactamente igual */}

      <section

        id="inicio"

        className="hidden lg:block relative min-h-[80vh] w-full flex items-center pt-16"

      >

        {/* Fondo con oscurecido */}

        <div className="absolute inset-0 z-0 pointer-events-none">

          <div className="absolute inset-0 bg-[url('/fondo.png')] bg-cover bg-center"></div>

          <div className="absolute inset-0 bg-black/55"></div>

        </div>



        {/* Contenido - Texto posicionado al lado de la laptop */}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8">

          <div className="flex justify-between items-start">

            {/* Texto - Posicionado a la izquierda y alineado con la laptop */}

            <div className="w-5/12 text-white mt-32">

              <p className="text-teal-300 font-semibold mb-2 text-lg">Tecnología!</p>



              <h1 className="font-extrabold leading-[1.05] text-[36px] sm:text-[44px] md:text-[56px] lg:text-[64px] mb-3">

                Gestión de <br /> Proyectos

              </h1>



              <p className="text-white/85 text-base md:text-[15px] leading-relaxed max-w-lg mb-3 font-bold">

                <strong>

                  Creando el Futuro Digital: Servicios Integrales de Software, IoT,

                  Ciberseguridad, Diseño, Multimedia, Marketing y Más.

                </strong>

              </p>



              {/* Línea separadora */}

              <div className="w-full h-px bg-white/30 my-4"></div>



              {/* Botón SOFTWARE */}

              <a

                href="#software"

                className="inline-block border border-white/85 text-white px-5 py-2 rounded-md hover:bg-white hover:text-black transition font-semibold mt-3 text-sm"

              >

                #SOFTWARE

              </a>

            </div>

            

            {/* Espacio para la laptop */}

            <div className="w-7/12"></div>

          </div>

        </div>



        {/* Laptop en posición absoluta */}

        <div className="absolute bottom-[-125px] right-0 left-0 flex justify-center md:justify-end z-30">

          <div className="relative">

            <img

              src="/imagen-laptop.png"

              alt="Laptop Devioz"

              className="w-[850px] md:w-[1000px] lg:w-[1150px] h-auto drop-shadow-2xl"

            />

            {/* Sombra debajo de la laptop */}

            <div

              aria-hidden

              className="

                absolute left-1/2 -translate-x-1/2 -bottom-6

                w-[70%] h-10

                rounded-full

                [background:radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_70%)]

                blur-2xl

                pointer-events-none

                z-20

              "

            />

          </div>

        </div>

      </section>



      {/* Versión Tablet - Texto centrado con imagen */}

      <section

        id="inicio-tablet"

        className="hidden md:block lg:hidden relative min-h-[80vh] w-full flex items-center pt-16"

      >

        {/* Fondo con oscurecido */}

        <div className="absolute inset-0 z-0 pointer-events-none">

          <div className="absolute inset-0 bg-[url('/fondo.png')] bg-cover bg-center"></div>

          <div className="absolute inset-0 bg-black/55"></div>

        </div>



        <div className="relative z-10 w-full max-w-3xl mx-auto px-8">

          <div className="flex flex-col items-center text-center">

            <p className="text-teal-300 font-semibold mb-3 text-lg">Tecnología!</p>



            <h1 className="font-extrabold text-4xl mb-5 text-white">

              Gestión de Proyectos

            </h1>



            <div className="w-32 h-px bg-white/30 my-4"></div>



            <a

              href="#software"

              className="inline-block border border-white/85 text-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition font-semibold mb-8 text-sm"

            >

              #SOFTWARE

            </a>



            <div className="mt-6 w-full flex justify-center">

              <img

                src="/imagen-laptop.png"

                alt="Laptop Devioz"

                className="w-[500px] h-auto drop-shadow-2xl"

              />

            </div>

          </div>

        </div>

      </section>



      {/* Versión Móvil - Solo texto y botón (sin párrafo largo) */}

      <section

        id="inicio-mobile"

        className="block md:hidden relative min-h-[70vh] w-full flex items-center justify-center pt-20 pb-10"

      >

        {/* Fondo con oscurecido */}

        <div className="absolute inset-0 z-0 pointer-events-none">

          <div className="absolute inset-0 bg-[url('/fondo.png')] bg-cover bg-center"></div>

          <div className="absolute inset-0 bg-black/55"></div>

        </div>



        <div className="relative z-10 w-full max-w-md mx-auto px-5">

          <div className="flex flex-col items-center text-center">

            <p className="text-teal-300 font-semibold mb-3 text-lg">Tecnología!</p>



            <h1 className="font-extrabold text-3xl mb-4 text-white">

              Gestión de Proyectos

            </h1>



            <div className="w-24 h-px bg-white/30 my-3"></div>



            <a

              href="#software"

              className="inline-block border border-white/85 text-white px-5 py-2 rounded-md font-semibold text-sm"

            >

              #SOFTWARE

            </a>

          </div>

        </div>

      </section>

    </>

  );

};



export default Hero;
