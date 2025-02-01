// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Layout from "./components/Layout";  // Import Layout
import Dashboard from "./pages/Dashboard";
import VehicleTrack from "./pages/VehicleTrackPage";
import AddVehiclesPage from "./pages/AddVehiclesPage";
import TrackDetails from "./pages/TrackDetails";
import { useEffect } from "react";
import bcrypt from 'bcryptjs'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Use Layout for routes that need the sidebar */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/vehicle-track" element={<Layout><VehicleTrack /></Layout>} />
        <Route path="/view-vehicles" element={<Layout><AddVehiclesPage /></Layout>} />
        <Route path="/trackvehicle/:imei" element={<Layout><TrackDetails /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
