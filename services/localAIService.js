// Local AI Service for Development
// Simulates the Firebase Functions API locally

// Import the AI modules (we'll create simplified versions)
const etaPrediction = require('./aiPredictionService').predictETA;
const carbonSavings = require('./aiPredictionService').calculateCarbonSavings;
const seatPrediction = require('./aiPredictionService').predictSeatAvailability;

// Local AI API endpoint simulation
export const callLocalAI = async (requestData) => {
  try {
    const {
      distanceKm,
      avgSpeed = 40,
      trafficFactor = 1,
      timeOfDay = 'normal',
      weather = 'clear',
      busType = 'standard',
      passengers = 1,
      currentSeats,
      totalSeats,
      routeId,
      currentStopIndex = 0,
      dayOfWeek = 'weekday'
    } = requestData;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Call AI modules
    const [etaResult, carbonResult, seatResult] = await Promise.allSettled([
      // ETA Prediction
      etaPrediction(
        [{ lat: 0, lng: 0 }], // Mock route coords
        [0, 0], // Mock current position
        avgSpeed
      ),
      
      // Carbon Savings
      Promise.resolve(carbonSavings(distanceKm, busType)),
      
      // Seat Forecast
      currentSeats && totalSeats ? 
        Promise.resolve(seatPrediction(currentSeats, { route: routeId }, currentStopIndex)) : 
        Promise.resolve({ predictedSeats: null, message: 'Seat data not provided' })
    ]);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        eta: etaResult.status === 'fulfilled' ? etaResult.value : { eta: 10, confidence: 0.5 },
        carbon: carbonResult.status === 'fulfilled' ? carbonResult.value : { co2Saved: 0, greenPoints: 0 },
        seat: seatResult.status === 'fulfilled' ? seatResult.value : { predictedSeats: currentSeats, trend: 'Stable' }
      }
    };

  } catch (error) {
    console.error('Local AI service error:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Mock API endpoint for development
export const mockAIEndpoint = async (requestData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const { distanceKm, currentSeats, totalSeats } = requestData;
  
  // Mock AI responses
  const mockResponse = {
    success: true,
    timestamp: new Date().toISOString(),
    data: {
      eta: {
        eta: Math.max(5, Math.round(distanceKm * 1.5 + Math.random() * 10)),
        confidence: Math.random() > 0.5 ? 'High' : 'Medium',
        get factors() {
          const totalEta = this.eta;
          const traffic = Math.round(Math.random() * 5);
          const history = Math.round(Math.random() * 3);
          const base = Math.max(1, totalEta - traffic - history);
          return {
            baseTime: base,
            trafficDelay: traffic,
            historicalFactor: history,
            timeOfDay: 'normal',
            weather: 'clear'
          };
        }
      },
      carbon: {
        co2Saved: (distanceKm * 0.09).toFixed(2),
        greenPoints: Math.round(distanceKm * 0.9),
        environmentalImpact: {
          treesEquivalent: Math.round(distanceKm * 0.045),
          carTripsAvoided: Math.round(distanceKm * 0.75),
          busType: 'standard'
        }
      },
      seat: currentSeats && totalSeats ? {
        currentSeats,
        totalSeats,
        nextStopSeats: Math.max(0, Math.min(totalSeats, currentSeats - Math.round(Math.random() * 5) + Math.round(Math.random() * 3))),
        trend: Math.random() > 0.5 ? 'Decreasing' : 'Stable',
        confidence: 'High',
        occupancyPercentage: Math.round(((totalSeats - currentSeats) / totalSeats) * 100)
      } : {
        currentSeats: null,
        message: 'Seat data not provided'
      }
    }
  };
  
  return mockResponse;
};



