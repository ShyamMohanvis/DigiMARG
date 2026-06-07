# 🚌 DigiMARG - Smart Bus Tracking System

[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify)](https://bus-tracking-systemm.netlify.app/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.2.1-FFCA28.svg?logo=firebase)](https://firebase.google.com/)

**[🚀 View Live Demo](https://bus-tracking-systemm.netlify.app/)** | **[🐛 Report Bug](https://github.com/ShyamMohanvis/DigiMARG/issues)**

**DigiMARG (Mobility Assistance for Reliable Governance)** is a comprehensive real-time bus tracking and management system built with React, Firebase, and Tailwind CSS. The platform provides intelligent bus tracking, route exploration, AI-powered ETA insights, and an innovative eco-friendly Carbon Reduction Initiative (CRI).

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Key Components](#key-components)
- [AI Features](#ai-features)
- [Admin Panels](#admin-panels)
- [API & Services](#api--services)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

DigiMARG is a full-featured bus tracking application designed for the Punjab region, featuring:

- **Real-time bus tracking** with live location updates
- **AI-powered predictions** for ETA, seat availability, and carbon savings
- **Route exploration** with detailed Punjab route information
- **Green Points System** for environmental impact tracking
- **Admin management panels** for conductors and transport managers
- **Interactive maps** using Leaflet and OpenStreetMap

## ✨ Features

### Public Features

1. **Real-Time Bus Tracking**
   - Live bus location tracking on interactive maps
   - Route visualization with stops and highlights
   - ETA calculations and distance tracking
   - Bus search by number or route

2. **Route Explorer**
   - Browse famous Punjab routes
   - View route details, stops, and highlights
   - See available buses for each route
   - Interactive route maps

3. **Bus Selection**
   - Filter buses by type, seats, and price
   - Sort by various criteria
   - View detailed bus information
   - Direct tracking integration

4. **AI-Powered Insights**
   - Smart ETA predictions with traffic analysis
   - Seat availability forecasting
   - Carbon footprint calculations
   - Green Points earning system

5. **Carbon Reduction Initiative (CRI)**
   - CO₂ savings calculator
   - Green Points system (100g CO₂ = 1 point)
   - Leaderboard for eco warriors
   - Rewards and redemption system

### Admin Features

1. **Conductor Panel**
   - Route-specific authentication
   - Real-time seat management
   - Passenger tracking
   - Bus status updates

2. **Transport Manager Dashboard**
   - Fleet management
   - Route planning and optimization
   - Performance analytics
   - Announcement system
   - Maintenance scheduling

## 🛠 Technology Stack

### Frontend
- **React 19.1.1** - UI framework
- **Vite 7.1.2** - Build tool and dev server
- **React Router DOM 7.8.2** - Routing
- **Tailwind CSS 4.1.12** - Styling
- **Framer Motion 12.23.12** - Animations
- **Leaflet 1.9.4** & **React-Leaflet 5.0.0** - Maps
- **React Icons 5.5.0** - Icon library
- **Lucide React 0.542.0** - Additional icons
- **React Confetti 6.4.0** - Celebration effects
- **Styled Components 6.1.19** - CSS-in-JS

### Backend & Services
- **Firebase 12.2.1**
  - Realtime Database - Live bus location updates
  - Hosting - Production deployment
  - Functions - Serverless backend (configured)
- **Local AI Server** - Development AI service

### Development Tools
- **ESLint 9.33.0** - Code linting
- **TypeScript types** - Type definitions

## 📁 Project Structure

```
bus-tracking/
├── src/
│   ├── components/          # React components
│   │   ├── AdminHome.jsx    # Admin dashboard
│   │   ├── AdminLogin.jsx   # Admin authentication
│   │   ├── BusDetails.jsx   # Bus list page
│   │   ├── BusInfo.jsx      # Individual bus details
│   │   ├── ConductorPanel.jsx  # Conductor interface
│   │   ├── Hero.jsx         # Landing page
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── ProtectedRoute.jsx  # Route protection
│   │   └── TransportManager.jsx # Manager dashboard
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   ├── App.css              # App styles
│   └── index.css            # Global styles
├── data/
│   └── punjabRoutes.js      # Route data and helpers
├── services/
│   ├── aiApiServer.js       # Local AI server
│   ├── aiPredictionService.js  # AI prediction logic
│   └── localAIService.js    # Local AI service wrapper
├── utils/
│   └── testDataGenerator.js # Test data utilities
├── public/                  # Static assets
├── dist/                    # Build output
├── functions/               # Firebase Functions (Node.js)
├── firebase.js              # Firebase configuration
├── firebase.json            # Firebase config
├── database.rules.json     # Firebase security rules
├── vite.config.js          # Vite configuration
├── package.json             # Dependencies
└── README.md               # This file
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Firebase account** (free tier works)
- **Git** (optional)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd bus-tracking
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database**
3. Copy your Firebase config from Project Settings
4. Update `firebase.js` with your credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### Step 4: Configure Database Rules

The `database.rules.json` file contains security rules. Update them as needed:

```json
{
  "rules": {
    "buses": {
      ".read": true,
      ".write": "auth != null"
    },
    "routes": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only database:rules
```

### Step 5: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file (optional for local development):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Firebase Hosting

Configured in `firebase.json`:
- Public directory: `dist`
- SPA routing: All routes redirect to `index.html`

### Vite Configuration

Located in `vite.config.js`:
- Tailwind CSS plugin enabled
- React plugin configured

## 📖 Usage

### For Passengers

1. **Track a Bus**
   - Enter source and destination cities
   - OR enter bus number directly
   - Click "Track Bus"
   - View real-time location on map

2. **Explore Routes**
   - Navigate to Routes page
   - Browse available routes
   - Click on a route to see details
   - View route map and stops

3. **Select a Bus**
   - Search by cities or bus number
   - Filter by type, seats, price
   - View AI predictions
   - Select and track bus

4. **Calculate Carbon Impact**
   - Use CRI calculator on homepage
   - Enter source and destination
   - View CO₂ saved and points earned

### For Administrators

1. **Conductor Login**
   - Go to Admin Login
   - Select "Conductor" role
   - Username: `conductor`
   - Password: `conductor123`
   - Select route and enter route password

2. **Manager Login**
   - Go to Admin Login
   - Select "Transport Manager" role
   - Username: `manager`
   - Password: `manager123`
   - Access full dashboard

## 🧩 Key Components

### RealTimeTracking.jsx
Main tracking component with:
- Interactive map with Leaflet
- Real-time bus position updates
- Route visualization
- Timeline of stops
- AI predictions integration
- Animation controls

### SmartAI.jsx
AI-powered insights component:
- ETA predictions with traffic analysis
- Carbon savings calculations
- Seat availability forecasting
- Interactive controls for traffic/passengers

### RouteExplorer.jsx
Route browsing interface:
- Grid of route cards
- Route details modal
- Interactive maps
- Statistics dashboard

### BusSelectionNew.jsx
Bus selection and filtering:
- Advanced filtering options
- Sorting capabilities
- AI predictions per bus
- Direct tracking integration

### GreenPointsSystem.jsx
Environmental impact tracking:
- Real-time points calculation
- CO₂ savings display
- Leaderboard
- Rewards section

## 🤖 AI Features

### AI Prediction Service

The system includes a comprehensive AI prediction service (`services/aiApiServer.js`) that provides:

1. **ETA Prediction**
   - Base time calculation
   - Traffic delay analysis
   - Historical data integration
   - Weather impact
   - Time-of-day adjustments

2. **Carbon Savings**
   - CO₂ emission calculations
   - Green Points generation
   - Environmental impact metrics
   - Bonus points for long distances

3. **Seat Availability**
   - Historical boarding patterns
   - Peak time predictions
   - Trend analysis
   - Confidence scoring

### Local AI Server

For development, a local AI server simulates Firebase Functions:
- No paid Firebase plan required
- Same API interface
- Realistic predictions
- Configurable parameters

## 👥 Admin Panels

### Conductor Panel

**Features:**
- Route selection
- Route-specific authentication
- Seat management (+/- buttons)
- Real-time occupancy tracking
- Bus information display

**Access:**
- Route passwords configured per route
- User ID and password authentication
- Session management via localStorage

### Transport Manager Dashboard

**Features:**
- **Dashboard Tab**
  - System overview statistics
  - Recent trips monitoring
  - Top routes performance
  - Quick actions

- **Routes Tab**
  - Route management (CRUD)
  - Route performance analytics
  - Stop management
  - Active route monitoring

- **Buses Tab**
  - Fleet management
  - Bus assignment to routes
  - Capacity tracking
  - Maintenance scheduling

- **Announcements Tab**
  - Create service updates
  - Priority management
  - Engagement tracking
  - Emergency alerts

## 🔌 API & Services

### Firebase Realtime Database Structure

```
buses/
  {busNumber}/
    location/
      lat: number
      lng: number
      timestamp: number
    status: string
    seats: number
routes/
  {routeId}/
    name: string
    stops: array
    activeBuses: array
ai_predictions/
  {routeId}/
    eta: object
    carbon: object
    seat: object
```

### Local AI API

Endpoint: `localAIServer.callAI(requestData)`

Request format:
```javascript
{
  distanceKm: number,
  avgSpeed: number,
  trafficFactor: number,
  timeOfDay: string,
  weather: string,
  busType: string,
  passengers: number,
  currentSeats: number,
  totalSeats: number,
  routeId: string,
  currentStopIndex: number,
  dayOfWeek: string
}
```

Response format:
```javascript
{
  success: boolean,
  data: {
    eta: { eta, confidence, factors },
    carbon: { co2Saved, greenPoints, environmentalImpact },
    seat: { nextStopSeats, trend, confidence }
  }
}
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize (if not already done)
firebase init

# Deploy
firebase deploy
```

### Environment-Specific Builds

For different environments, create build scripts in `package.json`:

```json
{
  "scripts": {
    "build:prod": "vite build --mode production",
    "build:staging": "vite build --mode staging"
  }
}
```

## 📊 Data Structure

### Route Data Format

Routes are defined in `data/punjabRoutes.js`:

```javascript
{
  id: "PB001",
  route: "Amritsar → Wagah Border",
  distance: "28.3 km",
  duration: "45-60 minutes",
  frequency: "Every 15 minutes",
  highlights: ["Golden Temple", "Wagah Border"],
  start_location: { name, latitude, longitude },
  end_location: { name, latitude, longitude },
  stops: [{ name, time, lat, lng }],
  buses: [{ busNumber, name, type, capacity, fare, ... }]
}
```

### Bus Data Format

```javascript
{
  busNumber: "PB20480001",
  name: "Heritage Express",
  type: "AC Deluxe",
  capacity: 50,
  currentSeats: 35,
  fare: "₹25",
  driver: "Rajinder Singh",
  phone: "+91 98765 43210",
  status: "Running",
  nextStop: "Golden Temple",
  eta: "2 min"
}
```

## 🎨 Styling

The project uses **Tailwind CSS 4.1.12** with:
- Custom color scheme (green theme)
- Responsive design
- Dark mode support (can be added)
- Custom animations via Framer Motion

Key color classes:
- Primary: `green-600`, `green-700`
- Secondary: `blue-600`, `purple-600`
- Accent: `orange-600`, `yellow-500`

## 🔒 Security

### Firebase Security Rules

Current rules in `database.rules.json`:
- Buses: Read public, Write authenticated
- Routes: Read public, Write authenticated
- AI Predictions: Read public, Write authenticated
- Users: Read/Write own data only

### Authentication

- Admin panels use localStorage (development)
- Production should use Firebase Auth
- Protected routes via `ProtectedRoute` component

## 🧪 Testing

### Test Data Generator

Located in `utils/testDataGenerator.js`:
- Generates mock bus positions
- Simulates bus movement
- Useful for development without Firebase

### Manual Testing

1. **Tracking**: Use test mode toggle in RealTimeTracking
2. **Routes**: Browse routes in RouteExplorer
3. **Admin**: Test conductor and manager panels
4. **AI**: Verify predictions with different parameters

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check Firebase config in `firebase.js`
   - Verify database rules are deployed
   - Check network connectivity

2. **Map Not Loading**
   - Verify Leaflet CSS is imported
   - Check OpenStreetMap tile access
   - Clear browser cache

3. **AI Predictions Not Working**
   - Check local AI server is running
   - Verify service imports
   - Check browser console for errors

4. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check Node.js version (18+)
   - Verify all dependencies are installed

## 🔮 Future Enhancements

Potential improvements:
- [ ] Firebase Authentication integration
- [ ] Push notifications for bus updates
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] QR code ticket system
- [ ] Weather API integration
- [ ] Real-time traffic API

## 📄 License

This project is private and proprietary. All rights reserved.

## 👨‍💻 Development Team

- **Project Name**: DigiMARG
- **Version**: 0.0.0
- **Status**: Active Development

## 📞 Support

For issues and questions:
- Email: support@digimarg.com
- Phone: +91 98989 89898

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Firebase for backend services
- React community for excellent libraries
- Punjab Transport Department for route data

---

**Built with ❤️ for better public transportation**
