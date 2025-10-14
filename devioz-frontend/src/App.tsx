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

// Páginas
import ProductsPage from "./pages/Products/ProductsPage";
import ProductDetailPage from "./pages/Products/ProductDetailPage";
import UserDashboard from "./pages/UserDashboard/UserDashboard";

// Rutas protegidas
import ProtectedRoute from "./routes/ProtectedRoute";

const Landing: React.FC = () => (
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/producto/:id" element={<ProductDetailPage />} />
        <Route
          path="/usuario"
          element={
            <ProtectedRoute role="ROL_USUARIO">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
