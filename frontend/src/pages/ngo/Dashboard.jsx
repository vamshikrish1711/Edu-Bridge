import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, campaignService, donationService } from '../../services/apiService';
import RoleBasedNavbar from '../../components/RoleBasedNavbar';

const NGODashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDonations: 0,
    totalAmount: 0,
    activeStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'ngo') {
      window.location.href = '/login';
      return;
    }
    setUser(currentUser);
    fetchNGOData();
  }, []);

  const fetchNGOData = async () => {
    try {
      setLoading(true);
      // Fetch NGO-specific data
      const [campaignsRes, donationsRes] = await Promise.all([
        campaignService.getAll(),
        donationService.getAll()
      ]);

      // Filter campaigns for this NGO (in real app, you'd have NGO-specific endpoints)
      const ngoCampaigns = campaignsRes.data.campaigns?.filter(c => c.ngo_id === user?.id) || [];
      const ngoDonations = donationsRes.data.donations?.filter(d => 
        ngoCampaigns.some(c => c.id === d.campaign_id)
      ) || [];

      const totalAmount = ngoDonations.reduce((sum, donation) => sum + donation.amount, 0);

      setStats({
        totalCampaigns: ngoCampaigns.length,
        totalDonations: ngoDonations.length,
        totalAmount: totalAmount,
        activeStudents: ngoCampaigns.length * 2 // This would come from NGO service
      });
    } catch (err) {
      console.error('Error fetching NGO data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="ngo" />
      
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              NGO Dashboard 🏛️
            </h1>
            <p className="text-white/70">Manage campaigns and track your organization's impact</p>
          </div>

          {/* Welcome Card */}
          <div className="glass-card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, {user?.first_name}! 🌟
                </h2>
                <p className="text-white/70">
                  Your organization is making a difference in education. Keep up the great work!
                </p>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-sm">NGO ID</div>
                <div className="text-white font-mono">{user?.id?.slice(-8)}</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
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
              <div className="text-white/70">Amount Raised</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : stats.activeStudents}
              </div>
              <div className="text-white/70">Students Helped</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📝</div>
                <h3 className="text-xl font-semibold text-white">Create Campaign</h3>
                <p className="text-white/70">Start a new fundraising campaign</p>
                <Link to="/ngo/campaigns/create" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  Create Campaign
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📊</div>
                <h3 className="text-xl font-semibold text-white">My Campaigns</h3>
                <p className="text-white/70">Manage existing campaigns</p>
                <Link to="/ngo/campaigns" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  View Campaigns
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">💰</div>
                <h3 className="text-xl font-semibold text-white">Donations</h3>
                <p className="text-white/70">Track incoming donations</p>
                <Link to="/ngo/donations" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  View Donations
                </Link>
              </div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="glass-card mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Active Campaigns</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    CS
                  </div>
                  <div>
                    <div className="text-white font-medium">Computer Science Scholarship</div>
                    <div className="text-white/70 text-sm">Rahul Kumar • Target: ₹50,000</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">₹25,000</div>
                  <div className="text-white/70 text-sm">50% Complete</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    MS
                  </div>
                  <div>
                    <div className="text-white font-medium">Medical Studies Fund</div>
                    <div className="text-white/70 text-sm">Priya Sharma • Target: ₹75,000</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">₹18,500</div>
                  <div className="text-white/70 text-sm">25% Complete</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    EN
                  </div>
                  <div>
                    <div className="text-white font-medium">Engineering Scholarship</div>
                    <div className="text-white/70 text-sm">Amit Patel • Target: ₹60,000</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">₹32,000</div>
                  <div className="text-white/70 text-sm">53% Complete</div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Campaign Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-white/70 mb-1">
                    <span>Success Rate</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white/70 mb-1">
                    <span>Avg. Completion</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '42%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white/70 mb-1">
                    <span>Donor Retention</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Monthly Goals</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Campaigns Created</span>
                  <span className="text-white">3/5</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Fundraising Target</span>
                  <span className="text-white">₹75,500/₹100,000</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '75.5%'}}></div>
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
                  <span className="text-white/70">New donation received</span>
                </div>
                <span className="text-white/50 text-sm">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/70">Campaign milestone reached</span>
                </div>
                <span className="text-white/50 text-sm">3 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/70">New student application</span>
                </div>
                <span className="text-white/50 text-sm">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/70">Campaign approved</span>
                </div>
                <span className="text-white/50 text-sm">2 days ago</span>
              </div>
            </div>
          </div>

          {/* Compliance & Reports */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Compliance Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">80G Registration</span>
                  <span className="text-green-400">✅ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">FCRA Status</span>
                  <span className="text-green-400">✅ Compliant</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Annual Report</span>
                  <span className="text-yellow-400">⚠️ Due Soon</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Tax Filing</span>
                  <span className="text-green-400">✅ Complete</span>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Reports</h3>
              <div className="space-y-3">
                <Link to="/ngo/reports/donations" className="flex items-center justify-between py-2 hover:bg-white/10 rounded-lg px-2 transition-colors">
                  <span className="text-white/70">Donation Report</span>
                  <span className="text-white">📊</span>
                </Link>
                <Link to="/ngo/reports/impact" className="flex items-center justify-between py-2 hover:bg-white/10 rounded-lg px-2 transition-colors">
                  <span className="text-white/70">Impact Report</span>
                  <span className="text-white">📈</span>
                </Link>
                <Link to="/ngo/reports/financial" className="flex items-center justify-between py-2 hover:bg-white/10 rounded-lg px-2 transition-colors">
                  <span className="text-white/70">Financial Report</span>
                  <span className="text-white">💰</span>
                </Link>
                <Link to="/ngo/reports/students" className="flex items-center justify-between py-2 hover:bg-white/10 rounded-lg px-2 transition-colors">
                  <span className="text-white/70">Student Report</span>
                  <span className="text-white">👥</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
