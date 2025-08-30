import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/apiService';
import SuccessPopup from './SuccessPopup';

const NavigationTestPage = () => {
  const [user, setUser] = useState(null);
  const [navigationLog, setNavigationLog] = useState([]);
  const [testInstructions, setTestInstructions] = useState('ready');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loginSuccessData, setLoginSuccessData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    // Log navigation changes
    setNavigationLog(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      path: location.pathname,
      action: 'Navigation',
      userStatus: user ? 'Logged In' : 'Logged Out'
    }]);
  }, [location, user]);

  const handleLogin = () => {
    // Simulate login
    const mockUser = {
      id: 'test123',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'student'
    };
    authService.setAuthData('mock-token', mockUser);
    setUser(mockUser);
    setTestInstructions('logged-in');

    // Show success popup
    setLoginSuccessData({
      title: '🎉 Test Login Successful!',
      message: `Welcome, ${mockUser.first_name}! You are now logged in as a ${mockUser.role}. You can now test the browser navigation features.`,
      icon: '🧪'
    });
    setShowSuccessPopup(true);

    // Navigate to dashboard after popup
    setTimeout(() => {
      navigate('/student/dashboard');
    }, 2500);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setTestInstructions('logged-out');
    navigate('/');
  };

  const clearLog = () => {
    setNavigationLog([]);
  };

  const resetTest = () => {
    setTestInstructions('ready');
    setNavigationLog([]);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    // Navigate to dashboard immediately if user closes popup
    navigate('/student/dashboard');
  };

  const getTestInstructions = () => {
    switch (testInstructions) {
      case 'ready':
        return {
          title: '🧪 Ready to Test Browser Navigation',
          steps: [
            'Click "Login" to simulate logging in and go to dashboard',
            'Use browser back button (←) to go back to this page',
            'You should be automatically logged out!',
            'Now try browser forward button (→) - you should go to login page, not dashboard!'
          ]
        };
      case 'logged-in':
        return {
          title: '✅ Now Test Browser Back Button',
          steps: [
            'You are now logged in and on the dashboard',
            'Click the browser back button (←) in your browser toolbar',
            'You should be redirected back to this page AND logged out automatically',
            'This demonstrates the security feature!'
          ]
        };
      case 'logged-out':
        return {
          title: '🚪 Now Test Browser Forward Button',
          steps: [
            'You have been logged out due to browser back navigation',
            'Now click the browser forward button (→) in your browser toolbar',
            'You should be redirected to the LOGIN page, NOT back to the dashboard',
            'This prevents unauthorized access to protected routes!'
          ]
        };
      default:
        return { title: '', steps: [] };
    }
  };

  const currentInstructions = getTestInstructions();

  return (
    <div className="min-h-screen animated-bg pt-20 px-4">
      {/* Success Popup */}
      <SuccessPopup
        isVisible={showSuccessPopup}
        onClose={handleSuccessPopupClose}
        title={loginSuccessData.title}
        message={loginSuccessData.message}
        icon={loginSuccessData.icon}
        autoClose={true}
        autoCloseDelay={2500}
        showCloseButton={true}
      />

      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">🧪 Browser Navigation Security Test</h1>
          <p className="text-white/70 mb-6">
            This page demonstrates the enhanced browser navigation security. The system now properly handles forward button navigation after logout!
          </p>

          <div className="flex space-x-4 mb-6">
            {!user ? (
              <button
                onClick={handleLogin}
                className="glass-button text-white hover:bg-white hover:text-gray-800 px-6 py-3 rounded-lg"
              >
                🔑 Login (Go to Dashboard)
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="glass-button text-white hover:bg-white hover:text-gray-800 px-6 py-3 rounded-lg"
              >
                🚪 Logout
              </button>
            )}
            
            <button
              onClick={() => navigate('/campaigns')}
              className="glass-button text-white hover:bg-white hover:text-gray-800 px-6 py-3 rounded-lg"
            >
              📋 Go to Campaigns
            </button>

            <button
              onClick={() => navigate('/about')}
              className="glass-button text-white hover:bg-white hover:text-gray-800 px-6 py-3 rounded-lg"
            >
              ℹ️ Go to About
            </button>

            <button
              onClick={resetTest}
              className="glass-button text-white hover:bg-white hover:text-gray-800 px-6 py-3 rounded-lg"
            >
              🔄 Reset Test
            </button>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">{currentInstructions.title}</h3>
            <ol className="space-y-2 text-blue-200/80 text-sm list-decimal ml-4">
              {currentInstructions.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-3">👤 Current Status</h3>
              <div className="space-y-2 text-white/80">
                <div><strong>Logged In:</strong> {user ? '✅ Yes' : '❌ No'}</div>
                <div><strong>Current Path:</strong> {location.pathname}</div>
                <div><strong>User Role:</strong> {user?.role || 'None'}</div>
                <div><strong>User Name:</strong> {user ? `${user.first_name} ${user.last_name}` : 'None'}</div>
                <div><strong>Test Phase:</strong> <span className="capitalize">{testInstructions.replace('-', ' ')}</span></div>
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-3">🔒 Enhanced Security Features</h3>
              <div className="space-y-2 text-white/80">
                <div>✅ <strong>Auto-logout on back navigation</strong></div>
                <div>✅ <strong>Forward button redirects to login</strong></div>
                <div>✅ <strong>Route protection</strong></div>
                <div>✅ <strong>Session tracking</strong></div>
                <div>✅ <strong>Navigation history monitoring</strong></div>
                <div>✅ <strong>Suspicious pattern detection</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">📊 Navigation Log</h2>
            <button
              onClick={clearLog}
              className="text-white/70 hover:text-white text-sm"
            >
              Clear Log
            </button>
          </div>
          
          <div className="max-h-64 overflow-y-auto space-y-2">
            {navigationLog.map((log, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <span className="text-white/50">{log.timestamp}</span>
                <span className="text-white/70">→</span>
                <span className="text-white">{log.path}</span>
                <span className="text-white/50">({log.action})</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  log.userStatus === 'Logged In' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {log.userStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">💡 How the Enhanced System Works</h2>
          <div className="space-y-3 text-white/80">
            <div>
              <strong>1. Login Detection:</strong> When you login, the system starts tracking your navigation from that point.
            </div>
            <div>
              <strong>2. Browser Navigation Monitoring:</strong> The system detects when you use browser back/forward buttons.
            </div>
            <div>
              <strong>3. Security Policy:</strong> If you navigate back to a public page from a dashboard, you're automatically logged out.
            </div>
            <div>
              <strong>4. Forward Button Protection:</strong> If you were logged out by navigation and try to go forward to a protected route, you're redirected to login instead.
            </div>
            <div>
              <strong>5. Pattern Detection:</strong> Suspicious back/forward navigation patterns trigger security measures.
            </div>
            <div>
              <strong>6. Session Protection:</strong> Your session is protected from unauthorized access through browser navigation.
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">🎯 Test Scenarios</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-blue-300">✅ Working Scenarios:</h3>
              <div className="space-y-1 text-sm text-white/80">
                <div>• Login → Dashboard → Browser Back → Auto-logout</div>
                <div>• Login → Dashboard → Browser Back → Browser Forward → Login Page</div>
                <div>• Login → Multiple Pages → Browser Back → Auto-logout</div>
                <div>• Custom Back Button → Smart Navigation</div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-red-300">❌ Blocked Scenarios:</h3>
              <div className="space-y-1 text-sm text-white/80">
                <div>• Forward to Dashboard after logout → Redirected to Login</div>
                <div>• Direct access to protected routes → Redirected to Login</div>
                <div>• Suspicious navigation patterns → Auto-logout</div>
                <div>• Browser refresh on protected route → Redirected to Login</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationTestPage;
