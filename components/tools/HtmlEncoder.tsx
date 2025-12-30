'use client';

import { useState } from 'react';

export default function HtmlEncoder() {
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
    };

    const reverseHtmlEntities: Record<string, string> = Object.fromEntries(
        Object.entries(htmlEntities).map(([k, v]) => [v, k])
    );

    const encodeHtml = (text: string) => {
        return text.replace(/[&<>"'\/]/g, (char) => htmlEntities[char] || char);
    };

    const decodeHtml = (text: string) => {
        let decoded = text;

        // Decode named entities
        Object.entries(reverseHtmlEntities).forEach(([entity, char]) => {
            decoded = decoded.replace(new RegExp(entity, 'g'), char);
        });

        // Decode numeric entities (&#123; and &#xAB;)
        decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
            return String.fromCharCode(parseInt(dec, 10));
        });
        decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });

        return decoded;
    };

    const stripHtmlTags = (text: string) => {
        return text.replace(/<[^>]*>/g, '');
    };

    const handleConvert = () => {
        if (!input.trim()) {
            setOutput('');
            return;
        }

        if (mode === 'encode') {
            setOutput(encodeHtml(input));
        } else {
            setOutput(decodeHtml(input));
        }
    };

    const handleStripTags = () => {
        if (!input.trim()) {
            setOutput('');
            return;
        }
        setOutput(stripHtmlTags(input));
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
    };

    const loadExample = () => {
        if (mode === 'encode') {
            setInput('<div class="container">Hello & "welcome" to the site!</div>');
        } else {
            setInput('&lt;div class=&quot;container&quot;&gt;Hello &amp; &quot;welcome&quot; to the site!&lt;/div&gt;');
        }
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">HTML Encoder/Decoder</h2>

                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => {
                                setMode('encode');
                                setInput('');
                                setOutput('');
                            }}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'encode'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => {
                                setMode('decode');
                                setInput('');
                                setOutput('');
                            }}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'decode'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Decode
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Input */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="input" className="block text-sm font-medium text-gray-700">
                                {mode === 'encode' ? 'HTML to Encode' : 'HTML Entities to Decode'}
                            </label>
                            <button
                                onClick={loadExample}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Load Example
                            </button>
                        </div>
                        <textarea
                            id="input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="textarea-field font-mono text-sm"
                            placeholder={
                                mode === 'encode'
                                    ? 'Enter HTML to encode...'
                                    : 'Enter HTML entities to decode...'
                            }
                            rows={12}
                        />
                    </div>

                    {/* Output */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                                {mode === 'encode' ? 'Encoded HTML Entities' : 'Decoded HTML'}
                            </label>
                            {output && (
                                <button
                                    onClick={copyOutput}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
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
                            rows={12}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                    <button onClick={handleConvert} className="btn-primary">
                        {mode === 'encode' ? 'Encode HTML' : 'Decode HTML'}
                    </button>
                    {mode === 'decode' && (
                        <button onClick={handleStripTags} className="btn-secondary">
                            Strip HTML Tags
                        </button>
                    )}
                </div>
            </div>

            {/* Common Entities Reference */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Common HTML Entities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <div className="font-semibold text-gray-900 mb-2">Basic</div>
                        <ul className="space-y-1 text-gray-600 font-mono">
                            <li>&amp; → &amp;amp;</li>
                            <li>&lt; → &amp;lt;</li>
                            <li>&gt; → &amp;gt;</li>
                            <li>&quot; → &amp;quot;</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 mb-2">Symbols</div>
                        <ul className="space-y-1 text-gray-600 font-mono">
                            <li>© → &amp;copy;</li>
                            <li>® → &amp;reg;</li>
                            <li>™ → &amp;trade;</li>
                            <li>€ → &amp;euro;</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 mb-2">Spaces</div>
                        <ul className="space-y-1 text-gray-600 font-mono">
                            <li>&nbsp; → &amp;nbsp;</li>
                            <li>­ → &amp;shy;</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 mb-2">Math</div>
                        <ul className="space-y-1 text-gray-600 font-mono">
                            <li>× → &amp;times;</li>
                            <li>÷ → &amp;divide;</li>
                            <li>± → &amp;plusmn;</li>
                            <li>° → &amp;deg;</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">What is HTML Encoding?</h3>
                    <p className="text-gray-600">
                        HTML encoding converts special characters to HTML entities to display them correctly and prevent XSS attacks.
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Security (prevent XSS)</li>
                        <li>• Display code examples</li>
                        <li>• Show special characters</li>
                        <li>• Data sanitization</li>
                    </ul>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Security Note</h3>
                    <p className="text-gray-600">
                        Always encode user input before displaying in HTML to prevent cross-site scripting (XSS) vulnerabilities.
                    </p>
                </div>
            </div>
        </div>
    );
}
