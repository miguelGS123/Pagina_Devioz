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

// Páginas de productos
import ProductsPage from "./pages/Products/ProductsPage";
import ProductDetailPage from "./pages/Products/ProductDetailPage";

// Nuevas páginas
import ProfilePage from "./pages/User/Profilepage";
import AdminPage from "./pages/Admin/AdminPage";

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
        {/* Landing principal */}
        <Route path="/" element={<Landing />} />

        {/* Productos */}
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/producto/:id" element={<ProductDetailPage />} />

        {/* Usuario */}
        <Route path="/perfil" element={<ProfilePage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
