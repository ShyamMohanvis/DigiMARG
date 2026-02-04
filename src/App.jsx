
 

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BusDetails from "./components/BusDetails"; // Bus list page
import BusInfo from "./components/BusInfo"; // Individual bus info page
import AdminHome from "./components/AdminHome"; // Admin home page
import AdminLogin from "./components/AdminLogin"; // Admin login page
import ConductorPanel from "./components/ConductorPanel"; // Conductor panel
import TransportManager from "./components/TransportManager"; // Transport manager panel
// Feature pages located at project root
import RealTimeTracking from "../RealTimeTracking.jsx";
import RouteExplorer from "../RouteExplorer.jsx";
import BusSelectionNew from "../BusSelectionNew.jsx";

const App = () => (
  <Router>
    <div className="App min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Hero />} />
          <Route path="/details" element={<BusDetails />} />
          <Route path="/details/:busNumber" element={<BusInfo />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Feature routes */}
          <Route path="/track" element={<RealTimeTracking />} />
          <Route path="/routes" element={<RouteExplorer />} />
          <Route path="/buses" element={<BusSelectionNew />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/conductor" element={<ConductorPanel />} />
          <Route path="/admin/manager" element={<TransportManager />} />
        </Routes>
      </main>

      <footer>
      </footer>
    </div>
  </Router>
);

export default App;

