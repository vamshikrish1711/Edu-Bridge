import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Bridging Dreams with
                  <span className="text-gradient block">Education</span>
                </h1>
                <p className="text-xl text-white/80 leading-relaxed">
                  Connect students with mentors, donors, and opportunities. 
                  Transform lives through the power of education and community support.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="glass-button text-white hover:bg-white hover:text-gray-800 text-center"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/campaigns"
                  className="glass-button text-white hover:bg-white hover:text-gray-800 text-center"
                >
                  Explore Campaigns
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="glass-card text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-white/70">Students Helped</div>
                </div>
                <div className="glass-card text-center">
                  <div className="text-3xl font-bold text-white">100+</div>
                  <div className="text-white/70">Active Mentors</div>
                </div>
                <div className="glass-card text-center">
                  <div className="text-3xl font-bold text-white">$2M+</div>
                  <div className="text-white/70">Funds Raised</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Floating Elements */}
            <div className="relative">
              <div className="glass-card float">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Quality Education</h3>
                  <p className="text-white/70">Access to world-class learning resources and mentorship</p>
                </div>
              </div>
              
              <div className="glass-card absolute top-20 -right-10 float" style={{animationDelay: '2s'}}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Community</h3>
                  <p className="text-white/70 text-sm">Connect with mentors and peers</p>
                </div>
              </div>
              
              <div className="glass-card absolute -bottom-10 -left-10 float" style={{animationDelay: '4s'}}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Funding</h3>
                  <p className="text-white/70 text-sm">Financial support for education</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-gradient">EduBridge</span>?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              We provide a comprehensive platform that connects students, mentors, donors, and NGOs 
              to create meaningful educational opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎓",
                title: "Student Support",
                description: "Access scholarships, mentorship, and educational resources tailored to your needs."
              },
              {
                icon: "🤝",
                title: "Mentor Network",
                description: "Connect with experienced professionals who can guide your educational journey."
              },
              {
                icon: "💝",
                title: "Donor Impact",
                description: "Make a real difference by supporting students and educational initiatives."
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card text-center group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of students, mentors, and donors who are already part of the EduBridge community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="glass-button text-white hover:bg-white hover:text-gray-800"
              >
                Join Now
              </Link>
              <Link
                to="/about"
                className="glass-button text-white hover:bg-white hover:text-gray-800"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-white font-bold text-lg">EduBridge</span>
          </div>
          <p className="text-white/60">
            © 2024 EduBridge. All rights reserved. Bridging dreams with education.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;