// frontend/src/components/AddProduct.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, updateProductImage } from '../services/productAPI';
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [productId, setProductId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Base URL untuk gambar
  const API_BASE_URL = import.meta.env.VITE_API || 'http://localhost:3000';

  // Page entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Floating particles effect
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        opacity: ${Math.random() * 0.3 + 0.1};
      `;
      document.body.appendChild(particle);

      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight + 100;
      const endY = -100;
      const duration = Math.random() * 10000 + 10000;
      const amplitude = Math.random() * 100 + 50;

      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;

      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress > 1) {
          particle.remove();
          return;
        }

        const x = startX + Math.sin(progress * Math.PI * 4) * amplitude;
        const y = startY + (endY - startY) * progress;

        particle.style.transform = `translate(${x - startX}px, ${y - startY}px)`;
        requestAnimationFrame(animate);
      };

      animate();
    };

    const particleInterval = setInterval(createParticle, 300);

    for (let i = 0; i < 20; i++) {
      setTimeout(createParticle, i * 100);
    }

    return () => {
      clearInterval(particleInterval);
      document.querySelectorAll('.particle').forEach(p => p.remove());
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format harga ke Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('data:')) return imagePath;

    const cleanPath = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    console.log('Selected file:', file);

    // Validate file type - sesuai dengan backend (hanya JPEG, JPG, PNG)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please select a valid image file (JPEG, JPG, PNG)',
        confirmButtonColor: '#4f46e5',
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Image size should not exceed 5MB',
        confirmButtonColor: '#4f46e5',
      });
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    Swal.fire({
      title: 'Remove Image?',
      text: 'Are you sure you want to remove this image?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedImage(null);
        setPreviewImage('');
        setFormData(prev => ({
          ...prev,
          image: ''
        }));
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  const validateForm = () => {
    const { name, qty, price, description } = formData;

    if (!name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Product name is required',
        confirmButtonColor: '#4f46e5',
      });
      return false;
    }

    if (!qty.trim() || parseInt(qty) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Quantity must be greater than 0',
        confirmButtonColor: '#4f46e5',
      });
      return false;
    }

    if (!price.trim() || parseFloat(price) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Price must be greater than 0',
        confirmButtonColor: '#4f46e5',
      });
      return false;
    }

    // Validasi Image - REQUIRED!
    if (!selectedImage && !previewImage) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Product image is required. Please select an image.',
        confirmButtonColor: '#4f46e5',
      });
      const uploadArea = document.querySelector('.image-upload-area');
      if (uploadArea) {
        uploadArea.classList.add('border-red-500', 'bg-red-900/20');
        setTimeout(() => {
          uploadArea.classList.remove('border-red-500', 'bg-red-900/20');
        }, 3000);
      }
      return false;
    }

    if (!description.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Description is required',
        confirmButtonColor: '#4f46e5',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await Swal.fire({
      title: 'Create New Product?',
      html: `
        <div class="text-center">
          <div class="relative mx-auto w-32 h-32 mb-4 overflow-hidden rounded-xl border-2 border-indigo-500/50 shadow-lg">
            ${previewImage ? `
              <img src="${previewImage}" 
                   alt="${formData.name}" 
                   class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            ` : `
              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            `}
            <div class="absolute bottom-2 left-0 right-0 text-center">
              <span class="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded-full">${formData.name || 'New Product'}</span>
            </div>
          </div>
          <p class="text-lg font-semibold text-gray-800">Add this product?</p>
          <div class="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <p class="text-sm text-gray-700">
              <span class="font-medium">Name:</span> ${formData.name}<br>
              <span class="font-medium">Price:</span> ${formatPrice(parseInt(formData.price) || 0)}<br>
              <span class="font-medium">Stock:</span> ${formData.qty} units<br>
              <span class="font-medium">Image:</span> <span class="text-green-600">✅ Selected</span>
            </p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '<span class="flex items-center justify-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Create Product</span>',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');

          if (!token) {
            navigate('/login');
            return false;
          }

          // STEP 1: Buat product dulu
          const payload = {
            name: formData.name,
            qty: parseInt(formData.qty),
            price: parseInt(formData.price),
            image: formData.image || '',
            description: formData.description
          };

          console.log('Creating product with payload:', payload);
          const productResponse = await addProduct(payload, token);
          console.log('Product created response:', productResponse);

          // Ambil ID produk dari response
          const newProductId = productResponse.data?.id || productResponse.id;
          setProductId(newProductId);

          // STEP 2: Upload image setelah product berhasil dibuat
          if (selectedImage && newProductId) {
            try {
              console.log('Uploading image for new product...');
              console.log('Product ID:', newProductId);
              console.log('Selected image:', selectedImage);

              // INI YANG PENTING - PAKAI updateProductImage
              const uploadResponse = await updateProductImage(newProductId, selectedImage, token);
              console.log('Image upload response:', uploadResponse);

              // Update form data dengan image path dari response
              if (uploadResponse.data?.image) {
                const imagePath = uploadResponse.data.image;
                const imageUrl = getImageUrl(imagePath);
                setFormData(prev => ({
                  ...prev,
                  image: imagePath
                }));
                setPreviewImage(imageUrl);
                console.log('Image saved to database:', imagePath);
              } else if (uploadResponse.image) {
                const imagePath = uploadResponse.image;
                const imageUrl = getImageUrl(imagePath);
                setFormData(prev => ({
                  ...prev,
                  image: imagePath
                }));
                setPreviewImage(imageUrl);
                console.log('Image saved to database:', imagePath);
              }

              // Clear selected image setelah upload berhasil
              setSelectedImage(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }

            } catch (uploadError) {
              console.error('Error uploading image:', uploadError);
              // Product tetap dibuat meskipun upload gambar gagal
              Swal.showValidationMessage(
                `Product created but image upload failed: ${uploadError.message || 'Please try again later'}`
              );
            }
          }

          return true;
        } catch (err) {
          console.error('Error creating product:', err);
          Swal.showValidationMessage(
            `Failed: ${err.response?.data?.message || err.message || 'Please try again'}`
          );
          return false;
        } finally {
          setLoading(false);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        html: `
          <div class="text-center">
            <div class="animate-bounce mb-4">
              <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p class="text-lg font-semibold text-gray-800">Product created successfully!</p>
            ${previewImage ? `<img src="${previewImage}" alt="${formData.name}" class="w-24 h-24 object-cover rounded-lg mx-auto mt-4 border border-gray-200 shadow-lg">` : ''}
            <p class="text-sm text-green-600 mt-2">✅ Image uploaded successfully!</p>
          </div>
        `,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          navigate('/products');
        }
      });
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Discard Changes?',
      text: 'Are you sure you want to leave? Your changes will not be saved.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Discard',
      cancelButtonText: 'Continue Editing',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/products');
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

  // Reset to original values
  const handleReset = () => {
    Swal.fire({
      title: 'Reset Form?',
      text: 'All unsaved changes will be cleared.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reset',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          name: '',
          qty: '',
          price: '',
          image: '',
          description: ''
        });
        setSelectedImage(null);
        setPreviewImage('');
        setProductId(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        Swal.fire({
          icon: 'success',
          title: 'Form Reset',
          text: 'Form has been cleared',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#4f46e5',
        });
      }
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const fakeEvent = {
        target: {
          files: [file]
        }
      };
      handleImageSelect(fakeEvent);
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        
        .loading-spinner {
          width: 80px;
          height: 80px;
          position: relative;
        }
        
        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
        }
        
        .spinner-ring:nth-child(1) { border-top-color: #8b5cf6; animation-delay: 0s; }
        .spinner-ring:nth-child(2) { border-right-color: #6366f1; animation-delay: 0.1s; }
        .spinner-ring:nth-child(3) { border-bottom-color: #3b82f6; animation-delay: 0.2s; }
        .spinner-ring:nth-child(4) { border-left-color: #06b6d4; animation-delay: 0.3s; }
        
        .spinner-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .loading-dots::after {
          content: '';
          animation: dots 1.5s steps(4, end) infinite;
        }
        
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
        
        .animate-float-slow { animation: float 6s ease-in-out infinite; }
        .animate-shimmer { 
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-slide-in { animation: slideIn 0.6s ease-out; }
      `}</style>

      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 transition-all duration-1000 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-float-slow"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 pt-8 mt-20">
          <div className="px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Header Section */}
              <div className="mb-8 animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <button
                      onClick={handleCancel}
                      className="flex items-center text-gray-300 hover:text-white mb-4 transition duration-200 group"
                    >
                      <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors duration-200 mr-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </div>
                      <span>Back to Products</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent pb-2">
                        Create New Product
                      </h1>
                      <span className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-medium rounded-full">
                        New
                      </span>
                    </div>
                    <p className="text-gray-300 mt-2 text-lg">Add a new product to your inventory</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-lg shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Card */}
              <div className="relative group animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 group-hover:border-purple-500/30 transition-all duration-500">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg blur opacity-0 group-hover/input:opacity-100 transition duration-300"></div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter product name"
                            disabled={loading || imageUploading}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Product Image <span className="text-red-500">*</span>
                      </label>

                      <div className="space-y-4">
                        {/* Image Preview */}
                        {previewImage && (
                          <div className="relative group/image-preview">
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <p className="text-sm font-medium text-gray-300 mb-4">Product Image:</p>
                              <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                <div className="relative">
                                  <img
                                    src={previewImage}
                                    alt="Product preview"
                                    className="w-full md:w-48 h-48 object-cover rounded-xl border-2 border-gray-700 group-hover/image-preview:border-purple-500 transition-all duration-300"
                                  />
                                  {selectedImage && (
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                                      NEW
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-300 font-medium">
                                    {selectedImage ? 'New image selected' : 'Product image'}
                                  </p>
                                  {selectedImage && (
                                    <>
                                      <p className="text-sm text-gray-400 mt-2">
                                        File: <span className="font-mono text-purple-300">{selectedImage.name}</span>
                                      </p>
                                      <p className="text-sm text-gray-400">
                                        Size: <span className="text-green-300">{Math.round(selectedImage.size / 1024)} KB</span>
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Upload Progress */}
                        {imageUploading && (
                          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border border-blue-700/50">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-blue-300">Uploading Image...</span>
                              <span className="text-sm font-bold text-cyan-300">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                              <span>Starting...</span>
                              <span>Processing...</span>
                              <span>Finishing...</span>
                            </div>
                          </div>
                        )}

                        {/* Upload Area */}
                        <div
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          className={`image-upload-area relative overflow-hidden border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                            selectedImage || previewImage
                              ? 'border-green-500/50 bg-green-900/10'
                              : 'border-gray-700 bg-gray-900/30 hover:bg-gray-900/50 hover:border-purple-500'
                          }`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg, image/jpg, image/png"
                            onChange={handleImageSelect}
                            className="hidden"
                            disabled={imageUploading || loading}
                            required
                          />

                          <div className="space-y-4">
                            <div className="text-5xl">
                              {selectedImage || previewImage ? '✅' : '📤'}
                            </div>
                            <div>
                              <p className="text-gray-200 font-medium text-lg">
                                {selectedImage || previewImage 
                                  ? 'Image selected!' 
                                  : 'Drag & drop or click to upload'
                                }
                              </p>
                              <p className="text-sm text-gray-400 mt-2">
                                PNG, JPG, JPEG up to 5MB <span className="text-red-500">*Required</span>
                              </p>
                              {!selectedImage && !previewImage && (
                                <p className="text-xs text-yellow-400 mt-1">
                                  ⚠️ Please select an image
                                </p>
                              )}
                            </div>
                            <div className="pt-4">
                              <div className="inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800/50 rounded-lg text-gray-300 text-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {selectedImage || previewImage ? 'Image uploaded ✓' : 'Click here to browse files'}
                              </div>
                            </div>
                          </div>

                          {/* Decorative elements */}
                          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/10 to-cyan-500/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
                        </div>

                        {/* Informasi: Image akan diupload setelah product dibuat */}
                        {selectedImage && !productId && (
                          <p className="text-sm text-yellow-400 flex items-center">
                            <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Image will be uploaded after product is created
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity and Price - Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group/input">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg blur opacity-0 group-hover/input:opacity-100 transition duration-300"></div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <input
                              type="number"
                              name="qty"
                              value={formData.qty}
                              onChange={handleChange}
                              min="1"
                              className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                              placeholder="Enter quantity"
                              disabled={loading || imageUploading}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group/input">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg blur opacity-0 group-hover/input:opacity-100 transition duration-300"></div>
                          <div className="relative">
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-700 bg-gray-800 text-gray-300">
                                Rp
                              </span>
                              <input
                                type="text"
                                name="price"
                                value={formatPriceDisplay(formData.price)}
                                onChange={handlePriceChange}
                                className="block w-full pl-3 py-3 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 rounded-r-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter price"
                                disabled={loading || imageUploading}
                              />
                            </div>
                            {formData.price && (
                              <p className="text-sm text-gray-400 mt-2">
                                Actual value: <span className="text-yellow-300 font-medium">Rp {parseInt(formData.price).toLocaleString('id-ID')}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-lg blur opacity-0 group-hover/input:opacity-100 transition duration-300"></div>
                        <div className="relative">
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            className="block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 resize-none"
                            placeholder="Enter product description..."
                            disabled={loading || imageUploading}
                          />
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-sm text-gray-400">
                              {formData.description.length}/1000 characters
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-xs text-gray-500">Message Power:</div>
                              <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(formData.description.length / 10, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Summary Preview */}
                    <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 border border-yellow-700/30">
                      <h3 className="text-lg font-medium text-yellow-300 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Product Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-yellow-200 mb-3">Product Details</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg">
                              <span className="text-yellow-300">Name:</span>
                              <span className="font-medium text-white truncate max-w-[150px]">{formData.name || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg">
                              <span className="text-yellow-300">Quantity:</span>
                              <span className="font-medium text-white">{formData.qty || '0'}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg">
                              <span className="text-yellow-300">Price:</span>
                              <span className="font-medium text-white">
                                {formData.price ? formatPrice(parseInt(formData.price)) : 'Rp 0'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg">
                              <span className="text-yellow-300">Image:</span>
                              <span className={`font-medium ${previewImage ? 'text-green-400' : 'text-red-400'}`}>
                                {previewImage ? '✅ Available' : '❌ Required'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-yellow-200 mb-3">Description Preview</h4>
                          <div className="p-3 bg-gray-900/50 rounded-lg border border-yellow-500/30 min-h-[100px]">
                            <p className="text-gray-300 text-sm">
                              {formData.description || 'No description provided yet'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 pt-8 border-t border-gray-700/50">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={loading || imageUploading}
                          className="relative overflow-hidden px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-300 transform hover:scale-105 font-medium flex-1 sm:flex-none"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          disabled={loading || imageUploading}
                          className="relative overflow-hidden px-6 py-3 border border-yellow-700/50 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 text-yellow-300 rounded-xl hover:from-yellow-900/50 hover:to-orange-900/50 transition-all duration-300 transform hover:scale-105 font-medium flex-1 sm:flex-none"
                        >
                          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Reset Form
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || imageUploading}
                        className={`relative overflow-hidden px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                          loading || imageUploading
                            ? 'bg-indigo-800 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25'
                        }`}
                      >
                        <div className="absolute inset-0 animate-shimmer"></div>
                        <div className="relative flex items-center justify-center">
                          {loading ? (
                            <>
                              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating...
                            </>
                          ) : imageUploading ? (
                            <>
                              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading Image...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

              {/* Tips Section */}
              <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur-lg rounded-2xl p-6 border border-blue-700/50 animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-200">Tips for creating products</h3>
                    <div className="mt-3 text-blue-100">
                      <ul className="list-disc pl-5 space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2">🎯</span>
                          <span>Use clear and descriptive product names for better SEO</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">💰</span>
                          <span>Research competitor pricing to stay competitive</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">📸</span>
                          <span>High-quality product images increase conversion rates - <span className="text-red-400">Required!</span></span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">📝</span>
                          <span>Write detailed descriptions highlighting key benefits</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">📦</span>
                          <span>Set accurate stock levels to avoid overselling</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Footer */}
          <div className="relative border-t border-gray-800/50 mt-12">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
            <div className="relative py-8 text-center text-gray-500 text-sm">
              <div className="flex items-center justify-center space-x-3">
                <span className="animate-pulse">⚡</span>
                <span>Creating New Product</span>
                <span className="animate-pulse">✨</span>
              </div>
              <p className="mt-2">Adding to inventory: <span className="text-indigo-300 font-medium">{formData.name || 'Unnamed Product'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;