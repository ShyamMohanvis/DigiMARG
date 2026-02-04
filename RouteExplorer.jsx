import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaClock, FaBus, FaRoute, FaEye } from "react-icons/fa";
import { getAllRoutes } from "./data/punjabRoutes";
import RouteMap from "./RouteMap";

export default function RouteExplorer() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const routes = getAllRoutes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🗺️ Famous Punjab Routes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the most popular and scenic bus routes across Punjab, 
            from the Golden Temple to the Wagah Border ceremony
          </p>
        </motion.div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedRoute(route);
                setShowMap(true);
              }}
            >
              {/* Route Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <FaRoute className="text-2xl" />
                  <h3 className="text-xl font-bold">{route.route}</h3>
                </div>
                <p className="text-blue-100">{route.distance} • {route.duration}</p>
              </div>

              {/* Route Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FaBus className="text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Buses</p>
                      <p className="font-semibold">{route.buses.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Frequency</p>
                      <p className="font-semibold">{route.frequency}</p>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-yellow-500" />
                    Highlights
                  </h4>
                  <div className="space-y-1">
                    {route.highlights.slice(0, 3).map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{highlight}</span>
                      </div>
                    ))}
                    {route.highlights.length > 3 && (
                      <p className="text-sm text-gray-500 ml-3">
                        +{route.highlights.length - 3} more...
                      </p>
                    )}
                  </div>
                </div>

                {/* Bus Types */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Available Bus Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(route.buses.map(bus => bus.type))].map((type, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fare Range */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Fare Range</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">
                      ₹{Math.min(...route.buses.map(bus => parseInt(bus.fare.replace('₹', ''))))}
                    </span>
                    <span className="text-gray-500">-</span>
                    <span className="text-green-600 font-bold">
                      ₹{Math.max(...route.buses.map(bus => parseInt(bus.fare.replace('₹', ''))))}
                    </span>
                  </div>
                </div>

                {/* View Route Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2">
                  <FaEye className="w-4 h-4" />
                  View Route Map
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Route Map Modal */}
        {showMap && selectedRoute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMap(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FaRoute className="text-blue-500" />
                    {selectedRoute.route}
                  </h2>
                  <button
                    onClick={() => setShowMap(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <RouteMap route={selectedRoute} showAllBuses={true} />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Punjab Bus Network Statistics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {routes.length}
              </div>
              <p className="text-gray-600">Famous Routes</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {routes.reduce((total, route) => total + route.buses.length, 0)}
              </div>
              <p className="text-gray-600">Total Buses</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {routes.reduce((total, route) => total + route.buses.reduce((sum, bus) => sum + bus.capacity, 0), 0)}
              </div>
              <p className="text-gray-600">Total Capacity</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {routes.reduce((total, route) => total + route.buses.reduce((sum, bus) => sum + bus.currentSeats, 0), 0)}
              </div>
              <p className="text-gray-600">Available Seats</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}



