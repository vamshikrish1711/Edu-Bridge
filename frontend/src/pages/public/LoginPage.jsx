import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/apiService';
import Navbar from '../../components/Navbar';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
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
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="glass-card">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white/70">Sign in to your EduBridge account</p>
              <div className="mt-2 text-xs text-white/50">
                Admin? Use: admin@edubridge.com / admin123
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
<div>
  <label className="block text-white/80 text-sm font-medium mb-2">
    I am a...
  </label>
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
        className={`glass-card cursor-pointer transition-all duration-300 ${
          formData.role === role.value
            ? 'ring-2 ring-blue-400 bg-blue-500/20 scale-105'
            : 'hover:bg-white/10'
        }`}
      >
        <div className="text-center">
          <div className="text-2xl mb-1">{role.icon}</div>
          <div className="text-white text-sm font-medium">{role.label}</div>
        </div>
      </div>
    ))}
  </div>

  {/* Continue Button */}
  <button
    type="button"
    onClick={() => navigate(`/login/${formData.role}`)}
    className="mt-6 w-full glass-button text-white hover:bg-white hover:text-gray-800 font-medium transition-colors"
  >
    Continue
  </button>
</div>        
            </form>

          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 glass-card w-20 h-20 rounded-full opacity-50 float"></div>
          <div className="absolute bottom-20 right-10 glass-card w-16 h-16 rounded-full opacity-30 float" style={{animationDelay: '2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;