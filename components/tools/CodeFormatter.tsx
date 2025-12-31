'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import * as prettier from 'prettier/standalone';
import * as prettierPluginBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as prettierPluginHtml from 'prettier/plugins/html';
import * as prettierPluginCss from 'prettier/plugins/postcss';
import { format as formatSql } from 'sql-formatter';
import CustomSelect from '@/components/ui/CustomSelect';

type Language = 'javascript' | 'html' | 'css' | 'json' | 'sql';

const EXAMPLES = {
    javascript: `function hello(name){if(!name){return "Hello, World!";}else{return "Hello, "+name+"!";}}const obj={a:1,b:2,c:3};`,
    html: `<div class="container"><h1>Title</h1><p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div>`,
    css: `.container{max-width:1200px;margin:0 auto;padding:20px;}.header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(to right,#667eea,#764ba2);}`,
    json: `{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","country":"USA"},"hobbies":["reading","coding","travel"]}`,
    sql: `SELECT users.id,users.name,users.email,orders.total,orders.created_at FROM users INNER JOIN orders ON users.id=orders.user_id WHERE orders.total>100 AND users.status='active' ORDER BY orders.created_at DESC LIMIT 10;`
};

export default function CodeFormatter() {
    const [code, setCode] = useState('');
    const [formatted, setFormatted] = useState('');
    const [language, setLanguage] = useState<Language>('javascript');
    const [error, setError] = useState('');
    const [isFormatting, setIsFormatting] = useState(false);

    const languageOptions = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'json', label: 'JSON' },
        { value: 'sql', label: 'SQL' },
    ];

    // Prettier options
    const [tabWidth, setTabWidth] = useState(2);
    const [useTabs, setUseTabs] = useState(false);
    const [printWidth, setPrintWidth] = useState(80);
    const [semi, setSemi] = useState(true);
    const [singleQuote, setSingleQuote] = useState(false);

    const formatCode = async () => {
        if (!code.trim()) {
            toast.error('Please enter code to format');
            setError('Please enter code to format');
            setFormatted('');
            return;
        }

        setIsFormatting(true);
        setError('');

        try {
            let result = '';

            if (language === 'sql') {
                // Use sql-formatter for SQL
                result = formatSql(code, {
                    language: 'sql',
                    tabWidth,
                    keywordCase: 'upper',
                    linesBetweenQueries: 2,
                });
            } else {
                // Use Prettier for JS, HTML, CSS, JSON
                const parserMap = {
                    javascript: 'babel',
                    html: 'html',
                    css: 'css',
                    json: 'json',
                };

                result = await prettier.format(code, {
                    parser: parserMap[language],
                    plugins: [prettierPluginBabel, (prettierPluginEstree as any), prettierPluginHtml, prettierPluginCss],
                    tabWidth,
                    useTabs,
                    printWidth,
                    semi,
                    singleQuote,
                });
            }

            setFormatted(result);
            toast.success('Code formatted successfully!');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to format code');
            setFormatted('');
        } finally {
            setIsFormatting(false);
        }
    };

    const copyFormatted = () => {
        navigator.clipboard.writeText(formatted);
        toast.success('Copied to clipboard!');
    };

    const downloadFormatted = () => {
        const extensions = { javascript: 'js', html: 'html', css: 'css', json: 'json', sql: 'sql' };
        const blob = new Blob([formatted], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `formatted.${extensions[language]}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const loadExample = () => {
        setCode(EXAMPLES[language]);
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                        Professional Code Formatter
                    </h2>

                    {/* Language Selector */}
                    <div className="flex items-center space-x-3">
                        <CustomSelect
                            id="language"
                            label="Language:"
                            value={language}
                            onChange={(val) => setLanguage(val as Language)}
                            options={languageOptions}
                            className="w-48"
                        />
                    </div>
                </div>

                {/* Formatting Options */}
                {language !== 'sql' && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Formatting Options</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Tab Width</label>
                                <input
                                    type="number"
                                    min="2"
                                    max="8"
                                    value={tabWidth}
                                    onChange={(e) => setTabWidth(parseInt(e.target.value))}
                                    className="input-field text-sm w-20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Line Width</label>
                                <input
                                    type="number"
                                    min="40"
                                    max="120"
                                    value={printWidth}
                                    onChange={(e) => setPrintWidth(parseInt(e.target.value))}
                                    className="input-field text-sm w-20"
                                />
                            </div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={useTabs}
                                    onChange={(e) => setUseTabs(e.target.checked)}
                                    className="w-4 h-4 text-primary-600 rounded mr-2"
                                />
                                <span className="text-xs text-gray-700">Use Tabs</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={semi}
                                    onChange={(e) => setSemi(e.target.checked)}
                                    className="w-4 h-4 text-primary-600 rounded mr-2"
                                />
                                <span className="text-xs text-gray-700">Semicolons</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={singleQuote}
                                    onChange={(e) => setSingleQuote(e.target.checked)}
                                    className="w-4 h-4 text-primary-600 rounded mr-2"
                                />
                                <span className="text-xs text-gray-700">Single Quotes</span>
                            </label>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Input */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                Unformatted Code
                            </label>
                            <button
                                onClick={loadExample}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Load Example
                            </button>
                        </div>
                        <textarea
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="textarea-field font-mono text-sm"
                            placeholder={`Paste your ${language.toUpperCase()} code here...`}
                            rows={18}
                        />
                    </div>

                    {/* Output */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="formatted" className="block text-sm font-medium text-gray-700">
                                Formatted Code
                            </label>
                            {formatted && (
                                <div className="flex gap-2">
                                    <button onClick={copyFormatted} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                        📋 Copy
                                    </button>
                                    <button onClick={downloadFormatted} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                        ⬇️ Download
                                    </button>
                                </div>
                            )}
                        </div>
                        <textarea
                            id="formatted"
                            value={formatted}
                            readOnly
                            className="textarea-field font-mono text-sm bg-gray-50"
                            placeholder="Formatted code will appear here..."
                            rows={18}
                        />
                    </div>
                </div>

                {/* Format Button */}
                <div className="mt-6">
                    <button
                        onClick={formatCode}
                        className="btn-primary w-full md:w-auto"
                        disabled={isFormatting}
                    >
                        {isFormatting ? '⏳ Formatting...' : '✨ Format Code'}
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        <strong>Error:</strong> {error}
                    </div>
                )}
            </div>

            {/* Format Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">⚡ Powered by Prettier</h3>
                    <p className="text-gray-600">Industry-standard code formatter used by millions of developers worldwide.</p>
                </div>
                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">🎯 Consistent Style</h3>
                    <p className="text-gray-600">Ensures consistent code formatting across your entire team.</p>
                </div>
                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">🔒 100% Private</h3>
                    <p className="text-gray-600">All formatting happens in your browser. Your code never leaves your device.</p>
                </div>
            </div>
        </div>
    );
}
