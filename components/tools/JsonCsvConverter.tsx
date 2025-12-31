'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

type ConversionMode = 'json-to-csv' | 'csv-to-json';

export default function JsonCsvConverter() {
    const [mode, setMode] = useState<ConversionMode>('json-to-csv');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const jsonToCsv = (jsonString: string): string => {
        const data = JSON.parse(jsonString);
        let items = Array.isArray(data) ? data : [data];

        if (items.length === 0) return '';

        // Collect all unique keys from all objects for headers
        const allKeys = new Set<string>();
        items.forEach(item => {
            if (item && typeof item === 'object') {
                Object.keys(item).forEach(key => allKeys.add(key));
            }
        });
        const headers = Array.from(allKeys);

        const formatValue = (value: any): string => {
            if (value === null || value === undefined) return '';

            let stringValue = '';
            if (typeof value === 'object') {
                stringValue = JSON.stringify(value);
            } else {
                stringValue = String(value);
            }

            // Handle values with commas, quotes or newlines
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        const csvRows = [
            headers.join(','),
            ...items.map(row =>
                headers.map(header => formatValue(row[header])).join(',')
            ),
        ];

        return csvRows.join('\n');
    };

    const csvToJson = (csvString: string): string => {
        const parseCSV = (text: string): string[][] => {
            const result: string[][] = [];
            let row: string[] = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const nextChar = text[i + 1];

                if (char === '"') {
                    if (inQuotes && nextChar === '"') {
                        current += '"';
                        i++; // Skip next quote
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    row.push(current);
                    current = '';
                } else if (char === '\n' && !inQuotes) {
                    row.push(current);
                    result.push(row);
                    row = [];
                    current = '';
                } else if (char === '\r' && !inQuotes) {
                    // Ignore carriage return
                    if (nextChar === '\n') {
                        row.push(current);
                        result.push(row);
                        row = [];
                        current = '';
                        i++; // Skip newline
                    }
                } else {
                    current += char;
                }
            }
            if (row.length > 0 || current.length > 0) {
                row.push(current);
                result.push(row);
            }
            return result;
        };

        const allRows = parseCSV(csvString.trim());
        if (allRows.length < 1) {
            throw new Error('CSV is empty');
        }

        const headers = allRows[0];
        const data = allRows.slice(1).map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
                let val = row[index] || '';
                // Try to parse as Number
                if (val !== '' && !isNaN(Number(val)) && /^-?\d+(\.\d+)?$/.test(val)) {
                    obj[header] = Number(val);
                }
                // Try to parse as Boolean
                else if (val.toLowerCase() === 'true') {
                    obj[header] = true;
                } else if (val.toLowerCase() === 'false') {
                    obj[header] = false;
                }
                // Try to parse as null
                else if (val.toLowerCase() === 'null') {
                    obj[header] = null;
                }
                // Try to parse as JSON (for nested objects/arrays)
                else if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
                    try {
                        obj[header] = JSON.parse(val);
                    } catch (e) {
                        obj[header] = val; // Keep as string if parsing fails
                    }
                } else {
                    obj[header] = val;
                }
            });
            return obj;
        });

        return JSON.stringify(data, null, 2);
    };

    const convert = () => {
        if (!input.trim()) {
            setError('Please enter some data to convert');
            setOutput('');
            return;
        }

        try {
            let result: string;
            if (mode === 'json-to-csv') {
                result = jsonToCsv(input);
            } else {
                result = csvToJson(input);
            }
            setOutput(result);
            setError('');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Conversion failed';
            setError(msg);
            toast.error(msg);
            setOutput('');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard!');
    };

    const downloadFile = () => {
        const extension = mode === 'json-to-csv' ? 'csv' : 'json';
        const mimeType = mode === 'json-to-csv' ? 'text/csv' : 'application/json';
        const blob = new Blob([output], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const loadExample = () => {
        if (mode === 'json-to-csv') {
            setInput(JSON.stringify([
                { name: 'John Doe', email: 'john@example.com', age: 30, city: 'New York' },
                { name: 'Jane Smith', email: 'jane@example.com', age: 25, city: 'San Francisco' },
                { name: 'Bob Johnson', email: 'bob@example.com', age: 35, city: 'Chicago' }
            ], null, 2));
        } else {
            setInput(`name,email,age,city
John Doe,john@example.com,30,New York
Jane Smith,jane@example.com,25,San Francisco
Bob Johnson,bob@example.com,35,Chicago`);
        }
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                        Convert Your Data
                    </h2>

                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setMode('json-to-csv')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'json-to-csv'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            JSON → CSV
                        </button>
                        <button
                            onClick={() => setMode('csv-to-json')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'csv-to-json'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            CSV → JSON
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Input */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="input" className="block text-sm font-medium text-gray-700">
                                Input ({mode === 'json-to-csv' ? 'JSON' : 'CSV'})
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
                            placeholder={mode === 'json-to-csv'
                                ? 'Paste your JSON here...'
                                : 'Paste your CSV here...'}
                            rows={15}
                        />
                    </div>

                    {/* Output */}
                    <div>
                        <label htmlFor="output" className="block text-sm font-medium text-gray-700 mb-2">
                            Output ({mode === 'json-to-csv' ? 'CSV' : 'JSON'})
                        </label>
                        <textarea
                            id="output"
                            value={output}
                            readOnly
                            className="textarea-field font-mono text-sm bg-gray-50"
                            placeholder="Converted output will appear here..."
                            rows={15}
                        />

                        {output && (
                            <div className="flex gap-2 mt-3">
                                <button onClick={copyToClipboard} className="btn-secondary text-sm">
                                    📋 Copy
                                </button>
                                <button onClick={downloadFile} className="btn-secondary text-sm">
                                    ⬇️ Download
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Convert Button */}
                <div className="mt-6">
                    <button onClick={convert} className="btn-primary w-full md:w-auto">
                        Convert {mode === 'json-to-csv' ? 'to CSV' : 'to JSON'}
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        <strong>Error:</strong> {error}
                    </div>
                )}
            </div>

            {/* Format Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-blue-50 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">JSON Format Tips</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Must be valid JSON syntax</li>
                        <li>• Array of objects works best</li>
                        <li>• All objects should have the same keys</li>
                        <li>• Single object will create one-row CSV</li>
                    </ul>
                </div>

                <div className="card bg-green-50 border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">CSV Format Tips</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                        <li>• First row should be headers</li>
                        <li>• Comma-separated values</li>
                        <li>• Values with commas must be quoted</li>
                        <li>• Will create an array of JSON objects</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
