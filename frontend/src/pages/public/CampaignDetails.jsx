import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { campaignService, donationService } from '../../services/apiService';
import Navbar from '../../components/Navbar';

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getById(id);
      const campaignData = response.data;
      
      // Map the API response to the expected format
      const mappedCampaign = {
        id: campaignData.id,
        title: campaignData.title,
        description: campaignData.description,
        category: campaignData.category,
        goal: campaignData.goal_amount,
        raised: campaignData.raised_amount,
        daysLeft: campaignData.days_left || 0,
        image: campaignData.image_url,
        ngo: campaignData.ngo_name,
        location: campaignData.location,
        longDescription: campaignData.long_description || campaignData.description,
        updates: [], // Will be populated from API
        donors: [] // Will be populated from API
      };
      
      setCampaign(mappedCampaign);
    } catch (err) {
      setError('Failed to load campaign details. Please try again.');
      console.error('Error fetching campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    if (!donationAmount || donationAmount <= 0) return;
    
    setIsDonating(true);
    try {
      await donationService.create({
        campaign_id: parseInt(id),
        amount: parseFloat(donationAmount),
        anonymous: false
      });
      
      // Refresh campaign data to update raised amount
      await fetchCampaignDetails();
      setDonationAmount('');
      alert('Thank you for your donation!');
    } catch (err) {
      setError('Failed to process donation. Please try again.');
      console.error('Error making donation:', err);
    } finally {
      setIsDonating(false);
    }
  };

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="glass-card text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-white">Loading campaign details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen animated-bg">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="glass-card text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-white">{error}</p>
            <button 
              onClick={fetchCampaignDetails}
              className="mt-4 glass-button text-white hover:bg-white hover:text-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen animated-bg">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="glass-card text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-white">Campaign not found</p>
            <Link 
              to="/campaigns"
              className="mt-4 glass-button text-white hover:bg-white hover:text-gray-800 inline-block"
            >
              Back to Campaigns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/campaigns" className="text-blue-300 hover:text-blue-200 transition-colors">
              ← Back to Campaigns
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Campaign Image */}
              <div className="glass-card p-0 overflow-hidden">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Campaign Title and Basic Info */}
              <div className="glass-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{campaign.title}</h1>
                    <p className="text-white/70">by {campaign.ngo}</p>
                  </div>
                  <span className="glass-button text-xs">
                    🎓 {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}
                  </span>
                </div>
                <p className="text-white/80 leading-relaxed">{campaign.description}</p>
              </div>

              {/* Tabs */}
              <div className="glass-card">
                <div className="flex space-x-1 mb-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📋' },
                    { id: 'updates', label: 'Updates', icon: '📢' },
                    { id: 'donors', label: 'Donors', icon: '💝' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 glass-button text-sm ${
                        activeTab === tab.id
                          ? 'bg-blue-500/30 ring-2 ring-blue-400'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-1">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {activeTab === 'overview' && (
                    <div dangerouslySetInnerHTML={{ __html: campaign.longDescription }} className="text-white/80 prose prose-invert max-w-none" />
                  )}

                  {activeTab === 'updates' && (
                    <div className="space-y-4">
                      {campaign.updates.map((update, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">{update.title}</h4>
                            <span className="text-white/60 text-sm">{update.date}</span>
                          </div>
                          <p className="text-white/70">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'donors' && (
                    <div className="space-y-4">
                      {campaign.donors.map((donor, index) => (
                        <div key={index} className="flex items-center justify-between p-3 glass-card">
                          <div>
                            <p className="text-white font-medium">{donor.name}</p>
                            <p className="text-white/60 text-sm">{donor.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">{formatCurrency(donor.amount)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Donation Card */}
              <div className="glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Support This Campaign</h3>
                
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Raised</span>
                    <span className="text-white font-medium">
                      {formatCurrency(campaign.raised)} / {formatCurrency(campaign.goal)}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-white/60">
                    {getProgressPercentage(campaign.raised, campaign.goal).toFixed(1)}% funded
                  </div>
                </div>

                {/* Days Left */}
                <div className="mb-6 p-3 glass-card">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{campaign.daysLeft}</div>
                    <div className="text-white/70 text-sm">days left</div>
                  </div>
                </div>

                {/* Donation Form */}
                <form onSubmit={handleDonation} className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-white/80 text-sm font-medium mb-2">
                      Donation Amount (₹)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="glass-input text-white placeholder-white/50"
                      placeholder="Enter amount"
                      min="1"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isDonating || !donationAmount}
                    className="w-full glass-button text-white hover:bg-white hover:text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDonating ? 'Processing...' : 'Donate Now'}
                  </button>
                </form>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[500, 1000, 2000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount.toString())}
                      className="glass-button text-white hover:bg-white hover:text-gray-800 text-sm"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campaign Info */}
              <div className="glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Campaign Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Location</span>
                    <span className="text-white">📍 {campaign.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Category</span>
                    <span className="text-white">🎓 {campaign.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">NGO</span>
                    <span className="text-white">🏢 {campaign.ngo}</span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Share This Campaign</h3>
                <div className="flex space-x-2">
                  <button className="flex-1 glass-button text-white hover:bg-white hover:text-gray-800 text-sm">
                    📱 Share
                  </button>
                  <button className="flex-1 glass-button text-white hover:bg-white hover:text-gray-800 text-sm">
                    📧 Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;