import React, { useEffect } from 'react';

const SuccessPopup = ({ 
  isVisible, 
  onClose, 
  title = 'Success!', 
  message = 'Operation completed successfully!',
  icon = '✅',
  autoClose = true,
  autoCloseDelay = 3000,
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  // Close popup when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
        {/* Success Icon */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">{icon}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Close Button */}
        {showCloseButton && (
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        )}

        {/* Auto-close indicator */}
        {autoClose && (
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-400">
              Auto-closing in {Math.ceil(autoCloseDelay / 1000)}s...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPopup;
