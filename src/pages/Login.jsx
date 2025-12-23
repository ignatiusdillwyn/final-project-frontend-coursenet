import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/userAPI';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const navigate = useNavigate();

  // Check if form is filled
  useEffect(() => {
    setIsFormFilled(username.trim() !== '' && password.trim() !== '');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Show loading animation
    Swal.fire({
      title: '<div style="color: #7c3aed; font-weight: bold; font-size: 24px;">Logging in...</div>',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="position: relative; margin: 20px 0;">
            <div style="width: 80px; height: 80px; border: 4px solid #e9d5ff; border-radius: 50%;"></div>
            <div style="position: absolute; top: 0; left: 0; width: 80px; height: 80px; border: 4px solid #7c3aed; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>
          <p style="margin-top: 16px; color: #6b7280;">Please wait while we authenticate...</p>
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
      const payload = {
        email: username,
        password: password
      };
      const response = await login(payload);

      // Close loading
      Swal.close();

      // Show success animation
      Swal.fire({
        title: '<div style="color: #10b981; font-weight: bold; font-size: 32px;">🎉 Welcome Back!</div>',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 96px; height: 96px; background: linear-gradient(135deg, #10b981, #34d399); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="color: white; font-size: 48px;">✓</span>
            </div>
            <p style="font-size: 18px; color: #374151; margin-bottom: 8px;">Login successful!</p>
            <p style="color: #6b7280;">Redirecting to dashboard...</p>
          </div>
        `,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'rgba(0, 0, 0, 0.4)',
        willClose: () => {
          const token = response.user.token;
          localStorage.setItem('token', token);
          navigate('/home');
        }
      });

    } catch (err) {
      Swal.close();
      
      // Show error animation
      Swal.fire({
        title: '<div style="color: #ef4444; font-weight: bold; font-size: 32px;">❌ Login Failed</div>',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 96px; height: 96px; background: linear-gradient(135deg, #ef4444, #f472b6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; animation: pulse 1s infinite;">
              <span style="color: white; font-size: 48px;">✗</span>
            </div>
            <p style="font-size: 18px; color: #374151; margin-bottom: 8px;">${err.response?.data?.message || 'Invalid credentials'}</p>
            <p style="color: #6b7280;">Please try again</p>
          </div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
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
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Floating Card with Glass Effect */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Animated Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-10 px-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-slide"></div>
            
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-2xl animate-bounce-subtle">
                <span className="text-3xl">🔐</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
              Welcome Back
            </h1>
            <p className="text-indigo-100/90 text-lg">
              Sign in to your account
            </p>
            
            {/* Floating particles in header */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-300 rounded-full animate-ping opacity-70 animation-delay-1000"></div>
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

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Username Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2"></span>
                    Username or Email
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">👤</span>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 outline-none"
                    placeholder="Enter your username or email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <div className="flex items-center justify-between mb-3 ml-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></span>
                      Password
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors flex items-center"
                  >
                    <span className="mr-1">{showPassword ? '🙈' : '👁️'}</span>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 group-hover:text-purple-500 transition-colors">🔒</span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-gray-300 outline-none"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setPassword('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600 transition-colors">✕</span>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                    />
                    <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                      <span className="opacity-0 group-has-[:checked]:opacity-100 text-indigo-600">✓</span>
                    </div>
                  </div>
                  <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <a href="#" className="text-sm font-medium text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || !isFormFilled}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group ${loading || !isFormFilled
                  ? 'opacity-70 cursor-not-allowed bg-gradient-to-r from-gray-400 to-gray-500'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/30'
                  }`}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-3">🚀</span>
                    Sign In
                  </span>
                )}
              </button>
            </form>

            {/* Sign Up Section - Simpler and Clear */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-700 mb-4 font-medium">
                  New to TokoPakEdi?
                </p>
                <Link 
                  to="/register" 
                  className="inline-block w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform group relative overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <span className="relative flex items-center justify-center">
                    <span className="mr-3">✨</span>
                    Create New Account
                    <span className="ml-3">→</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Terms & Privacy */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Decoration */}
        <div className="mt-6 flex justify-center space-x-4">
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>💫</span>
        </div>
      </div>
    </div>
  );
};

export default Login;