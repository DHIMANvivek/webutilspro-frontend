'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface JsonError {
    line: number;
    message: string;
}

export default function JsonValidator() {
    const [input, setInput] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [formatted, setFormatted] = useState('');
    const [minified, setMinified] = useState('');
    const [errors, setErrors] = useState<JsonError[]>([]);
    const [stats, setStats] = useState({ size: 0, lines: 0, depth: 0 });

    const validateAndFormat = () => {
        if (!input.trim()) {
            setIsValid(null);
            setFormatted('');
            setMinified('');
            setErrors([]);
            return;
        }

        try {
            const parsed = JSON.parse(input);
            setIsValid(true);
            setErrors([]);

            // Format
            const formattedJson = JSON.stringify(parsed, null, 2);
            setFormatted(formattedJson);

            // Minify
            const minifiedJson = JSON.stringify(parsed);
            setMinified(minifiedJson);

            // Calculate stats
            const lines = formattedJson.split('\n').length;
            const size = new Blob([minifiedJson]).size;
            const depth = calculateDepth(parsed);
            setStats({ size, lines, depth });

        } catch (e) {
            setIsValid(false);
            setFormatted('');
            setMinified('');

            const msg = e instanceof Error ? e.message : 'Unknown error';
            toast.error(msg);

            if (e instanceof SyntaxError) {
                const errorMatch = e.message.match(/position (\d+)/);
                const position = errorMatch ? parseInt(errorMatch[1]) : 0;
                const line = input.substring(0, position).split('\n').length;

                setErrors([{
                    line,
                    message: msg
                }]);
            } else {
                setErrors([{
                    line: 0,
                    message: msg
                }]);
            }

            setStats({ size: 0, lines: 0, depth: 0 });
        }
    };

    const calculateDepth = (obj: any, currentDepth = 1): number => {
        if (typeof obj !== 'object' || obj === null) return currentDepth;

        let maxDepth = currentDepth;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const depth = calculateDepth(obj[key], currentDepth + 1);
                maxDepth = Math.max(maxDepth, depth);
            }
        }
        return maxDepth;
    };

    const copyFormatted = () => {
        navigator.clipboard.writeText(formatted);
        toast.success('Copied to clipboard!');
    };

    const copyMinified = () => {
        navigator.clipboard.writeText(minified);
        toast.success('Copied to clipboard!');
    };

    const loadExample = () => {
        setInput('{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","country":"USA"},"hobbies":["reading","coding","travel"]}');
    };

    const loadInvalidExample = () => {
        setInput('{"name":"John Doe","age":30,"email":"john@example.com",}'); // Trailing comma
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">JSON Validator & Formatter</h2>
                    <div className="flex gap-2">
                        <button onClick={loadExample} className="btn-secondary text-sm">
                            Valid Example
                        </button>
                        <button onClick={loadInvalidExample} className="btn-secondary text-sm">
                            Invalid Example
                        </button>
                    </div>
                </div>

                {/* Input */}
                <div className="mb-4">
                    <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                        JSON Input
                    </label>
                    <textarea
                        id="input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="textarea-field font-mono text-sm"
                        placeholder="Paste your JSON here..."
                        rows={12}
                    />
                </div>

                {/* Validate Button */}
                <button onClick={validateAndFormat} className="btn-primary w-full md:w-auto mb-4">
                    ✅ Validate & Format JSON
                </button>

                {/* Validation Result */}
                {isValid !== null && (
                    <div className={`p-4 rounded-lg border mb-6 ${isValid
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">{isValid ? '✅' : '❌'}</span>
                            <h3 className="text-lg font-semibold">
                                {isValid ? 'Valid JSON!' : 'Invalid JSON'}
                            </h3>
                        </div>

                        {!isValid && errors.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {errors.map((error, index) => (
                                    <div key={index} className="bg-red-100 p-3 rounded border border-red-300">
                                        <div className="font-semibold text-red-900">Line {error.line}:</div>
                                        <div className="text-red-800 text-sm">{error.message}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isValid && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-700">{stats.size} B</div>
                                    <div className="text-sm text-gray-600">Size (minified)</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-700">{stats.lines}</div>
                                    <div className="text-sm text-gray-600">Lines</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-700">{stats.depth}</div>
                                    <div className="text-sm text-gray-600">Max Depth</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Formatted Output */}
                {formatted && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Formatted JSON
                                </label>
                                <button onClick={copyFormatted} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                    📋 Copy
                                </button>
                            </div>
                            <textarea
                                value={formatted}
                                readOnly
                                className="textarea-field font-mono text-sm bg-gray-50"
                                rows={12}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Minified JSON
                                </label>
                                <button onClick={copyMinified} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                    📋 Copy
                                </button>
                            </div>
                            <textarea
                                value={minified}
                                readOnly
                                className="textarea-field font-mono text-sm bg-gray-50"
                                rows={12}
                            />
                            <div className="text-sm text-gray-500 mt-2">
                                Size reduction: {formatted && minified ?
                                    ((1 - minified.length / formatted.length) * 100).toFixed(1) : 0}%
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Common JSON Errors */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Common JSON Errors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="font-semibold text-gray-900 mb-2">❌ Invalid</div>
                        <ul className="space-y-1 text-gray-600 font-mono bg-gray-50 p-3 rounded">
                            <li>{'{ name: "John" }'} // Keys not quoted</li>
                            <li>{'{ "name": \'John\' }'} // Single quotes</li>
                            <li>{'{ "name": "John", }'} // Trailing comma</li>
                            <li>{'{ "age": 030 }'} // Leading zero</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 mb-2">✅ Valid</div>
                        <ul className="space-y-1 text-gray-600 font-mono bg-gray-50 p-3 rounded">
                            <li>{'{ "name": "John" }'} // Keys quoted</li>
                            <li>{'{ "name": "John" }'} // Double quotes</li>
                            <li>{'{ "name": "John" }'} // No trailing comma</li>
                            <li>{'{ "age": 30 }'} // No leading zero</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">What is JSON?</h3>
                    <p className="text-gray-600">
                        JSON (JavaScript Object Notation) is a lightweight data format used for exchanging data between servers and web applications.
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• API responses</li>
                        <li>• Configuration files</li>
                        <li>• Data storage</li>
                        <li>• Data exchange</li>
                    </ul>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Use double quotes</li>
                        <li>• No trailing commas</li>
                        <li>• Validate before use</li>
                        <li>• Minify for production</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
