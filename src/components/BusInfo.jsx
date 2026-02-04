

import React from "react";
import SmartAI from "../../SmartAI";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { FiPhoneCall, FiUser } from "react-icons/fi";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl: iconShadowUrl,
});

const buses = [
  {
    busNumber: "PB20480001",
    name: "Banaras Express",
    status: "Running",
    statusText: "Running",
    source: "Banaras",
    destination: "Gorakhpur",
    driverName: "Ram Sharma",
    driverPhone: "+91 9898989898",
    seatAvailable: 17,
    seatCapacity: 50,
    currentStop: "Ayodhya - Bypass (W)",
    routeStops: [
      { name: "Banaras", scheduled: "07:00 AM" },
      { name: "Jaunpur", scheduled: "07:40 AM" },
      { name: "Sultanpur", scheduled: "08:30 AM" },
      { name: "Ayodhya - Bypass (W)", scheduled: "09:30 AM" },
      { name: "Gonda", scheduled: "10:20 AM" },
      { name: "Gorakhpur", scheduled: "11:10 AM" },
    ],
    currentLocation: { city: "Ayodhya", lat: 26.7997, lng: 82.2043 },
  },
];

export default function BusInfo() {
  const { busNumber } = useParams();
  const bus = buses.find((b) => b.busNumber === busNumber);

  if (!bus) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 font-semibold text-xl">
        Bus not found.
      </div>
    );
  }

  const seatPercent = (bus.seatAvailable / bus.seatCapacity) * 100;
  const currentIdx = bus.routeStops.findIndex((stop) => stop.name === bus.currentStop);

  return (
    <div className="min-h-screen p-12 bg-gradient-to-br from-green-50 via-white to-green-100 font-sans max-w-7xl mx-auto rounded-3xl shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-[480px_1fr] gap-12 bg-white rounded-3xl shadow-xl p-10">
        {/* LEFT BOX: Bus Details */}
        <div className="flex flex-col justify-start space-y-10">
          {/* Header */}
          <div>
            <h1 className="text-5xl font-extrabold text-green-900 leading-tight">
              {bus.name}
            </h1>
            <p className="text-green-700 font-semibold text-lg mt-1">
              Bus Number: <span className="text-green-900 font-bold">{bus.busNumber}</span>
            </p>
            {/* Status and small green dot */}
            <div className="flex items-center mt-4 space-x-2">
              <span className="w-4 h-4 rounded-full bg-green-500 inline-block" />
              <span className="text-green-600 font-semibold uppercase tracking-wide text-sm select-none">
                {bus.statusText}
              </span>
            </div>
          </div>

          {/* Route Info */}
          <p className="text-green-700 text-2xl font-bold flex items-center gap-3">
            <span>{bus.source}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#22c55e"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span>{bus.destination}</span>
          </p>

          {/* Driver Information */}
          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-3 text-gray-900 font-semibold">
              <FiUser className="text-green-600 w-6 h-6 flex-shrink-0" />
              <span>Driver: {bus.driverName}</span>
            </div>
            <div className="flex items-center gap-3 text-green-700 font-semibold">
              <FiPhoneCall className="text-green-600 w-6 h-6 flex-shrink-0" />
              <a
                href={`tel:${bus.driverPhone}`}
                className="hover:underline"
                aria-label={`Call ${bus.driverName}`}
              >
                {bus.driverPhone}
              </a>
            </div>
          </div>

          {/* Seat Availability */}
          <div>
            <label className="block mb-2 text-xl font-bold text-green-800">
              Seats Available
            </label>
            <div className="relative h-14 rounded-full bg-green-200 shadow-inner overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-700 via-green-600 to-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${seatPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-green-900 text-3xl select-none pointer-events-none">
                {bus.seatAvailable} / {bus.seatCapacity}
              </div>
            </div>
          </div>

          {/* Route Timeline */}
          <div>
            <h2 className="text-green-800 font-bold text-2xl mb-6">Route Timeline</h2>
            <div className="overflow-x-auto relative pb-6 px-6 border rounded-lg bg-green-50 shadow-inner select-none">
              <div className="flex items-center space-x-14 min-w-max relative">
                <div
                  className="absolute top-[36px] left-6 right-6 h-1 bg-gradient-to-r from-green-600 via-green-400 to-green-300 rounded-full z-0"
                  style={{ transform: "translateY(-50%)" }}
                />
                {bus.routeStops.map((stop, idx) => {
                  const isCurrent = idx === currentIdx;
                  const done = idx < currentIdx;

                  return (
                    <div
                      key={stop.name}
                      className={`relative z-10 flex flex-col items-center min-w-[120px] text-center ${
                        isCurrent ? "cursor-default" : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${
                          isCurrent
                            ? "bg-green-600 border-green-900 animate-pulse"
                            : done
                            ? "bg-green-400 border-green-700"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {done && !isCurrent && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {isCurrent && <span className="w-4 h-4 bg-white rounded-full" />}
                      </div>
                      <p
                        className={`mt-3 font-semibold ${
                          isCurrent ? "text-green-700" : done ? "text-green-600" : "text-gray-400"
                        }`}
                        title={stop.name}
                      >
                        {stop.name}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isCurrent ? "text-green-700" : "text-gray-400"
                        }`}
                      >
                        {stop.scheduled}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        
        {/* RIGHT BOX: Map and Location + AI */}
        <div
          className="bg-green-50 rounded-tr-3xl rounded-br-3xl p-8 flex flex-col items-center justify-start sticky top-16 z-30"
          style={{ alignSelf: "start" }} // Prevent sticky stretching when flex container
        >
          <h2 className="text-center text-3xl font-bold text-green-800 mb-10">
            Current Location: <span className="text-green-700">{bus.currentLocation.city}</span>
          </h2>
          <div className="w-full rounded-xl shadow-xl overflow-hidden" style={{ height: 420 }}>
            
            <div className="sticky top-16 z-30 w-full rounded-xl shadow-xl overflow-hidden" style={{ height: 420 }}>
  <MapContainer
    center={[bus.currentLocation.lat, bus.currentLocation.lng]}
    zoom={12}
    scrollWheelZoom
    style={{ height: "100%", width: "100%" }}
    key={`${bus.currentLocation.lat}-${bus.currentLocation.lng}`}
  >
    <TileLayer
      attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[bus.currentLocation.lat, bus.currentLocation.lng]}>
      <Popup>{bus.name} is located here.</Popup>
    </Marker>
  </MapContainer>
</div>
          </div>

          {/* AI Insights beside bus details */}
          <div className="w-full mt-6">
            <SmartAI
              distanceKm={120}
              currentSeats={bus.seatAvailable}
              totalSeats={bus.seatCapacity}
              routeId="PB001"
              userId="demo-user"
            />
          </div>
        </div>
      </div>
    </div>
  );
}