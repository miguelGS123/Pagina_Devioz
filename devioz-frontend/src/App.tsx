import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// Nueva página de productos
import ProductsPage from "./pages/Products/ProductsPage";

// Componente para la Landing (tu contenido actual)
const Landing: React.FC = () => {
  return (
    <>
      <SocialSidebar />   
      <ScrollToTop />
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
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal de la landing */}
        <Route path="/" element={<Landing />} />
        {/* Ruta de productos con login, ventas, etc */}
        <Route path="/productos" element={<ProductsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
