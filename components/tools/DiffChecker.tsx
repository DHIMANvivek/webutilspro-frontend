'use client';

import { useState } from 'react';
import { diffLines, diffWords, diffChars, Change } from 'diff';
import CustomSelect from '@/components/ui/CustomSelect';

type DiffMode = 'lines' | 'words' | 'characters';

export default function DiffChecker() {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [mode, setMode] = useState<DiffMode>('lines');
    const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
    const [ignoreCase, setIgnoreCase] = useState(false);
    const [differences, setDifferences] = useState<Change[]>([]);
    const [stats, setStats] = useState({ additions: 0, deletions: 0, unchanged: 0 });

    const modeOptions = [
        { value: 'lines', label: 'Line by Line' },
        { value: 'words', label: 'Word by Word' },
        { value: 'characters', label: 'Character by Character' },
    ];

    const comparTexts = () => {
        let processedText1 = text1;
        let processedText2 = text2;

        if (ignoreCase) {
            processedText1 = text1.toLowerCase();
            processedText2 = text2.toLowerCase();
        }

        if (ignoreWhitespace) {
            processedText1 = processedText1.replace(/\s+/g, ' ').trim();
            processedText2 = processedText2.replace(/\s+/g, ' ').trim();
        }

        let diff: Change[];
        switch (mode) {
            case 'characters':
                diff = diffChars(processedText1, processedText2);
                break;
            case 'words':
                diff = diffWords(processedText1, processedText2);
                break;
            default:
                diff = diffLines(processedText1, processedText2);
        }

        setDifferences(diff);

        // Calculate stats
        const additions = diff.filter(d => d.added).reduce((sum, d) => sum + (d.value.length || 0), 0);
        const deletions = diff.filter(d => d.removed).reduce((sum, d) => sum + (d.value.length || 0), 0);
        const unchanged = diff.filter(d => !d.added && !d.removed).reduce((sum, d) => sum + (d.value.length || 0), 0);

        setStats({ additions, deletions, unchanged });
    };

    const loadExample = () => {
        setText1('The quick brown fox jumps over the lazy dog.\nThis is the first version.\nSome text here.');
        setText2('The quick brown fox leaps over the lazy dog.\nThis is the second version.\nSome text here.\nNew line added.');
    };

    const clearAll = () => {
        setText1('');
        setText2('');
        setDifferences([]);
        setStats({ additions: 0, deletions: 0, unchanged: 0 });
    };

    const renderDiff = () => {
        if (differences.length === 0) return null;

        return (
            <div className="space-y-2">
                {differences.map((part, index) => (
                    <span
                        key={index}
                        className={`${part.added
                            ? 'bg-green-200 text-green-900'
                            : part.removed
                                ? 'bg-red-200 text-red-900 line-through'
                                : 'bg-gray-50 text-gray-700'
                            } px-1 rounded`}
                        style={{ whiteSpace: mode === 'lines' ? 'pre-wrap' : 'pre' }}
                    >
                        {part.value}
                    </span>
                ))}
            </div>
        );
    };

    const renderSideBySide = () => {
        if (differences.length === 0) return null;

        const leftParts: string[] = [];
        const rightParts: string[] = [];

        differences.forEach((part) => {
            if (part.removed) {
                leftParts.push(part.value);
            } else if (part.added) {
                rightParts.push(part.value);
            } else {
                leftParts.push(part.value);
                rightParts.push(part.value);
            }
        });

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-red-900 mb-2">Original</h4>
                    <div className="text-sm text-red-800 whitespace-pre-wrap font-mono">
                        {leftParts.join('')}
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-green-900 mb-2">Modified</h4>
                    <div className="text-sm text-green-800 whitespace-pre-wrap font-mono">
                        {rightParts.join('')}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Text Diff Checker</h2>
                    <div className="flex gap-2">
                        <button onClick={loadExample} className="btn-secondary text-sm">
                            Load Example
                        </button>
                        <button onClick={clearAll} className="btn-secondary text-sm">
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Options */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <CustomSelect
                                label="Comparison Mode"
                                value={mode}
                                onChange={(val) => setMode(val as DiffMode)}
                                options={modeOptions}
                            />
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={ignoreWhitespace}
                                    onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                                    className="w-4 h-4 text-primary-600 rounded mr-2"
                                />
                                <span className="text-sm text-gray-700">Ignore Whitespace</span>
                            </label>
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={ignoreCase}
                                    onChange={(e) => setIgnoreCase(e.target.checked)}
                                    className="w-4 h-4 text-primary-600 rounded mr-2"
                                />
                                <span className="text-sm text-gray-700">Ignore Case</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Input Texts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="text1" className="block text-sm font-medium text-gray-700 mb-2">
                            Original Text
                        </label>
                        <textarea
                            id="text1"
                            value={text1}
                            onChange={(e) => setText1(e.target.value)}
                            className="textarea-field font-mono text-sm"
                            placeholder="Paste your original text here..."
                            rows={12}
                        />
                    </div>

                    <div>
                        <label htmlFor="text2" className="block text-sm font-medium text-gray-700 mb-2">
                            Modified Text
                        </label>
                        <textarea
                            id="text2"
                            value={text2}
                            onChange={(e) => setText2(e.target.value)}
                            className="textarea-field font-mono text-sm"
                            placeholder="Paste your modified text here..."
                            rows={12}
                        />
                    </div>
                </div>

                {/* Compare Button */}
                <button onClick={comparTexts} className="btn-primary w-full md:w-auto mb-4">
                    🔍 Compare Texts
                </button>

                {/* Stats */}
                {differences.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-2xl font-bold text-green-600">{stats.additions}</div>
                            <div className="text-sm text-gray-600">Additions</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="text-2xl font-bold text-red-600">{stats.deletions}</div>
                            <div className="text-sm text-gray-600">Deletions</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-2xl font-bold text-gray-600">{stats.unchanged}</div>
                            <div className="text-sm text-gray-600">Unchanged</div>
                        </div>
                    </div>
                )}

                {/* Results - Unified View */}
                {differences.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Unified Diff View</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 font-mono text-sm overflow-x-auto">
                            {renderDiff()}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Side-by-Side View</h3>
                        {renderSideBySide()}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">What is a Diff Checker?</h3>
                    <p className="text-gray-600">
                        A diff checker compares two text files and highlights the differences, showing additions, deletions, and unchanged content.
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Code reviews</li>
                        <li>• Document comparison</li>
                        <li>• Version tracking</li>
                        <li>• Plagiarism detection</li>
                    </ul>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Color Legend</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li><span className="bg-green-200 px-1 rounded">Green</span> - Added text</li>
                        <li><span className="bg-red-200 px-1 rounded line-through">Red</span> - Removed text</li>
                        <li><span className="bg-gray-100 px-1 rounded">Gray</span> - Unchanged</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
