'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Match {
    match: string;
    index: number;
    groups: string[];
}

const QUICK_PATTERNS = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', desc: 'Basic email validation' },
    { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', desc: 'HTTP/HTTPS URLs' },
    { name: 'Phone (US)', pattern: '\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})', desc: 'US phone numbers' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', desc: 'ISO date format' },
    { name: 'IPv4', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', desc: 'IP addresses' },
    { name: 'Hex Color', pattern: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})', desc: 'Hex color codes' },
];

export default function RegexTester() {
    const [pattern, setPattern] = useState('');
    const [testString, setTestString] = useState('');
    const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
    const [matches, setMatches] = useState<Match[]>([]);
    const [error, setError] = useState('');
    const [replaceMode, setReplaceMode] = useState(false);
    const [replaceWith, setReplaceWith] = useState('');
    const [replaced, setReplaced] = useState('');

    useEffect(() => {
        if (!pattern || !testString) {
            setMatches([]);
            setError('');
            setReplaced('');
            return;
        }

        try {
            const flagString = Object.entries(flags)
                .filter(([, value]) => value)
                .map(([key]) => key)
                .join('');

            const regex = new RegExp(pattern, flagString);
            const matchList: Match[] = [];

            if (flags.g) {
                let match;
                while ((match = regex.exec(testString)) !== null) {
                    matchList.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1),
                    });
                    if (match.index === regex.lastIndex) regex.lastIndex++;
                }
            } else {
                const match = regex.exec(testString);
                if (match) {
                    matchList.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1),
                    });
                }
            }

            setMatches(matchList);
            setError('');

            // Handle replace
            if (replaceMode) {
                const replaceRegex = new RegExp(pattern, flagString);
                setReplaced(testString.replace(replaceRegex, replaceWith));
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid regular expression');
            setMatches([]);
            setReplaced('');
        }
    }, [pattern, testString, flags, replaceMode, replaceWith]);

    const highlightMatches = () => {
        if (!testString || matches.length === 0) return testString;

        let highlighted = '';
        let lastIndex = 0;

        matches.forEach((match, i) => {
            highlighted += testString.slice(lastIndex, match.index);
            highlighted += `<mark class="bg-yellow-200 text-gray-900 px-0.5 rounded">${match.match}</mark>`;
            lastIndex = match.index + match.match.length;
        });

        highlighted += testString.slice(lastIndex);
        return highlighted;
    };

    const loadQuickPattern = (quickPattern: string) => {
        setPattern(quickPattern);
    };

    const loadExample = () => {
        setPattern('\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b');
        setTestString('Contact us at support@example.com or sales@company.org for more info.');
        setFlags({ ...flags, i: true });
    };

    return (
        <div className="space-y-4">
            {/* Main Card */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Regular Expression Tester</h2>
                    <button onClick={loadExample} className="btn-secondary text-sm">
                        Load Example
                    </button>
                </div>

                {/* Regex Input */}
                <div className="mb-4">
                    <label htmlFor="pattern" className="block text-sm font-medium text-gray-700 mb-2">
                        Regular Expression
                    </label>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xl">/</span>
                        <input
                            id="pattern"
                            type="text"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            className="input-field flex-1 font-mono"
                            placeholder="Enter your regular expression..."
                        />
                        <span className="text-gray-500 text-xl">/</span>
                        <div className="flex gap-2">
                            {Object.entries(flags).map(([flag, checked]) => (
                                <label key={flag} className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => setFlags({ ...flags, [flag]: e.target.checked })}
                                        className="sr-only"
                                    />
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${checked ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                        {flag}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Flags: g=global, i=case-insensitive, m=multiline, s=dotAll
                    </p>
                </div>

                {/* Test String Input */}
                <div className="mb-4">
                    <label htmlFor="testString" className="block text-sm font-medium text-gray-700 mb-2">
                        Test String
                    </label>
                    <textarea
                        id="testString"
                        value={testString}
                        onChange={(e) => setTestString(e.target.value)}
                        className="textarea-field font-mono text-sm"
                        placeholder="Enter text to test against the regex..."
                        rows={6}
                    />
                </div>

                {/* Replace Mode */}
                <div className="mb-4">
                    <label className="flex items-center cursor-pointer mb-2">
                        <input
                            type="checkbox"
                            checked={replaceMode}
                            onChange={(e) => setReplaceMode(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Replace Mode</span>
                    </label>

                    {replaceMode && (
                        <div>
                            <input
                                type="text"
                                value={replaceWith}
                                onChange={(e) => setReplaceWith(e.target.value)}
                                className="input-field font-mono text-sm"
                                placeholder="Replacement text (use $1, $2 for capture groups)..."
                            />
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Matches */}
                {matches.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">
                                ✅ {matches.length} Match{matches.length !== 1 ? 'es' : ''} Found
                            </h3>
                        </div>

                        {/* Highlighted Text */}
                        <div className="bg-white p-4 rounded border border-green-100 mb-4 font-mono text-sm whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                        />

                        {/* Match Details */}
                        <div className="space-y-2">
                            {matches.map((match, index) => (
                                <div key={index} className="bg-white p-3 rounded border border-green-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-gray-600">Match {index + 1}</span>
                                        <span className="text-xs text-gray-500">Index: {match.index}</span>
                                    </div>
                                    <div className="font-mono text-sm text-gray-900 mb-2">
                                        &quot;{match.match}&quot;
                                    </div>
                                    {match.groups.length > 0 && (
                                        <div className="text-xs text-gray-600">
                                            <strong>Groups:</strong> {match.groups.map((g, i) => (
                                                <span key={i} className="ml-2">
                                                    ${i + 1}: &quot;{g || '(empty)'}&quot;
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Replace Result */}
                {replaceMode && replaced && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Replace Result</h3>
                        <div className="bg-white p-4 rounded border border-blue-100 font-mono text-sm whitespace-pre-wrap">
                            {replaced}
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(replaced);
                                toast.success('Replaced text copied!');
                            }}
                            className="btn-secondary text-sm mt-3"
                        >
                            📋 Copy Result
                        </button>
                    </div>
                )}

                {!error && matches.length === 0 && pattern && testString && (
                    <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg">
                        No matches found
                    </div>
                )}
            </div>

            {/* Quick Reference */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Regex Patterns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {QUICK_PATTERNS.map((qp, index) => (
                        <div
                            key={index}
                            onClick={() => loadQuickPattern(qp.pattern)}
                            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer border border-gray-200 transition-colors"
                        >
                            <div className="font-semibold text-gray-900 mb-1">{qp.name}</div>
                            <div className="font-mono text-xs text-gray-600 mb-1 break-all">{qp.pattern}</div>
                            <div className="text-xs text-gray-500">{qp.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cheat Sheet */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Regex Cheat Sheet</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Character Classes</h4>
                        <ul className="space-y-1 text-gray-600">
                            <li><code className="bg-gray-100 px-1 rounded">\d</code> - Digit</li>
                            <li><code className="bg-gray-100 px-1 rounded">\w</code> - Word character</li>
                            <li><code className="bg-gray-100 px-1 rounded">\s</code> - Whitespace</li>
                            <li><code className="bg-gray-100 px-1 rounded">.</code> - Any character</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Quantifiers</h4>
                        <ul className="space-y-1 text-gray-600">
                            <li><code className="bg-gray-100 px-1 rounded">*</code> - 0 or more</li>
                            <li><code className="bg-gray-100 px-1 rounded">+</code> - 1 or more</li>
                            <li><code className="bg-gray-100 px-1 rounded">?</code> - 0 or 1</li>
                            <li><code className="bg-gray-100 px-1 rounded">{`{n,m}`}</code> - Between n and m</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Anchors</h4>
                        <ul className="space-y-1 text-gray-600">
                            <li><code className="bg-gray-100 px-1 rounded">^</code> - Start of string</li>
                            <li><code className="bg-gray-100 px-1 rounded">$</code> - End of string</li>
                            <li><code className="bg-gray-100 px-1 rounded">\b</code> - Word boundary</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
