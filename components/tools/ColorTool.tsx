'use client';

import { useState } from 'react';

export default function ColorTool() {
    const [color, setColor] = useState('#3b82f6');
    const [gradientStart, setGradientStart] = useState('#3b82f6');
    const [gradientEnd, setGradientEnd] = useState('#8b5cf6');
    const [gradientAngle, setGradientAngle] = useState(90);


    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const hexToHsl = (hex: string) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return null;

        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    };

    const rgb = hexToRgb(color);
    const hsl = hexToHsl(color);

    const gradientStyle = {
        background: `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`
    };

    const gradientCSS = `background: linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd});`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-4">
            {/* Color Picker */}
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Color Picker</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Color Input */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Pick a Color
                            </label>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-full h-32 rounded-lg cursor-pointer border-2 border-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="hexInput" className="block text-sm font-medium text-gray-700 mb-2">
                                HEX Code
                            </label>
                            <input
                                type="text"
                                id="hexInput"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="input-field font-mono"
                            />
                        </div>
                    </div>

                    {/* Color Formats */}
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">HEX</span>
                                <button
                                    onClick={() => copyToClipboard(color)}
                                    className="text-sm text-primary-600 hover:text-primary-700"
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <code className="text-lg font-mono text-gray-900">{color.toUpperCase()}</code>
                        </div>

                        {rgb && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">RGB</span>
                                    <button
                                        onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                                        className="text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                                <code className="text-lg font-mono text-gray-900">
                                    rgb({rgb.r}, {rgb.g}, {rgb.b})
                                </code>
                            </div>
                        )}

                        {hsl && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">HSL</span>
                                    <button
                                        onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                                        className="text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                                <code className="text-lg font-mono text-gray-900">
                                    hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                                </code>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Gradient Generator */}
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gradient Generator</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Gradient Controls */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Color
                                </label>
                                <input
                                    type="color"
                                    value={gradientStart}
                                    onChange={(e) => setGradientStart(e.target.value)}
                                    className="w-full h-20 rounded-lg cursor-pointer border-2 border-gray-300"
                                />
                                <input
                                    type="text"
                                    value={gradientStart}
                                    onChange={(e) => setGradientStart(e.target.value)}
                                    className="input-field font-mono text-sm mt-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Color
                                </label>
                                <input
                                    type="color"
                                    value={gradientEnd}
                                    onChange={(e) => setGradientEnd(e.target.value)}
                                    className="w-full h-20 rounded-lg cursor-pointer border-2 border-gray-300"
                                />
                                <input
                                    type="text"
                                    value={gradientEnd}
                                    onChange={(e) => setGradientEnd(e.target.value)}
                                    className="input-field font-mono text-sm mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="angle" className="block text-sm font-medium text-gray-700 mb-2">
                                Angle: {gradientAngle}°
                            </label>
                            <input
                                type="range"
                                id="angle"
                                min="0"
                                max="360"
                                value={gradientAngle}
                                onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Gradient Preview */}
                    <div className="space-y-4">
                        <div
                            style={gradientStyle}
                            className="w-full h-48 rounded-lg shadow-lg"
                        />

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">CSS Code</span>
                                <button
                                    onClick={() => copyToClipboard(gradientCSS)}
                                    className="text-sm text-primary-600 hover:text-primary-700"
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <code className="text-sm font-mono text-gray-900 break-all">
                                {gradientCSS}
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
