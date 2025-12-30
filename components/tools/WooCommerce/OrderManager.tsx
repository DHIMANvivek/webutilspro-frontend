'use client';

import { useState, useEffect } from 'react';

export default function OrderManager() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const fetchOrders = async (page = currentPage, itemsPerPage = perPage) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/woo/orders?per_page=${itemsPerPage}&page=${page}`, {
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                setOrders(data.data);

                // Get total from headers if available (passed from backend)
                const total = data.total || data.data.length;
                setTotalOrders(total);
                setTotalPages(Math.ceil(total / itemsPerPage));
            } else {
                setError(data.error || 'Failed to fetch orders');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage, perPage);
    }, [currentPage, perPage]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'completed': 'bg-green-100 text-green-800',
            'processing': 'bg-blue-100 text-blue-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'on-hold': 'bg-orange-100 text-orange-800',
            'cancelled': 'bg-red-100 text-red-800',
            'refunded': 'bg-gray-100 text-gray-800',
            'failed': 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading && orders.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading orders...</p>
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
                    <h2 className="text-2xl font-bold">Orders</h2>
                    {totalOrders > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            Showing {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, totalOrders)} of {totalOrders}
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
                        onClick={() => fetchOrders(currentPage, perPage)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No orders found</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order #{order.number}
                                            </h3>
                                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status)}`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="mt-3 space-y-1 text-sm">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Customer:</span>{' '}
                                                {order.billing?.first_name} {order.billing?.last_name}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Email:</span> {order.billing?.email}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Date:</span>{' '}
                                                {new Date(order.date_created).toLocaleDateString()}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Items:</span> {order.line_items?.length || 0}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                            ${order.total}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {order.currency}
                                        </div>
                                    </div>
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
