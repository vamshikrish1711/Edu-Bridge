import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, campaignService, donationService } from '../../services/apiService';
import RoleBasedNavbar from '../../components/RoleBasedNavbar';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDonations: 0,
    totalAmount: 0,
    mentorAssigned: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
      window.location.href = '/login';
      return;
    }
    setUser(currentUser);
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      // Fetch student-specific data
      const [campaignsRes, donationsRes] = await Promise.all([
        campaignService.getAll(),
        donationService.getAll()
      ]);

      // Filter campaigns for this student (in real app, you'd have student-specific endpoints)
      const studentCampaigns = campaignsRes.data.campaigns?.filter(c => c.student_id === user?.id) || [];
      const studentDonations = donationsRes.data.donations?.filter(d => 
        studentCampaigns.some(c => c.id === d.campaign_id)
      ) || [];

      const totalAmount = studentDonations.reduce((sum, donation) => sum + donation.amount, 0);

      setStats({
        totalCampaigns: studentCampaigns.length,
        totalDonations: studentDonations.length,
        totalAmount: totalAmount,
        mentorAssigned: false // This would come from mentor service
      });
    } catch (err) {
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="student" />
      
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Student Dashboard 🎓
            </h1>
            <p className="text-white/70">Track your campaigns, donations, and mentorship progress</p>
          </div>

          {/* Welcome Card */}
          <div className="glass-card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, {user?.first_name}! 👋
                </h2>
                <p className="text-white/70">
                  You're making a difference in education. Keep up the great work!
                </p>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-sm">Student ID</div>
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
              <div className="text-white/70">My Campaigns</div>
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
                {stats.mentorAssigned ? '✅' : '❌'}
              </div>
              <div className="text-white/70">Mentor Assigned</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📝</div>
                <h3 className="text-xl font-semibold text-white">Create Campaign</h3>
                <p className="text-white/70">Start a new fundraising campaign</p>
                <Link to="/student/campaigns/create" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  Create Campaign
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">👨‍🏫</div>
                <h3 className="text-xl font-semibold text-white">Find Mentor</h3>
                <p className="text-white/70">Connect with experienced mentors</p>
                <Link to="/student/mentor" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  Find Mentor
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">🎯</div>
                <h3 className="text-xl font-semibold text-white">Scholarships</h3>
                <p className="text-white/70">Apply for scholarships</p>
                <Link to="/student/scholarships" className="glass-button text-white hover:bg-white hover:text-gray-800 block">
                  View Scholarships
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
                  <span className="text-white/70">New donation received</span>
                </div>
                <span className="text-white/50 text-sm">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/70">Campaign updated</span>
                </div>
                <span className="text-white/50 text-sm">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/70">Mentor request sent</span>
                </div>
                <span className="text-white/50 text-sm">3 days ago</span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Education Goals</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-white/70 mb-1">
                    <span>Current Grade</span>
                    <span>10th</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white/70 mb-1">
                    <span>Target Grade</span>
                    <span>12th</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-white/70">Complete campaign setup</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-white/70">Connect with mentor</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white/70">Apply for scholarships</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 