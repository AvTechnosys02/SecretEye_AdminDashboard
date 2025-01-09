// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AddUsersPage from './pages/AddUsersPage';
import Layout from './components/Layout'; // Import the Layout component
import AddVehiclesPage from './pages/AddVehiclesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Use Layout for routes that need the sidebar */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/add-users" element={<Layout><AddUsersPage /></Layout>} />
        <Route path="/view-vehicles" element={<Layout><AddVehiclesPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
