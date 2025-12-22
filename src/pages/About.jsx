import React, { useState, useEffect } from 'react';

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    // Auto scroll animation for timeline
    const interval = setInterval(() => {
      setActiveSection(prev => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"
            style={{
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 3}s`,
            }}
          />
        ))}
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 95%, rgba(147, 51, 234, 0.3) 100%),
              linear-gradient(transparent 95%, rgba(236, 72, 153, 0.3) 100%)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Animated Title */}
          <div className={`text-center mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block relative group mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-6xl">🌟</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Our Story
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              We're not just building products, we're crafting experiences that inspire and transform.
            </p>
            
            {/* Animated Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { number: '2018', label: 'Founded', icon: '🏢', color: 'from-blue-500 to-cyan-500' },
                { number: '50+', label: 'Team Members', icon: '👥', color: 'from-emerald-500 to-green-500' },
                { number: '500+', label: 'Projects', icon: '🚀', color: 'from-purple-500 to-pink-500' },
                { number: '99%', label: 'Satisfaction', icon: '⭐', color: 'from-yellow-500 to-orange-500' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className={`relative group transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute -inset-2 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
                  <div className="relative bg-gray-900/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 group-hover:border-transparent transition-all duration-300">
                    <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className={`relative group transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 group-hover:border-cyan-500/30 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl mr-4 animate-pulse">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-gray-300 mb-6 text-lg">
                  To revolutionize digital experiences by creating intuitive, beautiful, and impactful solutions that empower businesses and delight users worldwide.
                </p>
                <div className="space-y-4">
                  {[
                    { text: 'Innovate with purpose', icon: '💡' },
                    { text: 'Deliver exceptional value', icon: '⚡' },
                    { text: 'Foster meaningful connections', icon: '🤝' },
                    { text: 'Drive positive change', icon: '🌱' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center group/item">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-3 transform transition-transform duration-300 group-hover/item:rotate-12">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <span className="text-gray-300 group-hover/item:text-cyan-300 transition-colors duration-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className={`relative group transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{transitionDelay: '300ms'}}>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 group-hover:border-purple-500/30 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mr-4 animate-spin-slow">
                    <span className="text-2xl">🔮</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Our Vision</h2>
                </div>
                <p className="text-gray-300 mb-6 text-lg">
                  To be the global catalyst for digital transformation, inspiring innovation and creating a future where technology enhances every aspect of human life.
                </p>
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-bounce">✨</div>
                  </div>
                  {/* Animated elements */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float"
                      style={{
                        left: `${20 + i * 10}%`,
                        top: `${30 + Math.sin(i) * 30}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Our Journey
            </span>
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-600 via-pink-600 to-blue-600"></div>
            
            <div className="space-y-12">
              {[
                {
                  year: '2018',
                  title: 'The Beginning',
                  description: 'Started as a small team with big dreams in a garage',
                  icon: '🚀',
                  color: 'from-blue-500 to-cyan-500',
                  side: 'left'
                },
                {
                  year: '2019',
                  title: 'First Breakthrough',
                  description: 'Launched our flagship product that changed the game',
                  icon: '💎',
                  color: 'from-emerald-500 to-green-500',
                  side: 'right'
                },
                {
                  year: '2020',
                  title: 'Global Expansion',
                  description: 'Went international with offices in 3 continents',
                  icon: '🌍',
                  color: 'from-purple-500 to-pink-500',
                  side: 'left'
                },
                {
                  year: '2023',
                  title: 'Industry Leader',
                  description: 'Recognized as top innovator in digital solutions',
                  icon: '👑',
                  color: 'from-yellow-500 to-orange-500',
                  side: 'right'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center justify-between ${item.side === 'left' ? 'flex-row' : 'flex-row-reverse'} ${activeSection === index ? 'opacity-100 scale-100' : 'opacity-50 scale-95'} transition-all duration-500`}
                >
                  {/* Content */}
                  <div className={`w-5/12 ${item.side === 'left' ? 'text-right pr-12' : 'text-left pl-12'}`}>
                    <div className="relative group">
                      <div className={`absolute -inset-4 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
                      <div className="relative bg-gray-900/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 group-hover:border-transparent transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`text-2xl p-2 bg-gradient-to-br ${item.color} rounded-lg transform transition-transform duration-300 group-hover:rotate-12`}>
                            {item.icon}
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            {item.year}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline point */}
                  <div className="relative z-10">
                    <div className={`w-6 h-6 bg-gradient-to-r ${item.color} rounded-full transform transition-all duration-300 ${activeSection === index ? 'scale-150' : 'scale-100'}`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full animate-ping ${activeSection === index ? 'opacity-30' : 'opacity-0'}`}></div>
                  </div>
                  
                  {/* Empty space for alignment */}
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Meet Our Dream Team
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Alex Chen', role: 'CEO & Founder', expertise: 'Vision & Strategy', emoji: '👨‍💼', color: 'from-blue-500 to-cyan-500' },
              { name: 'Maya Rodriguez', role: 'CTO', expertise: 'Tech Innovation', emoji: '👩‍💻', color: 'from-purple-500 to-pink-500' },
              { name: 'David Kim', role: 'Lead Designer', expertise: 'UX/UI Wizardry', emoji: '🎨', color: 'from-emerald-500 to-green-500' },
              { name: 'Sarah Johnson', role: 'Growth Lead', expertise: 'Business Development', emoji: '📈', color: 'from-yellow-500 to-orange-500' }
            ].map((member, index) => (
              <div
                key={index}
                className={`relative group transform transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`absolute -inset-4 bg-gradient-to-r ${member.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition duration-1000`}></div>
                <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 group-hover:border-transparent transition-all duration-500 overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute w-32 h-32 bg-current rounded-full -top-16 -right-16"></div>
                    <div className="absolute w-24 h-24 bg-current rounded-full -bottom-12 -left-12"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <span className="text-4xl">{member.emoji}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white text-center mb-2">{member.name}</h3>
                    <p className="text-lg text-gray-300 text-center mb-3">{member.role}</p>
                    <div className="text-center mb-6">
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full text-sm text-gray-400">
                        {member.expertise}
                      </span>
                    </div>
                    
                    {/* Social/Contact Animation */}
                    <div className="flex justify-center space-x-4">
                      {['💼', '📧', '💬', '🐦'].map((icon, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-125 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 cursor-pointer"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        >
                          <span className="text-lg">{icon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-current rounded-full animate-float"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${80 + Math.sin(i) * 20}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${2 + i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Our Core Values
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Innovation First',
                description: 'We constantly push boundaries and challenge the status quo to create breakthrough solutions.',
                icon: '🚀',
                color: 'from-cyan-500 to-blue-500',
                features: ['Think Different', 'Embrace Change', 'Fail Forward']
              },
              {
                title: 'Customer Obsession',
                description: 'Our customers are at the heart of everything we do. We listen, understand, and deliver beyond expectations.',
                icon: '💖',
                color: 'from-pink-500 to-rose-500',
                features: ['Empathy Driven', 'Value Creation', 'Long-term Partnership']
              },
              {
                title: 'Excellence Always',
                description: 'We believe in doing ordinary things extraordinarily well. Quality is never an accident.',
                icon: '⭐',
                color: 'from-yellow-500 to-orange-500',
                features: ['Attention to Detail', 'Continuous Improvement', 'Pride in Work']
              }
            ].map((value, index) => (
              <div
                key={index}
                className={`relative group transform transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`absolute -inset-4 bg-gradient-to-r ${value.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition duration-1000`}></div>
                <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 group-hover:border-transparent transition-all duration-500 h-full">
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                    <span className="text-3xl">{value.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white text-center mb-4">{value.title}</h3>
                  <p className="text-gray-300 text-center mb-6">{value.description}</p>
                  
                  <div className="space-y-3">
                    {value.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center transform transition-all duration-300 group-hover/item:translate-x-2"
                      >
                        <div className={`w-2 h-2 bg-gradient-to-r ${value.color} rounded-full mr-3`}></div>
                        <span className="text-gray-400 group-hover/item:text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Animated line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`relative group text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-12 border border-gray-700/50 group-hover:border-purple-500/30 transition-all duration-500">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Create <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Magic</span> Together?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join us on our journey to transform ideas into extraordinary digital experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center group/btn">
                  <span className="mr-3 group-hover/btn:rotate-12 transition-transform duration-300">✨</span>
                  Join Our Team
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover/btn:border-white/30 transition-colors duration-300"></div>
                </button>
                
                <button className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center border border-gray-700/50 group/btn2">
                  <span className="mr-3 animate-pulse">📧</span>
                  Contact Us
                </button>
              </div>
              
              {/* Animated sparkles */}
              <div className="absolute top-4 right-4 text-2xl animate-spin">✨</div>
              <div className="absolute bottom-4 left-4 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>⭐</div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default About;