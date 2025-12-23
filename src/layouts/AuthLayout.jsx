import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [logoColor, setLogoColor] = useState('yellow'); // State untuk warna logo

  // Floating particles effect
  useEffect(() => {
    const initialParticles = [];
    const colors = [
      'from-blue-400 to-cyan-400',
      'from-purple-400 to-pink-400',
      'from-indigo-400 to-blue-400',
      'from-emerald-400 to-green-400',
      'from-amber-400 to-orange-400'
    ];

    for (let i = 0; i < 25; i++) {
      initialParticles.push({
        id: i,
        size: Math.random() * 60 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: Math.random() * 0.5 + 0.1,
        delay: Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360
      });
    }
    setParticles(initialParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > 100 ? -20 : particle.y + particle.speed,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.delay) * 0.2,
        rotation: particle.rotation + 0.3
      })));
    }, 50);

    // Rotate logo color
    const colorInterval = setInterval(() => {
      setLogoColor(prev => {
        const colors = ['yellow', 'cyan', 'pink', 'green', 'orange'];
        const currentIndex = colors.indexOf(prev);
        return colors[(currentIndex + 1) % colors.length];
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(colorInterval);
    };
  }, []);

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Get color class based on state
  const getLogoColorClass = () => {
    switch (logoColor) {
      case 'yellow': return 'text-yellow-300 hover:text-yellow-200';
      case 'cyan': return 'text-cyan-300 hover:text-cyan-200';
      case 'pink': return 'text-pink-300 hover:text-pink-200';
      case 'green': return 'text-green-300 hover:text-green-200';
      case 'orange': return 'text-orange-300 hover:text-orange-200';
      default: return 'text-yellow-300 hover:text-yellow-200';
    }
  };

  // Get gradient class based on state
  const getLogoGradientClass = () => {
    switch (logoColor) {
      case 'yellow': return 'from-yellow-400 to-orange-400';
      case 'cyan': return 'from-cyan-400 to-blue-400';
      case 'pink': return 'from-pink-400 to-purple-400';
      case 'green': return 'from-green-400 to-emerald-400';
      case 'orange': return 'from-orange-400 to-red-400';
      default: return 'from-yellow-400 to-orange-400';
    }
  };

  // Get glow color class
  const getLogoGlowClass = () => {
    switch (logoColor) {
      case 'yellow': return 'from-yellow-600 to-orange-600';
      case 'cyan': return 'from-cyan-600 to-blue-600';
      case 'pink': return 'from-pink-600 to-purple-600';
      case 'green': return 'from-green-600 to-emerald-600';
      case 'orange': return 'from-orange-600 to-red-600';
      default: return 'from-yellow-600 to-orange-600';
    }
  };

  // Page title based on route
  const getPageTitle = () => {
    if (isLoginPage) return 'Welcome Back';
    if (isRegisterPage) return 'Join Our Community';
    return 'Authentication';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden relative">
      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes color-cycle {
          0%, 100% { filter: hue-rotate(0deg); }
          25% { filter: hue-rotate(90deg); }
          50% { filter: hue-rotate(180deg); }
          75% { filter: hue-rotate(270deg); }
        }
        
        @keyframes neon-glow {
          0%, 100% { 
            text-shadow: 
              0 0 5px #fff,
              0 0 10px currentColor,
              0 0 15px currentColor,
              0 0 20px currentColor;
          }
          50% { 
            text-shadow: 
              0 0 10px #fff,
              0 0 20px currentColor,
              0 0 30px currentColor,
              0 0 40px currentColor;
          }
        }
        
        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }
        
        .animate-color-cycle {
          animation: color-cycle 12s linear infinite;
        }
        
        .animate-neon-glow {
          animation: neon-glow 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .shape-circle {
          clip-path: circle(50% at 50% 50%);
        }
        
        .text-shadow-glow {
          text-shadow: 0 0 10px rgba(255,255,255,0.5),
                       0 0 20px rgba(255,255,255,0.3),
                       0 0 30px rgba(255,255,255,0.2);
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 animate-gradient-shift"></div>
        
        {/* Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`fixed ${particle.color} to-transparent opacity-5 pointer-events-none shape-circle`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
              animation: `float ${6 + particle.delay}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}

        {/* Mouse Trailing Effect */}
        <div 
          className="fixed w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: `calc(50% + ${mousePosition.x}px)`,
            top: `calc(50% + ${mousePosition.y}px)`,
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, transparent 95%, rgba(147, 51, 234, 0.3) 100%),
                             linear-gradient(0deg, transparent 95%, rgba(236, 72, 153, 0.3) 100%)`,
            backgroundSize: '60px 60px',
          }}></div>
        </div>
      </div>

      {/* Animated Navbar */}
      <nav className="relative z-50 bg-gradient-to-b from-gray-900/80 to-transparent backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Animated Logo - TOKOPAKEDI DENGAN WARNA CERAH */}
            <Link 
              to="/" 
              className="group flex items-center space-x-3 relative"
              onMouseEnter={() => setHoveredLogo(true)}
              onMouseLeave={() => setHoveredLogo(false)}
            >
              {/* Logo Glow Effect */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${getLogoGlowClass()} rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
              
              {/* Main Logo Container */}
              <div className="relative">
                {/* Outer Ring */}
                <div className={`absolute -inset-2 border-2 border-transparent rounded-full transition-all duration-500 ${
                  hoveredLogo ? 'border-current animate-pulse' : ''
                } ${getLogoColorClass()}`}></div>
                
                {/* Middle Ring */}
                <div className={`absolute -inset-1 border border-transparent rounded-full transition-all duration-700 ${
                  hoveredLogo ? 'border-current animate-spin-slow' : ''
                } ${getLogoColorClass()}`}></div>
                
                {/* Logo Icon */}
                <div className={`relative bg-gradient-to-br ${getLogoGradientClass()} p-3 rounded-2xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  <svg 
                    className="w-8 h-8 text-white group-hover:scale-125 transition-transform duration-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                  </svg>
                </div>
                
                {/* Floating Stars */}
                {hoveredLogo && (
                  <>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-current rounded-full animate-ping"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-current rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                  </>
                )}
              </div>

              {/* Brand Name with Animation - WARNA CERAH DAN KELIHATAN */}
              <div className="relative overflow-hidden">
                <h1 className="text-3xl font-bold tracking-tight relative">
                  {/* Background shadow for better visibility */}
                  <span className="absolute -inset-1 bg-black/30 blur rounded-lg"></span>
                  
                  {/* Main text with multiple effects */}
                  <span className="relative flex items-center">
                    <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      TokoPak
                    </span>
                    <span className={`ml-1 animate-neon-glow transition-colors duration-1000 ${getLogoColorClass()} font-extrabold text-shadow-glow`}>
                      Edi
                    </span>
                    <span className="ml-2 text-lg animate-bounce" style={{animationDelay: "0.1s"}}>✨</span>
                    <span className="ml-1 text-lg animate-bounce" style={{animationDelay: "0.3s"}}>🌟</span>
                  </span>
                  
                  {/* Animated underline */}
                  <span className={`absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r ${getLogoGradientClass()} transition-all duration-700 rounded-full`}></span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-sm text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Secure Authentication Portal
                </p>
              </div>

              {/* Animated Dots */}
              <div className="flex space-x-1 ml-2">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${getLogoGradientClass()} transition-all duration-300 ${
                      hoveredLogo ? 'animate-bounce' : ''
                    }`}
                    style={{animationDelay: `${i * 0.1}s`}}
                  ></div>
                ))}
              </div>
            </Link>

            {/* Navigation Indicator */}
            <div className="hidden md:flex items-center space-x-6">
              <div className={`px-4 py-2 rounded-full transition-all duration-300 ${
                isLoginPage 
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30' 
                  : 'hover:bg-white/5'
              }`}>
                <span className={`text-sm font-medium ${
                  isLoginPage ? 'text-blue-300' : 'text-gray-400'
                }`}>
                  {getPageTitle()}
                </span>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-400">Secure</span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Animated Underline */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${getLogoGradientClass()} to-transparent animate-pulse`}></div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10">
        {/* Hero Section for Auth Pages */}
        <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Animated Welcome Message */}
            <div className="text-center mb-12">
              <div className="inline-block relative group mb-6">
                <div className={`absolute -inset-4 bg-gradient-to-r ${getLogoGlowClass()} rounded-full blur-2xl group-hover:blur-3xl transition-all duration-1000 opacity-30`}></div>
                <div className="relative">
                  <h2 className="text-5xl md:text-7xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                      {getPageTitle()}
                    </span>
                    <span className="ml-3 text-4xl animate-bounce">✨</span>
                  </h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    {isLoginPage 
                      ? 'Sign in to access your personalized dashboard and continue your journey with us.'
                      : 'Create your account and unlock exclusive features, personalized content, and seamless experience.'}
                  </p>
                </div>
              </div>

              {/* Animated Stats */}
              <div className="flex flex-wrap justify-center gap-6 mt-12">
                {[
                  { number: '10K+', label: 'Active Users', icon: '👥', color: 'from-blue-500 to-cyan-500' },
                  { number: '99.9%', label: 'Uptime', icon: '⚡', color: 'from-green-500 to-emerald-500' },
                  { number: '256-bit', label: 'Encryption', icon: '🔒', color: 'from-purple-500 to-pink-500' },
                  { number: '24/7', label: 'Support', icon: '🛡️', color: 'from-orange-500 to-amber-500' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="relative group"
                  >
                    <div className={`absolute -inset-2 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500`}></div>
                    <div className="relative bg-gray-900/50 backdrop-blur-lg rounded-xl p-4 border border-gray-800/50 group-hover:border-transparent transition-all duration-300">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg transform transition-transform duration-300 group-hover:rotate-12`}>
                          <span className="text-xl">{stat.icon}</span>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{stat.number}</div>
                          <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Area for Auth Forms */}
            <div className="relative">
              {/* Animated Border Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-0 hover:opacity-100 transition duration-1000"></div>
              
              {/* Main Content Card */}
              <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-800/50 overflow-hidden">
                {/* Animated Header Bar */}
                <div className="bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50 border-b border-gray-800/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      <span className="text-gray-400 ml-2 text-sm">auth.tokopakedi.com</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <span className="animate-pulse">🔐</span> Secure Connection
                    </div>
                  </div>
                </div>

                {/* Page Content */}
                <div className="p-6">
                  <Outlet />
                </div>

                {/* Animated Footer */}
                <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-t border-gray-800/50 p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className={`text-sm font-medium ${getLogoColorClass()} flex items-center`}>
                      <span className="mr-2 animate-pulse">⚡</span> 
                      Powered by 
                      <span className="ml-1 font-bold animate-neon-glow">TokoPak</span>
                      <span className={`ml-1 font-bold ${getLogoColorClass()} animate-neon-glow`}>Edi</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-xs text-gray-500">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                        SSL Secured
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse" style={{animationDelay: '0.3s'}}></span>
                        GDPR Compliant
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-1 animate-pulse" style={{animationDelay: '0.6s'}}></span>
                        Privacy First
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Switcher Animation */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-4 bg-gray-900/50 backdrop-blur-lg rounded-full px-4 py-2 border border-gray-800/50">
                <span className="text-gray-400 text-sm">
                  {isLoginPage ? "Don't have an account?" : "Already have an account?"}
                </span>
                <Link
                  to={isLoginPage ? "/register" : "/login"}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  {isLoginPage ? "Sign Up →" : "Sign In →"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Call to Action */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          to="/"
          className="group relative"
        >
          <div className={`absolute -inset-2 bg-gradient-to-r ${getLogoGradientClass()} rounded-full blur opacity-0 group-hover:opacity-50 transition duration-500`}></div>
          <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-full p-4 border border-gray-700/50 group-hover:border-current transition-all duration-300">
            <div className="flex items-center space-x-2">
              <span className="text-xl group-hover:rotate-12 transition-transform duration-300">🏠</span>
              <span className={`text-sm font-medium ${getLogoColorClass()}`}>Go Home</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Floating Elements Animation */}
      <div className="fixed bottom-4 left-4 z-40 opacity-50">
        <div className="flex space-x-2">
          {['✨', '🌟', '💫', '⭐'].map((emoji, i) => (
            <div
              key={i}
              className="text-2xl animate-float"
              style={{animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i}s`}}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Debug: Show current color state */}
      <div className="fixed top-4 right-4 z-50 opacity-50 text-xs text-white bg-black/50 px-2 py-1 rounded">
        Color: {logoColor}
      </div>
    </div>
  );
};

export default AuthLayout;