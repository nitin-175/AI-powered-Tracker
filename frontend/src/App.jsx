import { Routes, Route } from 'react-router-dom';
import './App.css'
import Dashboard from './Pages/Dashboard';
import AddJob from './Pages/AddJob';
import Applications from './Pages/Applications';
import Analytics from './Pages/Analytics';
import Settings from './Pages/Settings';
import DashboardLayout from './Components/DashboardLayout';
import ResumeMaker from './Pages/ResumeMaker';
import AutoApply from './Pages/AutoApply';
import { useState } from 'react';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  if (!isLoggedIn && showLogout) {
    return <LogoutPopup />;
  }

  return (
    <div>
      

      <Routes>

      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-job" element={<AddJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/resume-manager" element={<ResumeMaker />} />
        <Route path="/auto-apply" element={<AutoApply />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

    </Routes>

    </div>

  )
}

export default App;
