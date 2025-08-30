import React, { useState } from 'react';
import ErrorPopup from './ErrorPopup';
import { getErrorConfig } from '../utils/errorHandler';

const ErrorPopupDemo = () => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorData, setErrorData] = useState({});

  const demoErrors = [
    {
      name: '🔐 Incorrect Password',
      description: 'User enters wrong password',
      error: { response: { data: { error: 'Incorrect password' } } },
      context: 'login'
    },
    {
      name: '👤 User Not Found',
      description: 'User tries to login with non-existent email',
      error: { response: { data: { error: 'User not found' } } },
      context: 'login'
    },
    {
      name: '📧 Email Already Exists',
      description: 'User tries to register with existing email',
      error: { response: { data: { error: 'Email already exists' } } },
      context: 'registration'
    },
    {
      name: '🔒 Weak Password',
      description: 'User enters weak password during registration',
      error: { response: { data: { error: 'Password is too weak' } } },
      context: 'registration'
    },
    {
      name: '🌐 Network Error',
      description: 'Connection issues or server unreachable',
      error: { message: 'Network Error: Unable to connect to server' },
      context: 'network'
    },
    {
      name: '⏱️ Request Timeout',
      description: 'Request takes too long to complete',
      error: { message: 'Request timeout after 30 seconds' },
      context: 'network'
    },
    {
      name: '🖥️ Server Error',
      description: 'Internal server error (500 status)',
      error: { response: { status: 500, data: { error: 'Internal server error' } } },
      context: 'general'
    },
    {
      name: '🔍 Not Found',
      description: 'Resource not found (404 status)',
      error: { response: { status: 404, data: { error: 'Resource not found' } } },
      context: 'general'
    },
    {
      name: '⏰ Session Expired',
      description: 'User session has expired',
      error: { response: { data: { error: 'Token expired' } } },
      context: 'auth'
    },
    {
      name: '🚫 Access Denied',
      description: 'User lacks permission for resource',
      error: { response: { data: { error: 'Access denied' } } },
      context: 'auth'
    },
    {
      name: '⚠️ Too Many Attempts',
      description: 'User has exceeded login attempts',
      error: { response: { data: { error: 'Too many failed attempts' } } },
      context: 'login'
    },
    {
      name: '📱 Invalid Phone',
      description: 'User enters invalid phone number',
      error: { response: { data: { error: 'Invalid phone number format' } } },
      context: 'registration'
    }
  ];

  const handleShowError = (demoError) => {
    const errorConfig = getErrorConfig(demoError.error, demoError.context);
    setErrorData(errorConfig);
    setShowErrorPopup(true);
  };

  const handleErrorPopupClose = () => {
    setShowErrorPopup(false);
  };

  const handleRetry = () => {
    setShowErrorPopup(false);
    // Simulate retry action
    setTimeout(() => {
      alert('Retry action triggered!');
    }, 100);
  };

  return (
    <div className="min-h-screen animated-bg pt-20 px-4">
      {/* Error Popup */}
      <ErrorPopup
        isVisible={showErrorPopup}
        onClose={handleErrorPopupClose}
        title={errorData.title}
        message={errorData.message}
        errorType={errorData.errorType}
        icon={errorData.icon}
        showCloseButton={true}
        showRetryButton={errorData.showRetryButton}
        onRetry={handleRetry}
      />

      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">🧪 Error Popup Demo</h1>
          <p className="text-white/70 mb-6">
            This page demonstrates all the different types of error popups available in EduBridge. 
            <strong className="text-yellow-300"> All error popups now require manual acknowledgment - they will not close automatically.</strong>
            Click on any error type to see how it appears and behaves.
          </p>

          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">⚠️ Important Note:</h3>
            <p className="text-yellow-200/80 text-sm">
              <strong>User Acknowledgment Required:</strong> All error popups now stay open until the user explicitly clicks the "OK" button. 
              This ensures users read and understand the error message before proceeding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoErrors.map((demoError, index) => (
              <div
                key={index}
                onClick={() => handleShowError(demoError)}
                className="glass-card p-4 cursor-pointer hover:scale-105 transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{demoError.name}</h3>
                <p className="text-white/70 text-sm mb-3">{demoError.description}</p>
                <div className="text-xs text-white/50">
                  Context: <span className="text-blue-300">{demoError.context}</span>
                </div>
                <div className="mt-2 text-xs text-white/40">
                  Click to test →
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🎨 Error Popup Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-blue-300 mb-3">✨ Visual Features:</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• <strong>Color-coded:</strong> Different colors for different error types</li>
                <li>• <strong>Custom Icons:</strong> Relevant emojis for each error category</li>
                <li>• <strong>Responsive Design:</strong> Works on all screen sizes</li>
                <li>• <strong>Smooth Animations:</strong> Slide-in and scale effects</li>
                <li>• <strong>Backdrop Blur:</strong> Modern glass-morphism effect</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-green-300 mb-3">🔧 Functional Features:</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• <strong>Manual Acknowledgment:</strong> All errors require user to click OK</li>
                <li>• <strong>Retry Button:</strong> For retryable operations</li>
                <li>• <strong>Click Outside:</strong> Close by clicking backdrop</li>
                <li>• <strong>Context-aware:</strong> Different handling for login/registration</li>
                <li>• <strong>Smart Messages:</strong> User-friendly error descriptions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">🎯 Error Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-500/20 rounded-lg border border-red-500/30">
              <div className="text-2xl mb-2">🔐</div>
              <h3 className="text-red-300 font-medium">Authentication</h3>
              <p className="text-red-200/80 text-sm">Login, password, user not found</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <div className="text-2xl mb-2">⚠️</div>
              <h3 className="text-yellow-300 font-medium">Validation</h3>
              <p className="text-yellow-200/80 text-sm">Form validation, data format</p>
            </div>
            
            <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <div className="text-2xl mb-2">🌐</div>
              <h3 className="text-blue-300 font-medium">Network</h3>
              <p className="text-blue-200/80 text-sm">Connection, timeout issues</p>
            </div>
            
            <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <div className="text-2xl mb-2">🖥️</div>
              <h3 className="text-purple-300 font-medium">Server</h3>
              <p className="text-purple-200/80 text-sm">Internal server errors</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">💡 Usage Examples</h2>
          <div className="space-y-4">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-300 font-medium mb-2">Login Errors:</h3>
              <code className="text-blue-200/80 text-sm block">
                {`const errorConfig = getErrorConfig(error, 'login');
<ErrorPopup {...errorConfig} />`}
              </code>
            </div>
            
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-green-300 font-medium mb-2">Registration Errors:</h3>
              <code className="text-green-200/80 text-sm block">
                {`const errorConfig = getErrorConfig(error, 'registration');
<ErrorPopup {...errorConfig} />`}
              </code>
            </div>
            
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-medium mb-2">Custom Error:</h3>
              <code className="text-purple-200/80 text-sm block">
                {`<ErrorPopup
  title="🚫 Custom Error"
  message="Your custom error message"
  errorType="auth"
  showRetryButton={true}
  onRetry={handleRetry}
/>`}
              </code>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">🔒 User Acknowledgment Policy</h2>
          <div className="space-y-3 text-white/80">
            <div>
              <strong>Why Manual Acknowledgment?</strong> Error messages contain important information that users need to read and understand before proceeding.
            </div>
            <div>
              <strong>Security:</strong> Prevents users from accidentally dismissing critical security warnings or authentication errors.
            </div>
            <div>
              <strong>User Experience:</strong> Ensures users are aware of what went wrong and how to fix it.
            </div>
            <div>
              <strong>Compliance:</strong> Meets accessibility standards by requiring explicit user action.
            </div>
            <div>
              <strong>Consistency:</strong> All error types follow the same acknowledgment pattern for predictable behavior.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopupDemo;
