'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function UuidGenerator() {
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState(1);
    const [uppercase, setUppercase] = useState(false);
    const [removeDashes, setRemoveDashes] = useState(false);

    const generateUuids = () => {
        const newUuids = Array.from({ length: count }, () => {
            let uuid = uuidv4();
            if (uppercase) uuid = uuid.toUpperCase();
            if (removeDashes) uuid = uuid.replace(/-/g, '');
            return uuid;
        });
        setUuids(newUuids);
    };

    const copyAll = () => {
        navigator.clipboard.writeText(uuids.join('\n'));
    };

    const copyOne = (uuid: string) => {
        navigator.clipboard.writeText(uuid);
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">UUID/GUID Generator</h2>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
                            Number of UUIDs: {count}
                        </label>
                        <input
                            type="range"
                            id="count"
                            min="1"
                            max="100"
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1</span>
                            <span>100</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={uppercase}
                                onChange={(e) => setUppercase(e.target.checked)}
                                className="w-4 h-4 text-primary-600 rounded mr-2"
                            />
                            <span className="text-sm text-gray-700">Uppercase</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={removeDashes}
                                onChange={(e) => setRemoveDashes(e.target.checked)}
                                className="w-4 h-4 text-primary-600 rounded mr-2"
                            />
                            <span className="text-sm text-gray-700">Remove Dashes</span>
                        </label>
                    </div>
                </div>

                {/* Generate Button */}
                <button onClick={generateUuids} className="btn-primary w-full md:w-auto mb-4">
                    🔄 Generate UUID{count > 1 ? 's' : ''}
                </button>

                {/* Results */}
                {uuids.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Generated UUIDs</h3>
                            <button onClick={copyAll} className="btn-secondary text-sm">
                                📋 Copy All
                            </button>
                        </div>

                        <div className="space-y-2">
                            {uuids.map((uuid, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-white p-3 rounded border border-gray-200 hover:border-primary-300 transition-colors"
                                >
                                    <code className="font-mono text-sm text-gray-900">{uuid}</code>
                                    <button
                                        onClick={() => copyOne(uuid)}
                                        className="text-primary-600 hover:text-primary-700 text-sm ml-4"
                                    >
                                        Copy
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">What is a UUID?</h3>
                    <p className="text-gray-600">
                        A Universally Unique Identifier (UUID) is a 128-bit number used to identify information in computer systems.
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Database primary keys</li>
                        <li>• Session identifiers</li>
                        <li>• File names</li>
                        <li>• API request IDs</li>
                    </ul>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">UUID Version</h3>
                    <p className="text-gray-600">
                        This generator creates Version 4 UUIDs (random). They have a probability of collision of about 1 in 2^122.
                    </p>
                </div>
            </div>
        </div>
    );
}
