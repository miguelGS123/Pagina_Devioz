// import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FooterSection from "./components/FooterSection";
import ServicesSection from "./components/ServicesSection";
import CharacteristicSsection from "./components/CharacteristicsSection";
import PortfolioSection from "./components/PortfolioSection";
import FooterSection2 from "./components/FooterSection2";
import VentajasSection from "./components/VentajasSection";
import ContactSection from "./components/ContactSection";
import SocialSidebar from "./components/SocialSidebar";
import ScrollToTop from "./components/ScrollToTop";
import ChatButton from "./components/ChatButton";

function App() {
  return (
    <div className="App">
      {/* Sidebar flotante */}
      <SocialSidebar />

      {/* Botón scroll-to-top */}
      <ScrollToTop />

      {/* Contenido de la página */}
      <Navbar />
      <Hero />
      <FooterSection />
      <ServicesSection />
      <CharacteristicSsection />
      <PortfolioSection />
      <FooterSection2 />
      <VentajasSection />
      <ContactSection />
       <ChatButton />
    </div>
  );
}

export default App;
