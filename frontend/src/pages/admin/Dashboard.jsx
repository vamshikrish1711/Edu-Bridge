import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, userService, campaignService, donationService } from '../../services/apiService';
import RoleBasedNavbar from '../../components/RoleBasedNavbar';

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
    if (!currentUser || currentUser.role !== 'admin') {
      window.location.href = '/login';
      return;
    }
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
      <RoleBasedNavbar userRole="admin" />
      
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
                <Link to="/admin/users" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  Manage Users
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📊</div>
                <h3 className="text-xl font-semibold text-white">Analytics</h3>
                <p className="text-white/70">View detailed platform analytics</p>
                <Link to="/admin/analytics" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  View Analytics
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">✅</div>
                <h3 className="text-xl font-semibold text-white">Approvals</h3>
                <p className="text-white/70">Review pending approvals</p>
                <Link to="/admin/approvals" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  Review Approvals
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/70">System running normally</span>
                </div>
                <span className="text-white/50 text-sm">Just now</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/70">Database backup completed</span>
                </div>
                <span className="text-white/50 text-sm">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/70">New user registrations</span>
                </div>
                <span className="text-white/50 text-sm">5 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 