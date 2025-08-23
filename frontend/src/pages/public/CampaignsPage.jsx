import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../../services/apiService';
import Navbar from '../../components/Navbar';

const CampaignsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { value: 'all', label: 'All Campaigns', icon: '🌟' },
    { value: 'scholarship', label: 'Scholarships', icon: '🎓' },
    { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { value: 'mentorship', label: 'Mentorship', icon: '🤝' },
    { value: 'education', label: 'Education', icon: '📚' }
  ];

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getAll();
      // Map the API response to the expected format
      const mappedCampaigns = response.data.campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        category: campaign.category,
        goal: campaign.goal_amount,
        raised: campaign.raised_amount,
        daysLeft: campaign.days_left || 0,
        image: campaign.image_url,
        ngo: campaign.ngo_name,
        location: campaign.location
      }));
      setCampaigns(mappedCampaigns);
    } catch (err) {
      setError('Failed to load campaigns. Please try again.');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Active <span className="text-gradient">Campaigns</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover and support meaningful educational initiatives that are making a difference in students' lives.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="glass-card mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Search */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Search Campaigns
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input text-white placeholder-white/50 pl-10"
                  />
                  <svg className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Filter by Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`glass-button text-sm ${
                        selectedCategory === category.value
                          ? 'bg-blue-500/30 ring-2 ring-blue-400'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚙️</div>
                <h3 className="text-2xl font-semibold text-white mb-2">Loading campaigns...</h3>
                <p className="text-white/70">Please wait while we fetch the latest campaigns.</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-2xl font-semibold text-white mb-2">Error: {error}</h3>
                <p className="text-white/70">Please try again later or check your internet connection.</p>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-white mb-2">No campaigns found</h3>
                <p className="text-white/70">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="glass-card group hover:scale-105 transition-transform duration-300">
                  {/* Campaign Image */}
                  <div className="relative mb-4">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="glass-button text-xs">
                        {categories.find(c => c.value === campaign.category)?.icon} {categories.find(c => c.value === campaign.category)?.label}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="glass-button text-xs">
                        ⏰ {campaign.daysLeft} days left
                      </span>
                    </div>
                  </div>

                  {/* Campaign Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* NGO and Location */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">by {campaign.ngo}</span>
                      <span className="text-white/60">�� {campaign.location}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Raised</span>
                        <span className="text-white font-medium">
                          ₹{formatCurrency(campaign.raised)} / ₹{formatCurrency(campaign.goal)}
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-sm text-white/60">
                        {getProgressPercentage(campaign.raised, campaign.goal).toFixed(1)}% funded
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/campaign/${campaign.id}`}
                      className="w-full glass-button text-white hover:bg-white hover:text-gray-800 text-center"
                    >
                      Support This Campaign
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="glass-card max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Want to Start Your Own Campaign?
              </h2>
              <p className="text-white/70 mb-6">
                Join our network of NGOs and start making a difference in students' lives today.
              </p>
              <Link
                to="/register"
                className="glass-button text-white hover:bg-white hover:text-gray-800"
              >
                Register as NGO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;