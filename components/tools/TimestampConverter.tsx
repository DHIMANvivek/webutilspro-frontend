'use client';

import { useState } from 'react';

type ConversionMode = 'toTimestamp' | 'toDate';

export default function TimestampConverter() {
    const [mode, setMode] = useState<ConversionMode>('toTimestamp');
    const [dateInput, setDateInput] = useState('');
    const [timestampInput, setTimestampInput] = useState('');
    const [result, setResult] = useState('');
    const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));

    const convertToTimestamp = () => {
        try {
            const date = new Date(dateInput);
            if (isNaN(date.getTime())) {
                setResult('Invalid date format');
                return;
            }
            const timestamp = Math.floor(date.getTime() / 1000);
            setResult(timestamp.toString());
        } catch (e) {
            setResult('Error converting date');
        }
    };

    const convertToDate = () => {
        try {
            const timestamp = parseInt(timestampInput);
            if (isNaN(timestamp)) {
                setResult('Invalid timestamp');
                return;
            }
            const date = new Date(timestamp * 1000);
            setResult(date.toISOString());
        } catch (e) {
            setResult('Error converting timestamp');
        }
    };

    const handleConvert = () => {
        if (mode === 'toTimestamp') {
            convertToTimestamp();
        } else {
            convertToDate();
        }
    };

    const useNow = () => {
        const now = new Date();
        if (mode === 'toTimestamp') {
            setDateInput(now.toISOString().slice(0, 16));
        } else {
            setTimestampInput(Math.floor(now.getTime() / 1000).toString());
        }
    };

    const copyResult = () => {
        navigator.clipboard.writeText(result);
    };

    // Update current timestamp every second
    useState(() => {
        const interval = setInterval(() => {
            setCurrentTimestamp(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    });

    return (
        <div className="space-y-4">
            {/* Current Timestamp Display */}
            <div className="card bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="text-center">
                    <div className="text-sm opacity-90 mb-1">Current Unix Timestamp</div>
                    <div className="text-4xl font-bold font-mono">{currentTimestamp}</div>
                    <div className="text-sm opacity-75 mt-2">{new Date().toISOString()}</div>
                </div>
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Timestamp Converter</h2>

                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setMode('toTimestamp')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'toTimestamp'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Date → Timestamp
                        </button>
                        <button
                            onClick={() => setMode('toDate')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'toDate'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Timestamp → Date
                        </button>
                    </div>
                </div>

                {/* Input */}
                {mode === 'toTimestamp' ? (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="dateInput" className="block text-sm font-medium text-gray-700">
                                Date & Time
                            </label>
                            <button onClick={useNow} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                Use Now
                            </button>
                        </div>
                        <input
                            type="datetime-local"
                            id="dateInput"
                            value={dateInput}
                            onChange={(e) => setDateInput(e.target.value)}
                            className="input-field"
                        />
                    </div>
                ) : (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="timestampInput" className="block text-sm font-medium text-gray-700">
                                Unix Timestamp (seconds)
                            </label>
                            <button onClick={useNow} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                Use Now
                            </button>
                        </div>
                        <input
                            type="number"
                            id="timestampInput"
                            value={timestampInput}
                            onChange={(e) => setTimestampInput(e.target.value)}
                            className="input-field font-mono"
                            placeholder="1234567890"
                        />
                    </div>
                )}

                {/* Convert Button */}
                <button onClick={handleConvert} className="btn-primary w-full md:w-auto mb-4">
                    Convert
                </button>

                {/* Result */}
                {result && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Result</h3>
                            <button onClick={copyResult} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                📋 Copy
                            </button>
                        </div>
                        <div className="font-mono text-lg text-gray-900 break-all">{result}</div>

                        {/* Additional Info */}
                        {mode === 'toDate' && result !== 'Invalid timestamp' && result !== 'Error converting timestamp' && (
                            <div className="mt-4 pt-4 border-t border-green-200 text-sm text-gray-600 space-y-1">
                                <div><strong>UTC:</strong> {new Date(parseInt(timestampInput) * 1000).toUTCString()}</div>
                                <div><strong>Local:</strong> {new Date(parseInt(timestampInput) * 1000).toString()}</div>
                                <div><strong>ISO:</strong> {result}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">What is Unix Time?</h3>
                    <p className="text-gray-600">
                        Unix timestamp is the number of seconds since January 1, 1970, 00:00:00 UTC (the Unix epoch).
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Database timestamps</li>
                        <li>• API responses</li>
                        <li>• Log files</li>
                        <li>• Session management</li>
                    </ul>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Time Zones</h3>
                    <p className="text-gray-600">
                        Unix timestamps are always in UTC. Converting to local time depends on your timezone settings.
                    </p>
                </div>
            </div>
        </div>
    );
}
