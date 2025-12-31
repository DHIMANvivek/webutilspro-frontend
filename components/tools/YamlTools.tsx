'use client';

import { useState, useRef } from 'react';
import yaml from 'js-yaml';
import toast from 'react-hot-toast';
import { Search, ChevronDown, ChevronUp, Wrench, Sparkles } from 'lucide-react';

export default function YamlTools() {
    const [mode, setMode] = useState<'toJson' | 'fromJson' | 'validate' | 'format'>('toJson');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ start: number; end: number }[]>([]);
    const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const yamlToJson = (yamlStr: string) => {
        try {
            const parsed = yaml.load(yamlStr);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            throw new Error('Invalid YAML syntax');
        }
    };

    const jsonToYaml = (jsonStr: string) => {
        try {
            const parsed = JSON.parse(jsonStr);
            return yaml.dump(parsed, {
                indent: 2,
                lineWidth: -1,
            });
        } catch (e) {
            throw new Error('Invalid JSON syntax');
        }
    };

    const validateYaml = (yamlStr: string) => {
        try {
            yaml.load(yamlStr);
            return { valid: true, message: 'Valid YAML!' };
        } catch (e) {
            return {
                valid: false,
                message: e instanceof Error ? e.message : 'Invalid YAML',
            };
        }
    };

    const formatYaml = (yamlStr: string) => {
        try {
            const parsed = yaml.load(yamlStr);
            return yaml.dump(parsed, {
                indent: 2,
                lineWidth: -1,
                noRefs: true,
            });
        } catch (e) {
            throw new Error('Invalid YAML syntax');
        }
    };

    const handleProcess = () => {
        if (!input.trim()) {
            setError('Please enter content to process');
            setOutput('');
            setIsValid(null);
            return;
        }

        setError('');

        try {
            switch (mode) {
                case 'toJson':
                    setOutput(yamlToJson(input));
                    setIsValid(true);
                    break;
                case 'fromJson':
                    setOutput(jsonToYaml(input));
                    setIsValid(true);
                    break;
                case 'validate':
                    const validation = validateYaml(input);
                    setIsValid(validation.valid);
                    setOutput(validation.message);
                    if (!validation.valid) {
                        setError(validation.message);
                    }
                    break;
                case 'format':
                    setOutput(formatYaml(input));
                    setIsValid(true);
                    break;
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Processing failed';
            setError(msg);
            toast.error(msg);
            setIsValid(false);
            setOutput('');
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query) {
            setSearchResults([]);
            setCurrentSearchIndex(-1);
            return;
        }

        const matches: { start: number; end: number }[] = [];
        let pos = 0;
        const lowerInput = input.toLowerCase();
        const lowerQuery = query.toLowerCase();

        while ((pos = lowerInput.indexOf(lowerQuery, pos)) !== -1) {
            matches.push({ start: pos, end: pos + query.length });
            pos += query.length;
        }

        setSearchResults(matches);
        setCurrentSearchIndex(matches.length > 0 ? 0 : -1);
    };

    const goToMatch = (index: number) => {
        if (searchResults.length === 0 || index < 0 || index >= searchResults.length) return;

        setCurrentSearchIndex(index);
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(searchResults[index].start, searchResults[index].end);

            // Sync scroll if needed
            const textarea = inputRef.current;
            const fullText = textarea.value;
            const matchStart = searchResults[index].start;

            // Simple heuristic to scroll the match into view if it's far down
            const linesBefore = fullText.substring(0, matchStart).split('\n').length;
            const lineHeight = 20; // approximate
            textarea.scrollTop = (linesBefore - 5) * lineHeight;
        }
    };

    const nextSearchResult = () => {
        const nextIndex = (currentSearchIndex + 1) % searchResults.length;
        goToMatch(nextIndex);
    };

    const prevSearchResult = () => {
        const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
        goToMatch(prevIndex);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchResults.length > 0) {
                if (currentSearchIndex === -1) {
                    goToMatch(0);
                } else {
                    nextSearchResult();
                }
            }
        }
    };

    const tryFixYaml = () => {
        try {
            let fixed = input;

            // 1. Convert tabs to 2 spaces
            fixed = fixed.replace(/\t/g, '  ');

            // 2. Add spaces after colons if missing (key:value -> key: value)
            // But don't break URLs
            fixed = fixed.replace(/(\w+):([^\s/])/g, '$1: $2');

            // 3. Fix common indentation errors (e.g., 1 space -> 2 spaces)
            const lines = fixed.split('\n');
            const fixedLines = lines.map(line => {
                const indentMatch = line.match(/^(\s+)/);
                if (indentMatch) {
                    const indent = indentMatch[1].length;
                    if (indent % 2 !== 0) {
                        return ' '.repeat(indent + 1) + line.trimStart();
                    }
                }
                return line;
            });
            fixed = fixedLines.join('\n');

            // 4. Try to re-format it properly
            const parsed = yaml.load(fixed);
            const beautified = yaml.dump(parsed, { indent: 2, lineWidth: -1 });

            setInput(beautified);
            setError('');
            setIsValid(true);
            setOutput('Valid YAML (Fixed and Re-formatted)!');
            toast.success('YAML repaired and formatted!');
        } catch (e) {
            // If automated fix fails, try just normalizing indentation
            try {
                const lines = input.split('\n');
                const fixed = lines.map(l => l.replace(/\t/g, '  ')).join('\n');
                setInput(fixed);
                toast.success('Converted tabs to spaces. Check if it\'s fixed.');
            } catch (innerE) {
                toast.error('Could not auto-fix. Please check indentation manually.');
            }
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard!');
    };

    const loadExample = () => {
        if (mode === 'fromJson') {
            setInput(`{
  "name": "My App",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`);
        } else {
            setInput(`name: My App
version: 1.0.0
dependencies:
  react: ^18.0.0
  next: ^14.0.0
scripts:
  dev: next dev
  build: next build`);
        }
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">YAML Tools</h2>
                    <button onClick={loadExample} className="btn-secondary text-sm">
                        Load Example
                    </button>
                </div>

                {/* Mode Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Operation
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                            { value: 'toJson', label: 'YAML → JSON' },
                            { value: 'fromJson', label: 'JSON → YAML' },
                            { value: 'validate', label: 'Validate YAML' },
                            { value: 'format', label: 'Format YAML' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setMode(option.value as any)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === option.value
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Input */}
                    <div>
                        <div className="flex flex-col mb-2">
                            <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                                {mode === 'fromJson' ? 'JSON Input' : 'YAML Input'}
                            </label>
                            <div className="relative mb-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    placeholder="Search in input (Enter to jump)..."
                                    className="block w-full pl-10 pr-24 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                                />
                                {searchResults.length > 0 && (
                                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                                        <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded mr-1">
                                            {currentSearchIndex === -1 ? 'Found' : `${currentSearchIndex + 1}/${searchResults.length}`}
                                        </span>
                                        <button onClick={prevSearchResult} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                            <ChevronUp className="h-3 w-3" />
                                        </button>
                                        <button onClick={nextSearchResult} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                            <ChevronDown className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <textarea
                            id="input"
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="textarea-field font-mono text-sm"
                            placeholder={`Paste your ${mode === 'fromJson' ? 'JSON' : 'YAML'} here...`}
                            rows={14}
                        />
                    </div>

                    {/* Output */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                                {mode === 'validate' ? 'Validation Result' :
                                    mode === 'toJson' ? 'JSON Output' :
                                        'YAML Output'}
                            </label>
                            {output && mode !== 'validate' && (
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
                            placeholder="Result will appear here..."
                            rows={14}
                        />
                    </div>
                </div>

                {/* Process Button */}
                <div className="mt-6">
                    <button onClick={handleProcess} className="btn-primary">
                        {mode === 'toJson' && '🔄 Convert to JSON'}
                        {mode === 'fromJson' && '🔄 Convert to YAML'}
                        {mode === 'validate' && '✅ Validate YAML'}
                        {mode === 'format' && '✨ Format YAML'}
                    </button>
                </div>

                {/* Error / Validation Status */}
                {(isValid !== null || error) && (
                    <div className={`mt-4 p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isValid === true && mode === 'validate'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">{isValid === true ? '✅' : '❌'}</span>
                            <div className="flex flex-col">
                                <span className={`font-semibold text-sm sm:text-base ${isValid === true ? 'text-green-900' : 'text-red-900'}`}>
                                    {error || output}
                                </span>
                                {isValid === false && (
                                    <span className="text-xs text-red-700 mt-1">
                                        Invalid YAML detected. Indentation is usually the culprit!
                                    </span>
                                )}
                            </div>
                        </div>
                        {isValid === false && (
                            <button
                                onClick={tryFixYaml}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold rounded-lg shadow-lg transition-all active:scale-95"
                            >
                                <Sparkles className="w-4 h-4" />
                                Want to fix it?
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* YAML Syntax Guide */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">YAML Syntax Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="font-semibold text-gray-900 mb-2">Key-Value Pairs</div>
                        <pre className="bg-gray-50 p-3 rounded font-mono text-xs">
                            {`key: value
name: John Doe
age: 30`}
                        </pre>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 mb-2">Lists</div>
                        <pre className="bg-gray-50 p-3 rounded font-mono text-xs">
                            {`fruits:
  - Apple
  - Banana
  - Orange`}
                        </pre>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 mb-2">Nested Objects</div>
                        <pre className="bg-gray-50 p-3 rounded font-mono text-xs">
                            {`person:
  name: John
  address:
    city: NYC`}
                        </pre>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 mb-2">Multiline Strings</div>
                        <pre className="bg-gray-50 p-3 rounded font-mono text-xs">
                            {`description: |
  This is a
  multiline string`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">What is YAML?</h3>
                    <p className="text-gray-600">
                        YAML (YAML Ain't Markup Language) is a human-readable data serialization format commonly used for configuration files.
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Docker Compose</li>
                        <li>• Kubernetes configs</li>
                        <li>• CI/CD pipelines</li>
                        <li>• Ansible playbooks</li>
                    </ul>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">YAML Tips</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Indentation is crucial</li>
                        <li>• Use 2 spaces (not tabs)</li>
                        <li>• Quotes are usually optional</li>
                        <li>• Case-sensitive</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
