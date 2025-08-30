import React from "react";
import { FaWhatsapp, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const SocialSidebar: React.FC = () => {
  return (
    <div className="fixed top-1/3 left-4 flex flex-col gap-4 z-50">
      {/* WhatsApp */}
      <a
        href="https://wa.me/969072449"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 transition"
      >
        <FaWhatsapp size={22} />
      </a>

      {/* Facebook */}
      <a
        href="https://www.facebook.com/DeviozTI"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 transition"
      >
        <FaFacebookF size={20} />
      </a>

      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/company/devioz-ti/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 transition"
      >
        <FaLinkedinIn size={20} />
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/deviozti/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 transition"
      >
        <FaInstagram size={22} />
      </a>
    </div>
  );
};

export default SocialSidebar;
