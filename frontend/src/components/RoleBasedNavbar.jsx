import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/apiService';

const RoleBasedNavbar = ({ userRole }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [showBackButton, setShowBackButton] = useState(false);
  const [loginTimestamp, setLoginTimestamp] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use refs to avoid infinite re-renders
  const userRef = useRef(null);
  const navigationHistoryRef = useRef([]);
  const loginTimestampRef = useRef(null);
  const wasLoggedOutByNavigationRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize the logout function to prevent recreation
  const handleLogout = useCallback(() => {
    console.log('Logging out user due to navigation security policy');
    authService.logout();
    setUser(null);
    setNavigationHistory([]);
    setShowBackButton(false);
    setLoginTimestamp(null);
    userRef.current = null;
    navigationHistoryRef.current = [];
    loginTimestampRef.current = null;
    wasLoggedOutByNavigationRef.current = true;
    navigate('/');
  }, [navigate]);

  // Memoize the back to home function
  const handleBackToHome = useCallback(() => {
    authService.logout();
    setUser(null);
    setNavigationHistory([]);
    setShowBackButton(false);
    setLoginTimestamp(null);
    userRef.current = null;
    navigationHistoryRef.current = [];
    loginTimestampRef.current = null;
    wasLoggedOutByNavigationRef.current = true;
    navigate('/');
  }, [navigate]);

  // Memoize the custom back function
  const handleCustomBack = useCallback(() => {
    if (navigationHistoryRef.current.length > 1) {
      const previousRoute = navigationHistoryRef.current[navigationHistoryRef.current.length - 2];
      const currentRoute = location.pathname;
      
      const protectedRoutes = ['/admin', '/student', '/mentor', '/donor', '/ngo'];
      const isCurrentProtected = protectedRoutes.some(route => currentRoute.startsWith(route));
      const isPreviousProtected = protectedRoutes.some(route => previousRoute.path.startsWith(route));
      
      if (isCurrentProtected && !isPreviousProtected) {
        wasLoggedOutByNavigationRef.current = true;
        handleLogout();
      } else {
        navigate(-1);
      }
    } else {
      navigate('/');
    }
  }, [location.pathname, navigate, handleLogout]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const wasLoggedIn = !!userRef.current;
    const isNowLoggedIn = !!currentUser;
    
    if (currentUser !== userRef.current) {
      setUser(currentUser);
      userRef.current = currentUser;
      
      // Track when user logs in
      if (!wasLoggedIn && isNowLoggedIn) {
        const timestamp = Date.now();
        setLoginTimestamp(timestamp);
        loginTimestampRef.current = timestamp;
        wasLoggedOutByNavigationRef.current = false;
        console.log('User logged in, tracking navigation from this point');
      }
    }
  }, []); // Empty dependency array since we're using refs

  // Handle browser navigation (back/forward buttons) - separate effect
  useEffect(() => {
    const handlePopState = (event) => {
      const currentPath = window.location.pathname;
      const currentTime = Date.now();
      
      // Check if user is trying to navigate back to a public route
      const isPublicRoute = ['/', '/login', '/register', '/campaigns', '/about', '/contact'].includes(currentPath);
      
      // If user navigates back to a public route from a dashboard, logout
      if (isPublicRoute && userRef.current && navigationHistoryRef.current.length > 0) {
        const lastDashboardRoute = navigationHistoryRef.current.find(route => 
          route.path.includes('/dashboard') || 
          route.path.includes('/admin') || 
          route.path.includes('/student') || 
          route.path.includes('/mentor') || 
          route.path.includes('/donor') || 
          route.path.includes('/ngo')
        );
        
        if (lastDashboardRoute) {
          console.log('User navigated back from dashboard to public route, logging out...');
          wasLoggedOutByNavigationRef.current = true;
          handleLogout();
          return;
        }
      }

      // If user was logged out by navigation and tries to go forward to a protected route, redirect to login
      const protectedRoutes = ['/admin', '/student', '/mentor', '/donor', '/ngo'];
      const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
      
      if (wasLoggedOutByNavigationRef.current && isProtectedRoute) {
        console.log('User was logged out by navigation, redirecting to login instead of protected route...');
        navigate('/login');
        return;
      }

      // Check for suspicious navigation patterns (back/forward after login)
      if (userRef.current && loginTimestampRef.current) {
        const timeSinceLogin = currentTime - loginTimestampRef.current;
        const hasRecentNavigation = navigationHistoryRef.current.some(nav => 
          nav.timestamp > loginTimestampRef.current && 
          nav.path !== currentPath
        );

        // If user has been navigating back/forward after login, logout for security
        if (hasRecentNavigation && timeSinceLogin < 300000) { // 5 minutes
          console.log('Suspicious navigation pattern detected after login, logging out for security...');
          wasLoggedOutByNavigationRef.current = true;
          handleLogout();
          return;
        }
      }
      
      // Update navigation history
      const newHistoryEntry = {
        path: currentPath,
        timestamp: currentTime,
        wasLoggedIn: !!userRef.current
      };
      
      setNavigationHistory(prev => [...prev, newHistoryEntry]);
      navigationHistoryRef.current.push(newHistoryEntry);
      
      // Show back button if we have navigation history
      setShowBackButton(navigationHistoryRef.current.length > 1);
    };

    // Listen for browser navigation events
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleLogout, navigate]); // Depend on handleLogout and navigate

  // Track current location changes - separate effect
  useEffect(() => {
    if (location.pathname) {
      const newHistoryEntry = {
        path: location.pathname,
        timestamp: Date.now(),
        wasLoggedIn: !!userRef.current
      };
      
      setNavigationHistory(prev => [...prev, newHistoryEntry]);
      navigationHistoryRef.current.push(newHistoryEntry);
      setShowBackButton(navigationHistoryRef.current.length > 0);
    }
  }, [location.pathname]); // Only depend on location.pathname

  // Handle beforeunload to warn about leaving dashboard
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (userRef.current && location.pathname.includes('/dashboard')) {
        const message = 'Are you sure you want to leave? You will be logged out.';
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname]); // Only depend on location.pathname

  // Role-specific navigation items
  const getRoleNavItems = useCallback((role) => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard' },
          { name: 'Users', path: '/admin/users' },
          { name: 'Campaigns', path: '/admin/campaigns' },
          { name: 'Analytics', path: '/admin/analytics' },
        ];
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard' },
          { name: 'My Campaigns', path: '/student/campaigns' },
          { name: 'My Mentor', path: '/student/mentor' },
          { name: 'Scholarships', path: '/student/scholarships' },
        ];
      case 'mentor':
        return [
          { name: 'Dashboard', path: '/mentor/dashboard' },
          { name: 'My Students', path: '/mentor/students' },
          { name: 'Campaigns', path: '/mentor/campaigns' },
          { name: 'Resources', path: '/mentor/resources' },
        ];
      case 'donor':
        return [
          { name: 'Dashboard', path: '/donor/dashboard' },
          { name: 'My Donations', path: '/donor/donations' },
          { name: 'Campaigns', path: '/donor/campaigns' },
          { name: 'Impact', path: '/donor/impact' },
        ];
      case 'ngo':
        return [
          { name: 'Dashboard', path: '/ngo/dashboard' },
          { name: 'My Campaigns', path: '/ngo/campaigns' },
          { name: 'Donations', path: '/ngo/donations' },
          { name: 'Reports', path: '/ngo/reports' },
        ];
      default:
        return [];
    }
  }, []);

  const roleNavItems = getRoleNavItems(userRole);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass py-2' : 'py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Navigation Controls */}
          <div className="flex items-center space-x-4">
            {/* Logo with Back to Home functionality */}
            <button 
              onClick={handleBackToHome}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-white font-bold text-xl">EduBridge</span>
              <span className="text-white/70 text-sm ml-2">← Back to Home</span>
            </button>
          </div>

          {/* Role-specific Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {roleNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-white hover:text-blue-200 transition-colors duration-300 ${
                  location.pathname === item.path ? 'text-blue-200 font-medium' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <div className="text-right">
                  <div className="text-white font-medium">{user.first_name} {user.last_name}</div>
                  <div className="text-white/70 text-sm capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="glass-button text-white hover:bg-white hover:text-gray-800 px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="space-y-2">
              {roleNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block text-white hover:text-blue-200 transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <div className="pt-4 border-t border-white/20">
                  <div className="text-white/70 text-sm mb-2">
                    {user.first_name} {user.last_name} ({user.role})
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-white hover:text-blue-200 transition-colors duration-300 py-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default RoleBasedNavbar;
