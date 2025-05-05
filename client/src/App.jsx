import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react';
import LandingPage from './landingPage'
import HealthKioskPage from './pages/healthKioskPage'
import Login from './pages/login';
import Signup from './pages/signup';
import Homepage from './pages/homePage';
import HeightMeasurement from './pages/Services/heightMeasurement';
import WeightMeasurement from './pages/Services/weightMeasurement';
import TemperatureMeasurement from './pages/Services/tempratureMeasurement';
import OximeterMeasurement from './pages/Services/oximeter';
import ResultsPage from './pages/Services/results';
import Profile from './pages/Profile';
import ConsultationPage from './pages/Services/consultation';
import DoctorHomepage from './doctor/home';
import DoctorLogin from './doctor/doctorLogin';
import DoctorSignup from './doctor/doctorSignup';
import PatientInfo from './doctor/Services/PatientInfo.jsx';

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
          <Route path="/weight" element={<WeightMeasurement />} />
          <Route path="/temperature" element={<TemperatureMeasurement />} />
          <Route path="/oximeter" element={<OximeterMeasurement />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/doc" element={<DoctorHomepage />} />  
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-signup" element={<DoctorSignup />} />
          <Route path="/patient-info/:patientId" element = {<PatientInfo/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App