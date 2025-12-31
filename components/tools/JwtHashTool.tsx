'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';

type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export default function JwtHashTool() {
    const [jwtInput, setJwtInput] = useState('');
    const [decodedJwt, setDecodedJwt] = useState<any>(null);
    const [jwtError, setJwtError] = useState('');

    const [hashInput, setHashInput] = useState('');
    const [hashAlgorithm, setHashAlgorithm] = useState<HashAlgorithm>('sha256');
    const [hashOutput, setHashOutput] = useState('');

    // JWT Decoder
    const decodeJwt = () => {
        if (!jwtInput.trim()) {
            toast.error('Please enter a JWT token');
            setJwtError('Please enter a JWT token');
            setDecodedJwt(null);
            return;
        }

        try {
            const parts = jwtInput.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.');
            }

            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            setDecodedJwt({ header, payload, signature: parts[2] });
            setJwtError('');
            toast.success('JWT decoded successfully!');
        } catch (e) {
            setJwtError(e instanceof Error ? e.message : 'Failed to decode JWT');
            toast.error(e instanceof Error ? e.message : 'Failed to decode JWT');
            setDecodedJwt(null);
        }
    };

    // Hash Generator (client-side using Web Crypto API)
    const generateHash = async () => {
        if (!hashInput.trim()) {
            setHashOutput('');
            return;
        }

        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(hashInput);

            let hashBuffer;
            switch (hashAlgorithm) {
                case 'sha1':
                    hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
                    break;
                case 'sha256':
                    hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
                    break;
                case 'sha512':
                    hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
                    break;
                case 'md5':
                    // MD5 not supported by Web Crypto API, show note
                    setHashOutput('MD5 is not supported in modern browsers for security reasons. Use SHA-256 instead.');
                    return;
            }

            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setHashOutput(hashHex);
        } catch (e) {
            setHashOutput('Error generating hash');
            toast.error('Error generating hash');
        }
    };

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const loadJwtExample = () => {
        setJwtInput('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    };

    return (
        <div className="space-y-4">
            {/* JWT Decoder */}
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">JWT Decoder</h2>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="jwtInput" className="block text-sm font-medium text-gray-700">
                            JWT Token
                        </label>
                        <button
                            onClick={loadJwtExample}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Load Example
                        </button>
                    </div>
                    <textarea
                        id="jwtInput"
                        value={jwtInput}
                        onChange={(e) => setJwtInput(e.target.value)}
                        className="textarea-field font-mono text-sm"
                        placeholder="Paste your JWT token here..."
                        rows={4}
                    />
                </div>

                <button onClick={decodeJwt} className="btn-primary mb-4">
                    Decode JWT
                </button>

                {jwtError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                        <strong>Error:</strong> {jwtError}
                    </div>
                )}

                {decodedJwt && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">Header</h3>
                                <button
                                    onClick={() => copyText(JSON.stringify(decodedJwt.header, null, 2))}
                                    className="text-sm text-primary-600 hover:text-primary-700"
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <pre className="bg-white p-3 rounded border border-blue-100 overflow-x-auto">
                                <code className="text-sm">{JSON.stringify(decodedJwt.header, null, 2)}</code>
                            </pre>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">Payload</h3>
                                <button
                                    onClick={() => copyText(JSON.stringify(decodedJwt.payload, null, 2))}
                                    className="text-sm text-primary-600 hover:text-primary-700"
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <pre className="bg-white p-3 rounded border border-green-100 overflow-x-auto">
                                <code className="text-sm">{JSON.stringify(decodedJwt.payload, null, 2)}</code>
                            </pre>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Signature</h3>
                            <code className="text-sm break-all">{decodedJwt.signature}</code>
                            <p className="text-xs text-gray-600 mt-2">
                                ⚠️ Note: Signature verification requires the secret key and is not performed here.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Hash Generator */}
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Hash Generator</h2>

                <div className="mb-4">
                    <label htmlFor="hashAlgorithm" className="block text-sm font-medium text-gray-700 mb-2">
                        Hash Algorithm
                    </label>
                    <select
                        id="hashAlgorithm"
                        value={hashAlgorithm}
                        onChange={(e) => setHashAlgorithm(e.target.value as HashAlgorithm)}
                        className="input-field w-full md:w-64"
                    >
                        <option value="sha1">SHA-1</option>
                        <option value="sha256">SHA-256</option>
                        <option value="sha512">SHA-512</option>
                        <option value="md5">MD5 (Not recommended)</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="hashInput" className="block text-sm font-medium text-gray-700 mb-2">
                        Text to Hash
                    </label>
                    <textarea
                        id="hashInput"
                        value={hashInput}
                        onChange={(e) => {
                            setHashInput(e.target.value);
                            // Auto-generate hash on input
                            if (e.target.value.trim()) {
                                setTimeout(() => generateHash(), 100);
                            } else {
                                setHashOutput('');
                            }
                        }}
                        className="textarea-field font-mono text-sm"
                        placeholder="Enter text to generate hash..."
                        rows={4}
                    />
                </div>

                {hashOutput && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                {hashAlgorithm.toUpperCase()} Hash
                            </span>
                            <button
                                onClick={() => copyText(hashOutput)}
                                className="text-sm text-primary-600 hover:text-primary-700"
                            >
                                📋 Copy
                            </button>
                        </div>
                        <code className="text-sm font-mono text-gray-900 break-all block bg-white p-3 rounded">
                            {hashOutput}
                        </code>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">About JWT</h3>
                    <p className="text-gray-600">
                        JSON Web Tokens (JWT) are an open standard for securely transmitting information
                        between parties as a JSON object. They consist of three parts: header, payload, and signature.
                    </p>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">About Hashing</h3>
                    <p className="text-gray-600">
                        Hash functions convert data into a fixed-size string of characters. They're one-way
                        functions used for data integrity, passwords, and digital signatures.
                    </p>
                </div>
            </div>
        </div>
    );
}
