'use client';

import { useState } from 'react';

type ConversionMode = 'json-to-csv' | 'csv-to-json';

export default function JsonCsvConverter() {
    const [mode, setMode] = useState<ConversionMode>('json-to-csv');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const jsonToCsv = (jsonString: string): string => {
        const data = JSON.parse(jsonString);

        // Handle array of objects
        if (Array.isArray(data) && data.length > 0) {
            const headers = Object.keys(data[0]);
            const csvRows = [
                headers.join(','),
                ...data.map(row =>
                    headers.map(header => {
                        const value = row[header];
                        // Handle values with commas or quotes
                        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                            return `"${value.replace(/"/g, '""')}"`;
                        }
                        return value ?? '';
                    }).join(',')
                ),
            ];
            return csvRows.join('\n');
        }

        // Handle single object
        if (typeof data === 'object' && !Array.isArray(data)) {
            const headers = Object.keys(data);
            const values = headers.map(header => {
                const value = data[header];
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value ?? '';
            });
            return headers.join(',') + '\n' + values.join(',');
        }

        throw new Error('JSON must be an object or array of objects');
    };

    const csvToJson = (csvString: string): string => {
        const lines = csvString.trim().split('\n');
        if (lines.length < 2) {
            throw new Error('CSV must have at least a header row and one data row');
        }

        const parseCSVLine = (line: string): string[] => {
            const result: string[] = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                const nextChar = line[i + 1];

                if (char === '"') {
                    if (inQuotes && nextChar === '"') {
                        current += '"';
                        i++; // Skip next quote
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    result.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current);
            return result;
        };

        const headers = parseCSVLine(lines[0]);
        const data = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
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
            setError(e instanceof Error ? e.message : 'Conversion failed');
            setOutput('');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
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
