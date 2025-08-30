import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/apiService';
import Navbar from '../../components/Navbar';
import SuccessPopup from '../../components/SuccessPopup';
import ErrorPopup from '../../components/ErrorPopup';
import { getErrorConfig } from '../../utils/errorHandler';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = select role, 2 = register form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: null,
    phone: '',
    organization: ''
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [registrationSuccessData, setRegistrationSuccessData] = useState({});
  const [errorData, setErrorData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      const validationError = {
        title: '🔒 Passwords Do Not Match',
        message: 'The passwords you entered do not match. Please make sure both passwords are identical.',
        errorType: 'validation',
        icon: '🔒',
        autoClose: false,
        showRetryButton: true
      };
      setErrorData(validationError);
      setShowErrorPopup(true);
      return;
    }

    if (formData.password.length < 6) {
      const validationError = {
        title: '🔒 Password Too Short',
        message: 'Password must be at least 6 characters long. Please choose a stronger password.',
        errorType: 'validation',
        icon: '🔒',
        autoClose: false,
        showRetryButton: true
      };
      setErrorData(validationError);
      setShowErrorPopup(true);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(formData);
      const { access_token, user } = response.data;
      authService.setAuthData(access_token, user);

      // Show success popup
      setRegistrationSuccessData({
        title: '🎉 Registration Successful!',
        message: `Welcome to EduBridge, ${user.first_name}! Your account has been created successfully as a ${user.role}.`,
        icon: '🎉'
      });
      setShowSuccessPopup(true);

      // Navigate after a short delay to let user see the success message
      setTimeout(() => {
        switch (user.role) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'mentor':
            navigate('/mentor/dashboard');
            break;
          case 'donor':
            navigate('/donor/dashboard');
            break;
          case 'ngo':
            navigate('/ngo/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }, 2500); // 2.5 second delay

    } catch (err) {
      // Get error configuration for registration context
      const errorConfig = getErrorConfig(err, 'registration');
      setErrorData(errorConfig);
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    // Navigate immediately if user closes popup manually
    if (registrationSuccessData.user) {
      const { user } = registrationSuccessData;
      switch (user.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'mentor':
          navigate('/mentor/dashboard');
          break;
        case 'donor':
          navigate('/donor/dashboard');
          break;
        case 'ngo':
          navigate('/ngo/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  };

  const handleErrorPopupClose = () => {
    setShowErrorPopup(false);
  };

  const handleRetry = () => {
    setShowErrorPopup(false);
    // Form is already filled, user can try again
  };

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      {/* Success Popup */}
      <SuccessPopup
        isVisible={showSuccessPopup}
        onClose={handleSuccessPopupClose}
        title={registrationSuccessData.title}
        message={registrationSuccessData.message}
        icon={registrationSuccessData.icon}
        autoClose={true}
        autoCloseDelay={2500}
        showCloseButton={true}
      />

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

      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
        
        {/* 🔹 Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Join EduBridge</h1>
          <p className="text-white/80 text-lg">
            Create your account and start making a difference
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="glass-card p-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {step === 1 ? 'Choose your role' : `Register as ${formData.role}`}
              </h2>
              <p className="text-white/70">
                {step === 1
                  ? 'Select your role to continue'
                  : 'Fill in your details to create an account'}
              </p>
            </div>

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'student', label: 'Student', icon: '🎓' },
                    { value: 'mentor', label: 'Mentor', icon: '👨‍🏫' },
                    { value: 'donor', label: 'Donor', icon: '💝' },
                    { value: 'ngo', label: 'NGO', icon: '🏢' },
                    { value: 'admin', label: 'Admin', icon: '👨‍💼' }
                  ].map((role) => (
                    <div
                      key={role.value}
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={`cursor-pointer transition-all duration-300 rounded-lg p-4 text-center ${
                        formData.role === role.value
                          ? 'bg-white/20 border-2 border-white text-white scale-105'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      {/* Icon with size change */}
                      <div
                        className={`mb-1 transition-all duration-300 ${
                          formData.role === role.value ? 'text-3xl' : 'text-2xl'
                        }`}
                      >
                        {role.icon}
                      </div>
                      <div className="text-sm font-medium">{role.label}</div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!formData.role}
                  onClick={() => setStep(2)}
                  className={`mt-6 w-full glass-button text-white font-medium transition-colors ${
                    !formData.role
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-white hover:text-gray-800'
                  }`}
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Registration Form */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/80 text-sm mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
                    placeholder="Enter phone number"
                  />
                </div>

                {(formData.role === 'ngo' || formData.role === 'admin') && (
                  <div>
                    <label className="block text-white/80 text-sm mb-1">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
                      placeholder="Enter organization name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-white/80 text-sm mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-white/60 hover:text-white transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="glass-button text-white font-medium hover:bg-white hover:text-gray-800 transition-colors"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;