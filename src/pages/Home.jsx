import React, { useState, useEffect } from 'react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState(3);
  const [wishlistItems, setWishlistItems] = useState(5);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll untuk efek di search bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'All', icon: '🛍️', count: 45 },
    { name: 'Electronics', icon: '📱', count: 12 },
    { name: 'Fashion', icon: '👗', count: 18 },
    { name: 'Home', icon: '🏠', count: 8 },
    { name: 'Sports', icon: '⚽', count: 7 },
  ];

  const products = [
    { id: 1, name: 'Smart Watch Pro', price: '$299', rating: 4.8, image: '⌚', category: 'Electronics', isNew: true, discount: 0 },
    { id: 2, name: 'Wireless Headphones', price: '$189', rating: 4.6, image: '🎧', category: 'Electronics', discount: 20 },
    { id: 3, name: 'Designer Handbag', price: '$459', rating: 4.9, image: '👜', category: 'Fashion', isBestSeller: true, discount: 0 },
    { id: 4, name: 'Coffee Maker', price: '$129', rating: 4.7, image: '☕', category: 'Home', discount: 15 },
    { id: 5, name: 'Running Shoes', price: '$89', rating: 4.5, image: '👟', category: 'Sports', discount: 30 },
    { id: 6, name: 'Laptop Ultra', price: '$1299', rating: 4.9, image: '💻', category: 'Electronics', discount: 10 },
    { id: 7, name: 'Yoga Mat', price: '$45', rating: 4.4, image: '🧘', category: 'Sports', isNew: true, discount: 0 },
    { id: 8, name: 'Smart TV', price: '$799', rating: 4.8, image: '📺', category: 'Electronics', discount: 25 },
  ];

  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: '😊', color: 'from-blue-500 to-cyan-500' },
    { label: 'Products Sold', value: '200K+', icon: '📦', color: 'from-purple-500 to-pink-500' },
    { label: '5 Star Ratings', value: '4.9/5', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
    { label: 'Delivery Cities', value: '150+', icon: '📍', color: 'from-green-500 to-emerald-500' },
  ];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const handleAddToCart = (productId) => {
    setCartItems(prev => prev + 1);
    const button = document.getElementById(`add-to-cart-${productId}`);
    if (button) {
      button.classList.add('scale-110', 'bg-green-600');
      setTimeout(() => {
        button.classList.remove('scale-110', 'bg-green-600');
      }, 300);
    }
  };

  const handleAddToWishlist = (productId) => {
    setWishlistItems(prev => prev + 1);
    const icon = document.getElementById(`wishlist-${productId}`);
    if (icon) {
      icon.classList.add('scale-125', 'text-red-500');
      setTimeout(() => {
        icon.classList.remove('scale-125');
      }, 300);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
      {/* Floating Search Bar */}
      <div className={`fixed top-20 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-gray-200 p-1">
            <form onSubmit={handleSearch} className="flex items-center">
              <button type="submit" className="p-3 pl-4">
                <span className="text-gray-400 text-xl">🔍</span>
              </button>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="flex-1 px-2 py-3 focus:outline-none text-gray-700"
              />
              <div className="flex items-center space-x-2 pr-3">
                <button 
                  type="button"
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => alert('Wishlist clicked')}
                >
                  <span className="text-xl">❤️</span>
                  {wishlistItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistItems}
                    </span>
                  )}
                </button>
                <button 
                  type="button"
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => alert('Cart clicked')}
                >
                  <span className="text-xl">🛒</span>
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white mb-8 animate-pulse">
              <span className="mr-3 text-2xl">🔥</span>
              <span className="font-bold text-lg">FLASH SALE - Up to 70% OFF</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to
              <span className="block text-yellow-300 mt-2">TokoPakEdi</span>
            </h1>
            
            <p className="text-white/90 text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
              Your premium online shopping destination. Quality products, amazing prices, and exceptional service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center group">
                <span>Start Shopping</span>
                <span className="ml-3 text-2xl group-hover:translate-x-2 transition-transform">🛒</span>
              </button>
              <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300">
                Explore Categories
              </button>
            </div>
          </div>
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <span className="text-white text-3xl">👇</span>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Browse our wide range of product categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center ${
                  activeCategory === category.name
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl scale-105'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800 shadow-lg hover:shadow-xl'
                }`}
              >
                <span className="text-4xl mb-4">{category.icon}</span>
                <span className="font-bold text-lg mb-2">{category.name}</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  activeCategory === category.name
                    ? 'bg-white/20'
                    : 'bg-gray-200'
                }`}>
                  {category.count} items
                </span>
              </button>
            ))}
          </div>
          
          {/* Active Category Indicator */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
              <span className="text-blue-600 font-bold mr-2">📁</span>
              <span className="text-gray-700">
                Showing products in: <span className="font-bold text-blue-600">{activeCategory}</span>
              </span>
              {activeCategory !== 'All' && (
                <button 
                  onClick={() => setActiveCategory('All')}
                  className="ml-4 text-sm text-gray-500 hover:text-blue-600"
                >
                  (Show All)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 text-lg mt-2">Our best-selling products this month</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-bold text-lg flex items-center group">
              View All Products
              <span className="ml-3 text-2xl group-hover:translate-x-2 transition-transform">➡️</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                {/* Product Image Area */}
                <div className="relative p-8 bg-gradient-to-br from-gray-50 to-white">
                  <div className="text-7xl text-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    {product.image}
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-4 py-1.5 rounded-full font-bold shadow-lg">
                        NEW
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm px-4 py-1.5 rounded-full font-bold shadow-lg animate-pulse">
                        🔥 BEST SELLER
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-4 py-1.5 rounded-full font-bold shadow-lg">
                        -{product.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    id={`wishlist-${product.id}`}
                    onClick={() => handleAddToWishlist(product.id)}
                    className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-2xl">❤️</span>
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-6">
                    <div className="flex text-2xl text-yellow-400">
                      {'★★★★★'.split('').map((star, i) => (
                        <span 
                          key={i} 
                          className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-3 text-gray-600 font-medium">{product.rating}/5</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                      {product.discount > 0 && (
                        <span className="ml-3 text-lg text-gray-500 line-through">
                          ${(parseFloat(product.price.replace('$', '')) * (1 + product.discount/100)).toFixed(0)}
                        </span>
                      )}
                    </div>
                    <button
                      id={`add-to-cart-${product.id}`}
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 flex items-center group/cart"
                    >
                      <span className="mr-3">🛒</span>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TokoPakEdi?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're committed to providing the best shopping experience for our customers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${stat.color} text-white text-3xl mb-6`}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-3">{stat.value}</div>
                <p className="text-gray-600 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: '🚚',
                title: 'Free & Fast Delivery',
                desc: 'Free shipping on orders above $50. Same-day delivery available in major cities.',
                color: 'from-blue-400 to-cyan-400'
              },
              {
                icon: '🔒',
                title: 'Secure Payment',
                desc: 'Your payments are protected with bank-level security and 256-bit encryption.',
                color: 'from-purple-400 to-pink-400'
              },
              {
                icon: '🎁',
                title: 'Easy Returns',
                desc: '30-day return policy. No questions asked. We make returns hassle-free.',
                color: 'from-green-400 to-emerald-400'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-r ${feature.color} text-white text-4xl mb-8`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl mb-6">
              ✉️
            </span>
            <h2 className="text-4xl font-bold text-white mb-6">Stay Updated</h2>
            <p className="text-gray-300 text-xl mb-10">
              Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special promotions!
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-8 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Subscribe Now
              </button>
            </form>
            
            <p className="text-gray-400 text-sm mt-6">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">📚</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">TokoPak<span className="text-yellow-300">Edi</span></h2>
                  <p className="text-gray-400 text-sm">Premium Online Store</p>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-4">
                © {new Date().getFullYear()} TokoPakEdi. All rights reserved.
              </p>
              <div className="flex justify-center md:justify-end space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">📘</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">📷</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">▶️</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Cart Button */}
      <button 
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
        onClick={() => alert('Opening cart...')}
      >
        <span className="text-2xl">🛒</span>
        {cartItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center animate-bounce">
            {cartItems}
          </span>
        )}
      </button>
    </div>
  );
};

export default Home;