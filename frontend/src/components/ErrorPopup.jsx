import React from 'react';

const ErrorPopup = ({ 
  isVisible, 
  onClose, 
  title = 'Error!', 
  message = 'Something went wrong. Please try again.',
  errorType = 'general', // 'general', 'auth', 'validation', 'network', 'server'
  icon = '❌',
  showCloseButton = true,
  showRetryButton = false,
  onRetry = null
}) => {

  // Handle close button click
  const handleCloseClick = () => {
    console.log('ErrorPopup: Close button clicked, closing popup');
    onClose();
  };

  // Handle retry button click
  const handleRetryClick = () => {
    console.log('ErrorPopup: Retry button clicked');
    if (onRetry) {
      onRetry();
    }
  };

  // Prevent escape key from closing popup
  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isVisible) {
        console.log('ErrorPopup: Escape key pressed, popup will stay open');
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Get error-specific styling
  const getErrorStyling = (type) => {
    switch (type) {
      case 'auth':
        return {
          icon: '🔐',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          messageColor: 'text-red-600',
          buttonBg: 'bg-red-500 hover:bg-red-600',
          borderColor: 'border-red-200'
        };
      case 'validation':
        return {
          icon: '⚠️',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-600',
          buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
          borderColor: 'border-yellow-200'
        };
      case 'network':
        return {
          icon: '🌐',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-600',
          buttonBg: 'bg-blue-500 hover:bg-blue-600',
          borderColor: 'border-blue-200'
        };
      case 'server':
        return {
          icon: '🖥️',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          titleColor: 'text-purple-800',
          messageColor: 'text-purple-600',
          buttonBg: 'bg-purple-500 hover:bg-purple-600',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          icon: '❌',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-600',
          buttonBg: 'bg-gray-500 hover:bg-gray-600',
          borderColor: 'border-gray-200'
        };
    }
  };

  const styling = getErrorStyling(errorType);
  const finalIcon = icon === '❌' ? styling.icon : icon;

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4 border-2 ${styling.borderColor}`}
      >
        {/* Error Icon */}
        <div className="text-center mb-4">
          <div className={`w-16 h-16 ${styling.iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
            <span className="text-3xl">{finalIcon}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold text-center mb-2 ${styling.titleColor}`}>
          {title}
        </h3>

        {/* Message */}
        <p className={`text-center mb-6 ${styling.messageColor}`}>
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-3 justify-center">
          {showRetryButton && onRetry && (
            <button
              onClick={handleRetryClick}
              className={`${styling.buttonBg} text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              Try Again
            </button>
          )}
          
          {showCloseButton && (
            <button
              onClick={handleCloseClick}
              className={`${styling.buttonBg} text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              OK
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ErrorPopup;