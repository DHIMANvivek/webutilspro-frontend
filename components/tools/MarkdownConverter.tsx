'use client';

import { useState } from 'react';
import { marked } from 'marked';

export default function MarkdownConverter() {
    const [markdown, setMarkdown] = useState('');
    const [html, setHtml] = useState('');
    const [showPreview, setShowPreview] = useState(true);

    const convertToHtml = () => {
        if (!markdown) {
            setHtml('');
            return;
        }

        try {
            const converted = marked(markdown, {
                breaks: true,
                gfm: true,
            });
            setHtml(converted as string);
        } catch (e) {
            console.error('Conversion error:', e);
        }
    };

    // Auto-convert as user types
    const handleMarkdownChange = (value: string) => {
        setMarkdown(value);
        try {
            const converted = marked(value, {
                breaks: true,
                gfm: true,
            });
            setHtml(converted as string);
        } catch (e) {
            console.error('Conversion error:', e);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(html);
    };

    const downloadHtml = () => {
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted from Markdown</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }
        code {
            background-color: #f6f8fa;
            border-radius: 3px;
            padding: 2px 6px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow: auto;
        }
        pre code {
            background-color: transparent;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #ddd;
            margin: 0;
            padding-left: 16px;
            color: #666;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        table th, table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        table th {
            background-color: #f6f8fa;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        img {
            max-width: 100%;
        }
    </style>
</head>
<body>
${html}
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const loadExample = () => {
        setMarkdown(`# Welcome to Markdown Converter

This is a **paragraph** with *italic* and **bold** text.

## Features

- Headings
- Lists (ordered and unordered)
- Code blocks
- Links and images
- And much more!

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Links and Images

[Visit our website](https://example.com)

> This is a blockquote with some helpful information.

Inline code: \`const x = 10;\`

---

That's it! Start writing your Markdown above.`);
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                        Convert Markdown to HTML
                    </h2>

                    <button
                        onClick={loadExample}
                        className="btn-secondary text-sm"
                    >
                        Load Example
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {/* Markdown Input */}
                    <div>
                        <label htmlFor="markdown" className="block text-sm font-medium text-gray-700 mb-2">
                            Markdown Input
                        </label>
                        <textarea
                            id="markdown"
                            value={markdown}
                            onChange={(e) => handleMarkdownChange(e.target.value)}
                            className="textarea-field font-mono text-sm"
                            placeholder="# Enter your Markdown here..."
                            rows={12}
                        />
                    </div>

                    {/* Preview/HTML Toggle */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Output</label>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${showPreview
                                            ? 'bg-white text-primary-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${!showPreview
                                            ? 'bg-white text-primary-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    HTML Code
                                </button>
                            </div>
                        </div>

                        {showPreview ? (
                            <div
                                className="border border-gray-300 rounded-lg p-6 bg-white min-h-80 prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: html || '<p class="text-gray-400">Preview will appear here...</p>' }}
                            />
                        ) : (
                            <textarea
                                value={html}
                                readOnly
                                className="textarea-field font-mono text-sm bg-gray-50"
                                placeholder="HTML output will appear here..."
                                rows={12}
                            />
                        )}
                    </div>
                </div>

                {html && (
                    <div className="flex gap-3 mt-6">
                        <button onClick={copyToClipboard} className="btn-secondary">
                            📋 Copy HTML
                        </button>
                        <button onClick={downloadHtml} className="btn-secondary">
                            ⬇️ Download HTML File
                        </button>
                    </div>
                )}
            </div>

            {/* Markdown Syntax Guide */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Markdown Syntax Quick Reference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Text Formatting</h4>
                        <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg">
                            <div><span className="text-gray-600">**bold text**</span></div>
                            <div><span className="text-gray-600">*italic text*</span></div>
                            <div><span className="text-gray-600">~~strikethrough~~</span></div>
                            <div><span className="text-gray-600">`inline code`</span></div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Headings</h4>
                        <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg">
                            <div><span className="text-gray-600"># Heading 1</span></div>
                            <div><span className="text-gray-600">## Heading 2</span></div>
                            <div><span className="text-gray-600">### Heading 3</span></div>
                            <div><span className="text-gray-600">#### Heading 4</span></div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Lists</h4>
                        <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg">
                            <div><span className="text-gray-600">- Unordered item</span></div>
                            <div><span className="text-gray-600">* Also unordered</span></div>
                            <div><span className="text-gray-600">1. Ordered item</span></div>
                            <div><span className="text-gray-600">2. Another item</span></div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Links & Images</h4>
                        <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg">
                            <div><span className="text-gray-600">[text](url)</span></div>
                            <div><span className="text-gray-600">![alt](image.jpg)</span></div>
                            <div><span className="text-gray-600">&gt; Blockquote</span></div>
                            <div><span className="text-gray-600">--- (horizontal rule)</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
