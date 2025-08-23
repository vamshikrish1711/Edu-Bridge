import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import CampaignsPage from './pages/public/CampaignsPage';
import CampaignDetails from './pages/public/CampaignDetails';
import ContactPage from './pages/public/ContactPage';
import AboutPage from './pages/public/AboutPage';
import NotFound from './pages/public/NotFound';
import StudentDashboard from './pages/student/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen animated-bg">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Other Role-based routes will be added here */}
          <Route path="/mentor/dashboard" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Mentor Dashboard</h1><p className="text-white/70">Coming soon...</p></div></div>} />
          <Route path="/donor/dashboard" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Donor Dashboard</h1><p className="text-white/70">Coming soon...</p></div></div>} />
          <Route path="/ngo/dashboard" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">NGO Dashboard</h1><p className="text-white/70">Coming soon...</p></div></div>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}



