import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/apiService';

export const useBrowserNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationHistory = useRef([]);
  const isLoggedIn = useRef(false);
  const loginTimestamp = useRef(null);
  const wasLoggedOutByNavigation = useRef(false);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    const wasLoggedIn = isLoggedIn.current;
    isLoggedIn.current = !!currentUser;

    // Track when user logs in
    if (!wasLoggedIn && isLoggedIn.current) {
      loginTimestamp.current = Date.now();
      wasLoggedOutByNavigation.current = false;
      console.log('User logged in, tracking navigation from this point');
    }

    // Track navigation history
    if (location.pathname) {
      navigationHistory.current.push({
        path: location.pathname,
        timestamp: Date.now(),
        wasLoggedIn: wasLoggedIn
      });
    }
  }, [location]);

  useEffect(() => {
    const handlePopState = (event) => {
      const currentPath = window.location.pathname;
      const currentTime = Date.now();
      
      // Define public routes that don't require authentication
      const publicRoutes = ['/', '/login', '/register', '/campaigns', '/about', '/contact'];
      const isPublicRoute = publicRoutes.includes(currentPath);
      
      // Define dashboard/protected routes
      const protectedRoutes = ['/admin', '/student', '/mentor', '/donor', '/ngo'];
      const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
      
      console.log('Browser navigation detected:', {
        currentPath,
        isLoggedIn: isLoggedIn.current,
        navigationHistory: navigationHistory.current.length,
        loginTimestamp: loginTimestamp.current,
        wasLoggedOutByNavigation: wasLoggedOutByNavigation.current
      });

      // If user navigates back to a public route from a protected route, logout
      if (isPublicRoute && isLoggedIn.current && navigationHistory.current.length > 1) {
        const previousRoute = navigationHistory.current[navigationHistory.current.length - 2];
        const wasOnProtectedRoute = protectedRoutes.some(route => previousRoute.path.startsWith(route));
        
        if (wasOnProtectedRoute) {
          console.log('User navigated back from protected route to public route, logging out...');
          wasLoggedOutByNavigation.current = true;
          handleLogout();
          return;
        }
      }

      // If user navigates to a protected route without being logged in, redirect to login
      if (isProtectedRoute && !isLoggedIn.current) {
        console.log('Unauthorized access to protected route, redirecting to login...');
        navigate('/login');
        return;
      }

      // If user was logged out by navigation and tries to go forward to a protected route, redirect to login
      if (wasLoggedOutByNavigation.current && isProtectedRoute) {
        console.log('User was logged out by navigation, redirecting to login instead of protected route...');
        navigate('/login');
        return;
      }

      // Check for suspicious navigation patterns (back/forward after login)
      if (isLoggedIn.current && loginTimestamp.current) {
        const timeSinceLogin = currentTime - loginTimestamp.current;
        const hasRecentNavigation = navigationHistory.current.some(nav => 
          nav.timestamp > loginTimestamp.current && 
          nav.path !== currentPath
        );

        // If user has been navigating back/forward after login, consider logging them out
        if (hasRecentNavigation && timeSinceLogin < 300000) { // 5 minutes
          console.log('Suspicious navigation pattern detected after login, logging out for security...');
          wasLoggedOutByNavigation.current = true;
          handleLogout();
          return;
        }
      }

      // Update navigation history
      navigationHistory.current.push({
        path: currentPath,
        timestamp: currentTime,
        wasLoggedIn: isLoggedIn.current
      });
    };

    const handleBeforeUnload = (event) => {
      if (isLoggedIn.current && location.pathname.includes('/dashboard')) {
        const message = 'Are you sure you want to leave? You will be logged out.';
        event.returnValue = message;
        return message;
      }
    };

    // Add event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Track initial navigation
    if (location.pathname) {
      navigationHistory.current.push({
        path: location.pathname,
        timestamp: Date.now(),
        wasLoggedIn: isLoggedIn.current
      });
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location, navigate]);

  const handleLogout = () => {
    console.log('Logging out user due to navigation security policy');
    authService.logout();
    isLoggedIn.current = false;
    loginTimestamp.current = null;
    wasLoggedOutByNavigation.current = true;
    navigationHistory.current = [];
    navigate('/');
  };

  const handleLogin = (userData) => {
    isLoggedIn.current = true;
    loginTimestamp.current = Date.now();
    wasLoggedOutByNavigation.current = false;
    // Clear navigation history on login to start fresh
    navigationHistory.current = [{
      path: location.pathname,
      timestamp: Date.now(),
      wasLoggedIn: true
    }];
    console.log('User logged in, navigation history reset');
  };

  const handleBackNavigation = () => {
    // Custom back navigation that handles logout
    if (navigationHistory.current.length > 1) {
      const previousRoute = navigationHistory.current[navigationHistory.current.length - 2];
      const currentRoute = location.pathname;
      
      // If going from protected to public route, logout
      const protectedRoutes = ['/admin', '/student', '/mentor', '/donor', '/ngo'];
      const isCurrentProtected = protectedRoutes.some(route => currentRoute.startsWith(route));
      const isPreviousProtected = protectedRoutes.some(route => previousRoute.path.startsWith(route));
      
      if (isCurrentProtected && !isPreviousProtected) {
        wasLoggedOutByNavigation.current = true;
        handleLogout();
      } else {
        // Normal back navigation
        navigate(-1);
      }
    } else {
      // If no history, go to home
      navigate('/');
    }
  };

  const forceLogout = () => {
    console.log('Force logout requested');
    handleLogout();
  };

  return {
    handleLogout,
    handleLogin,
    handleBackNavigation,
    forceLogout,
    isLoggedIn: isLoggedIn.current,
    navigationHistory: navigationHistory.current,
    loginTimestamp: loginTimestamp.current,
    wasLoggedOutByNavigation: wasLoggedOutByNavigation.current
  };
};
