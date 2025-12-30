'use client';

import { useState } from 'react';
import yaml from 'js-yaml';

export default function YamlTools() {
    const [mode, setMode] = useState<'toJson' | 'fromJson' | 'validate' | 'format'>('toJson');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [error, setError] = useState('');

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
                    break;
                case 'format':
                    setOutput(formatYaml(input));
                    setIsValid(true);
                    break;
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Processing failed');
            setIsValid(false);
            setOutput('');
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
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
                        <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                            {mode === 'fromJson' ? 'JSON Input' : 'YAML Input'}
                        </label>
                        <textarea
                            id="input"
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

                {/* Validation Status */}
                {isValid !== null && mode === 'validate' && (
                    <div className={`mt-4 p-4 rounded-lg border ${isValid
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="flex items-center">
                            <span className="text-2xl mr-2">{isValid ? '✅' : '❌'}</span>
                            <span className={`font-semibold ${isValid ? 'text-green-900' : 'text-red-900'}`}>
                                {output}
                            </span>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        <strong>Error:</strong> {error}
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
