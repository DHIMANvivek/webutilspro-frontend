'use client';

import { useState } from 'react';
import WooAuth from '@/components/tools/WooCommerce/WooAuth';
import ProductManager from '@/components/tools/WooCommerce/ProductManager';
import OrderManager from '@/components/tools/WooCommerce/OrderManager';
import ChatInterface from '@/components/tools/WooCommerce/ChatInterface';

export default function WooCommerceClient() {
    const [isConnected, setIsConnected] = useState(false);
    const [storeUrl, setStoreUrl] = useState('');
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'chat'>('products');

    const handleConnect = (url: string) => {
        setIsConnected(true);
        setStoreUrl(url);
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        setStoreUrl('');
    };

    return (
        <div className="py-4">
            {!isConnected ? (
                <WooAuth onConnect={handleConnect} />
            ) : (
                <div className="space-y-6">
                    {/* Connection Status */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <p className="text-green-800 font-medium">✅ Connected to Store</p>
                            <p className="text-green-600 text-sm">{storeUrl}</p>
                        </div>
                        <button
                            onClick={handleDisconnect}
                            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Disconnect
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                📦 Products
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                🛍️ Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'chat'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                🤖 AI Chat
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === 'products' && <ProductManager />}
                        {activeTab === 'orders' && <OrderManager />}
                        {activeTab === 'chat' && <ChatInterface />}
                    </div>
                </div>
            )}
        </div>
    );
}
