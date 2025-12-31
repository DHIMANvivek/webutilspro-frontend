'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

type Mode = 'encode' | 'decode';

export default function UrlTool() {
    const [mode, setMode] = useState<Mode>('encode');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleConvert = () => {
        if (!input.trim()) {
            setOutput('');
            return;
        }

        try {
            if (mode === 'encode') {
                setOutput(encodeURIComponent(input));
            } else {
                setOutput(decodeURIComponent(input));
            }
        } catch (e) {
            setOutput('Error: Invalid input for decoding');
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard!');
    };

    const loadExample = () => {
        const example = mode === 'encode'
            ? 'https://example.com/search?q=hello world&category=tech'
            : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26category%3Dtech';
        handleInputChange(example);
    };

    // Auto-convert on input change
    const handleInputChange = (value: string) => {
        setInput(value);
        if (value.trim()) {
            try {
                if (mode === 'encode') {
                    setOutput(encodeURIComponent(value));
                } else {
                    setOutput(decodeURIComponent(value));
                }
            } catch {
                setOutput('Error: Invalid input');
            }
        } else {
            setOutput('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                        URL Encoder/Decoder
                    </h2>

                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => {
                                setMode('encode');
                                setInput('');
                                setOutput('');
                            }}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'encode'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => {
                                setMode('decode');
                                setInput('');
                                setOutput('');
                            }}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'decode'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Decode
                        </button>
                    </div>
                </div>

                {/* Input */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="input" className="block text-sm font-medium text-gray-700">
                            {mode === 'encode' ? 'URL to Encode' : 'Encoded URL to Decode'}
                        </label>
                        <button
                            onClick={loadExample}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Load Example
                        </button>
                    </div>
                    <textarea
                        id="input"
                        value={input}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="textarea-field font-mono text-sm"
                        placeholder={mode === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL to decode...'}
                        rows={4}
                    />
                </div>

                {/* Output */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                            {mode === 'encode' ? 'Encoded URL' : 'Decoded URL'}
                        </label>
                        {output && (
                            <button onClick={copyOutput} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                📋 Copy
                            </button>
                        )}
                    </div>
                    <textarea
                        id="output"
                        value={output}
                        readOnly
                        className="textarea-field font-mono text-sm bg-gray-50"
                        placeholder="Result will appear here automatically..."
                        rows={4}
                    />
                </div>
            </div>

            {/* Character Reference */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Common URL Encoded Characters</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mono text-gray-900">(space)</span>
                        <span className="font-mono text-sm text-gray-600">%20</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mono text-gray-900">!</span>
                        <span className="font-mono text-sm text-gray-600">%21</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mono text-gray-900">#</span>
                        <span className="font-mono text-sm text-gray-600">%23</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mono text-gray-900">$</span>
                        <span className="font-mono text-sm text-gray-600">%24</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mono text-gray-900">&</span>
                        <span className="font-mono text-sm text-gray-600">%26</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mono text-gray-900">=</span>
                        <span className="font-mono text-sm text-gray-600">%3D</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mono text-gray-900">?</span>
                        <span className="font-mono text-sm text-gray-600">%3F</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mono text-gray-900">/</span>
                        <span className="font-mono text-sm text-gray-600">%2F</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
