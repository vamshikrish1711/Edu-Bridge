import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-white mb-4 float">
              <span className="text-gradient">404</span>
            </div>
            <div className="text-6xl mb-4">🤔</div>
          </div>

          {/* Content */}
          <div className="glass-card">
            <h1 className="text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              The page you're looking for seems to have wandered off into the digital wilderness. 
              Don't worry, we'll help you find your way back!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/"
                className="glass-button text-white hover:bg-white hover:text-gray-800"
              >
                🏠 Go Home
              </Link>
              <Link
                to="/campaigns"
                className="glass-button text-white hover:bg-white hover:text-gray-800"
              >
                🎯 Explore Campaigns
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="border-t border-white/20 pt-6">
              <p className="text-white/60 mb-4">Or try these helpful links:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/about"
                  className="text-blue-300 hover:text-blue-200 transition-colors"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 glass-card w-16 h-16 rounded-full opacity-30 float"></div>
          <div className="absolute bottom-20 right-10 glass-card w-20 h-20 rounded-full opacity-20 float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-20 glass-card w-12 h-12 rounded-full opacity-25 float" style={{animationDelay: '4s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;