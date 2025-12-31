'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface PromptOptimization {
    optimizedPrompt: string;
    improvements: {
        category: string;
        explanation: string;
    }[];
    tips: string[];
}

export default function PromptOptimizer() {
    const [prompt, setPrompt] = useState('');
    const [useCase, setUseCase] = useState('general');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PromptOptimization | null>(null);
    const [error, setError] = useState('');
    const [remaining, setRemaining] = useState<number | null>(null);
    const [isPlaceholder, setIsPlaceholder] = useState(false);

    const useCases = [
        { value: 'general', label: 'General' },
        { value: 'coding', label: 'Coding/Programming' },
        { value: 'writing', label: 'Content Writing' },
        { value: 'creative', label: 'Creative Writing' },
        { value: 'analysis', label: 'Data Analysis' },
        { value: 'brainstorming', label: 'Brainstorming' },
        { value: 'education', label: 'Education/Learning' },
    ];

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            toast.error('Please enter a prompt');
            setError('Please enter a prompt');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/optimize-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    useCase,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const msg = data.error || data.message || 'Failed to optimize prompt';
                setError(msg);
                toast.error(msg);
                return;
            }

            setResult(data.data);
            setRemaining(data.remaining);
            setIsPlaceholder(data.isPlaceholder || false);
            toast.success('Prompt optimized successfully!');
        } catch (err) {
            setError('Failed to connect to the server');
            toast.error('Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    const copyOptimized = () => {
        if (result) {
            navigator.clipboard.writeText(result.optimizedPrompt);
            toast.success('Optimized prompt copied!');
        }
    };

    const loadExample = () => {
        setPrompt('Write a function to sort an array');
        setUseCase('coding');
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Optimize Your AI Prompts
                </h2>

                {/* Use Case Selector */}
                <div className="mb-4">
                    <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-1">
                        Use Case
                    </label>
                    <select
                        id="useCase"
                        value={useCase}
                        onChange={(e) => setUseCase(e.target.value)}
                        className="input-field"
                    >
                        {useCases.map((uc) => (
                            <option key={uc.value} value={uc.value}>
                                {uc.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Prompt Input */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                            Your Original Prompt
                        </label>
                        <button
                            onClick={loadExample}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Load Example
                        </button>
                    </div>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="textarea-field"
                        placeholder="Enter the prompt you want to optimize..."
                        rows={6}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Optimizing...' : 'Optimize Prompt'}
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
                        ⚠️ This is a placeholder response. To get real AI-powered optimizations, configure an AI API key.
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
                    {/* Optimized Prompt */}
                    <div className="card bg-green-50 border-green-300">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900">Optimized Prompt</h3>
                            <button onClick={copyOptimized} className="btn-secondary text-sm">
                                📋 Copy
                            </button>
                        </div>
                        <div className="bg-white border border-green-200 rounded-lg p-4">
                            <p className="text-gray-800 whitespace-pre-wrap">{result.optimizedPrompt}</p>
                        </div>
                    </div>

                    {/* Improvements Made */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Improvements Made</h3>
                        <div className="space-y-4">
                            {result.improvements.map((improvement, index) => (
                                <div key={index} className="border-l-4 border-primary-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        {improvement.category}
                                    </h4>
                                    <p className="text-gray-700 text-sm">{improvement.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips for Better Prompts */}
                    <div className="card bg-blue-50 border-blue-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Tips for Better Prompts
                        </h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            {result.tips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
