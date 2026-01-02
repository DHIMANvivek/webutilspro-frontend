'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, Globe, Copy, Check, ArrowRight } from 'lucide-react';

export default function TimestampConverterClient() {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [inputValue, setInputValue] = useState('');
    const [inputFormat, setInputFormat] = useState<'unix' | 'iso'>('unix');
    const [parsedDate, setParsedDate] = useState<Date | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Parse input when it changes
    useEffect(() => {
        if (!inputValue) {
            setParsedDate(null);
            return;
        }

        try {
            let date: Date;
            if (inputFormat === 'unix') {
                const timestamp = parseInt(inputValue);
                date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
            } else {
                date = new Date(inputValue);
            }

            if (!isNaN(date.getTime())) {
                setParsedDate(date);
            } else {
                setParsedDate(null);
            }
        } catch {
            setParsedDate(null);
        }
    }, [inputValue, inputFormat]);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatRelativeTime = (date: Date) => {
        const now = Date.now();
        const diff = now - date.getTime();
        const seconds = Math.floor(Math.abs(diff) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const future = diff < 0;
        const prefix = future ? 'in ' : '';
        const suffix = future ? '' : ' ago';

        if (seconds < 60) return `${prefix}${seconds} second${seconds !== 1 ? 's' : ''}${suffix}`;
        if (minutes < 60) return `${prefix}${minutes} minute${minutes !== 1 ? 's' : ''}${suffix}`;
        if (hours < 24) return `${prefix}${hours} hour${hours !== 1 ? 's' : ''}${suffix}`;
        return `${prefix}${days} day${days !== 1 ? 's' : ''}${suffix}`;
    };

    const useCurrentTime = () => {
        const unix = Math.floor(currentTime / 1000);
        setInputValue(unix.toString());
        setInputFormat('unix');
    };

    const displayDate = parsedDate || new Date(currentTime);
    const unixSeconds = Math.floor(displayDate.getTime() / 1000);
    const unixMillis = displayDate.getTime();

    return (
        <div className="container-custom py-8">
            {/* Current Time Display */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-6 h-6" />
                    <h2 className="text-xl font-black">Current Time</h2>
                </div>
                <div className="text-4xl font-black font-mono mb-2">
                    {new Date(currentTime).toLocaleTimeString()}
                </div>
                <div className="text-indigo-100 font-medium">
                    {new Date(currentTime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
                <button
                    onClick={useCurrentTime}
                    className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold text-sm transition-all"
                >
                    Use Current Time
                </button>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-indigo-600" />
                    Convert Timestamp
                </h3>
                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => setInputFormat('unix')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${inputFormat === 'unix'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Unix Timestamp
                    </button>
                    <button
                        onClick={() => setInputFormat('iso')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${inputFormat === 'iso'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        ISO 8601 / Date String
                    </button>
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={inputFormat === 'unix' ? '1609459200' : '2021-01-01T00:00:00Z'}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                />
            </div>

            {/* Output Formats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Unix Seconds */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-black text-gray-900">Unix (Seconds)</h4>
                        <button
                            onClick={() => copyToClipboard(unixSeconds.toString(), 'unix-sec')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {copied === 'unix-sec' ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <p className="font-mono text-lg text-indigo-600 font-bold">{unixSeconds}</p>
                </div>

                {/* Unix Milliseconds */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-black text-gray-900">Unix (Milliseconds)</h4>
                        <button
                            onClick={() => copyToClipboard(unixMillis.toString(), 'unix-ms')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {copied === 'unix-ms' ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <p className="font-mono text-lg text-indigo-600 font-bold">{unixMillis}</p>
                </div>

                {/* ISO 8601 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-black text-gray-900">ISO 8601</h4>
                        <button
                            onClick={() => copyToClipboard(displayDate.toISOString(), 'iso')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {copied === 'iso' ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <p className="font-mono text-sm text-indigo-600 font-bold break-all">
                        {displayDate.toISOString()}
                    </p>
                </div>

                {/* UTC String */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-black text-gray-900">UTC String</h4>
                        <button
                            onClick={() => copyToClipboard(displayDate.toUTCString(), 'utc')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {copied === 'utc' ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <p className="font-mono text-sm text-indigo-600 font-bold break-all">
                        {displayDate.toUTCString()}
                    </p>
                </div>

                {/* Local String */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-black text-gray-900">Local Time</h4>
                        <button
                            onClick={() => copyToClipboard(displayDate.toLocaleString(), 'local')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {copied === 'local' ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <p className="font-mono text-sm text-indigo-600 font-bold">
                        {displayDate.toLocaleString()}
                    </p>
                </div>

                {/* Relative Time */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-black text-gray-900">Relative Time</h4>
                        <Globe className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="font-mono text-lg text-indigo-600 font-bold">
                        {formatRelativeTime(displayDate)}
                    </p>
                </div>
            </div>
        </div>
    );
}
