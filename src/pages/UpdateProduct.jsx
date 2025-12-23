import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateProduct, fetchAllProduct, updateProductImage } from '../services/productAPI';
import Swal from 'sweetalert2';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const productData = location.state?.product;
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        qty: '',
        price: '',
        image: '',
        description: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(!productData);
    const [error, setError] = useState('');
    const [imageUploading, setImageUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Fetch product data if not passed via state
    useEffect(() => {
        const fetchProductData = async () => {
            if (!productData && id) {
                try {
                    setIsLoadingProduct(true);
                    const token = localStorage.getItem('token');
                    if (!token) {
                        navigate('/login');
                        return;
                    }

                    const response = await fetchAllProduct(token);
                    const product = response.data?.find(p => p.id === parseInt(id));

                    if (product) {
                        setFormData({
                            name: product.name || '',
                            qty: product.qty?.toString() || '',
                            price: product.price?.toString() || '',
                            image: product.image || '',
                            description: product.description || ''
                        });
                        
                        // Set preview image if exists
                        if (product.image) {
                            setPreviewImage(product.image);
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Product Not Found',
                            text: 'The product you are trying to edit does not exist',
                            confirmButtonColor: '#4f46e5',
                        }).then(() => {
                            navigate('/products');
                        });
                    }
                } catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to load product data',
                        confirmButtonColor: '#4f46e5',
                    });
                    console.error('Error fetching product:', err);
                } finally {
                    setIsLoadingProduct(false);
                }
            } else if (productData) {
                setFormData({
                    name: productData.name || '',
                    qty: productData.qty?.toString() || '',
                    price: productData.price?.toString() || '',
                    image: productData.image || '',
                    description: productData.description || ''
                });
                
                // Set preview image if exists
                if (productData.image) {
                    setPreviewImage(productData.image);
                }
                
                setIsLoadingProduct(false);
            }
        };

        fetchProductData();
    }, [id, productData, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File Type',
                text: 'Please select a valid image file (JPEG, JPG, PNG, WebP)',
                confirmButtonColor: '#4f46e5',
            });
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
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

    // Handle image upload
    const handleImageUpload = async () => {
        if (!selectedImage) {
            Swal.fire({
                icon: 'warning',
                title: 'No Image Selected',
                text: 'Please select an image first',
                confirmButtonColor: '#4f46e5',
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Upload Image?',
            html: `
                <div class="text-left">
                    <p class="mb-2">Upload new image for this product?</p>
                    <div class="bg-gray-50 p-3 rounded-lg mt-3">
                        <p class="text-sm font-medium text-gray-700">File: <span class="font-bold">${selectedImage.name}</span></p>
                        <p class="text-sm font-medium text-gray-700 mt-1">Size: <span class="font-bold">${(selectedImage.size / 1024).toFixed(2)} KB</span></p>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Upload Image',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    setImageUploading(true);
                    setUploadProgress(0);
                    
                    const token = localStorage.getItem('token');
                    if (!token) {
                        navigate('/login');
                        return false;
                    }

                    // Simulate progress
                    const progressInterval = setInterval(() => {
                        setUploadProgress(prev => {
                            if (prev >= 90) {
                                clearInterval(progressInterval);
                                return 90;
                            }
                            return prev + 10;
                        });
                    }, 200);

                    // Upload image
                    const response = await updateProductImage(id, selectedImage, token);
                    
                    clearInterval(progressInterval);
                    setUploadProgress(100);
                    
                    // Update form data with new image URL
                    if (response.data?.image) {
                        setFormData(prev => ({
                            ...prev,
                            image: response.data.image
                        }));
                        setPreviewImage(response.data.image);
                    }
                    
                    // Clear selected image
                    setSelectedImage(null);
                    
                    return true;
                } catch (err) {
                    Swal.showValidationMessage(
                        `Upload Failed: ${err.response?.data?.message || 'Please try again'}`
                    );
                    return false;
                } finally {
                    setImageUploading(false);
                    setUploadProgress(0);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Image uploaded successfully!',
                confirmButtonColor: '#4f46e5',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
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
            title: 'Update Product?',
            html: `
                <div class="text-left">
                <p class="mb-2">Are you sure you want to update this product?</p>
                <div class="bg-gray-50 p-3 rounded-lg mt-3">
                    <p class="text-sm font-medium text-gray-700">Product ID: <span class="font-bold">${id}</span></p>
                    <p class="text-sm font-medium text-gray-700 mt-1">Product Name: <span class="font-bold">${formData.name}</span></p>
                </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Update Product',
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

                    // Prepare payload
                    const payload = {
                        name: formData.name,
                        qty: parseInt(formData.qty),
                        price: parseInt(formData.price),
                        image: formData.image || '',
                        description: formData.description
                    };

                    await updateProduct(id, payload, token);
                    navigate('/products');
                } catch (err) {
                    Swal.showValidationMessage(
                        `Failed: ${err.response?.data?.message || 'Please try again'}`
                    );
                    return false;
                } finally {
                    setLoading(false);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (result.isConfirmed) {
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Product updated successfully!',
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

    // Reset to original values
    const handleReset = () => {
        Swal.fire({
            title: 'Reset Changes?',
            text: 'All unsaved changes will be reverted to original values.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Reset',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed && productData) {
                setFormData({
                    name: productData.name || '',
                    qty: productData.qty?.toString() || '',
                    price: productData.price?.toString() || '',
                    image: productData.image || '',
                    description: productData.description || ''
                });
                
                // Reset image preview
                if (productData.image) {
                    setPreviewImage(productData.image);
                } else {
                    setPreviewImage('');
                }
                
                setSelectedImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                
                Swal.fire({
                    icon: 'success',
                    title: 'Changes Reset',
                    text: 'Form has been reset to original values',
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
            // Create a fake event object for handleImageSelect
            const fakeEvent = {
                target: {
                    files: [file]
                }
            };
            handleImageSelect(fakeEvent);
        }
    };

    if (isLoadingProduct) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Loading product data...</p>
                </div>
            </div>
        );
    }

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
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">Update Product</h1>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                                    ID: {id}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-2">Edit the details of your product</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

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
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Product Image
                                    <span className="text-gray-400 ml-1">(Optional)</span>
                                </label>
                                
                                <div className="space-y-4">
                                    {/* Image Preview */}
                                    {previewImage && (
                                        <div className="relative">
                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-3">Current Image:</p>
                                                <div className="flex items-start space-x-4">
                                                    <div className="relative">
                                                        <img
                                                            src={previewImage}
                                                            alt="Product preview"
                                                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                                                        />
                                                        {selectedImage && (
                                                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                                NEW
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-600">
                                                            {selectedImage ? 'New image selected' : 'Current product image'}
                                                        </p>
                                                        {selectedImage && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                File: {selectedImage.name} ({Math.round(selectedImage.size / 1024)} KB)
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Progress */}
                                    {imageUploading && (
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-blue-700">Uploading...</span>
                                                <span className="text-sm font-bold text-blue-700">{uploadProgress}%</span>
                                            </div>
                                            <div className="w-full bg-blue-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Area */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                                            selectedImage 
                                                ? 'border-yellow-400 bg-yellow-50' 
                                                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                                        }`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg, image/jpg, image/png, image/webp"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                            disabled={imageUploading || loading}
                                        />
                                        
                                        <div className="space-y-3">
                                            <div className="text-4xl text-gray-400">
                                                {selectedImage ? '📁' : '📤'}
                                            </div>
                                            <div>
                                                <p className="text-gray-700 font-medium">
                                                    {selectedImage ? 'Image selected' : 'Click to upload or drag & drop'}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    PNG, JPG, WebP up to 5MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        {selectedImage && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleImageUpload}
                                                    disabled={imageUploading || loading}
                                                    className={`px-4 py-2 rounded-lg font-medium text-sm ${
                                                        imageUploading
                                                            ? 'bg-green-400 cursor-not-allowed text-white'
                                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                                    }`}
                                                >
                                                    {imageUploading ? 'Uploading...' : 'Upload Image'}
                                                </button>
                                                
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    disabled={imageUploading || loading}
                                                    className="px-4 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg font-medium text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </>
                                        )}
                                        
                                        {previewImage && !selectedImage && (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={imageUploading || loading}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm"
                                            >
                                                Change Image
                                            </button>
                                        )}
                                    </div>
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
                                            disabled={loading}
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
                                                disabled={loading}
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
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    {formData.description.length}/1000 characters
                                </p>
                            </div>

                            {/* Changes Summary */}
                            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                                <h3 className="text-lg font-medium text-yellow-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Update Summary
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-yellow-700 mb-2">Current Values</h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-yellow-600">Name:</span>
                                                <span className="font-medium">{productData?.name || 'Loading...'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-yellow-600">Quantity:</span>
                                                <span className="font-medium">{productData?.qty || '0'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-yellow-600">Price:</span>
                                                <span className="font-medium">
                                                    {productData?.price ? `Rp ${productData.price.toLocaleString('id-ID')}` : 'Rp 0'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-yellow-600">Image:</span>
                                                <span className="font-medium">
                                                    {productData?.image ? '✅' : '❌'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-green-700 mb-2">New Values</h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-green-600">Name:</span>
                                                <span className="font-medium">{formData.name || 'Not set'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-600">Quantity:</span>
                                                <span className="font-medium">{formData.qty || '0'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-600">Price:</span>
                                                <span className="font-medium">
                                                    {formData.price ? `Rp ${parseInt(formData.price).toLocaleString('id-ID')}` : 'Rp 0'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-600">Image:</span>
                                                <span className="font-medium">
                                                    {previewImage || selectedImage ? '✅' : '❌'}
                                                </span>
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
                                        disabled={loading || imageUploading}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        disabled={loading || imageUploading || !productData}
                                        className="px-6 py-3 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition duration-200 font-medium"
                                    >
                                        Reset Changes
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || imageUploading}
                                    className={`px-6 py-3 rounded-lg font-medium text-white transition duration-200 flex items-center ${loading || imageUploading
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Update Product
                                        </>
                                    )}
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
                            <h3 className="text-sm font-medium text-blue-800">Tips for updating products</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Update pricing based on market conditions and costs</li>
                                    <li>Adjust quantities to reflect actual stock levels</li>
                                    <li>Keep descriptions accurate and up-to-date</li>
                                    <li>Use high-quality images to showcase your products</li>
                                    <li>Consider seasonal changes when updating product details</li>
                                    <li>For best results, use images with minimum 800x600 resolution</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;