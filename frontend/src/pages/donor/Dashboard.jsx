import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, campaignService, donationService } from '../../services/apiService';
import RoleBasedNavbar from '../../components/RoleBasedNavbar';

const DonorDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    totalCampaigns: 0,
    impactScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'donor') {
      window.location.href = '/login';
      return;
    }
    setUser(currentUser);
    fetchDonorData();
  }, []);

  const fetchDonorData = async () => {
    try {
      setLoading(true);
      // Fetch donor-specific data
      const [campaignsRes, donationsRes] = await Promise.all([
        campaignService.getAll(),
        donationService.getAll()
      ]);

      // Filter donations for this donor (in real app, you'd have donor-specific endpoints)
      const donorDonations = donationsRes.data.donations?.filter(d => d.donor_id === user?.id) || [];
      const donorCampaigns = campaignsRes.data.campaigns?.filter(c => 
        donorDonations.some(d => d.campaign_id === c.id)
      ) || [];

      const totalAmount = donorDonations.reduce((sum, donation) => sum + donation.amount, 0);
      const impactScore = Math.min(100, Math.floor((totalAmount / 10000) * 100)); // Score based on amount

      setStats({
        totalDonations: donorDonations.length,
        totalAmount: totalAmount,
        totalCampaigns: donorCampaigns.length,
        impactScore: impactScore
      });
    } catch (err) {
      console.error('Error fetching donor data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="donor" />
      
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Donor Dashboard 💝
            </h1>
            <p className="text-white/70">Track your donations and see the impact you're making</p>
          </div>

          {/* Welcome Card */}
          <div className="glass-card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, {user?.first_name}! 🙏
                </h2>
                <p className="text-white/70">
                  Your generosity is changing lives. Thank you for supporting education!
                </p>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-sm">Donor ID</div>
                <div className="text-white font-mono">{user?.id?.slice(-8)}</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
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
              <div className="text-white/70">Total Amount</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : stats.totalCampaigns}
              </div>
              <div className="text-white/70">Campaigns Supported</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : `${stats.impactScore}%`}
              </div>
              <div className="text-white/70">Impact Score</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">🔍</div>
                <h3 className="text-xl font-semibold text-white">Find Campaigns</h3>
                <p className="text-white/70">Discover new campaigns to support</p>
                <Link to="/donor/campaigns" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  Browse Campaigns
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📊</div>
                <h3 className="text-xl font-semibold text-white">My Donations</h3>
                <p className="text-white/70">View your donation history</p>
                <Link to="/donor/donations" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  View History
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📈</div>
                <h3 className="text-xl font-semibold text-white">Impact Report</h3>
                <p className="text-white/70">See your impact metrics</p>
                <Link to="/donor/impact" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  View Impact
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="glass-card mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Donations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    CS
                  </div>
                  <div>
                    <div className="text-white font-medium">Computer Science Scholarship</div>
                    <div className="text-white/70 text-sm">Rahul Kumar</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">₹5,000</div>
                  <div className="text-white/70 text-sm">2 days ago</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    MS
                  </div>
                  <div>
                    <div className="text-white font-medium">Medical Studies Fund</div>
                    <div className="text-white/70 text-sm">Priya Sharma</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">₹3,500</div>
                  <div className="text-white/70 text-sm">1 week ago</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    EN
                  </div>
                  <div>
                    <div className="text-white font-medium">Engineering Scholarship</div>
                    <div className="text-white/70 text-sm">Amit Patel</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">₹7,000</div>
                  <div className="text-white/70 text-sm">2 weeks ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-white/70 mb-1">
                    <span>Students Helped</span>
                    <span>{stats.totalCampaigns}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.min(100, (stats.totalCampaigns / 10) * 100)}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white/70 mb-1">
                    <span>Total Impact</span>
                    <span>{stats.impactScore}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${stats.impactScore}%`}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Donation Goals</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Monthly Goal</span>
                  <span className="text-white">₹10,000</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${Math.min(100, (stats.totalAmount / 10000) * 100)}%`}}></div>
                </div>
                <div className="text-center text-white/70 text-sm">
                  {stats.totalAmount >= 10000 ? 'Goal achieved! 🎉' : `₹${10000 - stats.totalAmount} more to reach goal`}
                </div>
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
                  <span className="text-white/70">Donation processed successfully</span>
                </div>
                <span className="text-white/50 text-sm">2 days ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/70">Campaign milestone reached</span>
                </div>
                <span className="text-white/50 text-sm">1 week ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/70">New campaign discovered</span>
                </div>
                <span className="text-white/50 text-sm">2 weeks ago</span>
              </div>
            </div>
          </div>

          {/* Tax Benefits */}
          <div className="glass-card mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Tax Benefits</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">80G</div>
                <div className="text-white/70 text-sm">Tax deduction available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">100%</div>
                <div className="text-white/70 text-sm">Deduction on donations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">₹1.5L</div>
                <div className="text-white/70 text-sm">Max deduction limit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
