import React, { useState } from 'react';
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
  const navigate = useNavigate();

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

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Add Product?',
      text: 'Are you sure you want to add this product?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Add Product',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          
          if (!token) {
            navigate('/login');
            return false;
          }

          // Prepare payload
          const payload = {
            name: formData.name,
            qty: parseInt(formData.qty),
            price: parseInt(formData.price),
            image: formData.image || '',
            description: formData.description
          };

          return await addProduct(payload, token);
        } catch (err) {
          Swal.showValidationMessage(
            `Failed: ${err.response?.data?.message || 'Please try again'}`
          );
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    if (result.isConfirmed) {
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product added successfully!',
        confirmButtonColor: '#4f46e5',
        timer: 1500,
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

  // Reset form
  const handleReset = () => {
    Swal.fire({
      title: 'Reset Form?',
      text: 'All entered data will be cleared.',
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
        Swal.fire({
          icon: 'success',
          title: 'Form Reset',
          text: 'Form has been cleared successfully',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#4f46e5',
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600 mt-2">Fill in the details to add a new product to your inventory</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="Enter product name"
                  />
                </div>
              </div>

              {/* Quantity and Price - Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      name="qty"
                      value={formData.qty}
                      onChange={handleChange}
                      min="1"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        Rp
                      </span>
                      <input
                        type="text"
                        name="price"
                        value={formatPriceDisplay(formData.price)}
                        onChange={handlePriceChange}
                        className="block w-full pl-3 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="Enter price"
                      />
                    </div>
                    {formData.price && (
                      <p className="text-sm text-gray-500 mt-2">
                        Actual value: Rp {parseInt(formData.price).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Image URL (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Image URL <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Leave empty if you don't have an image URL
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="Enter product description..."
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Preview Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Product Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{formData.name || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">{formData.qty || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">
                          {formData.price ? `Rp ${parseInt(formData.price).toLocaleString('id-ID')}` : 'Rp 0'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Image Preview</h4>
                    <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="h-full w-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div className={`text-center ${formData.image ? 'hidden' : 'block'}`}>
                        <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500 mt-2">No image preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-6 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 font-medium"
                  >
                    Reset Form
                  </button>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Form Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Tips for adding products</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use descriptive names that customers can easily understand</li>
                  <li>Set accurate quantities to maintain proper inventory management</li>
                  <li>Price should include any applicable taxes or fees</li>
                  <li>Add detailed descriptions to help customers make informed decisions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;