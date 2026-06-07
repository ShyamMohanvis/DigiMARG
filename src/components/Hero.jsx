

import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";
import { FaMedal, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import Confetti from "react-confetti";

const features = [
  {
    id: 1,
    title: "Real-Time Bus Tracking",
    desc: "Track buses in real-time with accurate live locations for a smooth travel experience.",
    img: "bus.jpg",
  },
  {
    id: 2,
    title: "Accurate Routes & Stops",
    desc: "Get precise route maps and nearby bus stop information to plan your journey better.",
    img: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  },
  {
    id: 3,
    title: "Live Updates & Alerts",
    desc: "Get instant notifications about delays, diversions, and real-time service updates.",
    img: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png",
  },
];

export default function Hero() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ co2Saved: 0, points: 0 });
  const navigate = useNavigate();

  const [confettiSize, setConfettiSize] = useState({ w: 0, h: 0 });
  const location = useLocation();

  useEffect(() => {
    const setSize = () =>
      setConfettiSize({
        w: typeof window !== "undefined" ? window.innerWidth : 0,
        h: typeof window !== "undefined" ? window.innerHeight : 0,
      });
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  // Handle scrolling when navigated with a hash (e.g. /#features)
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  const distances = {
    "amritsar-chandigarh": 240,
    "chandigarh-amritsar": 240,
    // Add more city pairs as needed, e.g., "delhi-mumbai": 1400
  };

  const carCO2PerKm = 150; // g/km
  const busCO2PerPassengerKm = 40; // g/km per passenger (assumed value; adjust as needed)

  const handleTrackBus = (e) => {
    e.preventDefault();
    if (busNumber.trim().length > 0) {
      navigate(`/track?busNumber=${encodeURIComponent(busNumber.trim())}&autoStart=true`);
    } else if (fromCity.trim().length > 0 && toCity.trim().length > 0) {
      navigate(`/buses?from=${encodeURIComponent(fromCity.trim())}&to=${encodeURIComponent(toCity.trim())}`);
    } else {
      alert("Please enter either both cities or the bus number.");
    }
  };

  const [errorMsg, setErrorMsg] = useState("");

  const handleCalculate = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const key = `${source.toLowerCase().trim()}-${destination.toLowerCase().trim()}`;
    let distance = distances[key] || distances[`${destination.toLowerCase().trim()}-${source.toLowerCase().trim()}`];
    
    // Fallback: generate a deterministic distance based on string length if not found
    if (!distance) {
      distance = (source.length + destination.length) * 15;
    }
    
    const co2Saved = (carCO2PerKm - busCO2PerPassengerKm) * distance;
    const points = Math.floor(co2Saved / 100);
    setResult({ co2Saved, points });
    setShowResult(true);
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="flex flex-col md:flex-row items-center px-6 md:px-16 py-16 min-h-[90vh] bg-gradient-to-l from-green-100 via-white to-green-100"
        id="home"
      >
        <div className="md:w-1/2 flex flex-col items-start gap-8">
          <h3 className="font-poppins text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            DigiMARG (Mobility Assistance for Reliable Governance)
          </h3>
          <p className="font-inter text-lg text-gray-600 max-w-md">
            Enter your source & destination or directly search by bus number.
          </p>
          <form
            onSubmit={handleTrackBus}
            className="w-full bg-white/90 backdrop-blur-md px-6 py-6 rounded-2xl shadow-lg border border-gray-200 space-y-4"
          >
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Source City"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                autoComplete="off"
              />
              <ArrowLeftRight className="w-6 h-6 text-green-600 self-center hidden md:block" />
              <input
                type="text"
                placeholder="Destination"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-600 mb-2">OR</span>
              <input
                type="text"
                placeholder="Enter Bus Number (Eg. PB20AB0001)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Track Bus
            </button>
          </form>
          {/* Admin Access Link (positioned below Track Bus form, left side) */}
          <Link
            to="/admin"
            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:text-green-800 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
            Admin Panel Access
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center items-center mt-12 md:mt-0">
          <img src="bus.png" alt="Bus Tracking" className="w-[420px] h-auto" />
        </div>
      </section>



  {/* Features Section */}    
  <section className="py-20 bg-gradient-to-b from-green-50 to-white" id="features">
      <div className="max-w-6xl mx-auto px-6 text-center">
         <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-14 text-gray-900"
          >
            Our <span className="text-green-700">Features</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="p-8 bg-white rounded-2xl shadow-md hover:shadow-2xl border border-green-100 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex justify-center mb-6">
                  <motion.img
                    src={feature.img}
                    alt={feature.title}
                    className="w-20 h-20 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 10 }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-green-700 group-hover:text-green-800 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mt-3 text-base">{feature.desc}</p>
                <div className="mt-6 h-1 w-0 group-hover:w-full bg-green-500 transition-all duration-500 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CRI Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-green-50 via-white to-green-100" id="co2">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-12 md:p-16 space-y-20">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h2 className="text-5xl font-bold text-green-900 tracking-tight">
              Carbon Reduction Initiative (CRI)
            </h2>
            <p className="text-xl leading-relaxed text-gray-600 font-medium">
              The <span className="font-bold text-green-800">Carbon Reduction Initiative</span>{" "}
              empowers you to make a difference. Earn{" "}
              <span className="text-green-700 font-semibold">Green Points</span> by reducing carbon
              emissions through eco-friendly actions. Redeem your points for exclusive coupons,
              discounts, and rewards while contributing to a{" "}
              <span className="text-green-900 font-semibold">sustainable, pollution-free future 🌿</span>.
            </p>
            <p className="text-lg font-bold text-green-800">(100gm CO2 saved = 1 Point)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div id="calculate">
              <h3 className="text-3xl font-bold text-green-800 mb-8">CRI Emission Calculator</h3>
              <form onSubmit={handleCalculate} className="space-y-6">
                <div>
                  <label htmlFor="source" className="block text-lg font-medium text-gray-700 mb-2">
                    Source Place
                  </label>
                  <input
                    type="text"
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-4 py-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Amritsar"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="destination"
                    className="block text-lg font-medium text-gray-700 mb-2"
                  >
                    Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Chandigarh"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors duration-200"
                >
                  Calculate
                </button>
              </form>
            </div>
            <div>
              <h3 className="flex items-center justify-center text-3xl font-bold text-green-800 mb-10">
                <FaMedal className="mr-3 text-yellow-500 text-3xl" />
                Top Eco Warriors
              </h3>
              <div className="grid gap-4">
                {[
                  { rank: "🥇", name: "Prakhar", points: 500 },
                  { rank: "🥈", name: "Shubh", points: 200 },
                  { rank: "🥉", name: "You?", points: null, isJoin: true },
                ].map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gradient-to-r from-green-50 to-green-100 rounded-2xl px-6 py-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{entry.rank}</span>
                      <span className="font-semibold text-green-900 text-lg">{entry.name}</span>
                    </div>
                    {entry.isJoin ? (
                      <a
                        href="#calculate"
                        className="text-green-600 font-bold text-lg hover:text-green-700 transition-colors duration-200"
                      >
                        Join Now →
                      </a>
                    ) : (
                      <span className="text-green-700 font-bold text-lg">{entry.points} pts</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Result Popup (Inline, No Black Background) */}
          {showResult && (
            <div className="relative max-w-4xl mx-auto mt-12">
              <Confetti
                width={confettiSize.w}
                height={confettiSize.h}
                recycle={false}
                numberOfPieces={200}
                gravity={0.1}
                colors={["#10B981", "#059669", "#34D399", "#A7F3D0"]}
              />
              <motion.div
                className="bg-white rounded-3xl p-10 shadow-2xl max-w-lg mx-auto space-y-8 border-4 border-green-200 bg-gradient-to-br from-green-50 to-white"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <h4 className="text-3xl font-extrabold text-green-900 text-center">
                  🌿 Your Eco Impact
                </h4>
                <div className="space-y-4 text-center">
                  <p className="text-xl text-gray-700 font-semibold">
                    <span className="text-green-700">{result.co2Saved} gm</span> of CO2 saved
                  </p>
                  <p className="text-xl text-gray-700 font-semibold">
                    <span className="text-green-700">{result.points}</span> points earned
                  </p>
                </div>
                <button
                  onClick={() => setShowResult(false)}
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-md"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 via-white to-green-100" id="contact">
        <div className="max-w-2xl mx-auto text-gray-700">
          <h2 className="text-4xl font-extrabold text-green-900 mb-12 text-center">Get in Touch</h2>
          <div className="bg-white shadow-2xl rounded-2xl p-10 border border-green-100">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-green-800 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-green-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-green-800 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  required
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-800 transition duration-300"
              >
                Send Message
              </button>
            </form>
            <div className="mt-10 pt-6 border-t border-green-200 text-center">
              <h3 className="text-lg font-bold text-green-800 mb-4">Emergency Helplines</h3>
              <ul className="flex flex-wrap justify-center gap-6 text-green-700 text-base">
                <li>
                  <span className="font-semibold">Police:</span>{" "}
                  <a href="tel:100" className="hover:underline">100</a>
                </li>
                <li>
                  <span className="font-semibold">Children Helpline:</span>{" "}
                  <a href="tel:1098" className="hover:underline">1098</a>
                </li>
                <li>
                  <span className="font-semibold">Ambulance:</span>{" "}
                  <a href="tel:102" className="hover:underline">102</a>
                </li>
                <li>
                  <span className="font-semibold">Fire:</span>{" "}
                  <a href="tel:101" className="hover:underline">101</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="bg-green-100 py-12 border-t border-green-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-700">
            <div>
              <h4 className="text-xl font-bold text-green-900 mb-5">Quick Links</h4>
              <ul className="space-y-3 text-base">
                <li><a href="#home" className="hover:text-green-900 text-green-700 transition">Home</a></li>
                <li><a href="#about" className="hover:text-green-900 text-green-700 transition">About Us</a></li>
                <li><a href="#services" className="hover:text-green-900 text-green-700 transition">Services</a></li>
                <li><a href="#contact" className="hover:text-green-900 text-green-700 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-green-900 mb-5">Contact Us</h4>
              <ul className="space-y-2 text-base">
                <li>
                  Email:{" "}
                  <a href="mailto:support@digimarg.com" className="text-green-700 hover:text-green-900 transition">
                    support@digimarg.com
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a href="tel:+919899899898" className="text-green-700 hover:text-green-900 transition">
                    +91 98989 89898
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-green-900 mb-5">Follow Us</h4>
              <div className="flex space-x-6 text-green-700">
                <a href="#" className="hover:text-green-900 transition" aria-label="Facebook">
                  <FaFacebookF size={20} />
                </a>
                <a href="#" className="hover:text-green-900 transition" aria-label="Twitter">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="hover:text-green-900 transition" aria-label="LinkedIn">
                  <FaLinkedinIn size={20} />
                </a>
                <a href="#" className="hover:text-green-900 transition" aria-label="Instagram">
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center text-sm text-gray-500 border-t border-green-200 pt-6">
            &copy; {new Date().getFullYear()} DigiMarg. All rights reserved.
          </div>
        </div>
      </section>

    </>
  );
}


