'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function TextTools() {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        lines: 0,
        sentences: 0,
    });

    useEffect(() => {
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const lines = text === '' ? 0 : text.split('\n').length;
        const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

        setStats({ characters, charactersNoSpaces, words, lines, sentences });
    }, [text]);

    const convertToUpperCase = () => {
        setText(text.toUpperCase());
        toast.success('Converted to uppercase');
    };
    const convertToLowerCase = () => {
        setText(text.toLowerCase());
        toast.success('Converted to lowercase');
    };
    const convertToTitleCase = () => {
        setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
        toast.success('Converted to title case');
    };
    const convertToSentenceCase = () => {
        setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()));
        toast.success('Converted to sentence case');
    };
    const removeExtraSpaces = () => {
        setText(text.replace(/\s+/g, ' ').trim());
        toast.success('Extra spaces removed');
    };
    const removeAllSpaces = () => {
        setText(text.replace(/\s/g, ''));
        toast.success('All spaces removed');
    };
    const removeLineBreaks = () => {
        setText(text.replace(/\n/g, ' ').replace(/\s+/g, ' '));
        toast.success('Line breaks removed');
    };
    const copyText = () => {
        navigator.clipboard.writeText(text);
        toast.success('Text copied!');
    };
    const clearText = () => {
        setText('');
        toast.success('Text cleared');
    };

    return (
        <div className="space-y-4">
            {/* Text Input */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Text Input</h2>
                    <div className="flex gap-2">
                        <button onClick={copyText} className="btn-secondary text-sm" disabled={!text}>
                            📋 Copy
                        </button>
                        <button onClick={clearText} className="btn-secondary text-sm" disabled={!text}>
                            🗑️ Clear
                        </button>
                    </div>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="textarea-field"
                    placeholder="Type or paste your text here..."
                    rows={12}
                />
            </div>

            {/* Statistics */}
            <div className="card bg-blue-50 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Text Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-3xl font-bold text-primary-600">{stats.characters}</div>
                        <div className="text-sm text-gray-600 mt-1">Characters</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-3xl font-bold text-primary-600">{stats.charactersNoSpaces}</div>
                        <div className="text-sm text-gray-600 mt-1">No Spaces</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-3xl font-bold text-secondary-600">{stats.words}</div>
                        <div className="text-sm text-gray-600 mt-1">Words</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-3xl font-bold text-secondary-600">{stats.lines}</div>
                        <div className="text-sm text-gray-600 mt-1">Lines</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-3xl font-bold text-secondary-600">{stats.sentences}</div>
                        <div className="text-sm text-gray-600 mt-1">Sentences</div>
                    </div>
                </div>
            </div>

            {/* Case Conversion */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Case Conversion</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button onClick={convertToUpperCase} className="btn-secondary" disabled={!text}>
                        UPPER CASE
                    </button>
                    <button onClick={convertToLowerCase} className="btn-secondary" disabled={!text}>
                        lower case
                    </button>
                    <button onClick={convertToTitleCase} className="btn-secondary" disabled={!text}>
                        Title Case
                    </button>
                    <button onClick={convertToSentenceCase} className="btn-secondary" disabled={!text}>
                        Sentence case
                    </button>
                </div>
            </div>

            {/* Text Cleanup */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Text Cleanup</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button onClick={removeExtraSpaces} className="btn-secondary" disabled={!text}>
                        Remove Extra Spaces
                    </button>
                    <button onClick={removeAllSpaces} className="btn-secondary" disabled={!text}>
                        Remove All Spaces
                    </button>
                    <button onClick={removeLineBreaks} className="btn-secondary" disabled={!text}>
                        Remove Line Breaks
                    </button>
                </div>
            </div>

            {/* Tips */}
            <div className="card bg-green-50 border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Use Cases</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Check character limits for social media posts (Twitter: 280, SMS: 160)</li>
                    <li>• Count words for essays, articles, or blog posts</li>
                    <li>• Clean up messy text copied from PDFs or websites</li>
                    <li>• Convert text case for consistent formatting</li>
                </ul>
            </div>
        </div>
    );
}
