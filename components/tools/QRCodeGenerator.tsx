'use client';

import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi';

export default function QRCodeGenerator() {
    const [qrType, setQrType] = useState<QRType>('url');
    const [text, setText] = useState('');
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
    const [logo, setLogo] = useState<string>('');
    const [includeMargin, setIncludeMargin] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Advanced QR data builders
    const [email, setEmail] = useState({ to: '', subject: '', body: '' });
    const [phone, setPhone] = useState('');
    const [sms, setSms] = useState({ number: '', message: '' });
    const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA' });

    const getQRValue = () => {
        switch (qrType) {
            case 'email':
                return `mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
            case 'phone':
                return `tel:${phone}`;
            case 'sms':
                return `sms:${sms.number}?body=${encodeURIComponent(sms.message)}`;
            case 'wifi':
                return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};;`;
            default:
                return text;
        }
    };

    const qrValue = getQRValue();

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setLogo(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeLogo = () => setLogo('');

    const downloadQR = async (format: 'png' | 'svg' = 'png') => {
        if (format === 'svg') {
            const svg = document.getElementById('qr-code');
            if (!svg) return;

            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qrcode.svg';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            // PNG with logo overlay
            const svg = document.getElementById('qr-code');
            if (!svg || !canvasRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = size;
            canvas.height = size;

            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();

            img.onload = async () => {
                // Draw QR code
                ctx.drawImage(img, 0, 0);

                // Draw logo if exists
                if (logo) {
                    const logoImg = new Image();
                    logoImg.onload = () => {
                        const logoSize = size * 0.2; // 20% of QR size
                        const x = (size - logoSize) / 2;
                        const y = (size - logoSize) / 2;

                        // Draw white background for logo
                        ctx.fillStyle = 'white';
                        ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);

                        // Draw logo
                        ctx.drawImage(logoImg, x, y, logoSize, logoSize);

                        // Download
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'qrcode.png';
                                a.click();
                                URL.revokeObjectURL(url);
                            }
                        });
                    };
                    logoImg.src = logo;
                } else {
                    // Download without logo
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'qrcode.png';
                            a.click();
                            URL.revokeObjectURL(url);
                        }
                    });
                }
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    const loadExample = () => {
        setQrType('url');
        setText('https://webutilspro.com');
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>
                    <button onClick={loadExample} className="btn-secondary text-sm">
                        Load Example
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Settings */}
                    <div className="space-y-4">
                        {/* QR Type Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Type</label>
                            <select
                                value={qrType}
                                onChange={(e) => setQrType(e.target.value as QRType)}
                                className="input-field"
                            >
                                <option value="url">URL / Website</option>
                                <option value="text">Plain Text</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone Number</option>
                                <option value="sms">SMS Message</option>
                                <option value="wifi">WiFi Network</option>
                            </select>
                        </div>

                        {/* Dynamic Input Based on Type */}
                        {qrType === 'url' || qrType === 'text' ? (
                            <div>
                                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                                    {qrType === 'url' ? 'URL' : 'Text'}
                                </label>
                                <textarea
                                    id="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="textarea-field"
                                    placeholder={qrType === 'url' ? 'https://example.com' : 'Enter your text...'}
                                    rows={4}
                                />
                            </div>
                        ) : qrType === 'email' ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email.to}
                                        onChange={(e) => setEmail({ ...email, to: e.target.value })}
                                        className="input-field"
                                        placeholder="recipient@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={email.subject}
                                        onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Body</label>
                                    <textarea
                                        value={email.body}
                                        onChange={(e) => setEmail({ ...email, body: e.target.value })}
                                        className="textarea-field"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ) : qrType === 'phone' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="input-field"
                                    placeholder="+1234567890"
                                />
                            </div>
                        ) : qrType === 'sms' ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={sms.number}
                                        onChange={(e) => setSms({ ...sms, number: e.target.value })}
                                        className="input-field"
                                        placeholder="+1234567890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        value={sms.message}
                                        onChange={(e) => setSms({ ...sms, message: e.target.value })}
                                        className="textarea-field"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ) : qrType === 'wifi' ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Network Name (SSID)</label>
                                    <input
                                        type="text"
                                        value={wifi.ssid}
                                        onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="text"
                                        value={wifi.password}
                                        onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Encryption</label>
                                    <select
                                        value={wifi.encryption}
                                        onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="WPA">WPA/WPA2</option>
                                        <option value="WEP">WEP</option>
                                        <option value="nopass">None</option>
                                    </select>
                                </div>
                            </div>
                        ) : null}

                        <div>
                            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                                Size: {size}px
                            </label>
                            <input
                                type="range"
                                id="size"
                                min="128"
                                max="512"
                                step="64"
                                value={size}
                                onChange={(e) => setSize(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fgColor" className="block text-sm font-medium text-gray-700 mb-2">
                                    Foreground
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        id="fgColor"
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="input-field font-mono text-sm flex-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="bgColor" className="block text-sm font-medium text-gray-700 mb-2">
                                    Background
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        id="bgColor"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="input-field font-mono text-sm flex-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="errorLevel" className="block text-sm font-medium text-gray-700 mb-2">
                                Error Correction
                            </label>
                            <select
                                id="errorLevel"
                                value={errorLevel}
                                onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                                className="input-field"
                            >
                                <option value="L">Low (7%) - Smaller QR code</option>
                                <option value="M">Medium (15%) - Balanced</option>
                                <option value="Q">Quartile (25%) - Good for logos</option>
                                <option value="H">High (30%) - Best for logos</option>
                            </select>
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo (Optional)
                            </label>
                            {logo ? (
                                <div className="flex items-center gap-3">
                                    <img src={logo} alt="Logo" className="w-16 h-16 rounded border border-gray-200" />
                                    <button onClick={removeLogo} className="btn-secondary text-sm">
                                        Remove Logo
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                        id="logoUpload"
                                    />
                                    <label htmlFor="logoUpload" className="btn-secondary cursor-pointer inline-block">
                                        Upload Logo
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Recommended: Use high error correction (Q or H) when adding a logo
                                    </p>
                                </div>
                            )}
                        </div>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={includeMargin}
                                onChange={(e) => setIncludeMargin(e.target.checked)}
                                className="w-4 h-4 text-primary-600 rounded mr-2"
                            />
                            <span className="text-sm text-gray-700">Include margin</span>
                        </label>
                    </div>

                    {/* QR Code Preview */}
                    <div className="flex flex-col items-center justify-center">
                        {qrValue ? (
                            <div className="space-y-4">
                                <div className="bg-white p-6 rounded-lg shadow-lg inline-block relative">
                                    <QRCodeSVG
                                        id="qr-code"
                                        value={qrValue}
                                        size={size}
                                        bgColor={bgColor}
                                        fgColor={fgColor}
                                        level={errorLevel}
                                        includeMargin={includeMargin}
                                    />
                                    {logo && (
                                        <img
                                            src={logo}
                                            alt="Logo"
                                            className="absolute bg-white p-1 rounded"
                                            style={{
                                                width: `${size * 0.2}px`,
                                                height: `${size * 0.2}px`,
                                                left: `calc(50% - ${size * 0.1}px)`,
                                                top: `calc(50% - ${size * 0.1}px)`,
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => downloadQR('png')} className="btn-primary flex-1">
                                        ⬇️ Download PNG
                                    </button>
                                    <button onClick={() => downloadQR('svg')} className="btn-secondary flex-1">
                                        ⬇️ Download SVG
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-gray-50 rounded-lg">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                <p className="text-gray-500">Enter content to generate QR code</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
