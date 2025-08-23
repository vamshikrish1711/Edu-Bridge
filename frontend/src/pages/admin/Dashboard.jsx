import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, userService, campaignService, donationService } from '../../services/apiService';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCampaigns: 0,
    totalDonations: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have dedicated admin endpoints
      // For now, we'll use the existing endpoints
      const [usersRes, campaignsRes, donationsRes] = await Promise.all([
        userService.getAll(),
        campaignService.getAll(),
        donationService.getAll()
      ]);

      const totalAmount = donationsRes.data.donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;

      setStats({
        totalUsers: usersRes.data.users?.length || 0,
        totalCampaigns: campaignsRes.data.campaigns?.length || 0,
        totalDonations: donationsRes.data.donations?.length || 0,
        totalAmount: totalAmount
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard 👨‍💼
            </h1>
            <p className="text-white/70">Manage users, campaigns, and monitor platform activity</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : stats.totalUsers}
              </div>
              <div className="text-white/70">Total Users</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : stats.totalCampaigns}
              </div>
              <div className="text-white/70">Active Campaigns</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : stats.totalDonations}
              </div>
              <div className="text-white/70">Total Donations</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : `₹${stats.totalAmount.toLocaleString()}`}
              </div>
              <div className="text-white/70">Total Raised</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">👥</div>
                <h3 className="text-xl font-semibold text-white">User Management</h3>
                <p className="text-white/70">View and manage all users</p>
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  Manage Users
                </button>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📊</div>
                <h3 className="text-xl font-semibold text-white">Campaign Analytics</h3>
                <p className="text-white/70">Monitor campaign performance</p>
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  View Analytics
                </button>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">💰</div>
                <h3 className="text-xl font-semibold text-white">Donation Reports</h3>
                <p className="text-white/70">Track all donations</p>
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  View Reports
                </button>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">⚙️</div>
                <h3 className="text-xl font-semibold text-white">System Settings</h3>
                <p className="text-white/70">Configure platform settings</p>
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  Settings
                </button>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📧</div>
                <h3 className="text-xl font-semibold text-white">Notifications</h3>
                <p className="text-white/70">Manage system notifications</p>
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  Manage Notifications
                </button>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">🔒</div>
                <h3 className="text-xl font-semibold text-white">Security</h3>
                <p className="text-white/70">Security and access control</p>
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  Security Settings
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card">
            <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <p className="text-white font-medium">New campaign created</p>
                  <p className="text-white/60 text-sm">Computer Science Scholarship Program</p>
                </div>
                <span className="text-white/40 text-sm">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <p className="text-white font-medium">New user registered</p>
                  <p className="text-white/60 text-sm">student@example.com</p>
                </div>
                <span className="text-white/40 text-sm">4 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <p className="text-white font-medium">Donation received</p>
                  <p className="text-white/60 text-sm">₹5,000 for Rural School Infrastructure</p>
                </div>
                <span className="text-white/40 text-sm">6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 