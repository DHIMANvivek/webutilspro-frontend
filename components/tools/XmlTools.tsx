'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';

export default function XmlTools() {
    const [mode, setMode] = useState<'format' | 'validate' | 'minify' | 'toJson'>('format');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [error, setError] = useState('');

    const formatXml = (xml: string) => {
        try {
            const parser = new XMLParser({
                ignoreAttributes: false,
            });
            const parsed = parser.parse(xml);

            const builder = new XMLBuilder({
                ignoreAttributes: false,
                format: true,
                indentBy: '  ',
                suppressEmptyNode: true,
            });

            return builder.build(parsed);
        } catch (e) {
            throw new Error('Invalid XML structure');
        }
    };

    const validateXml = (xml: string) => {
        const result = XMLValidator.validate(xml, {
            allowBooleanAttributes: true,
        });

        if (result === true) {
            return { valid: true, message: 'Valid XML!' };
        } else {
            return {
                valid: false,
                message: `Error at line ${result.err.line}: ${result.err.msg}`,
            };
        }
    };

    const minifyXml = (xml: string) => {
        try {
            const parser = new XMLParser({
                ignoreAttributes: false,
            });
            const parsed = parser.parse(xml);

            const builder = new XMLBuilder({
                ignoreAttributes: false,
                format: false,
                suppressEmptyNode: true,
            });

            return builder.build(parsed);
        } catch (e) {
            throw new Error('Invalid XML structure');
        }
    };

    const xmlToJson = (xml: string) => {
        try {
            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: '@_',
            });
            const parsed = parser.parse(xml);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            throw new Error('Invalid XML structure');
        }
    };

    const handleProcess = () => {
        if (!input.trim()) {
            toast.error('Please enter XML to process');
            setError('Please enter XML to process');
            setOutput('');
            setIsValid(null);
            return;
        }

        setError('');

        try {
            switch (mode) {
                case 'format':
                    setOutput(formatXml(input));
                    setIsValid(true);
                    toast.success('XML formatted successfully!');
                    break;
                case 'validate':
                    const validation = validateXml(input);
                    setIsValid(validation.valid);
                    setOutput(validation.message);
                    break;
                case 'minify':
                    setOutput(minifyXml(input));
                    setIsValid(true);
                    toast.success('XML minified successfully!');
                    break;
                case 'toJson':
                    setOutput(xmlToJson(input));
                    setIsValid(true);
                    toast.success('Converted to JSON successfully!');
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

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard!');
    };

    const loadExample = () => {
        setInput(`<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="cooking">
    <title lang="en">Everyday Italian</title>
    <author>Giada De Laurentiis</author>
    <year>2005</year>
    <price>30.00</price>
  </book>
  <book category="children">
    <title lang="en">Harry Potter</title>
    <author>J K. Rowling</author>
    <year>2005</year>
    <price>29.99</price>
  </book>
</bookstore>`);
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">XML Tools</h2>
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
                            { value: 'format', label: 'Format' },
                            { value: 'validate', label: 'Validate' },
                            { value: 'minify', label: 'Minify' },
                            { value: 'toJson', label: 'XML → JSON' },
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
                            XML Input
                        </label>
                        <textarea
                            id="input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="textarea-field font-mono text-sm"
                            placeholder="Paste your XML here..."
                            rows={14}
                        />
                    </div>

                    {/* Output */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                                {mode === 'validate' ? 'Validation Result' : 'Output'}
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
                        {mode === 'format' && '✨ Format XML'}
                        {mode === 'validate' && '✅ Validate XML'}
                        {mode === 'minify' && '⚡ Minify XML'}
                        {mode === 'toJson' && '🔄 Convert to JSON'}
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

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">What is XML?</h3>
                    <p className="text-gray-600">
                        XML (eXtensible Markup Language) is a markup language for storing and transporting data in a structured format.
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Web services (SOAP)</li>
                        <li>• Configuration files</li>
                        <li>• Data exchange</li>
                        <li>• Android layouts</li>
                    </ul>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">XML vs JSON</h3>
                    <p className="text-gray-600">
                        XML is more verbose but supports attributes and namespaces. JSON is simpler and more popular for web APIs.
                    </p>
                </div>
            </div>
        </div>
    );
}
