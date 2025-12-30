'use client';

import { useState } from 'react';

interface WooAuthProps {
    onConnect: (storeUrl: string) => void;
}

export default function WooAuth({ onConnect }: WooAuthProps) {
    const [storeUrl, setStoreUrl] = useState('');
    const [consumerKey, setConsumerKey] = useState('');
    const [consumerSecret, setConsumerSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/woo/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for session cookies
                body: JSON.stringify({
                    storeUrl,
                    consumerKey,
                    consumerSecret,
                }),
            });

            const data = await response.json();

            if (data.success) {
                onConnect(storeUrl);
            } else {
                setError(data.message || data.error || 'Failed to connect');
            }
        } catch (err) {
            setError('Network error. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Connect Your WooCommerce Store</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="storeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                            Store URL
                        </label>
                        <input
                            type="url"
                            id="storeUrl"
                            value={storeUrl}
                            onChange={(e) => setStoreUrl(e.target.value)}
                            placeholder="https://yourstore.com"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="consumerKey" className="block text-sm font-medium text-gray-700 mb-2">
                            Consumer Key
                        </label>
                        <input
                            type="text"
                            id="consumerKey"
                            value={consumerKey}
                            onChange={(e) => setConsumerKey(e.target.value)}
                            placeholder="ck_xxxxxxxxxxxxx"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="consumerSecret" className="block text-sm font-medium text-gray-700 mb-2">
                            Consumer Secret
                        </label>
                        <input
                            type="password"
                            id="consumerSecret"
                            value={consumerSecret}
                            onChange={(e) => setConsumerSecret(e.target.value)}
                            placeholder="cs_xxxxxxxxxxxxx"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Connecting...' : 'Connect Store'}
                    </button>
                </form>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">🔒 Security Note:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Your credentials are encrypted and stored only in session memory</li>
                        <li>• Credentials are never saved to database</li>
                        <li>• Session expires after 30 minutes of inactivity</li>
                        <li>• You'll need to reconnect after closing the browser</li>
                    </ul>
                </div>

                <div className="mt-6 text-sm text-gray-600">
                    <p className="font-semibold mb-2">How to get your API keys:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Go to your WooCommerce store admin</li>
                        <li>Navigate to WooCommerce → Settings → Advanced → REST API</li>
                        <li>Click "Add key" and select "Read/Write" permissions</li>
                        <li>Copy the Consumer Key and Consumer Secret</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
