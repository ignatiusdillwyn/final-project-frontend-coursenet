import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../services/productAPI';
import Swal from 'sweetalert2';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    qty: '',
    price: '',
    image: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const navigate = useNavigate();

  // Page entrance animation
  useEffect(() => {
    setPageLoaded(true);
    
    // Create floating particles
    const elements = [];
    for (let i = 0; i < 15; i++) {
      elements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        color: ['#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4'][Math.floor(Math.random() * 4)]
      });
    }
    setFloatingElements(elements);

    // Animate particles
    const interval = setInterval(() => {
      setFloatingElements(prev => prev.map(el => ({
        ...el,
        y: el.y > 100 ? 0 : el.y + el.speed,
        x: el.x + Math.sin(el.y * 0.1) * 0.5
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

  const validateForm = () => {
    const { name, qty, price, description } = formData;
    
    if (!name.trim()) {
      showValidationError('Product name is required', 'name');
      return false;
    }

    if (!qty.trim() || parseInt(qty) <= 0) {
      showValidationError('Quantity must be greater than 0', 'qty');
      return false;
    }

    if (!price.trim() || parseFloat(price) <= 0) {
      showValidationError('Price must be greater than 0', 'price');
      return false;
    }

    if (!description.trim()) {
      showValidationError('Description is required', 'description');
      return false;
    }

    return true;
  };

  const showValidationError = (message, field) => {
    const fieldElement = document.getElementById(`${field}-field`);
    if (fieldElement) {
      fieldElement.classList.add('field-error');
      setTimeout(() => fieldElement.classList.remove('field-error'), 2000);
    }

    // Create error particle
    createErrorParticle(field);

    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: message,
      confirmButtonColor: '#4f46e5',
      background: '#1f2937',
      color: 'white',
      customClass: {
        popup: 'animate__animated animate__shakeX'
      }
    });
  };

  const createErrorParticle = (field) => {
    const fieldElement = document.getElementById(`${field}-field`);
    if (fieldElement) {
      const rect = fieldElement.getBoundingClientRect();
      for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'error-particle';
        particle.style.cssText = `
          position: fixed;
          width: 4px;
          height: 4px;
          background: #ef4444;
          border-radius: 50%;
          pointer-events: none;
          z-index: 100;
          left: ${rect.left + rect.width / 2}px;
          top: ${rect.top + rect.height / 2}px;
        `;
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const duration = 800;

        let startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          if (elapsed > duration) {
            particle.remove();
            return;
          }

          const progress = elapsed / duration;
          const x = Math.cos(angle) * velocity * elapsed / 10;
          const y = Math.sin(angle) * velocity * elapsed / 10;
          const opacity = 1 - progress;

          particle.style.transform = `translate(${x}px, ${y}px)`;
          particle.style.opacity = opacity.toString();
          requestAnimationFrame(animate);
        };

        animate();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add submit animation
    const form = e.target;
    form.classList.add('form-submitting');
    setTimeout(() => form.classList.remove('form-submitting'), 1000);

    if (!validateForm()) {
      return;
    }

    // Show animated confirmation
    const result = await Swal.fire({
      title: '<div class="confirmation-animation">✨</div>',
      html: `
        <div class="text-center">
          <h2 class="text-2xl font-bold text-white mb-4">Create New Product?</h2>
          <div class="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-4 mb-4 border border-purple-500/30">
            <p class="text-lg font-semibold text-purple-300 mb-2">${formData.name}</p>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-gray-400">Quantity:</div>
              <div class="text-white">${formData.qty}</div>
              <div class="text-gray-400">Price:</div>
              <div class="text-white">Rp ${parseInt(formData.price || 0).toLocaleString('id-ID')}</div>
            </div>
          </div>
          <p class="text-gray-400">This product will be added to your inventory</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '<span class="flex items-center justify-center"><svg class="w-5 h-5 mr-2 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Create Product</span>',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      customClass: {
        popup: 'animate__animated animate__zoomIn',
        confirmButton: 'btn-confirm'
      },
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          
          if (!token) {
            navigate('/login');
            return false;
          }

          const payload = {
            name: formData.name,
            qty: parseInt(formData.qty),
            price: parseInt(formData.price),
            image: formData.image || '',
            description: formData.description
          };

          const response = await addProduct(payload, token);
          
          // Create success particles
          createSuccessParticles();
          
          return response;
        } catch (err) {
          Swal.showValidationMessage(`Failed: ${err.response?.data?.message || 'Please try again'}`);
          return false;
        } finally {
          setLoading(false);
        }
      }
    });

    if (result.isConfirmed) {
      // Show success animation
      await Swal.fire({
        title: '<div class="success-animation">🎉</div>',
        html: `
          <div class="text-center">
            <h2 class="text-3xl font-bold text-green-400 mb-4">Success!</h2>
            <p class="text-xl text-white mb-2">Product created successfully</p>
            <p class="text-gray-400">Redirecting to products...</p>
            <div class="mt-6">
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="progress-bar bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"></div>
              </div>
            </div>
          </div>
        `,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#1f2937',
        customClass: {
          popup: 'animate__animated animate__bounceIn'
        },
        willClose: () => {
          navigate('/products');
        }
      });
    }
  };

  const createSuccessParticles = () => {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'success-particle';
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: linear-gradient(45deg, #10b981, #34d399);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
        left: 50%;
        top: 50%;
      `;
      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 3 + Math.random() * 4;
      const duration = 1500;

      let startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed > duration) {
          particle.remove();
          return;
        }

        const progress = elapsed / duration;
        const distance = velocity * elapsed / 10;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const opacity = 1 - progress;
        const scale = 1 - progress;

        particle.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        particle.style.opacity = opacity.toString();
        requestAnimationFrame(animate);
      };

      animate();
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: '<div class="warning-animation">⚠️</div>',
      html: `
        <div class="text-center">
          <h2 class="text-2xl font-bold text-yellow-400 mb-4">Discard Changes?</h2>
          <p class="text-gray-300 mb-4">All unsaved changes will be lost</p>
          <div class="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/30">
            <p class="text-sm text-gray-400">This action cannot be undone</p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Discard',
      cancelButtonText: 'Continue Editing',
      background: '#1f2937',
      customClass: {
        popup: 'animate__animated animate__wobble'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Add exit animation
        const container = document.querySelector('.page-container');
        if (container) {
          container.classList.add('page-exit');
          setTimeout(() => navigate('/products'), 500);
        } else {
          navigate('/products');
        }
      }
    });
  };

  // Format price while typing
  const formatPriceDisplay = (value) => {
    if (!value) return '';
    const num = parseInt(value.replace(/\D/g, ''));
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      price: value
    }));
  };

  const handleFieldFocus = (field) => {
    setActiveField(field);
    // Add focus animation
    const fieldElement = document.getElementById(`${field}-field`);
    if (fieldElement) {
      fieldElement.classList.add('field-focus');
    }
  };

  const handleFieldBlur = (field) => {
    setActiveField(null);
    const fieldElement = document.getElementById(`${field}-field`);
    if (fieldElement) {
      fieldElement.classList.remove('field-focus');
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { opacity: 1; box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes field-glow {
          0%, 100% { border-color: rgba(99, 102, 241, 0.3); box-shadow: 0 0 10px rgba(99, 102, 241, 0.2); }
          50% { border-color: rgba(139, 92, 246, 0.6); box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
        }
        
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .page-container {
          transition: transform 0.5s ease, opacity 0.5s ease;
        }
        
        .page-exit {
          transform: translateX(-100px);
          opacity: 0;
        }
        
        .form-submitting {
          animation: submit-pulse 1s ease;
        }
        
        @keyframes submit-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .field-focus {
          animation: field-glow 2s infinite;
        }
        
        .field-error {
          animation: error-shake 0.5s ease;
        }
        
        @keyframes error-shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .confirmation-animation {
          display: inline-block;
          animation: float 3s ease-in-out infinite;
          font-size: 3rem;
        }
        
        .success-animation {
          display: inline-block;
          animation: bounce 2s ease infinite;
          font-size: 4rem;
        }
        
        .warning-animation {
          display: inline-block;
          animation: wobble 1s ease infinite;
          font-size: 3rem;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        .progress-bar {
          animation: progress-grow 2s linear forwards;
        }
        
        @keyframes progress-grow {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .btn-confirm:hover {
          animation: confirm-pulse 0.5s ease;
        }
        
        @keyframes confirm-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .typewriter-text {
          overflow: hidden;
          border-right: 2px solid #8b5cf6;
          white-space: nowrap;
          animation: typewriter 3s steps(40, end);
        }
        
        .floating-element {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <div className={`page-container mt-20 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 transition-all duration-1000 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Floating Background Elements */}
        {floatingElements.map(el => (
          <div
            key={el.id}
            className="floating-element"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
              background: el.color,
              opacity: 0.3,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${el.id * 0.2}s`
            }}
          />
        ))}

        {/* Animated Background Gradient */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-shift" 
               style={{backgroundSize: '400% 400%', animation: 'gradient-shift 15s ease infinite'}}>
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: 'linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)',
                 backgroundSize: '50px 50px'
               }}>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Header with Animation */}
          <div className="pt-8 px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 animate-slide-in" style={{animationDelay: '0.2s'}}>
                <button
                  onClick={handleCancel}
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-105 mb-6"
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
                    <div className="relative flex items-center">
                      <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span className="font-medium">Back to Products</span>
                    </div>
                  </div>
                </button>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent pb-2 typewriter-text">
                          Create New Product
                        </h1>
                      </div>
                    </div>
                    <p className="text-gray-400 text-lg mt-4 animate-slide-in" style={{animationDelay: '0.3s'}}>
                      Fill in the details to add a masterpiece to your inventory
                    </p>
                    
                    {/* Progress Indicator */}
                    <div className="mt-6 max-w-md animate-slide-in" style={{animationDelay: '0.4s'}}>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>Form Progress</span>
                        <span className="text-purple-400 font-semibold">
                          {Object.values(formData).filter(v => v.toString().trim()).length}/5
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{width: `${(Object.values(formData).filter(v => v.toString().trim()).length / 5) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated Icon */}
                  <div className="animate-slide-in" style={{animationDelay: '0.5s'}}>
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6">
                        <div className="text-center">
                          <div className="inline-block animate-spin-slow">
                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-3xl">
                              ✨
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-gray-400">New Product</p>
                          <div className="mt-2 flex justify-center space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Card */}
              <div className="animate-slide-in" style={{animationDelay: '0.6s'}}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition duration-1000"></div>
                  <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-gray-700/50 group-hover:border-purple-500/30 transition-all duration-500">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Product Name */}
                      <div id="name-field" className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          <span className="flex items-center">
                            <span className="mr-2">📝</span>
                            Product Name
                            <span className="ml-2 text-red-500">*</span>
                            {formData.name && (
                              <span className="ml-auto text-xs text-green-400 animate-pulse">
                                ✓ Valid
                              </span>
                            )}
                          </span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg blur group-hover:blur-md transition-all duration-300"></div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('name')}
                            onBlur={() => handleFieldBlur('name')}
                            className="relative block w-full px-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter an amazing product name..."
                            disabled={loading}
                          />
                        </div>
                        <div className="mt-2 flex items-center">
                          <div className="text-xs text-gray-500">
                            {formData.name.length}/100 characters
                          </div>
                          {formData.name.length > 0 && (
                            <div className="ml-auto">
                              <div className={`h-1 rounded-full transition-all duration-500 ${
                                formData.name.length < 50 ? 'w-8 bg-red-500' : 
                                formData.name.length < 80 ? 'w-16 bg-yellow-500' : 
                                'w-24 bg-green-500'
                              }`}></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Price Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quantity */}
                        <div id="qty-field" className="relative">
                          <label className="block text-sm font-medium text-gray-300 mb-3">
                            <span className="flex items-center">
                              <span className="mr-2">📦</span>
                              Quantity
                              <span className="ml-2 text-red-500">*</span>
                            </span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-lg blur transition-all duration-300"></div>
                            <div className="relative flex items-center">
                              <div className="absolute left-3 z-10">
                                <span className="text-gray-400">Units</span>
                              </div>
                              <input
                                type="number"
                                name="qty"
                                value={formData.qty}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('qty')}
                                onBlur={() => handleFieldBlur('qty')}
                                min="1"
                                className="block w-full pl-20 pr-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                placeholder="0"
                                disabled={loading}
                              />
                            </div>
                          </div>
                          {formData.qty && (
                            <div className="mt-3">
                              <div className="flex items-center space-x-2">
                                <div className="text-xs text-gray-500">Stock visualization:</div>
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                                    style={{width: `${Math.min(parseInt(formData.qty) * 2, 100)}%`}}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div id="price-field" className="relative">
                          <label className="block text-sm font-medium text-gray-300 mb-3">
                            <span className="flex items-center">
                              <span className="mr-2">💰</span>
                              Price
                              <span className="ml-2 text-red-500">*</span>
                            </span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-lg blur transition-all duration-300"></div>
                            <div className="relative flex">
                              <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-700 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-300">
                                Rp
                              </span>
                              <input
                                type="text"
                                name="price"
                                value={formatPriceDisplay(formData.price)}
                                onChange={handlePriceChange}
                                onFocus={() => handleFieldFocus('price')}
                                onBlur={() => handleFieldBlur('price')}
                                className="block w-full pl-3 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-r-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                placeholder="0"
                                disabled={loading}
                              />
                            </div>
                          </div>
                          {formData.price && (
                            <div className="mt-3 p-3 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-700/30">
                              <div className="text-sm">
                                <div className="flex justify-between text-gray-400">
                                  <span>Formatted:</span>
                                  <span className="text-yellow-300 font-semibold">Rp {parseInt(formData.price).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 mt-1">
                                  <span>Raw value:</span>
                                  <span className="text-white">{formData.price}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Image URL */}
                      <div id="image-field" className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          <span className="flex items-center">
                            <span className="mr-2">🖼️</span>
                            Image URL
                            <span className="ml-2 text-gray-500 text-sm">(Optional)</span>
                          </span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-lg blur transition-all duration-300"></div>
                          <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('image')}
                            onBlur={() => handleFieldBlur('image')}
                            className="relative block w-full px-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                            placeholder="https://example.com/product-image.jpg"
                            disabled={loading}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Leave empty to use default placeholder
                        </p>
                        
                        {/* Image Preview */}
                        {formData.image && (
                          <div className="mt-4 animate-slide-in">
                            <div className="relative group/image">
                              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur group-hover/image:blur-md transition duration-300"></div>
                              <div className="relative">
                                <h4 className="text-sm font-medium text-gray-400 mb-2">Image Preview</h4>
                                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                                  <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover transform group-hover/image:scale-105 transition-transform duration-700"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="hidden w-full h-full items-center justify-center flex-col">
                                    <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-500">Invalid or loading image URL</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div id="description-field" className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          <span className="flex items-center">
                            <span className="mr-2">📝</span>
                            Description
                            <span className="ml-2 text-red-500">*</span>
                            {formData.description && (
                              <span className="ml-auto text-xs text-green-400 animate-pulse">
                                {formData.description.length}/1000
                              </span>
                            )}
                          </span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-lg blur transition-all duration-300"></div>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('description')}
                            onBlur={() => handleFieldBlur('description')}
                            rows="6"
                            className="relative block w-full px-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 resize-none"
                            placeholder="Describe your amazing product in detail..."
                            disabled={loading}
                          />
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Character count: {formData.description.length}/1000
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-xs text-gray-500">Readability:</div>
                              <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                                  style={{width: `${Math.min(formData.description.length / 10, 100)}%`}}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Live Preview */}
                      <div className="pt-6 border-t border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <span className="mr-2">👁️</span>
                          Live Preview
                          <div className="ml-2 flex">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-1 h-1 mx-0.5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                            ))}
                          </div>
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Product Summary */}
                          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                            <h4 className="text-sm font-medium text-gray-400 mb-4">Product Summary</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500">Name:</span>
                                <span className="text-white font-medium truncate max-w-[200px]">
                                  {formData.name || 'Not set'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500">Quantity:</span>
                                <div className="flex items-center">
                                  <div className="w-16 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                                      style={{width: `${Math.min(parseInt(formData.qty || 0) * 2, 100)}%`}}
                                    ></div>
                                  </div>
                                  <span className="text-white font-medium">{formData.qty || '0'}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500">Price:</span>
                                <span className="text-yellow-300 font-semibold">
                                  {formData.price ? `Rp ${parseInt(formData.price).toLocaleString('id-ID')}` : 'Rp 0'}
                                </span>
                              </div>
                              <div className="pt-3 border-t border-gray-800">
                                <div className="text-gray-500 text-sm">Description Preview:</div>
                                <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                                  {formData.description || 'No description provided'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Card Preview */}
                          <div className="relative group/preview">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur group-hover/preview:blur-md transition duration-300"></div>
                            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                              <h4 className="text-sm font-medium text-gray-400 mb-4">Card Preview</h4>
                              <div className="space-y-4">
                                <div className="h-32 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-lg flex items-center justify-center">
                                  {formData.image ? (
                                    <img 
                                      src={formData.image} 
                                      alt="Preview" 
                                      className="h-full w-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="text-center">
                                      <div className="text-3xl mb-2">📦</div>
                                      <p className="text-gray-500 text-sm">Product Image</p>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h5 className="text-white font-medium truncate">{formData.name || 'Product Name'}</h5>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-lg font-bold text-white">
                                      {formData.price ? `Rp ${parseInt(formData.price).toLocaleString('id-ID')}` : 'Rp 0'}
                                    </span>
                                    <span className="px-2 py-1 text-xs bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full">
                                      {formData.qty || '0'} in stock
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 pt-6 border-t border-gray-800">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="group relative overflow-hidden px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-300 transform hover:scale-105 flex-1 sm:flex-none"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Cancel
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                name: '',
                                qty: '',
                                price: '',
                                image: '',
                                description: ''
                              });
                              // Add reset animation
                              const form = document.querySelector('form');
                              if (form) {
                                form.classList.add('form-reset');
                                setTimeout(() => form.classList.remove('form-reset'), 1000);
                              }
                            }}
                            disabled={loading}
                            className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-700/30 text-yellow-300 rounded-xl hover:from-yellow-600/30 hover:to-orange-600/30 transition-all duration-300 transform hover:scale-105 flex-1 sm:flex-none"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Reset Form
                            </span>
                          </button>
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className={`group relative overflow-hidden px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                            loading
                              ? 'bg-purple-700 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700'
                          }`}
                        >
                          <div className="absolute inset-0 animate-shimmer"></div>
                          <div className="relative flex items-center justify-center">
                            {loading ? (
                              <>
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Product...
                              </>
                            ) : (
                              <>
                                <svg className="w-6 h-6 mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Product
                                <div className="absolute -right-2 -top-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12 px-4 md:px-6 lg:px-8 pb-16">
            <div className="max-w-6xl mx-auto animate-slide-in" style={{animationDelay: '0.8s'}}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur group-hover:blur-xl transition duration-1000"></div>
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-700/30">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
                      <span className="text-2xl">💡</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">
                        Pro Tips for Amazing Products
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { icon: '🎯', title: 'Clear Names', desc: 'Use descriptive, SEO-friendly names' },
                          { icon: '📈', title: 'Realistic Pricing', desc: 'Research market prices for competitiveness' },
                          { icon: '📷', title: 'Quality Images', desc: 'High-res images increase conversions by 40%' },
                          { icon: '📝', title: 'Detailed Descriptions', desc: 'Include specs, benefits, and usage' }
                        ].map((tip, i) => (
                          <div key={i} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105">
                            <div className="text-2xl mb-2">{tip.icon}</div>
                            <h4 className="font-medium text-white mb-1">{tip.title}</h4>
                            <p className="text-sm text-gray-400">{tip.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;