import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/apiService';
import Navbar from '../../components/Navbar';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    organization: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const roles = [
    { value: 'student', label: 'Student', icon: '🎓', description: 'Looking for educational opportunities and mentorship' },
    { value: 'mentor', label: 'Mentor', icon: '👨‍🏫', description: 'Want to guide and support students' },
    { value: 'donor', label: 'Donor', icon: '💝', description: 'Want to support educational initiatives' },
    { value: 'ngo', label: 'NGO', icon: '🏢', description: 'Organization creating educational campaigns' },
    { value: 'admin', label: 'Admin', icon: '👨‍💼', description: 'Platform administrator' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await authService.register(formData);
      const { access_token, user } = response.data;
      
      // Store auth data
      authService.setAuthData(access_token, user);
      
      // Redirect based on role
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
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => {
    if (step === 1 && formData.role) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <div className="w-full max-w-2xl">
          {/* Registration Card */}
          <div className="glass-card">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Join EduBridge</h2>
              <p className="text-white/70">Create your account and start making a difference</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/50'
                }`}>
                  1
                </div>
                <div className={`w-16 h-0.5 ${
                  step >= 2 ? 'bg-blue-500' : 'bg-white/20'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/50'
                }`}>
                  2
                </div>
              </div>
            </div>

            {step === 1 ? (
              /* Step 1: Role Selection */
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 text-center">Choose Your Role</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {roles.map((role) => (
                    <label
                      key={role.value}
                      className={`glass-card cursor-pointer transition-all duration-300 ${
                        formData.role === role.value
                          ? 'ring-2 ring-blue-400 bg-blue-500/20'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center p-4">
                        <div className="text-3xl mb-2">{role.icon}</div>
                        <div className="text-white font-medium mb-1">{role.label}</div>
                        <div className="text-white/60 text-xs">{role.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  onClick={nextStep}
                  disabled={!formData.role}
                  className="w-full glass-button text-white hover:bg-white hover:text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            ) : (
              /* Step 2: Registration Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-white/80 text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="glass-input text-white placeholder-white/50"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-white/80 text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="glass-input text-white placeholder-white/50"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="glass-input text-white placeholder-white/50"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-white/80 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="glass-input text-white placeholder-white/50"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {(formData.role === 'ngo' || formData.role === 'mentor') && (
                  <div>
                    <label htmlFor="organization" className="block text-white/80 text-sm font-medium mb-2">
                      {formData.role === 'ngo' ? 'Organization Name' : 'Company/Organization'}
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="glass-input text-white placeholder-white/50"
                      placeholder={`Enter your ${formData.role === 'ngo' ? 'organization' : 'company'} name`}
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="glass-input text-white placeholder-white/50"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-white/80 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="glass-input text-white placeholder-white/50"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-white/70">
                    I agree to the{' '}
                    <a href="#" className="text-blue-300 hover:text-blue-200">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-300 hover:text-blue-200">Privacy Policy</a>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 glass-button text-white hover:bg-white hover:text-gray-800"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 glass-button text-white hover:bg-white hover:text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            )}

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-white/70">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 glass-card w-20 h-20 rounded-full opacity-50 float"></div>
          <div className="absolute bottom-20 right-10 glass-card w-16 h-16 rounded-full opacity-30 float" style={{animationDelay: '2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;