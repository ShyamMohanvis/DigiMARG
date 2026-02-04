import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBrain, FaClock, FaLeaf, FaUsers, FaTrophy, FaTrafficLight } from "react-icons/fa";
import { localAIServer } from "./services/aiApiServer";

export default function SmartAI({ distanceKm, stopId, currentSeats, totalSeats, routeId, userId }) {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Interactive controls
  const [trafficFactor, setTrafficFactor] = useState(1);
  const [passengers, setPassengers] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function fetchAI() {
      try {
        setLoading(true);
        setError(null);
        
        // Determine time of day
        const hour = new Date().getHours();
        let timeOfDay = 'normal';
        if (hour >= 7 && hour <= 9) timeOfDay = 'rush_morning';
        else if (hour >= 17 && hour <= 19) timeOfDay = 'rush_evening';
        else if (hour >= 22 || hour <= 6) timeOfDay = 'night';
        
        // Determine day of week
        const day = new Date().getDay();
        const dayOfWeek = day === 0 || day === 6 ? 'weekend' : 'weekday';
        
        // Simulate traffic factor (in real app, get from traffic API)
        const rushFactor = timeOfDay.includes('rush') ? 2 : 1;
        
        // Prepare request data
        const requestData = {
          distanceKm,
          avgSpeed: 40,
          trafficFactor: trafficFactor || rushFactor,
          timeOfDay,
          weather: 'clear',
          busType: 'standard',
          passengers,
          userId,
          currentSeats,
          totalSeats,
          routeId,
          currentStopIndex: 0,
          dayOfWeek
        };
        
        // Use local AI server (works with free Firebase plan)
        // In production with paid plan, this would call Firebase Functions
        const result = await localAIServer.callAI(requestData);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch AI data');
        }
        
        setAiData(result.data);
        
      } catch (err) {
        console.error('AI fetch error:', err);
        setError(err.message);
        
        // Fallback to mock data for development
        setAiData({
          eta: { eta: 12, confidence: 'Medium', factors: { baseTime: 10, trafficDelay: 2 } },
          carbon: { co2Saved: '1.5', greenPoints: 15, environmentalImpact: { treesEquivalent: 1 } },
          seat: { nextStopSeats: 8, trend: 'Decreasing', confidence: 'High' }
        });
      } finally {
        setLoading(false);
      }
    }

    if (distanceKm > 0) {
      fetchAI();
    }
  }, [distanceKm, stopId, currentSeats, totalSeats, routeId, userId, trafficFactor, passengers]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Loading smart insights...</span>
        </div>
      </div>
    );
  }

  if (error && !aiData) {
    return (
      <div className="p-4 bg-red-50 rounded-2xl shadow-lg border border-red-200">
        <p className="text-red-600">Failed to load AI insights: {error}</p>
      </div>
    );
  }

  if (!aiData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white rounded-2xl shadow-lg border border-green-200"
    >
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-600">Traffic level</label>
          <input type="range" min="1" max="3" step="1" value={trafficFactor}
            onChange={(e) => setTrafficFactor(Number(e.target.value))}
            className="w-full" />
          <div className="text-xs text-gray-500">{trafficFactor === 1 ? 'Normal' : trafficFactor === 2 ? 'Rush' : 'Heavy'}</div>
        </div>
        <div>
          <label className="text-xs text-gray-600">Passengers</label>
          <input type="number" min="1" value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value) || 1)}
            className="w-full px-2 py-1 border rounded" />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <FaBrain className="text-blue-500 text-2xl" />
        <h2 className="text-xl font-bold text-gray-800">🤖 AI Insights</h2>
        <div className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Powered by AI
        </div>
      </div>

      <div className="space-y-4">
        {/* ETA Prediction */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center gap-3">
            <FaClock className="text-blue-500" />
            <div>
              <p className="font-semibold text-gray-800">Smart ETA</p>
              <p className="text-sm text-gray-600">
                {aiData.eta.factors?.baseTime}min base + {aiData.eta.factors?.trafficDelay}min traffic
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{aiData.eta.eta} min</p>
            <p className="text-xs text-gray-500">{aiData.eta.confidence} confidence</p>
          </div>
        </motion.div>

        {/* Carbon Savings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
        >
          <div className="flex items-center gap-3">
            <FaLeaf className="text-green-500" />
            <div>
              <p className="font-semibold text-gray-800">Environmental Impact</p>
              <p className="text-sm text-gray-600">
                {aiData.carbon.environmentalImpact?.treesEquivalent} trees saved
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">{aiData.carbon.co2Saved} kg CO₂</p>
            <p className="text-xs text-gray-500">+{aiData.carbon.greenPoints} points</p>
          </div>
        </motion.div>

        {/* Seat Prediction */}
        {aiData.seat && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
          >
            <div className="flex items-center gap-3">
              <FaUsers className="text-orange-500" />
              <div>
                <p className="font-semibold text-gray-800">Crowd Prediction</p>
                <p className="text-sm text-gray-600">
                  Next stop forecast
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-orange-600">{aiData.seat.nextStopSeats} seats</p>
              <p className="text-xs text-gray-500">{aiData.seat.trend} trend</p>
            </div>
          </motion.div>
        )}

        {/* AI Factors */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaTrafficLight className="text-gray-500" />
            AI Analysis Factors
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>• Traffic patterns</div>
            <div>• Historical data</div>
            <div>• Time of day</div>
            <div>• Weather impact</div>
            <div>• Route popularity</div>
            <div>• Seasonal trends</div>
          </div>
          <button onClick={() => setShowDetails(!showDetails)} className="mt-3 text-xs text-blue-600 hover:underline">{showDetails ? 'Hide' : 'Show'} details</button>
          {showDetails && (
            <div className="mt-2 text-xs text-gray-600">
              <pre className="whitespace-pre-wrap">{JSON.stringify(aiData, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Green Points Display */}
        {aiData.carbon.greenPoints > 0 && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mt-4 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaTrophy className="text-yellow-300" />
                <span className="font-semibold">Green Points Earned!</span>
              </div>
              <span className="text-xl font-bold">+{aiData.carbon.greenPoints}</span>
            </div>
            <p className="text-green-100 text-sm mt-1">
              Keep using public transport to earn more points and help the environment!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
