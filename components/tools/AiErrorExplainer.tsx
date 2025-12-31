'use client';

import { useState, useRef, useEffect } from 'react';
import CustomSelect from '@/components/ui/CustomSelect';
import { Sparkles, AlertCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

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
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (result && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [result]);

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

    const languageOptions = languages.map(lang => ({
        value: lang,
        label: lang.charAt(0).toUpperCase() + lang.slice(1)
    }));

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

                <CustomSelect
                    id="language"
                    label="Programming Language"
                    value={language}
                    onChange={(val) => setLanguage(val)}
                    options={languageOptions}
                    className="mb-4"
                />

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
                <div className="space-y-4 animate-slide-up" ref={resultRef}>
                    {/* Explanation */}
                    <div className="card border-2 border-primary-100 bg-gradient-to-br from-primary-50 to-white shadow-lg shadow-primary-100/20">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-6 h-6 text-primary-600" />
                            <h3 className="text-xl font-bold text-gray-900">AI Explanation</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Possible Causes */}
                        <div className="card bg-amber-50 border-amber-200">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                <h3 className="text-lg font-bold text-gray-900">Possible Causes</h3>
                            </div>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                                {result.possibleCauses.map((cause, index) => (
                                    <li key={index}>{cause}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Prevention */}
                        <div className="card bg-purple-50 border-purple-200">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldCheck className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-bold text-gray-900">Prevention Tips</h3>
                            </div>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                                {result.prevention.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Solution */}
                    <div className="card border-2 border-green-100 bg-gradient-to-br from-green-50 to-white shadow-lg shadow-green-100/20">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                            <h3 className="text-xl font-bold text-gray-900">How to Fix It</h3>
                        </div>
                        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6 font-medium">
                            {result.solution.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                        {result.solution.codeExample && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> Fix Example
                                    </span>
                                </div>
                                <pre className="bg-gray-900 text-gray-100 p-6 overflow-x-auto font-mono text-sm leading-relaxed">
                                    <code>{result.solution.codeExample}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
