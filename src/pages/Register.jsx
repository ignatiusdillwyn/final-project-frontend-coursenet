import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/userAPI';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  // Check if form is filled
  useEffect(() => {
    const { username, email, password, confirmPassword } = formData;
    setIsFormFilled(
      username.trim() !== '' && 
      email.trim() !== '' && 
      password.trim() !== '' && 
      confirmPassword.trim() !== '' &&
      acceptedTerms
    );
  }, [formData, acceptedTerms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!acceptedTerms) {
      setError('You must accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Show loading animation
    Swal.fire({
      title: '<div style="color: #7c3aed; font-weight: bold; font-size: 24px;">Creating Account...</div>',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="position: relative; margin: 20px 0;">
            <div style="width: 80px; height: 80px; border: 4px solid #e9d5ff; border-radius: 50%;"></div>
            <div style="position: absolute; top: 0; left: 0; width: 80px; height: 80px; border: 4px solid #7c3aed; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>
          <p style="margin-top: 16px; color: #6b7280;">Setting up your account...</p>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      background: 'rgba(255, 255, 255, 0.95)',
      backdrop: 'rgba(0, 0, 0, 0.4)'
    });

    try {
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        image: ''
      };

      console.log('Registration payload:', payload);
      
      const response = await register(payload);
      
      console.log('Registration successful:', response);
      
      // Close loading
      Swal.close();

      // Show success animation
      Swal.fire({
        title: '<div style="color: #10b981; font-weight: bold; font-size: 32px;">🎉 Account Created!</div>',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 96px; height: 96px; background: linear-gradient(135deg, #10b981, #34d399); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; animation: bounce 1s infinite;">
              <span style="color: white; font-size: 48px;">✓</span>
            </div>
            <p style="font-size: 18px; color: #374151; margin-bottom: 8px;">Welcome to TokoPakEdi!</p>
            <p style="color: #6b7280;">Redirecting to login page...</p>
          </div>
          <style>
            @keyframes bounce {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          </style>
        `,
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'rgba(0, 0, 0, 0.4)',
        willClose: () => {
          navigate('/login');
        }
      });
      
    } catch (err) {
      Swal.close();
      
      // Show error animation
      Swal.fire({
        title: '<div style="color: #ef4444; font-weight: bold; font-size: 32px;">❌ Registration Failed</div>',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 96px; height: 96px; background: linear-gradient(135deg, #ef4444, #f472b6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; animation: shake 0.5s;">
              <span style="color: white; font-size: 48px;">✗</span>
            </div>
            <p style="font-size: 18px; color: #374151; margin-bottom: 8px;">${err.response?.data?.message || 'Registration failed'}</p>
            <p style="color: #6b7280;">Please try again</p>
          </div>
          <style>
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-5px); }
              75% { transform: translateX(5px); }
            }
          </style>
        `,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#7c3aed',
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'rgba(0, 0, 0, 0.4)',
        customClass: {
          confirmButton: 'py-3 px-6 rounded-lg font-bold'
        }
      });
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          ></div>
        ))}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1500"></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Floating Card with Glass Effect */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Animated Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-12 px-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-slide"></div>
            
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl animate-bounce-subtle">
                <span className="text-4xl">✨</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3 animate-slide-up">
              Join Our Community
            </h1>
            <p className="text-blue-100/90 text-lg">
              Create your account and start shopping
            </p>
            
            {/* Floating particles in header */}
            <div className="absolute top-6 right-6 w-4 h-4 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
            <div className="absolute bottom-6 left-6 w-3 h-3 bg-cyan-300 rounded-full animate-ping opacity-60 animation-delay-700"></div>
          </div>

          {/* Form Section */}
          <div className="p-8 md:p-10">
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl animate-shake">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white">!</span>
                  </div>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-2"></span>
                    Username
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 group-hover:text-blue-500 transition-colors">👤</span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 outline-none"
                    placeholder="Choose a username"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></span>
                    Email Address
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 group-hover:text-purple-500 transition-colors">📧</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-gray-300 outline-none"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-2"></span>
                    Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 group-hover:text-green-500 transition-colors">🔒</span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 hover:border-gray-300 outline-none"
                    placeholder="At least 6 characters"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? '🙈' : '👁️'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mr-2"></span>
                    Confirm Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 group-hover:text-orange-500 transition-colors">🔐</span>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:border-gray-300 outline-none"
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="h-5 w-5 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <label htmlFor="terms" className="ml-3 text-sm cursor-pointer">
                  <span className="text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading || !isFormFilled}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group ${loading || !isFormFilled
                  ? 'opacity-70 cursor-not-allowed bg-gradient-to-r from-gray-400 to-gray-500'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/30'
                  }`}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-3">🚀</span>
                    Create Account
                  </span>
                )}
              </button>
            </form>

            {/* Login Link Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-700 mb-4 font-medium">
                  Already have an account?
                </p>
                <Link 
                  to="/login" 
                  className="inline-block w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform group relative overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <span className="relative flex items-center justify-center">
                    <span className="mr-3">🔑</span>
                    Sign In Now
                    <span className="ml-3">→</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Terms & Privacy Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Terms</a>
                {' '}and{' '}
                <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Decoration */}
        <div className="mt-6 flex justify-center space-x-4">
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🌟</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>💫</span>
        </div>
      </div>
    </div>
  );
};

export default Register;