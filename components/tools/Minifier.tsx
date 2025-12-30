'use client';

import { useState } from 'react';

type MinifyType = 'javascript' | 'css' | 'html';

export default function Minifier() {
    const [type, setType] = useState<MinifyType>('javascript');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ original: 0, minified: 0, reduction: 0 });

    const minifyJavaScript = async (code: string) => {
        try {
            // Client-side minification using basic techniques
            // For production, you'd use terser in a server API route
            let minified = code
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
                .replace(/\/\/.*/g, '') // Remove single-line comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .replace(/\s*([{}();,:])\s*/g, '$1') // Remove spaces around punctuation
                .trim();

            return minified;
        } catch (e) {
            throw new Error('JavaScript minification failed');
        }
    };

    const minifyCSS = (code: string) => {
        try {
            let minified = code
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around punctuation
                .replace(/;\}/g, '}') // Remove last semicolon in block
                .trim();

            return minified;
        } catch (e) {
            throw new Error('CSS minification failed');
        }
    };

    const minifyHTML = (code: string) => {
        try {
            let minified = code
                .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .replace(/>\s+</g, '><') // Remove spaces between tags
                .trim();

            return minified;
        } catch (e) {
            throw new Error('HTML minification failed');
        }
    };

    const handleMinify = async () => {
        if (!input.trim()) {
            setError('Please enter code to minify');
            setOutput('');
            return;
        }

        setError('');

        try {
            let minified = '';

            switch (type) {
                case 'javascript':
                    minified = await minifyJavaScript(input);
                    break;
                case 'css':
                    minified = minifyCSS(input);
                    break;
                case 'html':
                    minified = minifyHTML(input);
                    break;
            }

            setOutput(minified);

            const originalSize = new Blob([input]).size;
            const minifiedSize = new Blob([minified]).size;
            const reduction = ((1 - minifiedSize / originalSize) * 100);

            setStats({
                original: originalSize,
                minified: minifiedSize,
                reduction: reduction,
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Minification failed');
            setOutput('');
        }
    };

    const beautify = () => {
        // Basic beautification
        let beautified = input;

        if (type === 'javascript') {
            beautified = input
                .replace(/\{/g, ' {\n  ')
                .replace(/\}/g, '\n}\n')
                .replace(/;/g, ';\n')
                .replace(/,/g, ', ')
                .split('\n')
                .map(line => line.trim())
                .filter(line => line)
                .join('\n');
        } else if (type === 'css') {
            beautified = input
                .replace(/\{/g, ' {\n  ')
                .replace(/\}/g, '\n}\n')
                .replace(/;/g, ';\n  ')
                .split('\n')
                .map(line => line.trim())
                .filter(line => line)
                .join('\n');
        } else if (type === 'html') {
            beautified = input
                .replace(/></g, '>\n<')
                .split('\n')
                .map(line => line.trim())
                .join('\n');
        }

        setOutput(beautified);
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
    };

    const downloadOutput = () => {
        const extensions = { javascript: 'js', css: 'css', html: 'html' };
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `minified.${extensions[type]}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const loadExample = () => {
        const examples = {
            javascript: `function greet(name) {
  // This is a comment
  const message = "Hello, " + name + "!";
  console.log(message);
  return message;
}

greet("World");`,
            css: `/* Main styles */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}`,
            html: `<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <!-- Main content -->
    <div class="container">
      <h1>Hello World</h1>
    </div>
  </body>
</html>`,
        };

        setInput(examples[type]);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Code Minifier</h2>
                    <button onClick={loadExample} className="btn-secondary text-sm">
                        Load Example
                    </button>
                </div>

                {/* Type Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code Type
                    </label>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {(['javascript', 'css', 'html'] as MinifyType[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors capitalize ${type === t
                                        ? 'bg-white text-primary-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Input */}
                    <div>
                        <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                            Original Code
                        </label>
                        <textarea
                            id="input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="textarea-field font-mono text-sm"
                            placeholder={`Enter your ${type} code here...`}
                            rows={14}
                        />
                    </div>

                    {/* Output */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                                Minified Code
                            </label>
                            {output && (
                                <div className="flex gap-2">
                                    <button onClick={copyOutput} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                        📋 Copy
                                    </button>
                                    <button onClick={downloadOutput} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                        ⬇️ Download
                                    </button>
                                </div>
                            )}
                        </div>
                        <textarea
                            id="output"
                            value={output}
                            readOnly
                            className="textarea-field font-mono text-sm bg-gray-50"
                            placeholder="Minified code will appear here..."
                            rows={14}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                    <button onClick={handleMinify} className="btn-primary">
                        ⚡ Minify Code
                    </button>
                    <button onClick={beautify} className="btn-secondary">
                        ✨ Beautify
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Stats */}
                {output && !error && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">{formatBytes(stats.original)}</div>
                            <div className="text-sm text-gray-600">Original</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-2xl font-bold text-green-600">{formatBytes(stats.minified)}</div>
                            <div className="text-sm text-gray-600">Minified</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-2xl font-bold text-purple-600">{stats.reduction.toFixed(1)}%</div>
                            <div className="text-sm text-gray-600">Reduction</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">What is Minification?</h3>
                    <p className="text-gray-600">
                        Minification removes unnecessary characters (whitespace, comments, newlines) to reduce file size without changing functionality.
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Faster page load times</li>
                        <li>• Reduced bandwidth usage</li>
                        <li>• Improved SEO</li>
                        <li>• Better performance</li>
                    </ul>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
                    <p className="text-gray-600">
                        Always keep original source files. Use minified versions only for production deployment.
                    </p>
                </div>
            </div>
        </div>
    );
}
