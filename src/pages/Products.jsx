import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllProduct, deleteProduct, searchProduct } from '../services/productAPI';
import Swal from 'sweetalert2';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [statsAnimated, setStatsAnimated] = useState([false, false, false]);
    const navigate = useNavigate();

    // Format harga ke Rupiah
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Format tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Animate stats numbers
    const animateNumbers = (target, elementId, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const element = document.getElementById(elementId);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(start);
        }, 16);
    };

    // Animate stats on mount
    useEffect(() => {
        if (products.length > 0 && !statsAnimated[0]) {
            setTimeout(() => {
                const totalProducts = products.length;
                const totalStock = products.reduce((sum, product) => sum + (product.qty || 0), 0);
                const totalValue = products.reduce((sum, product) => sum + ((product.price || 0) * (product.qty || 0)), 0);

                animateNumbers(totalProducts, 'stat-total-products', 1500);
                animateNumbers(totalStock, 'stat-total-stock', 2000);
                animateNumbers(totalValue, 'stat-total-value', 2500);

                setStatsAnimated([true, true, true]);
            }, 500);
        }
    }, [products, statsAnimated]);

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

        // Create particles periodically
        const particleInterval = setInterval(createParticle, 300);
        
        // Create initial particles
        for (let i = 0; i < 20; i++) {
            setTimeout(createParticle, i * 100);
        }

        return () => {
            clearInterval(particleInterval);
            document.querySelectorAll('.particle').forEach(p => p.remove());
        };
    }, []);

    // Fetch all products
    const loadAllProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetchAllProduct(token);
            setProducts(response.data || []);
            setError('');
            
            // Reset animation states for new data
            setStatsAnimated([false, false, false]);
        } catch (err) {
            setError('Failed to load products');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle search product
    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            loadAllProducts();
            return;
        }

        try {
            setSearchLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await searchProduct(searchQuery, token);

            if (response.data && response.data.length > 0) {
                setProducts(response.data);
                setError('');
            } else {
                setProducts([]);
                setError('No products found matching your search');
            }
        } catch (err) {
            console.error('Error searching products:', err);
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setProducts(filtered);

            if (filtered.length === 0) {
                setError('No products found matching your search');
            }
        } finally {
            setSearchLoading(false);
        }
    };

    // Debounce search input
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            handleSearch(value);
        }, 500);

        setSearchTimeout(timeout);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm('');
        loadAllProducts();
    };

    // Handle search button click
    const handleSearchButtonClick = () => {
        handleSearch(searchTerm);
    };

    // Fetch initial products
    useEffect(() => {
        loadAllProducts();

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [navigate]);

    // Handle delete product with SweetAlert2
    const handleDelete = async (product) => {
        const result = await Swal.fire({
            title: `Delete "${product.name}"?`,
            html: `
                <div class="text-center">
                    <div class="mb-4">
                        <svg class="animate-spin-slow mx-auto w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </div>
                    <p class="text-lg font-semibold text-gray-800">This action cannot be undone!</p>
                    <p class="text-gray-600 mt-2">All data for <span class="font-bold text-red-600">${product.name}</span> will be permanently deleted.</p>
                    <div class="mt-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                        <p class="text-sm text-gray-700">
                            <span class="font-medium">Product ID:</span> #${product.id}<br>
                            <span class="font-medium">Price:</span> ${formatPrice(product.price)}<br>
                            <span class="font-medium">Stock:</span> ${product.qty} units
                        </p>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: '<span class="flex items-center justify-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Yes, Delete Permanently</span>',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    const token = localStorage.getItem('token');
                    await deleteProduct(product.id, token);
                    return true;
                } catch (err) {
                    Swal.showValidationMessage(`Failed: ${err.response?.data?.message || 'Please try again'}`);
                    return false;
                }
            }
        });

        if (result.isConfirmed) {
            // Animate card removal
            const cardElement = document.querySelector(`[data-product-id="${product.id}"]`);
            if (cardElement) {
                cardElement.classList.add('card-removing');
                setTimeout(() => {
                    setProducts(prev => prev.filter(p => p.id !== product.id));
                }, 500);
            } else {
                setProducts(prev => prev.filter(p => p.id !== product.id));
            }

            Swal.fire({
                title: 'Deleted!',
                html: `
                    <div class="animate-bounce">
                        <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <p class="mt-4 text-lg font-semibold text-gray-800">Product deleted successfully!</p>
                `,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                willClose: () => {
                    setSelectedProduct(null);
                }
            });
        }
    };

    // Handle edit product
    const handleEdit = (product) => {
        // Add ripple effect to button
        const button = document.querySelector(`[data-edit-id="${product.id}"]`);
        if (button) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
                navigate(`/updateProduct/${product.id}`);
            }, 600);
        } else {
            navigate(`/updateProduct/${product.id}`);
        }
    };

    // Handle add new product
    const handleAddProduct = () => {
        // Add flash effect to button
        const button = document.querySelector('[data-add-product]');
        if (button) {
            button.classList.add('button-flash');
            setTimeout(() => {
                button.classList.remove('button-flash');
                navigate('/addProduct');
            }, 300);
        } else {
            navigate('/addProduct');
        }
    };

    // Card hover effects
    const handleCardMouseEnter = (id) => {
        setHoveredCard(id);
    };

    const handleCardMouseLeave = () => {
        setHoveredCard(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    <div className="relative">
                        <div className="loading-spinner">
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                            <div className="spinner-center"></div>
                        </div>
                    </div>
                </div>
                <p className="mt-8 text-xl text-white font-light tracking-wider animate-pulse">
                    Loading your products<span className="loading-dots">...</span>
                </p>
                <div className="mt-4 text-gray-400 text-sm">
                    <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: `${i * 0.1}s`}}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

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
                
                @keyframes cardGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.1); }
                    50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.3); }
                }
                
                @keyframes slideIn {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes ripple {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(4); opacity: 0; }
                }
                
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
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
                
                .card-removing {
                    animation: removeCard 0.5s ease forwards;
                }
                
                @keyframes removeCard {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(0.8) rotate(-5deg); opacity: 0.5; }
                    100% { transform: scale(0) rotate(10deg); opacity: 0; }
                }
                
                .ripple-effect {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(99, 102, 241, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                }
                
                .button-flash {
                    animation: flash 0.3s ease;
                }
                
                @keyframes flash {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(99, 102, 241, 0.5); }
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
                .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
            `}</style>

            <div className={`mt-20 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 transition-all duration-1000 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
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
                <div className="relative z-10">
                    {/* Header Section */}
                    <div className="pt-8 px-4 md:px-6 lg:px-8 animate-slide-in" style={{animationDelay: '0.1s'}}>
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                                <div className="mb-6 md:mb-0">
                                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent pb-2">
                                        My Products
                                    </h1>
                                    <p className="text-gray-300 mt-2 text-lg">Manage your inventory like a pro</p>
                                    <div className="flex items-center mt-4 space-x-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-gray-400">{products.length} products loaded</span>
                                    </div>
                                </div>
                                
                                <button
                                    data-add-product
                                    onClick={handleAddProduct}
                                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
                                >
                                    <div className="absolute inset-0 animate-shimmer"></div>
                                    <div className="relative flex items-center justify-center">
                                        <svg className="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span className="text-lg">Add New Product</span>
                                        <div className="absolute -right-2 -top-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white/20 rounded-full blur-sm"></div>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full blur-sm"></div>
                                </button>
                            </div>

                            {/* Stats Cards with Animated Numbers */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {[
                                    {
                                        title: "Total Products",
                                        value: products.length,
                                        id: "stat-total-products",
                                        icon: "📦",
                                        color: "from-blue-500 to-cyan-500",
                                        delay: "0.2s"
                                    },
                                    {
                                        title: "Total Stock",
                                        value: products.reduce((sum, product) => sum + (product.qty || 0), 0),
                                        id: "stat-total-stock",
                                        icon: "📊",
                                        color: "from-emerald-500 to-green-500",
                                        delay: "0.3s"
                                    },
                                    {
                                        title: "Total Value",
                                        value: products.reduce((sum, product) => sum + ((product.price || 0) * (product.qty || 0)), 0),
                                        id: "stat-total-value",
                                        icon: "💰",
                                        color: "from-purple-500 to-pink-500",
                                        delay: "0.4s"
                                    }
                                ].map((stat, index) => (
                                    <div 
                                        key={index}
                                        className="relative group overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 animate-slide-in"
                                        style={{animationDelay: stat.delay}}
                                    >
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl transform group-hover:rotate-12 transition-transform duration-300`}>
                                                    <span className="text-2xl">{stat.icon}</span>
                                                </div>
                                                <div className="absolute top-0 right-0 -mt-2 -mr-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-transparent rounded-full animate-pulse-glow"></div>
                                                </div>
                                            </div>
                                            <p className="text-gray-400 text-sm font-medium mb-2">{stat.title}</p>
                                            <div className="flex items-baseline">
                                                <span id={stat.id} className="text-3xl font-bold text-white">
                                                    {stat.title === "Total Value" ? formatPrice(stat.value).replace('Rp', '') : stat.value}
                                                </span>
                                                {stat.title === "Total Value" && (
                                                    <span className="ml-2 text-gray-400">IDR</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Search Section */}
                            <div className="mb-8 animate-slide-in" style={{animationDelay: '0.5s'}}>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                    <div className="relative bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row gap-3 items-center">
                                                    <div className="flex-1 w-full">
                                                        <div className="relative group">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg blur group-hover:blur-md transition-all duration-300"></div>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                    </svg>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search products by name or description..."
                                                                    value={searchTerm}
                                                                    onChange={handleSearchChange}
                                                                    className="block w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                                                    onKeyPress={(e) => e.key === 'Enter' && handleSearchButtonClick()}
                                                                />
                                                                {searchTerm && (
                                                                    <button
                                                                        onClick={handleClearSearch}
                                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-purple-300 transition-colors duration-200"
                                                                        title="Clear search"
                                                                    >
                                                                        <svg className="h-5 w-5 text-gray-400 hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <button
                                                            onClick={handleSearchButtonClick}
                                                            disabled={searchLoading}
                                                            className={`relative overflow-hidden px-4 py-3 rounded-lg flex items-center justify-center flex-1 sm:flex-none sm:w-[120px] h-[46px] transition-all duration-300 transform hover:scale-105 ${
                                                                searchLoading 
                                                                    ? 'bg-purple-700 cursor-not-allowed'
                                                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                                            }`}
                                                        >
                                                            {searchLoading ? (
                                                                <>
                                                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    <span>Searching</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                    </svg>
                                                                    <span>Search</span>
                                                                </>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={loadAllProducts}
                                                            className="relative overflow-hidden px-4 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center flex-1 sm:flex-none sm:w-[100px] h-[46px]"
                                                        >
                                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                            <span>Refresh</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2 ml-1">
                                                    {searchTerm ? `Searching for: "${searchTerm}"` : 'Type to search products...'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid Section */}
                    <div className="pb-16 px-4 md:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            {error && (
                                <div className="mb-6 bg-gradient-to-r from-red-900/50 to-orange-900/50 backdrop-blur-lg border border-red-700/50 rounded-2xl p-6 animate-slide-in">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-full">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.858-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-medium text-white">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {searchLoading ? (
                                <div className="text-center py-20 animate-slide-in">
                                    <div className="inline-block relative">
                                        <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl">🔍</span>
                                        </div>
                                    </div>
                                    <h3 className="mt-6 text-2xl font-bold text-white">Searching...</h3>
                                    <p className="text-gray-400 mt-2">Looking for products matching "{searchTerm}"</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-20 animate-slide-in">
                                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-full border border-gray-700/50 mb-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 border-4 border-purple-500/20 rounded-full animate-ping"></div>
                                            <svg className="w-16 h-16 text-gray-400 absolute top-4 left-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                                        {searchTerm ? 'No products found' : 'Your store is empty'}
                                    </h3>
                                    <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                                        {searchTerm
                                            ? `No products found matching "${searchTerm}". Try a different search term.`
                                            : 'Start building your product catalog by adding your first product.'}
                                    </p>
                                    {searchTerm && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="mb-8 px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Clear Search
                                        </button>
                                    )}
                                    <button
                                        onClick={handleAddProduct}
                                        className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
                                    >
                                        <span className="relative flex items-center">
                                            <svg className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Your First Product
                                        </span>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {searchTerm && (
                                        <div className="mb-8 p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 animate-slide-in">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white">
                                                        Search Results for "<span className="text-purple-300">"{searchTerm}"</span>"
                                                    </h2>
                                                    <p className="text-gray-400 mt-1">
                                                        Found <span className="text-yellow-300 font-bold">{products.length}</span> product{products.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleClearSearch}
                                                    className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
                                                >
                                                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors duration-200 mr-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                    <span>Clear Search</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {products.map((product, index) => (
                                            <div
                                                key={product.id}
                                                data-product-id={product.id}
                                                onMouseEnter={() => handleCardMouseEnter(product.id)}
                                                onMouseLeave={handleCardMouseLeave}
                                                className={`relative group overflow-hidden rounded-2xl transition-all duration-500 animate-slide-in ${
                                                    hoveredCard === product.id 
                                                        ? 'transform scale-[1.02]' 
                                                        : ''
                                                }`}
                                                style={{
                                                    animationDelay: `${0.1 * index}s`,
                                                    animationFillMode: 'both'
                                                }}
                                            >
                                                {/* Card Glow Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                                                
                                                {/* Main Card */}
                                                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-300 h-full rounded-2xl overflow-hidden">
                                                    {/* Product Image with Hover Effect */}
                                                    <div className="relative h-48 overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-indigo-900/20 z-10"></div>
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className="relative">
                                                                    <div className="w-24 h-24 border-4 border-gray-700/50 border-t-purple-500 rounded-full animate-spin"></div>
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Stock Badge with Animation */}
                                                        <div className="absolute top-4 right-4 z-20">
                                                            <div className="relative">
                                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur opacity-50 animate-pulse"></div>
                                                                <span className="relative bg-gray-900/90 backdrop-blur-sm text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30">
                                                                    {product.qty} in stock
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* ID Badge */}
                                                        <div className="absolute top-4 left-4 z-20">
                                                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                                                ID: #{product.id}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="p-5">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h3 className="text-lg font-bold text-white truncate group-hover:text-purple-200 transition-colors duration-300">
                                                                {product.name}
                                                            </h3>
                                                        </div>
                                                        
                                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10 group-hover:text-gray-300 transition-colors duration-300">
                                                            {product.description}
                                                        </p>

                                                        <div className="space-y-3 mb-6">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-500">Price</span>
                                                                <span className="text-xl font-bold text-white animate-pulse">
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-500">Total Value</span>
                                                                <span className="text-lg font-semibold text-purple-300">
                                                                    {formatPrice(product.price * product.qty)}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-700/50">
                                                                <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                Added on {formatDate(product.createdAt)}
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons with Hover Effects */}
                                                        <div className="flex space-x-2">
                                                            <button
                                                                data-edit-id={product.id}
                                                                onClick={() => handleEdit(product)}
                                                                className="relative overflow-hidden flex-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600 hover:to-purple-600 text-indigo-300 hover:text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 group/edit"
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/edit:opacity-100 transition-opacity duration-300"></div>
                                                                <svg className="w-4 h-4 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                <span className="relative z-10">Edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(product)}
                                                                className="relative overflow-hidden flex-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600 hover:to-orange-600 text-red-300 hover:text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 group/delete"
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover/delete:opacity-100 transition-opacity duration-300"></div>
                                                                <svg className="w-4 h-4 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                <span className="relative z-10">Delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Floating Action Button for Mobile */}
                <div className="fixed bottom-6 right-6 md:hidden z-50">
                    <button
                        onClick={handleAddProduct}
                        className="relative w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-bounce"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                    </button>
                </div>

                {/* Animated Footer */}
                <div className="relative border-t border-gray-800/50 mt-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
                    <div className="relative py-6 text-center text-gray-500 text-sm">
                        <div className="flex items-center justify-center space-x-2">
                            <span className="animate-pulse">⚡</span>
                            <span>Powered by</span>
                            <span className="text-purple-400 font-bold">TokoPakEdi</span>
                            <span className="animate-pulse">✨</span>
                        </div>
                        <p className="mt-2">Showing {products.length} products • Last updated: Just now</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Products;