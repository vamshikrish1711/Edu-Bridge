import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import CampaignsPage from './pages/public/CampaignsPage';
import CampaignDetails from './pages/public/CampaignDetails';
import ContactPage from './pages/public/ContactPage';
import AboutPage from './pages/public/AboutPage';
import NotFound from './pages/public/NotFound';

// Dashboard imports
import AdminDashboard from './pages/admin/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import MentorDashboard from './pages/mentor/Dashboard';
import DonorDashboard from './pages/donor/Dashboard';
import NGODashboard from './pages/ngo/Dashboard';

// Test components
import NavigationTestPage from './components/NavigationTestPage';
import ErrorPopupDemo from './components/ErrorPopupDemo';

// Import the browser navigation hook
import { useBrowserNavigation } from './hooks/useBrowserNavigation';

function AppContent() {
  // Use the browser navigation hook
  const { handleLogout, handleLogin, handleBackNavigation } = useBrowserNavigation();

  // Handle browser back/forward button clicks
  useEffect(() => {
    const handlePopState = (event) => {
      // This will be handled by the useBrowserNavigation hook
      console.log('Browser navigation detected');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/campaigns" element={<CampaignsPage />} />
      <Route path="/campaign/:id" element={<CampaignDetails />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      
      {/* Test Pages */}
      <Route path="/test-navigation" element={<NavigationTestPage />} />
      <Route path="/test-errors" element={<ErrorPopupDemo />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Users Management</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/admin/campaigns" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Campaigns Management</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/admin/analytics" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Analytics</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/admin/approvals" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Approvals</h1><p className="text-white/70">Coming soon...</p></div></div>} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/campaigns" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">My Campaigns</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/student/campaigns/create" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Create Campaign</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/student/mentor" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">My Mentor</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/student/scholarships" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Scholarships</h1><p className="text-white/70">Coming soon...</p></div></div>} />

      {/* Mentor Routes */}
      <Route path="/mentor/dashboard" element={<MentorDashboard />} />
      <Route path="/mentor/students" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">My Students</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/mentor/campaigns" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Campaigns</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/mentor/resources" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Resources</h1><p className="text-white/70">Coming soon...</p></div></div>} />

      {/* Donor Routes */}
      <Route path="/donor/dashboard" element={<DonorDashboard />} />
      <Route path="/donor/donations" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">My Donations</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/donor/campaigns" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Campaigns</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/donor/impact" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Impact Report</h1><p className="text-white/70">Coming soon...</p></div></div>} />

      {/* NGO Routes */}
      <Route path="/ngo/dashboard" element={<NGODashboard />} />
      <Route path="/ngo/campaigns" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">My Campaigns</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/ngo/campaigns/create" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Create Campaign</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/ngo/donations" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Donations</h1><p className="text-white/70">Coming soon...</p></div></div>} />
      <Route path="/ngo/reports/*" element={<div className="min-h-screen animated-bg pt-20 px-4"><div className="glass-card text-center"><h1 className="text-2xl font-bold text-white">Reports</h1><p className="text-white/70">Coming soon...</p></div></div>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen animated-bg">
        <AppContent />
      </div>
    </Router>
  );
}



