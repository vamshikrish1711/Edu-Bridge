import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, campaignService, donationService } from '../../services/apiService';
import RoleBasedNavbar from '../../components/RoleBasedNavbar';

const MentorDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCampaigns: 0,
    totalDonations: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'mentor') {
      window.location.href = '/login';
      return;
    }
    setUser(currentUser);
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      // Fetch mentor-specific data
      const [campaignsRes, donationsRes] = await Promise.all([
        campaignService.getAll(),
        donationService.getAll()
      ]);

      // Filter campaigns for this mentor (in real app, you'd have mentor-specific endpoints)
      const mentorCampaigns = campaignsRes.data.campaigns?.filter(c => c.mentor_id === user?.id) || [];
      const mentorDonations = donationsRes.data.donations?.filter(d => 
        mentorCampaigns.some(c => c.id === d.campaign_id)
      ) || [];

      const totalAmount = mentorDonations.reduce((sum, donation) => sum + donation.amount, 0);

      setStats({
        totalStudents: 3, // This would come from mentor service
        totalCampaigns: mentorCampaigns.length,
        totalDonations: mentorDonations.length,
        totalAmount: totalAmount
      });
    } catch (err) {
      console.error('Error fetching mentor data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="mentor" />
      
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Mentor Dashboard 👨‍🏫
            </h1>
            <p className="text-white/70">Guide students and track their progress</p>
          </div>

          {/* Welcome Card */}
          <div className="glass-card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, {user?.first_name}! 🌟
                </h2>
                <p className="text-white/70">
                  You're making a difference in students' lives. Thank you for your dedication!
                </p>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-sm">Mentor ID</div>
                <div className="text-white font-mono">{user?.id?.slice(-8)}</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : stats.totalStudents}
              </div>
              <div className="text-white/70">Active Students</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : stats.totalCampaigns}
              </div>
              <div className="text-white/70">Managed Campaigns</div>
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
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">👥</div>
                <h3 className="text-xl font-semibold text-white">My Students</h3>
                <p className="text-white/70">View and manage your students</p>
                <Link to="/mentor/students" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  View Students
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📊</div>
                <h3 className="text-xl font-semibold text-white">Campaigns</h3>
                <p className="text-white/70">Manage student campaigns</p>
                <Link to="/mentor/campaigns" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  View Campaigns
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📚</div>
                <h3 className="text-xl font-semibold text-white">Resources</h3>
                <p className="text-white/70">Access mentoring resources</p>
                <Link to="/mentor/resources" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  View Resources
                </Link>
              </div>
            </div>
          </div>

          {/* Student Progress */}
          <div className="glass-card mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Student Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    R
                  </div>
                  <div>
                    <div className="text-white font-medium">Rahul Kumar</div>
                    <div className="text-white/70 text-sm">Computer Science Campaign</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">₹25,000</div>
                  <div className="text-white/70 text-sm">Raised</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <div>
                    <div className="text-white font-medium">Priya Sharma</div>
                    <div className="text-white/70 text-sm">Medical Studies Fund</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">₹18,500</div>
                  <div className="text-white/70 text-sm">Raised</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="text-white font-medium">Amit Patel</div>
                    <div className="text-white/70 text-sm">Engineering Scholarship</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">₹32,000</div>
                  <div className="text-white/70 text-sm">Raised</div>
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
                  <span className="text-white/70">New student assigned</span>
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
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/70">Student progress review</span>
                </div>
                <span className="text-white/50 text-sm">1 day ago</span>
              </div>
            </div>
          </div>

          {/* Mentoring Tips */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Mentoring Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-white/70">Regular check-ins help maintain momentum</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-white/70">Celebrate small wins to boost confidence</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <span className="text-white/70">Provide constructive feedback regularly</span>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Upcoming Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-white/70">Rahul - CS Review</span>
                  <span className="text-white/50 text-sm">Tomorrow 2 PM</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-white/70">Priya - Medical Prep</span>
                  <span className="text-white/50 text-sm">Wed 4 PM</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-white/70">Amit - Engineering</span>
                  <span className="text-white/50 text-sm">Fri 3 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
