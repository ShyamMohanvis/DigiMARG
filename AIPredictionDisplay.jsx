import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBrain, FaTrafficLight, FaUsers, FaClock, FaLeaf } from "react-icons/fa";
import { predictETA, predictSeatAvailability, calculateCarbonSavings } from "./services/aiPredictionService";

const AIPredictionDisplay = ({ 
  routeCoords, 
  currentPosition, 
  busNumber, 
  currentSeats, 
  totalSeats,
  distance 
}) => {
  const [etaPrediction, setEtaPrediction] = useState(null);
  const [seatPrediction, setSeatPrediction] = useState(null);
  const [carbonSavings, setCarbonSavings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPredictions = async () => {
      setLoading(true);
      
      try {
        // AI ETA Prediction
        if (routeCoords && currentPosition) {
          const eta = await predictETA(routeCoords, currentPosition);
          setEtaPrediction(eta);
        }

        // AI Seat Prediction
        if (currentSeats !== null && totalSeats) {
          const seats = predictSeatAvailability(currentSeats, { route: busNumber }, 0);
          setSeatPrediction(seats);
        }

        // Carbon Savings
        if (distance > 0) {
          const savings = calculateCarbonSavings(distance);
          setCarbonSavings(savings);
        }
      } catch (error) {
        console.error('AI prediction error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, [routeCoords, currentPosition, currentSeats, totalSeats, distance, busNumber]);

  if (loading) {
    return (
      <div className="ai-predictions-loading">
        <div className="loading-spinner"></div>
        <p>AI is analyzing data...</p>
      </div>
    );
  }

  return (
    <div className="ai-predictions-container">
      <div className="ai-header">
        <FaBrain className="ai-icon" />
        <h3 className="ai-title">AI-Powered Predictions</h3>
        <div className="ai-badge">Powered by AI</div>
      </div>

      <div className="predictions-grid">
        {/* ETA Prediction */}
        {etaPrediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prediction-card eta-card"
          >
            <div className="card-header">
              <FaClock className="card-icon" />
              <span className="card-title">Smart ETA</span>
            </div>
            
            <div className="prediction-content">
              <div className="main-prediction">
                <span className="prediction-value">{etaPrediction.eta}</span>
                <span className="prediction-unit">min</span>
              </div>
              
              <div className="confidence-bar">
                <div className="confidence-label">Confidence</div>
                <div className="confidence-track">
                  <div 
                    className="confidence-fill"
                    style={{ width: `${etaPrediction.confidence * 100}%` }}
                  ></div>
                </div>
                <div className="confidence-percentage">
                  {Math.round(etaPrediction.confidence * 100)}%
                </div>
              </div>
              
              <div className="prediction-factors">
                <div className="factor-item">
                  <FaTrafficLight className="factor-icon" />
                  <span>Traffic: +{etaPrediction.factors.trafficDelay}min</span>
                </div>
                <div className="factor-item">
                  <FaClock className="factor-icon" />
                  <span>Base: {etaPrediction.factors.baseTime}min</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Seat Prediction */}
        {seatPrediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prediction-card seat-card"
          >
            <div className="card-header">
              <FaUsers className="card-icon" />
              <span className="card-title">Crowd Prediction</span>
            </div>
            
            <div className="prediction-content">
              <div className="main-prediction">
                <span className="prediction-value">{seatPrediction.predictedSeats}</span>
                <span className="prediction-unit">seats</span>
              </div>
              
              <div className="prediction-details">
                <div className="detail-item">
                  <span className="detail-label">Current:</span>
                  <span className="detail-value">{currentSeats} seats</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Expected boarding:</span>
                  <span className="detail-value">+{seatPrediction.boardingPrediction}</span>
                </div>
              </div>
              
              <div className="confidence-indicator">
                <div className="confidence-dot" style={{ 
                  backgroundColor: seatPrediction.confidence > 0.8 ? '#4caf50' : 
                                  seatPrediction.confidence > 0.6 ? '#ff9800' : '#f44336'
                }}></div>
                <span className="confidence-text">
                  {seatPrediction.confidence > 0.8 ? 'High' : 
                   seatPrediction.confidence > 0.6 ? 'Medium' : 'Low'} confidence
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Carbon Savings */}
        {carbonSavings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prediction-card carbon-card"
          >
            <div className="card-header">
              <FaLeaf className="card-icon" />
              <span className="card-title">Carbon Impact</span>
            </div>
            
            <div className="prediction-content">
              <div className="main-prediction">
                <span className="prediction-value">{carbonSavings.co2Saved}</span>
                <span className="prediction-unit">g CO₂</span>
              </div>
              
              <div className="carbon-details">
                <div className="carbon-saved">
                  <span className="carbon-label">Saved by choosing bus</span>
                  <span className="carbon-equivalent">{carbonSavings.equivalent}</span>
                </div>
                
                <div className="green-points">
                  <span className="points-label">Green Points:</span>
                  <span className="points-value">+{carbonSavings.greenPoints}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="ai-footer">
        <p className="ai-disclaimer">
          ⚡ Predictions powered by AI models trained on traffic patterns, historical data, and environmental factors.
        </p>
      </div>
    </div>
  );
};

export default AIPredictionDisplay;



