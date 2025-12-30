'use client';

import { useState } from 'react';

interface ErrorExplanation {
    explanation: string;
    possibleCauses: string[];
    solution: {
        steps: string[];
        codeExample?: string;
    };
    prevention: string[];
}

export default function AiErrorExplainer() {
    const [errorMessage, setErrorMessage] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ErrorExplanation | null>(null);
    const [error, setError] = useState('');
    const [remaining, setRemaining] = useState<number | null>(null);
    const [isPlaceholder, setIsPlaceholder] = useState(false);

    const languages = [
        'javascript',
        'python',
        'java',
        'csharp',
        'php',
        'ruby',
        'go',
        'rust',
        'typescript',
        'other',
    ];

    const handleSubmit = async () => {
        if (!errorMessage.trim()) {
            setError('Please enter an error message');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/ai-error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    errorMessage,
                    language,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || data.message || 'Failed to explain error');
                return;
            }

            setResult(data.data);
            setRemaining(data.remaining);
            setIsPlaceholder(data.isPlaceholder || false);
        } catch (err) {
            setError('Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    const loadExample = () => {
        setErrorMessage(`TypeError: Cannot read property 'map' of undefined
    at Array.forEach (<anonymous>)
    at processData (app.js:42:15)`);
        setLanguage('javascript');
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Get AI-Powered Error Explanations
                </h2>

                {/* Language Selector */}
                <div className="mb-4">
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                        Programming Language
                    </label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="input-field"
                    >
                        {languages.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Error Message Input */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="errorMessage" className="block text-sm font-medium text-gray-700">
                            Error Message or Stack Trace
                        </label>
                        <button
                            onClick={loadExample}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Load Example
                        </button>
                    </div>
                    <textarea
                        id="errorMessage"
                        value={errorMessage}
                        onChange={(e) => setErrorMessage(e.target.value)}
                        className="textarea-field font-mono text-sm"
                        placeholder="Paste your error message or stack trace here..."
                        rows={8}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Analyzing...' : 'Explain Error'}
                </button>

                {/* Usage Limit */}
                {remaining !== null && (
                    <div className="mt-4 text-sm text-gray-600">
                        Daily requests remaining: <strong>{remaining}/10</strong>
                    </div>
                )}

                {/* Placeholder Notice */}
                {isPlaceholder && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                        ⚠️ This is a placeholder response. To get real AI-powered explanations, configure an AI API key.
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        <strong>Error:</strong> {error}
                    </div>
                )}
            </div>

            {/* Results */}
            {result && (
                <div className="space-y-4">
                    {/* Explanation */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Explanation</h3>
                        <p className="text-gray-700">{result.explanation}</p>
                    </div>

                    {/* Possible Causes */}
                    <div className="card bg-blue-50 border-blue-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Possible Causes</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            {result.possibleCauses.map((cause, index) => (
                                <li key={index}>{cause}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Solution */}
                    <div className="card bg-green-50 border-green-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">How to Fix It</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                            {result.solution.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                        {result.solution.codeExample && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Code Example:</p>
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                    <code>{result.solution.codeExample}</code>
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Prevention */}
                    <div className="card bg-purple-50 border-purple-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Prevention Tips</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            {result.prevention.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
