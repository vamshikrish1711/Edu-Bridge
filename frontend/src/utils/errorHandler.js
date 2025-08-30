// Error handling utility for EduBridge application

export const getErrorConfig = (error, context = 'general') => {
  // Default error configuration
  let errorConfig = {
    title: 'Error!',
    message: 'Something went wrong. Please try again.',
    errorType: 'general',
    icon: '❌',
    autoClose: false, // All errors should require user acknowledgment
    showRetryButton: false
  };

  // Handle different error contexts
  switch (context) {
    case 'login':
      return getLoginErrorConfig(error);
    case 'registration':
      return getRegistrationErrorConfig(error);
    case 'auth':
      return getAuthErrorConfig(error);
    case 'network':
      return getNetworkErrorConfig(error);
    case 'validation':
      return getValidationErrorConfig(error);
    default:
      return getGeneralErrorConfig(error);
  }
};

// Login-specific error handling
const getLoginErrorConfig = (error) => {
  const errorMessage = error?.response?.data?.error || error?.message || 'Login failed';
  
  // Check for specific error patterns
  if (errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('incorrect')) {
    return {
      title: '🔐 Incorrect Password',
      message: 'The password you entered is incorrect. Please check your password and try again.',
      errorType: 'auth',
      icon: '🔐',
      autoClose: false, // User must acknowledge
      showRetryButton: true
    };
  }
  
  if (errorMessage.toLowerCase().includes('user not found') || errorMessage.toLowerCase().includes('not registered')) {
    return {
      title: '👤 User Not Found',
      message: 'No account found with this email address. Please check your email or create a new account.',
      errorType: 'auth',
      icon: '👤',
      autoClose: false, // User must acknowledge
      showRetryButton: false
    };
  }
  
  if (errorMessage.toLowerCase().includes('invalid email')) {
    return {
      title: '📧 Invalid Email',
      message: 'Please enter a valid email address.',
      errorType: 'validation',
      icon: '📧',
      autoClose: false, // User must acknowledge
      showRetryButton: true
    };
  }
  
  if (errorMessage.toLowerCase().includes('account locked') || errorMessage.toLowerCase().includes('suspended')) {
    return {
      title: '🚫 Account Locked',
      message: 'Your account has been temporarily locked. Please contact support for assistance.',
      errorType: 'auth',
      icon: '🚫',
      autoClose: false, // User must acknowledge
      showRetryButton: false
    };
  }
  
  if (errorMessage.toLowerCase().includes('too many attempts')) {
    return {
      title: '⚠️ Too Many Attempts',
      message: 'Too many failed login attempts. Please wait a few minutes before trying again.',
      errorType: 'auth',
      icon: '⚠️',
      autoClose: false, // User must acknowledge - changed from true
      showRetryButton: false
    };
  }
  
  // Default login error
  return {
    title: '🔐 Login Failed',
    message: errorMessage,
    errorType: 'auth',
    icon: '🔐',
    autoClose: false, // User must acknowledge
    showRetryButton: true
  };
};

// Registration-specific error handling
const getRegistrationErrorConfig = (error) => {
  const errorMessage = error?.response?.data?.error || error?.message || 'Registration failed';
  
  if (errorMessage.toLowerCase().includes('already exists') || errorMessage.toLowerCase().includes('already registered')) {
    return {
      title: '📧 Email Already Exists',
      message: 'An account with this email address already exists. Please use a different email or try logging in.',
      errorType: 'validation',
      icon: '📧',
      autoClose: false, // User must acknowledge
      showRetryButton: false
    };
  }
  
  if (errorMessage.toLowerCase().includes('password') && errorMessage.toLowerCase().includes('weak')) {
    return {
      title: '🔒 Weak Password',
      message: 'Your password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.',
      errorType: 'validation',
      icon: '🔒',
      autoClose: false, // User must acknowledge
      showRetryButton: true
    };
  }
  
  if (errorMessage.toLowerCase().includes('invalid phone')) {
    return {
      title: '📱 Invalid Phone Number',
      message: 'Please enter a valid phone number.',
      errorType: 'validation',
      icon: '📱',
      autoClose: false, // User must acknowledge
      showRetryButton: true
    };
  }
  
  if (errorMessage.toLowerCase().includes('organization') && errorMessage.toLowerCase().includes('required')) {
    return {
      title: '🏢 Organization Required',
      message: 'Organization name is required for this role. Please provide your organization details.',
      errorType: 'validation',
      icon: '🏢',
      autoClose: false, // User must acknowledge
      showRetryButton: true
    };
  }
  
  // Default registration error
  return {
    title: '📝 Registration Failed',
    message: errorMessage,
    errorType: 'validation',
    icon: '📝',
    autoClose: false, // User must acknowledge
    showRetryButton: true
  };
};

// Authentication error handling
const getAuthErrorConfig = (error) => {
  const errorMessage = error?.response?.data?.error || error?.message || 'Authentication failed';
  
  if (errorMessage.toLowerCase().includes('token expired') || errorMessage.toLowerCase().includes('expired')) {
    return {
      title: '⏰ Session Expired',
      message: 'Your session has expired. Please log in again.',
      errorType: 'auth',
      icon: '⏰',
      autoClose: false, // User must acknowledge - changed from true
      showRetryButton: false
    };
  }
  
  if (errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('access denied')) {
    return {
      title: '🚫 Access Denied',
      message: 'You do not have permission to access this resource.',
      errorType: 'auth',
      icon: '🚫',
      autoClose: false, // User must acknowledge
      showRetryButton: false
    };
  }
  
  return {
    title: '🔐 Authentication Error',
    message: errorMessage,
    errorType: 'auth',
    icon: '🔐',
    autoClose: false, // User must acknowledge
    showRetryButton: true
  };
};

// Network error handling
const getNetworkErrorConfig = (error) => {
  const errorMessage = error?.message || 'Network error occurred';
  
  if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('connection')) {
    return {
      title: '🌐 Network Error',
      message: 'Unable to connect to the server. Please check your internet connection and try again.',
      errorType: 'network',
      icon: '🌐',
      autoClose: false, // User must acknowledge
      showRetryButton: true
    };
  }
  
  if (errorMessage.toLowerCase().includes('timeout')) {
    return {
      title: '⏱️ Request Timeout',
      message: 'The request took too long to complete. Please try again.',
      errorType: 'network',
      icon: '⏱️',
      autoClose: false, // User must acknowledge
      showRetryButton: true
    };
  }
  
  return {
    title: '🌐 Network Error',
    message: errorMessage,
    errorType: 'network',
    icon: '🌐',
    autoClose: false, // User must acknowledge
    showRetryButton: true
  };
};

// Validation error handling
const getValidationErrorConfig = (error) => {
  const errorMessage = error?.response?.data?.error || error?.message || 'Validation failed';
  
  return {
    title: '⚠️ Validation Error',
    message: errorMessage,
    errorType: 'validation',
    icon: '⚠️',
    autoClose: false, // User must acknowledge
    showRetryButton: true
  };
};

// General error handling
const getGeneralErrorConfig = (error) => {
  const errorMessage = error?.response?.data?.error || error?.message || 'An unexpected error occurred';
  
  if (error?.response?.status === 500) {
    return {
      title: '🖥️ Server Error',
      message: 'Something went wrong on our end. Please try again later.',
      errorType: 'server',
      icon: '🖥️',
      autoClose: false, // User must acknowledge
      showRetryButton: true
    };
  }
  
  if (error?.response?.status === 404) {
    return {
      title: '🔍 Not Found',
      message: 'The requested resource was not found.',
      errorType: 'general',
      icon: '🔍',
      autoClose: false, // User must acknowledge
      showRetryButton: false
    };
  }
  
  return {
    title: '❌ Error',
    message: errorMessage,
    errorType: 'general',
    icon: '❌',
    autoClose: false, // User must acknowledge
    showRetryButton: true
  };
};

// Helper function to check if error is retryable
export const isRetryableError = (error) => {
  const errorMessage = error?.response?.data?.error || error?.message || '';
  
  // Network errors are usually retryable
  if (errorMessage.toLowerCase().includes('network') || 
      errorMessage.toLowerCase().includes('connection') ||
      errorMessage.toLowerCase().includes('timeout')) {
    return true;
  }
  
  // Server errors (5xx) are usually retryable
  if (error?.response?.status >= 500) {
    return true;
  }
  
  // Authentication errors are usually not retryable
  if (errorMessage.toLowerCase().includes('password') ||
      errorMessage.toLowerCase().includes('user not found') ||
      errorMessage.toLowerCase().includes('already exists')) {
    return false;
  }
  
  return true;
};
