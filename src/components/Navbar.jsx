
import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-green-900 via-green-800 to-green-700 py-4 px-0">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3 bg-white rounded-2xl shadow-lg">

        {/* Left: Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-poppins font-bold text-green-700 select-none">
            DigiMARG
          </span>
        </div>

        {/* Center: Navigation links */}
        <nav className="flex items-center space-x-8 text-base font-inter text-gray-800">
          <ScrollLink
            to="home"
            smooth={true}
            duration={600}
            offset={-80}
            className="cursor-pointer font-semibold px-3 py-2 rounded transition hover:text-green-600"
          >
            Home
          </ScrollLink>
          <ScrollLink
            to="features"
            smooth={true}
            duration={600}
            offset={-80}
            className="cursor-pointer font-semibold px-3 py-2 rounded transition hover:text-green-600"
          >
            Features
          </ScrollLink>
          <ScrollLink
            to="co2"
            smooth={true}
            duration={600}
            offset={-80}
            className="cursor-pointer font-semibold px-3 py-2 rounded transition hover:text-green-600"
          >
            CRI
          </ScrollLink>
          <ScrollLink
            to="contact"
            smooth={true}
            duration={600}
            offset={-80}
            className="cursor-pointer font-semibold px-3 py-2 rounded transition hover:text-green-600"
          >
            Contact
          </ScrollLink>
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
