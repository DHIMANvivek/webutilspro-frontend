'use client';

import { useState } from 'react';

type Mode = 'encode' | 'decode';
type InputType = 'text' | 'file';

export default function Base64Tool() {
    const [mode, setMode] = useState<Mode>('encode');
    const [inputType, setInputType] = useState<InputType>('text');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');

    const handleTextEncode = () => {
        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            setOutput(encoded);
            setError('');
        } catch (e) {
            setError('Failed to encode. Make sure your text contains only valid characters.');
            setOutput('');
        }
    };

    const handleTextDecode = () => {
        try {
            const decoded = decodeURIComponent(escape(atob(input)));
            setOutput(decoded);
            setError('');
        } catch (e) {
            setError('Invalid Base64 string. Please check your input.');
            setOutput('');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setFileType(file.type);
        setError('');

        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                if (mode === 'encode') {
                    // Remove data URI prefix for cleaner output
                    const base64Data = base64.split(',')[1];
                    setOutput(base64Data);
                }
            };
            reader.readAsDataURL(file);
        } catch (e) {
            setError('Failed to read file');
        }
    };

    const handleConvert = () => {
        if (!input.trim()) {
            setError('Please enter text to convert');
            setOutput('');
            return;
        }

        if (mode === 'encode') {
            handleTextEncode();
        } else {
            handleTextDecode();
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
    };

    const downloadOutput = () => {
        if (mode === 'decode' && fileType) {
            // Download as original file type
            try {
                const binary = atob(output);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: fileType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName || 'decoded-file';
                a.click();
                URL.revokeObjectURL(url);
            } catch (e) {
                setError('Failed to download file');
            }
        } else {
            // Download as text
            const blob = new Blob([output], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const generateDataURI = () => {
        if (output && fileType) {
            return `data:${fileType};base64,${output}`;
        }
        return '';
    };

    const loadExample = () => {
        if (mode === 'encode') {
            setInput('Hello, World! This is a Base64 encoding example with special characters: é, ñ, 中文');
            setInputType('text');
        } else {
            setInput('SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgQmFzZTY0IGVuY29kaW5nIGV4YW1wbGUgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnM6IMOpLCDDsSwg5Lit5paH');
            setInputType('text');
        }
    };

    const isImage = fileType && fileType.startsWith('image/');
    const dataURI = generateDataURI();

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                        Base64 Converter
                    </h2>

                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => {
                                setMode('encode');
                                setInput('');
                                setOutput('');
                                setError('');
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
                                setError('');
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

                {/* Input Type Selector */}
                {mode === 'encode' && (
                    <div className="mb-4 flex gap-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                checked={inputType === 'text'}
                                onChange={() => setInputType('text')}
                                className="w-4 h-4 text-primary-600 mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">Text Input</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                checked={inputType === 'file'}
                                onChange={() => setInputType('file')}
                                className="w-4 h-4 text-primary-600 mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">File Upload</span>
                        </label>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Input */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="input" className="block text-sm font-medium text-gray-700">
                                {mode === 'encode' ? (inputType === 'file' ? 'Upload File' : 'Text to Encode') : 'Base64 to Decode'}
                            </label>
                            {inputType === 'text' && (
                                <button
                                    onClick={loadExample}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Load Example
                                </button>
                            )}
                        </div>

                        {inputType === 'file' && mode === 'encode' ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="fileUpload"
                                />
                                <label htmlFor="fileUpload" className="cursor-pointer">
                                    <div className="text-4xl mb-2">📁</div>
                                    <div className="text-sm text-gray-600">
                                        Click to upload or drag and drop
                                    </div>
                                    {fileName && (
                                        <div className="mt-2 text-sm font-medium text-primary-600">
                                            {fileName}
                                        </div>
                                    )}
                                </label>
                            </div>
                        ) : (
                            <textarea
                                id="input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="textarea-field font-mono text-sm"
                                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
                                rows={12}
                            />
                        )}
                    </div>

                    {/* Output */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                                {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
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

                        {isImage && mode === 'encode' && dataURI ? (
                            <div className="space-y-3">
                                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <img src={dataURI} alt="Preview" className="max-w-full h-auto rounded" />
                                </div>
                                <textarea
                                    id="output"
                                    value={output}
                                    readOnly
                                    className="textarea-field font-mono text-sm bg-gray-50"
                                    rows={6}
                                />
                            </div>
                        ) : (
                            <textarea
                                id="output"
                                value={output}
                                readOnly
                                className="textarea-field font-mono text-sm bg-gray-50"
                                placeholder="Result will appear here..."
                                rows={12}
                            />
                        )}
                    </div>
                </div>

                {/* Convert Button (for text input) */}
                {inputType === 'text' && (
                    <div className="mt-6">
                        <button onClick={handleConvert} className="btn-primary w-full md:w-auto">
                            {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
                        </button>
                    </div>
                )}

                {/* Data URI */}
                {isImage && mode === 'encode' && output && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Data URI (for HTML/CSS)</h4>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={dataURI}
                                readOnly
                                className="input-field font-mono text-xs flex-1"
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(dataURI)}
                                className="btn-secondary text-sm"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        <strong>Error:</strong> {error}
                    </div>
                )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-blue-50 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">What is Base64?</h3>
                    <p className="text-sm text-gray-600">
                        Base64 is an encoding scheme that converts binary data into ASCII text format.
                        It's commonly used for embedding images in HTML/CSS, transmitting data over text-based protocols,
                        and encoding email attachments.
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Embedding images in CSS/HTML as Data URIs</li>
                        <li>• API data transmission and JSON payloads</li>
                        <li>• Email attachments (MIME encoding)</li>
                        <li>• Storing binary data in databases</li>
                        <li>• JWT tokens and authentication</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
