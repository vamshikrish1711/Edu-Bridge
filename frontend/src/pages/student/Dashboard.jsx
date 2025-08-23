import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/apiService';
import Navbar from '../../components/Navbar';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.first_name || 'Student'}! 👋
            </h1>
            <p className="text-white/70">Track your educational journey and opportunities</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">3</div>
              <div className="text-white/70">Active Applications</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">2</div>
              <div className="text-white/70">Mentors Connected</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">₹15,000</div>
              <div className="text-white/70">Scholarships Received</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/campaigns" className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">🎓</div>
                <h3 className="text-xl font-semibold text-white">Browse Campaigns</h3>
                <p className="text-white/70">Find educational opportunities and scholarships</p>
              </div>
            </Link>

            <Link to="/mentors" className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">👨‍🏫</div>
                <h3 className="text-xl font-semibold text-white">Find Mentors</h3>
                <p className="text-white/70">Connect with industry professionals</p>
              </div>
            </Link>

            <Link to="/profile" className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">👤</div>
                <h3 className="text-xl font-semibold text-white">Update Profile</h3>
                <p className="text-white/70">Keep your information current</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 