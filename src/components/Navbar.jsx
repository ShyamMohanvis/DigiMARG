
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (target) => {
    if (location.pathname === "/") {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${target}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-green-900 via-green-800 to-green-700 py-4 px-0">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3 bg-white rounded-2xl shadow-lg">

        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="DigiMARG Logo" className="w-8 h-8 object-contain rounded-full border border-green-200 bg-white" />
          <span className="text-2xl font-poppins font-bold text-green-700 select-none">
            DigiMARG
          </span>
        </div>

        {/* Center: Navigation links */}
        <nav className="flex items-center space-x-8 text-base font-inter text-gray-800">
          <button
            onClick={() => handleNavClick("home")}
            className="cursor-pointer font-semibold px-3 py-2 rounded transition hover:text-green-600"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("features")}
            className="cursor-pointer font-semibold px-3 py-2 rounded transition hover:text-green-600"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick("co2")}
            className="cursor-pointer font-semibold px-3 py-2 rounded transition hover:text-green-600"
          >
            CRI
          </button>
          <button
            onClick={() => handleNavClick("contact")}
            className="cursor-pointer font-semibold px-3 py-2 rounded transition hover:text-green-600"
          >
            Contact
          </button>
        </nav>

        {/* Right: Admin Login */}
        <div className="flex items-center space-x-2">
          <Link to="/admin/login" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition">
            Admin Login
          </Link>
        </div>

      </div>
    </header>
  );
}
