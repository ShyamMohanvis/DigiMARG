// Test data generator for bus tracking animation
// This helps test the animation without needing real Firebase data

export const generateTestBusData = (busNumber, routeCoords) => {
  if (!routeCoords || routeCoords.length === 0) return null;
  
  // Generate random position along the route
  const randomIndex = Math.floor(Math.random() * routeCoords.length);
  const [lat, lng] = routeCoords[randomIndex];
  
  return {
    lat: lat + (Math.random() - 0.5) * 0.001, // Add small random offset
    lng: lng + (Math.random() - 0.5) * 0.001,
    timestamp: Date.now(),
    speed: Math.floor(Math.random() * 20) + 30, // 30-50 km/h
    direction: Math.floor(Math.random() * 360) // 0-360 degrees
  };
};

export const simulateBusMovement = (routeCoords, callback, interval = 3000) => {
  if (!routeCoords || routeCoords.length < 2) {
    console.error("simulateBusMovement: At least 2 coordinates required");
    return null;
  }
  
  console.log("simulateBusMovement: Starting smooth animation with", routeCoords.length, "coordinates");
  
  let currentIndex = 0;
  let currentPos = [...routeCoords[0]];
  
  // Update at 60FPS (~16ms), or let's use 50ms for performance
  const tickRate = 50; 
  // Speed is normally distance / time. 
  // We want the bus to move between nodes relatively quickly for testing.
  const speed = 0.0005; // degree change per 50ms
  
  const intervalId = setInterval(() => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= routeCoords.length) {
      // Loop back or stay at end. Let's loop back for testing.
      currentIndex = 0;
      nextIndex = 1;
      currentPos = [...routeCoords[0]];
    }
    
    const targetPos = routeCoords[nextIndex];
    const dx = targetPos[0] - currentPos[0];
    const dy = targetPos[1] - currentPos[1];
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist <= speed) {
      // We reached the target node, move to next
      currentPos = [...targetPos];
      currentIndex = nextIndex;
    } else {
      // Interpolate towards target
      currentPos[0] += (dx / dist) * speed;
      currentPos[1] += (dy / dist) * speed;
    }
    
    const testData = {
      lat: currentPos[0],
      lng: currentPos[1],
      timestamp: Date.now(),
      speed: Math.floor(Math.random() * 15) + 35,
      direction: Math.atan2(dy, dx) * (180 / Math.PI)
    };
    
    callback(testData);
  }, tickRate);
  
  return intervalId;
};

// Punjab route coordinates for testing
export const testRoutes = {
  "PB001": {
    from: "Amritsar",
    to: "Wagah Border",
    coords: [
      [31.6340, 74.8723], // Amritsar
      [31.6200, 74.8765], // Golden Temple area
      [31.6000, 74.8500], // Mid route
      [31.5900, 74.8000], // Approaching border
      [31.5820, 74.5730]  // Wagah Border
    ]
  },
  "PB002": {
    from: "Chandigarh",
    to: "Amritsar", 
    coords: [
      [30.7333, 76.7794], // Chandigarh
      [30.8000, 76.7000], // Mohali
      [31.0000, 75.5000], // Jalandhar
      [31.3000, 75.2000], // Mid route
      [31.6340, 74.8723]  // Amritsar
    ]
  }
};






