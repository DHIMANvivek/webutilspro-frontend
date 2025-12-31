'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PasswordGenerator() {
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState({ score: 0, label: '', color: '' });

    const generatePassword = () => {
        let charset = '';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (charset === '') {
            setPassword('');
            return;
        }

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(newPassword);
        toast.success('New password generated!');
    };

    const calculateStrength = (pwd: string) => {
        let score = 0;
        if (!pwd) return { score: 0, label: 'No Password', color: 'gray' };

        // Length
        if (pwd.length >= 8) score += 1;
        if (pwd.length >= 12) score += 1;
        if (pwd.length >= 16) score += 1;

        // Character variety
        if (/[a-z]/.test(pwd)) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

        if (score <= 2) return { score, label: 'Weak', color: 'red' };
        if (score <= 4) return { score, label: 'Fair', color: 'orange' };
        if (score <= 6) return { score, label: 'Good', color: 'yellow' };
        return { score, label: 'Strong', color: 'green' };
    };

    useEffect(() => {
        setStrength(calculateStrength(password));
    }, [password]);

    const copyPassword = () => {
        navigator.clipboard.writeText(password);
        toast.success('Password copied to clipboard!');
    };

    return (
        <div className="space-y-4">
            {/* Password Generator */}
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Secure Password</h2>

                {/* Generated Password */}
                {password && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Generated Password
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={password}
                                readOnly
                                className="input-field font-mono text-lg flex-1"
                            />
                            <button onClick={copyPassword} className="btn-secondary">
                                📋 Copy
                            </button>
                        </div>

                        {/* Strength Indicator */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Password Strength</span>
                                <span className={`text-sm font-semibold text-${strength.color}-600`}>
                                    {strength.label}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all bg-${strength.color}-500`}
                                    style={{ width: `${(strength.score / 7) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Length Slider */}
                <div className="mb-4">
                    <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                        Password Length: {length}
                    </label>
                    <input
                        type="range"
                        id="length"
                        min="8"
                        max="32"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>8</span>
                        <span>32</span>
                    </div>
                </div>

                {/* Character Options */}
                <div className="space-y-3 mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={includeUppercase}
                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded mr-3"
                        />
                        <span className="text-sm text-gray-700">Include Uppercase Letters (A-Z)</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={includeLowercase}
                            onChange={(e) => setIncludeLowercase(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded mr-3"
                        />
                        <span className="text-sm text-gray-700">Include Lowercase Letters (a-z)</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={includeNumbers}
                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded mr-3"
                        />
                        <span className="text-sm text-gray-700">Include Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={includeSymbols}
                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded mr-3"
                        />
                        <span className="text-sm text-gray-700">Include Symbols (!@#$%^&*)</span>
                    </label>
                </div>

                <button onClick={generatePassword} className="btn-primary w-full">
                    🔐 Generate Password
                </button>
            </div>

            {/* Password Tips */}
            <div className="card bg-yellow-50 border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🛡️ Password Security Tips</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Use at least 12 characters for better security</li>
                    <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
                    <li>• Don't use personal information (names, birthdays, etc.)</li>
                    <li>• Use a unique password for each account</li>
                    <li>• Consider using a password manager to store passwords securely</li>
                    <li>• Enable two-factor authentication (2FA) whenever possible</li>
                </ul>
            </div>

            {/* Strength Checker */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Password Strength Checker</h3>
                <div>
                    <label htmlFor="checkPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Test Your Password Strength
                    </label>
                    <input
                        type="text"
                        id="checkPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field font-mono"
                        placeholder="Enter a password to check its strength..."
                    />

                    {password && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Length: <strong>{password.length}</strong></p>
                                    <p className="text-gray-600">Uppercase: <strong>{/[A-Z]/.test(password) ? '✓' : '✗'}</strong></p>
                                    <p className="text-gray-600">Lowercase: <strong>{/[a-z]/.test(password) ? '✓' : '✗'}</strong></p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Numbers: <strong>{/[0-9]/.test(password) ? '✓' : '✗'}</strong></p>
                                    <p className="text-gray-600">Symbols: <strong>{/[^a-zA-Z0-9]/.test(password) ? '✓' : '✗'}</strong></p>
                                    <p className={`text-${strength.color}-600 font-semibold`}>
                                        Strength: {strength.label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
