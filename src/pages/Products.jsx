import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllProduct, deleteProduct, searchProduct } from '../services/productAPI';
import Swal from 'sweetalert2';

const Products = () => {
    console.log('Component rendered');
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(1);
    
    const navigate = useNavigate();

    // Format harga ke Rupiah (tidak perlu useCallback karena pure function)
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Format tanggal (tidak perlu useCallback karena pure function)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get current page data - useCallback dengan dependency products dan currentPage
    const getCurrentPageData = useCallback(() => {
        console.log('getCurrentPageData called');
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return products.slice(startIndex, endIndex);
    }, [products, currentPage, itemsPerPage]);

    // Calculate total pages
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Handle page change - useCallback dengan dependency kosong
    const handlePageChange = useCallback((pageNumber) => {
        console.log('Changing to page:', pageNumber);
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Handle next page - useCallback dengan dependency totalPages
    const nextPage = useCallback(() => {
        console.log('Next page clicked');
        setCurrentPage(currentPage => {
            if (currentPage < totalPages) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return currentPage + 1;
            }
            return currentPage;
        });
    }, [totalPages]);

    // Handle previous page - useCallback dengan dependency kosong
    const prevPage = useCallback(() => {
        console.log('Previous page clicked');
        setCurrentPage(currentPage => {
            if (currentPage > 1) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return currentPage - 1;
            }
            return currentPage;
        });
    }, []);

    // Fetch all products - useCallback dengan dependency navigate
    const loadAllProducts = useCallback(async () => {
        console.log('loadAllProducts called');
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetchAllProduct(token);
            console.log('Products fetched:', response);

            if (response && response.products) {
                setProducts(response.products);
                setError('');
            } else if (response && response.data) {
                setProducts(response.data);
                setError('');
            } else {
                setProducts([]);
                setError('No products found');
            }

        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Handle refresh - useCallback dengan dependency loadAllProducts
    const handleRefresh = useCallback(async () => {
        console.log('Refresh clicked');
        await loadAllProducts();
        setCurrentPage(1);
    }, [loadAllProducts]);

    // Handle search product - useCallback dengan dependency products, navigate, loadAllProducts
    const handleSearch = useCallback(async (searchQuery) => {
        console.log('Searching for:', searchQuery);
        if (!searchQuery.trim()) {
            loadAllProducts();
            setCurrentPage(1);
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
            console.log('Search response:', response);
            
            if (response && response.products) {
                if (response.products.length > 0) {
                    setProducts(response.products);
                    setCurrentPage(1);
                    setError('');
                } else {
                    setProducts([]);
                    setCurrentPage(1);
                    setError('No products found matching your search');
                }
            } else if (response && response.data && response.data.length > 0) {
                setProducts(response.data);
                setCurrentPage(1);
                setError('');
            } else {
                setProducts([]);
                setCurrentPage(1);
                setError('No products found matching your search');
            }
        } catch (err) {
            console.error('Error searching products:', err);
            // Client-side filtering sebagai fallback
            const filtered = products.filter(product =>
                product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setProducts(filtered);
            setCurrentPage(1);

            if (filtered.length === 0) {
                setError('No products found matching your search');
            }
        } finally {
            setSearchLoading(false);
        }
    }, [products, navigate, loadAllProducts]);

    // Debounce search input - useCallback dengan dependency handleSearch
    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        console.log('Search input changed:', value);
        setSearchTerm(value);

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            handleSearch(value);
        }, 500);

        setSearchTimeout(timeout);
    }, [handleSearch, searchTimeout]);

    // Clear search - useCallback dengan dependency loadAllProducts
    const handleClearSearch = useCallback(() => {
        console.log('Clear search clicked');
        setSearchTerm('');
        loadAllProducts();
        setCurrentPage(1);
    }, [loadAllProducts]);

    // Handle search button click - useCallback dengan dependency handleSearch, searchTerm
    const handleSearchButtonClick = useCallback(() => {
        console.log('Search button clicked');
        handleSearch(searchTerm);
    }, [handleSearch, searchTerm]);

    // Handle delete product - useCallback dengan dependency getCurrentPageData, currentPage
    const handleDelete = useCallback(async (product) => {
        console.log('Deleting product:', product.id);
        const result = await Swal.fire({
            title: `Delete "${product.name}"?`,
            text: `This action cannot be undone! Product ${product.name} will be permanently deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await deleteProduct(product.id, token);
                setProducts(prev => prev.filter(p => p.id !== product.id));
                
                // If current page becomes empty, go to previous page
                const currentPageData = getCurrentPageData();
                if (currentPageData.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }

                Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            } catch (err) {
                console.error('Delete error:', err);
                Swal.fire('Error!', 'Failed to delete product.', 'error');
            }
        }
    }, [getCurrentPageData, currentPage]);

    // Handle edit product - useCallback dengan dependency navigate
    const handleEdit = useCallback((product) => {
        console.log('Editing product:', product.id);
        navigate(`/updateProduct/${product.id}`, { state: { product } });
    }, [navigate]);

    // Handle add new product - useCallback dengan dependency navigate
    const handleAddProduct = useCallback(() => {
        console.log('Add product clicked');
        navigate('/addProduct');
    }, [navigate]);

    // Fetch initial products
    useEffect(() => {
        console.log('useEffect - loading initial products');
        loadAllProducts();

        return () => {
            console.log('Cleanup - clearing search timeout');
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [loadAllProducts]); // Tambahkan loadAllProducts sebagai dependency

    // Log pagination info
    useEffect(() => {
        console.log('Products length:', products.length);
        console.log('Total pages:', totalPages);
        console.log('Current page:', currentPage);
    }, [products.length, totalPages, currentPage]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading your products...</div>;
    }

    // Styles
    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '80px auto 0',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '20px'
        },
        title: {
            fontSize: '32px',
            marginBottom: '5px'
        },
        subtitle: {
            color: '#666',
            marginBottom: '10px'
        },
        addButton: {
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
        },
        statsContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },
        statCard: {
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
        },
        statTitle: {
            color: '#666',
            marginBottom: '10px',
            fontSize: '14px'
        },
        statValue: {
            fontSize: '28px',
            fontWeight: 'bold',
            margin: 0
        },
        searchSection: {
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '1px solid #dee2e6'
        },
        searchForm: {
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
        },
        searchInput: {
            flex: 1,
            padding: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '16px'
        },
        searchButton: {
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        refreshButton: {
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        errorMessage: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
        },
        emptyState: {
            textAlign: 'center',
            padding: '50px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
        },
        productGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },
        productCard: {
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white'
        },
        productHeader: {
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderBottom: '1px solid #dee2e6'
        },
        productName: {
            margin: '0 0 5px 0',
            fontSize: '18px'
        },
        productId: {
            color: '#6c757d',
            fontSize: '12px'
        },
        productBody: {
            padding: '15px'
        },
        productDescription: {
            color: '#666',
            fontSize: '14px',
            marginBottom: '15px'
        },
        productDetail: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '14px'
        },
        productLabel: {
            color: '#666'
        },
        productValue: {
            fontWeight: 'bold'
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            marginTop: '15px'
        },
        editButton: {
            flex: 1,
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            padding: '8px',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        deleteButton: {
            flex: 1,
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            marginTop: '30px',
            flexWrap: 'wrap'
        },
        pageButton: {
            padding: '8px 12px',
            border: '1px solid #dee2e6',
            backgroundColor: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
        },
        activePageButton: {
            padding: '8px 12px',
            border: '1px solid #007bff',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
        },
        disabledButton: {
            padding: '8px 12px',
            border: '1px solid #dee2e6',
            backgroundColor: '#e9ecef',
            color: '#6c757d',
            cursor: 'not-allowed',
            borderRadius: '4px'
        },
        pageInfo: {
            textAlign: 'center',
            marginTop: '15px',
            color: '#666',
            fontSize: '14px'
        },
        stockBadge: {
            backgroundColor: '#28a745',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px'
        },
        fab: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        },
        footer: {
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #dee2e6',
            textAlign: 'center',
            color: '#666'
        },
        searchInfo: {
            marginTop: '10px',
            color: '#666',
            fontSize: '14px'
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>My Products</h1>
                    <p style={styles.subtitle}>Manage your inventory</p>
                    <div>{products.length} products loaded</div>
                </div>
                <button style={styles.addButton} onClick={handleAddProduct}>
                    + Add New Product
                </button>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsContainer}>
                <div style={styles.statCard}>
                    <div style={styles.statTitle}>Total Products</div>
                    <div style={styles.statValue}>{products.length}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statTitle}>Total Stock</div>
                    <div style={styles.statValue}>
                        {products.reduce((sum, product) => sum + (product.qty || 0), 0)}
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statTitle}>Total Value</div>
                    <div style={styles.statValue}>
                        {formatPrice(products.reduce((sum, product) => sum + ((product.price || 0) * (product.qty || 0)), 0))}
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div style={styles.searchSection}>
                <div style={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Search products by name or description..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchButtonClick()}
                        style={styles.searchInput}
                    />
                    <button 
                        style={styles.searchButton} 
                        onClick={handleSearchButtonClick}
                        disabled={searchLoading}
                    >
                        {searchLoading ? 'Searching...' : 'Search'}
                    </button>
                    <button style={styles.refreshButton} onClick={handleRefresh}>
                        Refresh
                    </button>
                </div>
                {searchTerm && (
                    <div style={styles.searchInfo}>
                        Searching for: "{searchTerm}"
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}

            {/* Products Grid */}
            {searchLoading ? (
                <div style={styles.emptyState}>
                    <h3>Searching...</h3>
                    <p>Looking for products matching "{searchTerm}"</p>
                </div>
            ) : products.length === 0 ? (
                <div style={styles.emptyState}>
                    <h3>{searchTerm ? 'No products found' : 'Your store is empty'}</h3>
                    <p>
                        {searchTerm
                            ? `No products found matching "${searchTerm}". Try a different search term.`
                            : 'Start building your product catalog by adding your first product.'}
                    </p>
                    {searchTerm && (
                        <button style={styles.editButton} onClick={handleClearSearch}>
                            Clear Search
                        </button>
                    )}
                    {!searchTerm && (
                        <button style={styles.addButton} onClick={handleAddProduct}>
                            Add Your First Product
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Search Results Info */}
                    {searchTerm && (
                        <div style={{ ...styles.statCard, marginBottom: '20px' }}>
                            <h3>Search Results for "{searchTerm}"</h3>
                            <p>Found {products.length} product{products.length !== 1 ? 's' : ''}</p>
                            <button style={styles.editButton} onClick={handleClearSearch}>
                                Clear Search
                            </button>
                        </div>
                    )}

                    {/* Product Grid */}
                    <div style={styles.productGrid}>
                        {getCurrentPageData().map((product) => (
                            <div key={product.id} style={styles.productCard}>
                                <div style={styles.productHeader}>
                                    <h3 style={styles.productName}>{product.name}</h3>
                                    <div style={styles.productId}>ID: #{product.id}</div>
                                    <div style={{ marginTop: '8px' }}>
                                        <span style={styles.stockBadge}>{product.qty} in stock</span>
                                    </div>
                                </div>
                                <div style={styles.productBody}>
                                    <p style={styles.productDescription}>
                                        {product.description || 'No description available'}
                                    </p>
                                    <div style={styles.productDetail}>
                                        <span style={styles.productLabel}>Price:</span>
                                        <span style={styles.productValue}>{formatPrice(product.price)}</span>
                                    </div>
                                    <div style={styles.productDetail}>
                                        <span style={styles.productLabel}>Total Value:</span>
                                        <span style={styles.productValue}>{formatPrice(product.price * product.qty)}</span>
                                    </div>
                                    <div style={styles.productDetail}>
                                        <span style={styles.productLabel}>Added on:</span>
                                        <span>{formatDate(product.createdAt)}</span>
                                    </div>
                                    <div style={styles.buttonGroup}>
                                        <button style={styles.editButton} onClick={() => handleEdit(product)}>
                                            Edit
                                        </button>
                                        <button style={styles.deleteButton} onClick={() => handleDelete(product)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div>
                            <div style={styles.pagination}>
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    style={currentPage === 1 ? styles.disabledButton : styles.pageButton}
                                >
                                    Previous
                                </button>

                                {(() => {
                                    const pageNumbers = [];
                                    const maxVisible = 5;
                                    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                                    
                                    if (endPage - startPage + 1 < maxVisible) {
                                        startPage = Math.max(1, endPage - maxVisible + 1);
                                    }

                                    if (startPage > 1) {
                                        pageNumbers.push(
                                            <button key={1} onClick={() => handlePageChange(1)} style={styles.pageButton}>
                                                1
                                            </button>
                                        );
                                        if (startPage > 2) {
                                            pageNumbers.push(<span key="dots1" style={{ padding: '0 5px' }}>...</span>);
                                        }
                                    }

                                    for (let i = startPage; i <= endPage; i++) {
                                        pageNumbers.push(
                                            <button
                                                key={i}
                                                onClick={() => handlePageChange(i)}
                                                style={currentPage === i ? styles.activePageButton : styles.pageButton}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }

                                    if (endPage < totalPages) {
                                        if (endPage < totalPages - 1) {
                                            pageNumbers.push(<span key="dots2" style={{ padding: '0 5px' }}>...</span>);
                                        }
                                        pageNumbers.push(
                                            <button key={totalPages} onClick={() => handlePageChange(totalPages)} style={styles.pageButton}>
                                                {totalPages}
                                            </button>
                                        );
                                    }

                                    return pageNumbers;
                                })()}

                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    style={currentPage === totalPages ? styles.disabledButton : styles.pageButton}
                                >
                                    Next
                                </button>
                            </div>

                            <div style={styles.pageInfo}>
                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} products
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Footer */}
            <div style={styles.footer}>
                <p>Powered by TokoPakEdi</p>
                <p>Showing {products.length} products • Page {currentPage} of {totalPages}</p>
            </div>

            {/* Floating Action Button for Mobile */}
            <button 
                style={{ ...styles.fab, display: 'block' }}
                onClick={handleAddProduct}
            >
                +
            </button>
        </div>
    );
};

export default Products;