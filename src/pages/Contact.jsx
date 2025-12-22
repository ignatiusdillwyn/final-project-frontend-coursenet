import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [floatingShapes, setFloatingShapes] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize floating shapes
  useEffect(() => {
    const shapes = [];
    const shapeTypes = ['circle', 'triangle', 'square', 'hexagon'];
    const colors = ['from-purple-500', 'from-pink-500', 'from-blue-500', 'from-cyan-500', 'from-emerald-500'];
    
    for (let i = 0; i < 20; i++) {
      shapes.push({
        id: i,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 40 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: Math.random() * 0.5 + 0.1,
        delay: Math.random() * 5,
        rotation: Math.random() * 360
      });
    }
    setFloatingShapes(shapes);
    setIsLoaded(true);
  }, []);

  // Mouse position tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate floating shapes
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingShapes(prev => prev.map(shape => ({
        ...shape,
        y: shape.y > 100 ? 0 : shape.y + shape.speed,
        x: shape.x + Math.sin(Date.now() * 0.001 + shape.delay) * 0.3,
        rotation: shape.rotation + 0.5
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Show success notification
    createSuccessNotification();
  };

  const createSuccessNotification = () => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl transform translate-x-full animate-slide-in';
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="text-2xl mr-3">🎉</div>
        <div>
          <div class="font-bold">Message Sent!</div>
          <div class="text-sm opacity-90">We'll get back to you soon.</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('animate-slide-in');
      notification.classList.add('animate-slide-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden relative mt-10">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes blink {
          0%, 100% { border-color: transparent; }
          50% { border-color: #8b5cf6; }
        }
        
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes slide-out {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        
        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
        
        .animate-typing {
          overflow: hidden;
          border-right: 3px solid;
          white-space: nowrap;
          animation: typing 3.5s steps(40, end), blink 0.75s step-end infinite;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        
        .animate-slide-out {
          animation: slide-out 0.3s ease-in forwards;
        }
        
        .shape-circle {
          clip-path: circle(50% at 50% 50%);
        }
        
        .shape-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        
        .shape-square {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
        
        .shape-hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>

      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 animate-gradient-shift"></div>

      {/* Mouse Trailing Effect */}
      <div 
        className="fixed w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-300 ease-out"
        style={{
          left: `calc(50% + ${mousePosition.x}px)`,
          top: `calc(50% + ${mousePosition.y}px)`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Floating Shapes */}
      {floatingShapes.map(shape => (
        <div
          key={shape.id}
          className={`fixed ${shape.color} to-transparent opacity-5 pointer-events-none z-0 ${`shape-${shape.type}`}`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
            animation: `float ${4 + shape.delay}s ease-in-out infinite`,
            animationDelay: `${shape.delay}s`
          }}
        />
      ))}

      {/* Animated Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gradient-shift 20s ease infinite'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-3 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                <span className="text-6xl">📱</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-typing inline-block">
                Get in Touch
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Let's create something amazing together. Send us a message and we'll get back to you faster than you can say "hello"!
            </p>

            {/* Animated Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {[
                { value: '24/7', label: 'Support', icon: '🕒', delay: 'delay-100' },
                { value: '2h', label: 'Response Time', icon: '⚡', delay: 'delay-200' },
                { value: '99%', label: 'Satisfaction', icon: '⭐', delay: 'delay-300' },
                { value: '∞', label: 'Possibilities', icon: '✨', delay: 'delay-400' }
              ].map((stat, index) => (
                <div key={index} className={`group relative transition-all duration-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} ${stat.delay}`}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 group-hover:border-cyan-500/50 transition-all duration-300">
                    <div className="text-4xl mb-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 transform transition-transform duration-300 group-hover:translate-y-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`relative group transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 group-hover:border-purple-500/30 transition-all duration-500">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <span className="mr-3 animate-bounce">✉️</span>
                  Send us a Message
                  <div className="ml-3 flex">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-1 h-1 mx-1 bg-purple-400 rounded-full animate-pulse ${i === 0 ? 'delay-0' : i === 1 ? 'delay-200' : 'delay-400'}`}></div>
                    ))}
                  </div>
                </h2>
                <p className="text-gray-400 mb-8">Fill out the form below and we'll get back to you ASAP!</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <span className="flex items-center">
                            <span className="mr-2">👤</span>
                            Your Name
                          </span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setActiveField('name')}
                          onBlur={() => setActiveField(null)}
                          className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="John Doe"
                          required
                        />
                        {activeField === 'name' && (
                          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <span className="flex items-center">
                            <span className="mr-2">📧</span>
                            Email Address
                          </span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setActiveField('email')}
                          onBlur={() => setActiveField(null)}
                          className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="john@example.com"
                          required
                        />
                        {activeField === 'email' && (
                          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="flex items-center">
                          <span className="mr-2">🎯</span>
                          Subject
                        </span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setActiveField('subject')}
                        onBlur={() => setActiveField(null)}
                        className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="How can we help you?"
                        required
                      />
                      {activeField === 'subject' && (
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="flex items-center">
                          <span className="mr-2">💬</span>
                          Your Message
                        </span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setActiveField('message')}
                        onBlur={() => setActiveField(null)}
                        rows="6"
                        className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                        placeholder="Tell us about your project, ideas, or questions..."
                        required
                      />
                      {activeField === 'message' && (
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-gray-500">
                          {formData.message.length}/500 characters
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs text-gray-500">Message Power:</div>
                          <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-300"
                              style={{width: `${Math.min(formData.message.length / 5, 100)}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`relative overflow-hidden w-full py-5 px-8 rounded-xl font-bold text-lg transition-all duration-500 transform hover:scale-105 disabled:cursor-not-allowed ${
                      isSubmitting
                        ? 'bg-purple-800'
                        : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700'
                    }`}
                  >
                    <div className="absolute inset-0 animate-shimmer"></div>
                    <div className="relative flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <span className="mr-3 text-2xl animate-pulse">🚀</span>
                          Send Message
                          <div className="absolute -right-2 -top-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                          <div className="absolute -left-2 -bottom-2 w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-75 delay-200"></div>
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info & Animation */}
            <div className={`space-y-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              {/* Animated Contact Card */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 group-hover:border-cyan-500/30 transition-all duration-500">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <span className="mr-3 animate-spin-slow">📍</span>
                    Contact Information
                    <div className="ml-3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  </h2>

                  <div className="space-y-6">
                    {[
                      {
                        icon: '🏢',
                        title: 'Office Address',
                        content: '123 Innovation Street\nTech District, Digital City 10101',
                        color: 'from-blue-500 to-cyan-500',
                        delay: 'delay-0'
                      },
                      {
                        icon: '📞',
                        title: 'Phone Number',
                        content: '+1 (555) 123-4567\nMon-Fri, 9:00 AM - 6:00 PM',
                        color: 'from-emerald-500 to-green-500',
                        delay: 'delay-100'
                      },
                      {
                        icon: '✉️',
                        title: 'Email Address',
                        content: 'hello@tokopakedi.com\nsupport@tokopakedi.com',
                        color: 'from-purple-500 to-pink-500',
                        delay: 'delay-200'
                      },
                      {
                        icon: '🕒',
                        title: 'Working Hours',
                        content: '24/7 Support Available\nEmergency contact: Always',
                        color: 'from-orange-500 to-red-500',
                        delay: 'delay-300'
                      }
                    ].map((info, index) => (
                      <div
                        key={index}
                        className={`group/item relative transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${info.delay}`}
                      >
                        <div className={`absolute -inset-2 bg-gradient-to-r ${info.color} rounded-2xl blur opacity-0 group-hover/item:opacity-20 transition duration-500`}></div>
                        <div className="relative flex items-start p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 group-hover/item:border-transparent transition-all duration-300 transform group-hover/item:scale-105">
                          <div className={`mr-4 p-3 bg-gradient-to-br ${info.color} rounded-xl text-2xl transition-transform duration-300 group-hover/item:rotate-12`}>
                            {info.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">{info.title}</h3>
                            <p className="text-gray-400 whitespace-pre-line">{info.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Media Links with Animation */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 group-hover:border-yellow-500/30 transition-all duration-500">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="mr-3 animate-bounce">🌐</span>
                    Connect With Us
                    <div className="ml-3 flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 bg-yellow-400 rounded-full animate-bounce ${i === 0 ? 'delay-0' : i === 1 ? 'delay-100' : 'delay-200'}`}></div>
                      ))}
                    </div>
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: '📘', label: 'Facebook', color: 'from-blue-600 to-blue-700', delay: 'delay-0' },
                      { icon: '📷', label: 'Instagram', color: 'from-pink-600 to-rose-600', delay: 'delay-75' },
                      { icon: '💼', label: 'LinkedIn', color: 'from-cyan-600 to-blue-600', delay: 'delay-150' },
                      { icon: '🐦', label: 'Twitter', color: 'from-sky-600 to-cyan-600', delay: 'delay-225' },
                      { icon: '🎵', label: 'TikTok', color: 'from-gray-800 to-gray-900', delay: 'delay-300' },
                      { icon: '📹', label: 'YouTube', color: 'from-red-600 to-rose-600', delay: 'delay-375' },
                      { icon: '💬', label: 'Discord', color: 'from-indigo-600 to-purple-600', delay: 'delay-450' },
                      { icon: '💎', label: 'Dribbble', color: 'from-pink-600 to-purple-600', delay: 'delay-525' }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href="#"
                        className={`group/social relative block p-4 rounded-xl bg-gradient-to-br ${social.color} text-white text-center transition-all duration-300 hover:shadow-2xl hover:shadow-current/30 transform hover:scale-105 active:scale-95 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} ${social.delay}`}
                      >
                        <div className="text-2xl mb-2 transform transition-transform duration-300 group-hover/social:scale-125 group-hover/social:rotate-12">
                          {social.icon}
                        </div>
                        <div className="text-sm font-medium">{social.label}</div>
                        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover/social:border-white/50 transition-colors duration-300"></div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat Animation */}
          <div className={`mt-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 group-hover:border-green-500/30 transition-all duration-500">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-3 flex items-center">
                      <span className="mr-3 animate-pulse">💬</span>
                      Live Chat Available
                      <div className="ml-3 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    </h2>
                    <p className="text-gray-400 mb-4">Chat with our support team in real-time. No waiting, instant answers!</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <div className="ml-3">
                          <div className="text-white font-medium">Online Now</div>
                          <div className="text-sm text-gray-400">Average wait: 30 seconds</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="relative w-64 h-64">
                      {/* Chat Animation */}
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg animate-pulse"
                          style={{
                            width: `${40 + i * 10}px`,
                            height: '20px',
                            left: `${i * 15}px`,
                            top: `${i * 30}px`,
                            animationDelay: `${i * 0.2}s`
                          }}
                        />
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl animate-bounce">💬</div>
                      </div>
                    </div>
                  </div>
                  <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center animate-pulse">
                    <span className="mr-3">🚀</span>
                    Start Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Footer */}
        <div className="mt-20 border-t border-gray-800/50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl animate-spin">✨</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    TokoPakEdi
                  </div>
                  <div className="text-2xl animate-pulse">⚡</div>
                </div>
                <p className="text-gray-500 mt-2">Creating digital experiences that matter</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-gray-500">© {new Date().getFullYear()} All rights reserved</div>
                <div className="flex space-x-3">
                  {['💖', '🚀', '🌟', '🎯'].map((icon, i) => (
                    <div
                      key={i}
                      className={`text-xl ${isLoaded ? 'animate-bounce' : ''}`}
                      style={{animationDelay: `${i * 0.2}s`}}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;