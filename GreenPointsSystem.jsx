import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaTrophy, FaMedal, FaCoins } from "react-icons/fa";

const GreenPointsSystem = ({ distance, busType, onPointsEarned }) => {
  const [points, setPoints] = useState(0);
  const [totalCo2Saved, setTotalCo2Saved] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const previousDistanceRef = useRef(0);

  useEffect(() => {
    // Compute incremental distance since last update to avoid double counting
    const previousDistance = previousDistanceRef.current || 0;
    const incrementalDistance = Math.max(0, (Number(distance) || 0) - previousDistance);

    // Update previous for next render
    previousDistanceRef.current = Number(distance) || 0;

    if (incrementalDistance > 0) {
      // Emission factors in g/km (car vs bus per passenger)
      const carGPerKm = 120;
      const busGPerKm = 40;
      const savedPerKm = Math.max(0, carGPerKm - busGPerKm);
      const co2SavedThisStep = savedPerKm * incrementalDistance; // grams
      const pointsThisStep = Math.round(co2SavedThisStep / 100); // 100 g = 1 point

      setPoints(prev => prev + pointsThisStep);
      setTotalCo2Saved(prev => prev + co2SavedThisStep);

      // Notify parent, if requested
      if (typeof onPointsEarned === 'function' && (pointsThisStep > 0 || co2SavedThisStep > 0)) {
        try {
          onPointsEarned(pointsThisStep, co2SavedThisStep);
        } catch {}
      }

      setShowAnimation(true);
      const t = setTimeout(() => setShowAnimation(false), 800);
      return () => clearTimeout(t);
    }
  }, [distance, onPointsEarned]);

  const getLeaderboard = () => {
    return [
      { name: "Prakhar", points: 500, co2Saved: 5000, rank: 1 },
      { name: "Shubh", points: 200, co2Saved: 2000, rank: 2 },
      { name: "You", points: points, co2Saved: totalCo2Saved, rank: 3 }
    ];
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaTrophy className="text-yellow-500" />;
      case 2: return <FaMedal className="text-gray-400" />;
      case 3: return <FaMedal className="text-amber-600" />;
      default: return <FaCoins className="text-emerald-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-5 bg-gradient-to-br from-[#e8f5e8] to-[#f1f8e9] rounded-2xl border border-[#c8e6c9]">
      {/* Current Trip Points */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: showAnimation ? 1.05 : 1, opacity: 1 }}
        className="bg-white rounded-xl p-5 shadow-[0_4px_12px_rgba(76,175,80,0.15)] border-2 border-emerald-500 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-500 animate-[shimmer_2s_infinite]"></div>
        
        <div className="flex items-center gap-3 mb-4">
          <FaLeaf className="text-emerald-500 text-2xl" />
          <h3 className="text-lg font-bold text-emerald-800 m-0">Green Points Earned</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-center">
          <div className="text-center">
            <span className="block text-3xl md:text-4xl font-black text-emerald-500 leading-none">+{points}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Points</span>
          </div>
          
          <div className="text-center">
            <span className="block text-2xl md:text-3xl font-bold text-emerald-800 leading-none">{totalCo2Saved.toFixed(0)}g</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">CO₂ Saved</span>
          </div>
          
          <div className="col-span-1 md:col-span-2 text-center pt-3 mt-1 border-t border-slate-200">
            <span className="text-sm text-emerald-600 font-semibold">
              = {Math.round(totalCo2Saved / 1000 * 10) / 10} kg CO₂
            </span>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl p-5 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <FaTrophy className="text-yellow-500 text-xl" />
          <h3 className="text-lg font-bold text-slate-800 m-0">Eco Warriors Leaderboard</h3>
        </div>
        
        <div className="flex flex-col gap-3">
          {getLeaderboard().map((user, index) => (
            <motion.div
              key={user.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 md:gap-4 p-3 rounded-lg transition-all ${
                user.name === "You" 
                  ? "bg-gradient-to-br from-[#e8f5e8] to-[#f1f8e9] border-2 border-emerald-500 scale-[1.02]" 
                  : "bg-slate-50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 min-w-[50px] md:min-w-[60px]">
                {getRankIcon(user.rank)}
                <span className="text-sm font-semibold text-slate-600">#{user.rank}</span>
              </div>
              
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-base font-semibold text-slate-800">{user.name}</span>
                <span className="text-xs text-slate-500">{Math.round(user.co2Saved)}g CO₂ saved</span>
              </div>
              
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold text-emerald-500 leading-none">{user.points}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">pts</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200 text-center">
          <p className="text-sm text-emerald-600 font-medium m-0">
            🌍 Every trip makes a difference! Keep going green!
          </p>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-white rounded-xl p-5 shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Redeem Your Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-200 border border-slate-300 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
            <div className="text-base font-bold text-emerald-600 mb-1">50 pts</div>
            <div className="text-xs text-slate-600 font-medium">10% Bus Discount</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-200 border border-slate-300 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
            <div className="text-base font-bold text-emerald-600 mb-1">100 pts</div>
            <div className="text-xs text-slate-600 font-medium">Free Coffee</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-200 border border-slate-300 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
            <div className="text-base font-bold text-emerald-600 mb-1">200 pts</div>
            <div className="text-xs text-slate-600 font-medium">Movie Ticket</div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default GreenPointsSystem;
