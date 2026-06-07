import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { db } from "./firebase";
import { onValue, ref } from "firebase/database";
import { useSearchParams } from "react-router-dom";
import { simulateBusMovement } from "./utils/testDataGenerator";
import { getBusByNumber, getAllRoutes } from "./data/punjabRoutes";
import { getRouteById } from "./data/punjabRoutes";

import GreenPointsSystem from "./GreenPointsSystem";
import SmartAI from "./SmartAI";

// Custom icons
const busIcon = L.icon({
  iconUrl: "https://img.icons8.com/3d-fluency/94/bus.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const startIcon = L.icon({
  iconUrl: "https://img.icons8.com/color/48/map-pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const endIcon = L.icon({
  iconUrl: "https://img.icons8.com/color/48/map-pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const highlightIcon = L.icon({
  iconUrl: "https://img.icons8.com/color/48/map-marker.png",
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  popupAnchor: [0, -20],
});

const myLocationIcon = L.icon({
  iconUrl: "https://img.icons8.com/color/48/user-location.png",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

// Helper: Geocode with Nominatim
async function geocode(place) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1&addressdetails=1&countrycodes=in`
    );
    const data = await res.json();
    if (data.length > 0) {
      const result = data[0];
      return [parseFloat(result.lat), parseFloat(result.lon)];
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Helper: Fetch OSRM route
async function getRoute(from, to) {
  try {
    if (!from || !to || !Array.isArray(from) || !Array.isArray(to)) {
      console.error("Invalid coordinates:", { from, to });
      return [];
    }
    
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (!data.routes || !data.routes.length) {
      console.error("No route found:", data);
      return [];
    }
    
    return data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
  } catch (error) {
    console.error("Route fetching error:", error);
    return [];
  }
}

// Helper: Haversine distance in km
function getDistanceKm(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

// Fit map bounds helper
function FitBounds({ coords }) {
  const map = useMap();
  if (coords.length > 0) {
    map.fitBounds(coords);
  }
  return null;
}

const RealTimeTracking = () => {
  const [searchParams] = useSearchParams();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [busPos, setBusPos] = useState(null);
  const busIntervalRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const SPEED_KMPH = 40; // fixed speed used for ETA calculations
  const [startDate] = useState(new Date());
  const [live, setLive] = useState(false);
  const [myLocation, setMyLocation] = useState(null);
  const [busNumber, setBusNumber] = useState("");
  const [busInfo, setBusInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("route");
  const [testMode, setTestMode] = useState(true); // Enable test mode by default
  const testSimulationRef = useRef(null);
  const [currentSeats, setCurrentSeats] = useState(25); // Mock current seats
  const [totalSeats, setTotalSeats] = useState(45); // Mock total seats
  const [greenPoints, setGreenPoints] = useState(0);
  const [routeId, setRouteId] = useState("PB001");

  // Punjab routes and bus data with exact coordinates
  const punjabRoutes = {
    "PB001": { 
      route: "Amritsar → Wagah Border", 
      distance: "283 km",
      from: "Amritsar", 
      to: "Wagah Border",
      fromCoords: [31.6340, 74.8723],
      toCoords: [31.5820, 74.5730],
      highlights: ["Golden Temple", "Kapurthala architecture", "Jalandhar sports hub", "Wagah Border ceremony"],
      bus: { name: "Golden Temple Express", driver: "Raj Kumar", phone: "+91-9876543210", capacity: 45, type: "AC Sleeper" }
    },
    "PB002": { 
      route: "Chandigarh → Amritsar", 
      distance: "230 km",
      from: "Chandigarh", 
      to: "Amritsar",
      fromCoords: [30.7333, 76.7794],
      toCoords: [31.6340, 74.8723],
      highlights: ["Mohali IT hub", "Jalandhar Devi Talab Mandir", "Pushpa Gujral Science City", "Golden Temple"],
      bus: { name: "Capital Connect", driver: "Amit Singh", phone: "+91-9876543211", capacity: 35, type: "Non-AC" }
    },
    "PB003": { 
      route: "Heritage Street, Amritsar", 
      distance: "1.1 km",
      from: "Golden Temple", 
      to: "Jallianwala Bagh",
      fromCoords: [31.6200, 74.8765],
      toCoords: [31.6206, 74.8769],
      highlights: ["Jallianwala Bagh", "Partition Museum", "Heritage architecture"],
      bus: { name: "Heritage Shuttle", driver: "Vikram Sharma", phone: "+91-9876543212", capacity: 25, type: "Mini Bus" }
    },
    "PB004": { 
      route: "Guru Gobind Singh Marg", 
      distance: "577 km",
      from: "Anandpur Sahib", 
      to: "Talwandi Sabo",
      fromCoords: [31.2360, 76.4997],
      toCoords: [29.9850, 75.0910],
      highlights: ["Anandpur Sahib", "Chamkaur Sahib", "Muktsar", "Talwandi Sabo"],
      bus: { name: "Guru Marg Express", driver: "Suresh Patel", phone: "+91-9876543213", capacity: 50, type: "AC Semi-Sleeper" }
    },
    "PB005": { 
      route: "Chandigarh → Shimla", 
      distance: "115 km",
      from: "Chandigarh", 
      to: "Shimla",
      fromCoords: [30.7333, 76.7794],
      toCoords: [31.1048, 77.1734],
      highlights: ["Mall Road Shimla", "Jakhoo Temple", "Kasauli sunset points", "Parwanoo Timber Trail"],
      bus: { name: "Himalayan Express", driver: "Ravi Kumar", phone: "+91-9876543214", capacity: 40, type: "AC Seater" }
    },
    "PB006": { 
      route: "Himalayan Expressway", 
      distance: "27.5 km",
      from: "Zirakpur", 
      to: "Parwanoo",
      fromCoords: [30.6426, 76.8173],
      toCoords: [30.8372, 76.9614],
      highlights: ["Smooth modern highway", "Gateway to Himachal hills"],
      bus: { name: "Expressway Shuttle", driver: "Gurpreet Singh", phone: "+91-9876543215", capacity: 30, type: "Non-AC Seater" }
    }
  };

  // Swap from and to locations
  const handleSwap = () => {
    const tempFrom = from;
    const tempFromCoords = fromCoords;
    setFrom(to);
    setTo(tempFrom);
    setFromCoords(toCoords);
    setToCoords(tempFromCoords);
  };

  // Track bus by number
  const handleTrackBusByNumber = async (busNum) => {
    console.log("Tracking bus by number:", busNum);
    
    // Find bus in our route data
    const busData = getBusByNumber(busNum);
    if (!busData) {
      console.log("Bus not found in route data, using default route");
      // Use default Amritsar to Wagah Border route
      const defaultRoute = [
        [31.6340, 74.8723], // Amritsar Bus Stand
        [31.6200, 74.8765], // Golden Temple
        [31.6206, 74.8769], // Jallianwala Bagh
        [31.6210, 74.8770], // Partition Museum
        [31.6000, 74.6000], // Attari Railway Station
        [31.5820, 74.5730]  // Wagah Border
      ];
      console.log("Using default route with", defaultRoute.length, "points");
      setRouteCoords(defaultRoute);
      setBusPos(defaultRoute[0]);
      setFrom("Amritsar");
      setTo("Wagah Border");
      setLive(true);
      return;
    }
    
    const { bus, route } = busData;
    console.log("Found bus data:", bus, "Route:", route.route);
    
    setBusInfo(bus);
    setFrom(route.start_location.name);
    setTo(route.end_location.name);
    
    // Use route coordinates from our data
    const routeCoords = route.stops.map(stop => [stop.lat, stop.lng]);
    console.log("Setting route coordinates:", routeCoords.length, "points");
    console.log("Route coordinates:", routeCoords);
    
    setRouteCoords(routeCoords);
    setBusPos(routeCoords[0]);
    
    // Start live tracking
    setLive(true);
    clearInterval(busIntervalRef.current);
    setIsAnimating(false);
  };

  const handleTrackBus = async () => {
    if (!busNumber.trim()) {
      alert("Enter bus number");
      return;
    }
    
    await handleTrackBusByNumber(busNumber);
  };

  // Initialize from URL parameters
  useEffect(() => {
    const urlBus = searchParams.get('busNumber') || searchParams.get('bus');
    const urlFrom = searchParams.get('from');
    const urlTo = searchParams.get('to');
    const autoStart = searchParams.get('autoStart') === 'true';
    const rid = searchParams.get('routeId');
    if (rid) setRouteId(rid);
    
    if (urlBus) {
      setBusNumber(urlBus);
      setActiveTab('bus');
      handleTrackBusByNumber(urlBus);
      
      // Auto-start animation if requested
      if (autoStart) {
        setTimeout(() => {
          console.log("Auto-starting animation for bus:", urlBus);
          setLive(true);
        }, 3000); // Wait 3 seconds for route to load
      }
    } else if (urlFrom && urlTo) {
      setFrom(decodeURIComponent(urlFrom));
      setTo(decodeURIComponent(urlTo));
      setActiveTab('route');
      handleShowRouteByParams(decodeURIComponent(urlFrom), decodeURIComponent(urlTo));
      
      // Auto-start animation if requested
      if (autoStart) {
        setTimeout(() => {
          console.log("Auto-starting animation for route:", urlFrom, "to", urlTo);
          setLive(true);
        }, 3000); // Wait 3 seconds for route to load
      }
    }
  }, [searchParams]);

  const handleShowRouteByParams = async (fromParam, toParam) => {
    const f = await geocode(fromParam);
    const t = await geocode(toParam);
    
    if (!f || !t) {
      alert(`Could not find coordinates for ${fromParam} or ${toParam}. Please try different locations.`);
      return;
    }
    
    setFromCoords(f);
    setToCoords(t);

    const route = await getRoute(f, t);
    if (route.length === 0) {
      alert("Could not find route between these locations. Please try different locations.");
      return;
    }
    
    setRouteCoords(route);
    setBusPos(route[0]);
    
    // Start live tracking from Firebase
    setLive(true);
    clearInterval(busIntervalRef.current);
    setIsAnimating(false);
  };

  // Show Route and start live tracking
  const handleShowRoute = async () => {
    if (!from || !to) {
      alert("Enter both From and To");
      return;
    }

    await handleShowRouteByParams(from, to);
  };

  // Start Bus Animation
  const handleStartBus = () => {
    if (!routeCoords.length) {
      alert("Show route first");
      return;
    }
    setLive(false); // Disable live tracking to use simulation
    startSimulation();
  };

  const handlePause = () => {
    clearInterval(busIntervalRef.current);
    setIsAnimating(false);
  };

  const handleReset = () => {
    handlePause();
    if (routeCoords.length) setBusPos(routeCoords[0]);
  };

  // Get user's current location
  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setMyLocation(coords);
      },
      (err) => {
        alert("Location access denied or failed");
      }
    );
  };

  // Distances and ETA
  const totalDistanceKm = useMemo(() => {
    if (routeCoords.length < 2) return 0;
    let sum = 0;
    for (let i = 1; i < routeCoords.length; i++) {
      sum += getDistanceKm(routeCoords[i - 1], routeCoords[i]);
    }
    return sum;
  }, [routeCoords]);

  const coveredDistanceKm = useMemo(() => {
    if (!busPos || routeCoords.length < 2) return 0;
    let sum = 0;
    for (let i = 1; i < routeCoords.length; i++) {
      const segEnd = routeCoords[i];
      sum += getDistanceKm(routeCoords[i - 1], segEnd);
      if (segEnd[0] === busPos[0] && segEnd[1] === busPos[1]) break;
    }
    return Math.min(sum, totalDistanceKm);
  }, [busPos, routeCoords, totalDistanceKm]);

  const remainingKm = Math.max(totalDistanceKm - coveredDistanceKm, 0);
  const etaMinutes = (remainingKm / SPEED_KMPH) * 60;
  const etaText = useMemo(() => {
    const totalMins = Math.max(0, Math.round(etaMinutes));
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h <= 0) return `${m} min`;
    return `${h} hr ${m} min`;
  }, [etaMinutes]);

  // Live location subscriber with fallback simulation
  useEffect(() => {
    if (!live || !routeCoords.length) {
      console.log("Animation not started - live:", live, "routeCoords:", routeCoords.length);
      return;
    }
    
    console.log("Starting animation - live:", live, "testMode:", testMode, "routeCoords:", routeCoords.length);
    
    // stop any running simulation when live tracking is enabled
    clearInterval(busIntervalRef.current);
    clearInterval(testSimulationRef.current);
    setIsAnimating(false);
    
    if (testMode) {
      // Use test simulation instead of Firebase
      console.log("Test mode enabled - starting test simulation...");
      console.log("Route coordinates for animation:", routeCoords);
      setIsAnimating(true);
      
      // Clear any existing simulation
      if (testSimulationRef.current) {
        clearInterval(testSimulationRef.current);
      }
      
      testSimulationRef.current = simulateBusMovement(routeCoords, (testData) => {
        // Removed console log to prevent console spam and improve performance
        setBusPos([testData.lat, testData.lng]);
      }, 3000); // 3 seconds for better visibility
      
      return () => {
        if (testSimulationRef.current) {
          clearInterval(testSimulationRef.current);
          setIsAnimating(false);
        }
      };
    }
    
    // Use bus number specific path if tracking by bus number, otherwise use general path
    const path = busNumber ? `buses/${busNumber.toUpperCase()}/location` : "bus/location";
    const locRef = ref(db, path);
    
    let hasRealData = false;
    let fallbackTimeout;
    
    const unsub = onValue(locRef, (snap) => {
      const v = snap.val();
      if (v && typeof v.lat === "number" && typeof v.lng === "number") {
        hasRealData = true;
        setBusPos([v.lat, v.lng]);
        setIsAnimating(true);
        clearTimeout(fallbackTimeout);
      } else if (!hasRealData) {
        // If no real data after 3 seconds, start simulation
        fallbackTimeout = setTimeout(() => {
          console.log("No real-time data available, starting simulation...");
          setTestMode(true);
          setIsAnimating(true);
          testSimulationRef.current = simulateBusMovement(routeCoords, (testData) => {
            setBusPos([testData.lat, testData.lng]);
          }, 2000);
        }, 3000);
      }
    }, (error) => {
      console.error("Firebase connection error:", error);
      // Start simulation as fallback
      setTestMode(true);
      setIsAnimating(true);
      testSimulationRef.current = simulateBusMovement(routeCoords, (testData) => {
        setBusPos([testData.lat, testData.lng]);
      }, 2000);
    });
    
    return () => {
      unsub();
      clearTimeout(fallbackTimeout);
    };
  }, [live, busNumber, routeCoords, testMode]);

  // Simulation function
  const startSimulation = () => {
    if (!routeCoords.length) return;
    
    let step = 0;
    clearInterval(busIntervalRef.current);
    setIsAnimating(true);
    
    // Start from current position or beginning
    const startIndex = busPos ? routeCoords.findIndex(coord => 
      Math.abs(coord[0] - busPos[0]) < 0.001 && Math.abs(coord[1] - busPos[1]) < 0.001
    ) : 0;
    
    step = Math.max(0, startIndex);
    setBusPos(routeCoords[step]);
    
    busIntervalRef.current = setInterval(() => {
      step++;
      if (step >= routeCoords.length) {
        // Loop back to start for continuous simulation
        step = 0;
      }
      setBusPos(routeCoords[step]);
    }, 1000); // Slower animation for better visibility
  };

  // Generate sidebar timeline using actual route coordinates
  const timeline = useMemo(() => {
    if (!routeCoords || routeCoords.length < 2) return [];
    
    const items = [];
    let accKm = 0;
    
    // Add start location
    const startTime = new Date(startDate);
    const startTimeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    items.push({ 
      index: 0, 
      coords: routeCoords[0], 
      km: 0, 
      timeStr: startTimeStr,
      name: from || "Start"
    });
    
    // Sample points along the actual route
    const step = Math.max(1, Math.floor(routeCoords.length / 6)); // 6 intermediate stops max
    for (let i = step; i < routeCoords.length - step; i += step) {
      accKm += getDistanceKm(routeCoords[i - step], routeCoords[i]);
      const minutesFromStart = (accKm / SPEED_KMPH) * 60;
      const eta = new Date(startDate.getTime() + minutesFromStart * 60000);
      const timeStr = eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Get highlight name if available
      const currentRoute = Object.values(punjabRoutes).find(route => 
        route.from === from && route.to === to
      );
      const highlightIndex = Math.floor((i / routeCoords.length) * (currentRoute?.highlights?.length || 0));
      const highlightName = currentRoute?.highlights?.[highlightIndex] || `Stop ${items.length}`;
      
      items.push({ 
        index: items.length, 
        coords: routeCoords[i], 
        km: accKm, 
        timeStr,
        name: highlightName
      });
    }
    
    // Add end location
    const totalDistance = accKm + getDistanceKm(routeCoords[routeCoords.length - 2], routeCoords[routeCoords.length - 1]);
    const endMinutes = (totalDistance / SPEED_KMPH) * 60;
    const endTime = new Date(startDate.getTime() + endMinutes * 60000);
    const endTimeStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    items.push({ 
      index: items.length, 
      coords: routeCoords[routeCoords.length - 1], 
      km: totalDistance, 
      timeStr: endTimeStr,
      name: to || "Destination"
    });
    
    return items;
  }, [routeCoords, from, to, startDate]);

  // Determine current timeline index nearest to bus position
  const currentIndex = useMemo(() => {
    if (!busPos || timeline.length === 0) return -1;
    let best = -1;
    let bestDist = Number.POSITIVE_INFINITY;
    timeline.forEach((t, i) => {
      const d = getDistanceKm(busPos, t.coords);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }, [busPos, timeline]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-100">
      
      {/* 1. Map container taking full screen */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[31.1471, 75.3412]}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {fromCoords && <Marker position={fromCoords} icon={startIcon}></Marker>}
          {toCoords && <Marker position={toCoords} icon={endIcon}></Marker>}
          {myLocation && <Marker position={myLocation} icon={myLocationIcon}></Marker>}
          {routeCoords.length > 0 && (
            <>
              <Polyline positions={routeCoords} color="#10b981" weight={4} opacity={0.9} />
              {timeline.map((t, i) => (
                <Marker key={i} position={t.coords} icon={highlightIcon}></Marker>
              ))}
            </>
          )}
          {busPos && <Marker position={busPos} icon={busIcon}></Marker>}
          <FitBounds coords={routeCoords} />
        </MapContainer>
      </div>

      {/* 2. Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-center bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/40">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-md">
            DigiMarg
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-800 font-semibold text-lg ml-4">
            <span>{from || "From"}</span>
            <span className="text-emerald-500">→</span>
            <span>{to || "To"}</span>
            {busNumber && (
              <span className="ml-4 bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">
                Bus {busNumber.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-md whitespace-nowrap pointer-events-auto"
        >
          ← Back
        </button>
      </div>

      {/* 3. Floating Left Panel */}
      <div className="absolute top-28 left-4 w-96 max-h-[calc(100vh-8rem)] overflow-y-auto z-[1000] rounded-3xl hide-scrollbar pointer-events-none">
        <div className="flex flex-col gap-4 pb-8 pointer-events-auto">
          
          {/* Smart AI Card at the top */}
          {routeCoords.length > 0 && (
            <div className="shadow-2xl rounded-3xl overflow-hidden border border-white/40 backdrop-blur-md">
              <SmartAI 
                distanceKm={coveredDistanceKm}
                currentSeats={currentSeats}
                totalSeats={totalSeats}
                routeId={routeId}
                userId="demo-user"
              />
            </div>
          )}

          {/* Controls Card */}
          {routeCoords.length > 0 && (
            <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/40">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Animation Controls</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isAnimating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                  <span className="text-xs font-semibold text-slate-500">
                    {isAnimating ? 'Running' : 'Stopped'}
                  </span>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors relative ${testMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${testMode ? 'translate-x-5' : ''}`}></div>
                </div>
                <span className="text-sm font-semibold text-slate-700">Test Mode (Simulation)</span>
              </label>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <button 
                  onClick={() => { setLive(true); setIsAnimating(true); }}
                  disabled={isAnimating}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  ▶️ Start
                </button>
                <button 
                  onClick={() => {
                    setLive(false); setIsAnimating(false);
                    if (testSimulationRef.current) clearInterval(testSimulationRef.current);
                  }}
                  disabled={!isAnimating}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  ⏸️ Pause
                </button>
                <button 
                  onClick={() => {
                    setLive(false); setIsAnimating(false);
                    if (testSimulationRef.current) clearInterval(testSimulationRef.current);
                    if (routeCoords.length > 0) setBusPos(routeCoords[0]);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  🔄 Reset
                </button>
                <button 
                  onClick={() => {
                    if (routeCoords.length === 0) {
                      const defaultRoute = [[31.6340, 74.8723], [31.6200, 74.8765], [31.5820, 74.5730]];
                      setRouteCoords(defaultRoute); setBusPos(defaultRoute[0]);
                      setFrom("Amritsar"); setTo("Wagah Border");
                    }
                    setLive(true); setIsAnimating(true);
                  }}
                  className="bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  🧪 Test
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-3 gap-2 border border-slate-100 divide-x divide-slate-200">
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total</div>
                  <div className="text-sm font-bold text-slate-800">{totalDistanceKm.toFixed(1)} <span className="text-[10px]">km</span></div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Covered</div>
                  <div className="text-sm font-bold text-emerald-600">{coveredDistanceKm.toFixed(1)} <span className="text-[10px]">km</span></div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">ETA</div>
                  <div className="text-sm font-bold text-slate-800">{etaText}</div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Card */}
          {timeline.length > 0 && (
            <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/40">
              <h3 className="font-bold text-slate-800 mb-4">Itinerary</h3>
              <div className="relative pl-4">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                {timeline.map((t, idx) => {
                  const isReached = idx <= currentIndex;
                  const isActive = idx === currentIndex;
                  return (
                    <div key={idx} className="relative mb-6 last:mb-0 pl-6">
                      <div className={`absolute left-[-5px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center z-10
                        ${isActive ? 'border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]' : isReached ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}
                      `}>
                        {isActive && <div className="text-[8px]">🚌</div>}
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-xs font-bold text-slate-800">{t.timeStr}</div>
                        <div className="text-sm text-slate-600">{t.name || `Stop ${idx + 1}`}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 4. Floating Green Points Pill */}
      {totalDistanceKm > 0 && (
        <div className="absolute top-28 right-4 z-[1000] transform transition-transform hover:scale-105 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-white/40 overflow-hidden">
             <GreenPointsSystem
                distance={coveredDistanceKm}
                busType="standard"
                onPointsEarned={(points, co2Saved) => {
                  setGreenPoints(prev => prev + points);
                }}
              />
          </div>
        </div>
      )}
      
      {/* 5. Location Control */}
      <button 
        onClick={handleMyLocation} 
        className="absolute bottom-8 right-4 z-[1000] w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 hover:bg-slate-50 transition-colors text-2xl pointer-events-auto"
        title="My Location"
      >
        📍
      </button>

      {/* Hide scrollbar styles locally */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );

};

export default RealTimeTracking;
