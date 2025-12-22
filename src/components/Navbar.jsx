import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const activeClass = "text-white font-semibold";
  const baseClass = "hover:text-blue-300 transition-all duration-300 hover:scale-105";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle link click for animation
  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 shadow-2xl py-3" 
        : "bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-lg py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LEFT - ANIMATED LOGO */}
          <div className="flex items-center flex-1">
            <Link 
              to="/" 
              className="group flex items-center space-x-2"
              onClick={() => handleLinkClick("/")}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-70 group-hover:opacity-100 group-hover:animate-pulse transition duration-300"></div>
                <div className="relative bg-white p-2 rounded-full">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
              <div className="relative">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  TokoPak<span className="text-yellow-300">Edi</span>
                </h1>
                <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-yellow-300 transition-all duration-500 rounded-full"></div>
              </div>
              {/* Floating emojis */}
              <span className="text-lg animate-bounce" style={{ animationDelay: "0.1s" }}>✨</span>
              <span className="text-lg animate-bounce" style={{ animationDelay: "0.3s" }}>🌟</span>
            </Link>
          </div>

          {/* CENTER - DESKTOP MENU (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20">
              <NavLink
                to="/home"
                className={({ isActive }) => 
                  `px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 relative group ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg" 
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  }`
                }
                onClick={() => handleLinkClick("/home")}
              >
                <span className="relative z-10">Home</span>
                {activeLink === "/home" && (
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-ping opacity-20"></span>
                )}
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) => 
                  `px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 relative group ${
                    isActive 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  }`
                }
                onClick={() => handleLinkClick("/products")}
              >
                <span className="relative z-10">Products</span>
                {activeLink === "/products" && (
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-20"></span>
                )}
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) => 
                  `px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 relative group ${
                    isActive 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" 
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  }`
                }
                onClick={() => handleLinkClick("/about")}
              >
                <span className="relative z-10">About</span>
                {activeLink === "/about" && (
                  <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-ping opacity-20"></span>
                )}
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) => 
                  `px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 relative group ${
                    isActive 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg" 
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  }`
                }
                onClick={() => handleLinkClick("/contact")}
              >
                <span className="relative z-10">Contact</span>
                {activeLink === "/contact" && (
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-ping opacity-20"></span>
                )}
              </NavLink>
            </div>
          </div>

          {/* RIGHT - USER MENU */}
          <div className="flex items-center justify-end flex-1 space-x-4">
            {/* User Profile with Animation */}
            <div className="hidden md:block">
              <div className="group relative">
                <button className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold animate-spin-slow">
                    <span className="transform -rotate-45">👤</span>
                  </div>
                  <span className="text-white font-medium">Welcome</span>
                  <svg className="w-4 h-4 text-white transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Animation */}
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-white/20">
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105">
                      👤 My Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105">
                      ⚙️ Settings
                    </Link>
                    <Link to="/logout" className="block px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105">
                      🚪 Logout
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative w-10 h-10 focus:outline-none group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}>
                <div className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 group-hover:bg-yellow-300"></div>
                <div className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 group-hover:bg-yellow-300"></div>
                <div className="w-6 h-0.5 bg-white transition-all duration-300 group-hover:bg-yellow-300"></div>
              </div>
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-6 h-0.5 bg-white rotate-45 absolute"></div>
                <div className="w-6 h-0.5 bg-white -rotate-45 absolute"></div>
              </div>
            </button>
          </div>
        </div>

        {/* MOBILE MENU (Sliding Animation) */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-white/20">
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/home"
                className={({ isActive }) => 
                  `px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
                onClick={() => handleLinkClick("/home")}
              >
                <span className="text-lg">🏠</span>
                <span className="font-medium">Home</span>
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) => 
                  `px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${
                    isActive 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  }`
                }
                onClick={() => handleLinkClick("/products")}
              >
                <span className="text-lg animate-pulse">📦</span>
                <span className="font-medium">Products</span>
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) => 
                  `px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${
                    isActive 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                  }`
                }
                onClick={() => handleLinkClick("/about")}
              >
                <span className="text-lg">ℹ️</span>
                <span className="font-medium">About</span>
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) => 
                  `px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${
                    isActive 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`
                }
                onClick={() => handleLinkClick("/contact")}
              >
                <span className="text-lg">📞</span>
                <span className="font-medium">Contact</span>
              </NavLink>

              <div className="pt-4 border-t border-gray-200 mt-2">
                <div className="flex items-center space-x-3 px-4 py-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold animate-spin-slow">
                    <span className="transform -rotate-45">👤</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Welcome User!</p>
                    <p className="text-sm text-gray-500">TokoPakEdi Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;