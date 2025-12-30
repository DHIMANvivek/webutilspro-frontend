'use client';

import { useState, useEffect } from 'react';

export default function ProductManager() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const fetchProducts = async (page = currentPage, itemsPerPage = perPage) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/woo/products?per_page=${itemsPerPage}&page=${page}`, {
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                setProducts(data.data);

                // Get total from headers if available (passed from backend)
                const total = data.total || data.data.length;
                setTotalProducts(total);
                setTotalPages(Math.ceil(total / itemsPerPage));
            } else {
                setError(data.error || 'Failed to fetch products');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, perPage);
    }, [currentPage, perPage]);

    if (loading && products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Refresh and Info */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Products</h2>
                    {totalProducts > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            Showing {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, totalProducts)} of {totalProducts}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Show:</label>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    <button
                        onClick={() => fetchProducts(currentPage, perPage)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No products found</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">SKU: {product.sku || 'N/A'}</p>
                                        <div className="mt-3 flex items-center space-x-4">
                                            <span className="text-lg font-bold text-blue-600">
                                                ${product.price}
                                            </span>
                                            <span className={`px-3 py-1 text-xs rounded-full ${product.stock_status === 'instock'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.stock_status === 'instock' ? '✓ In Stock' : '✗ Out of Stock'}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                Stock: {product.stock_quantity || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    {product.images && product.images[0] && (
                                        <img
                                            src={product.images[0].src}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded-lg ml-4"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Previous
                            </button>

                            <div className="flex items-center gap-2">
                                {/* First page */}
                                {currentPage > 3 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentPage(1)}
                                            className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                        >
                                            1
                                        </button>
                                        {currentPage > 4 && <span className="text-gray-400">...</span>}
                                    </>
                                )}

                                {/* Page numbers around current page */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => page === currentPage || Math.abs(page - currentPage) === 1)
                                    .map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 rounded-lg ${page === currentPage
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                {/* Last page */}
                                {currentPage < totalPages - 2 && (
                                    <>
                                        {currentPage < totalPages - 3 && <span className="text-gray-400">...</span>}
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
