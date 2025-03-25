import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react';
import LandingPage from './pages/landingPage'
import HealthKioskPage from './pages/healthKioskPage'
import Login from './pages/login';
import Signup from './pages/signup';
import Homepage from './pages/homePage';
import HeightMeasurement from './pages/Services/heightMeasurement';

function App() {
  return (
    <div className="min-h-screen bg-gray-50"> {/* Added background color */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/health-kiosk" element={<HealthKioskPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/height" element={<HeightMeasurement />} />
        </Routes>
      </Router>
    </div>
  )
}
export default App