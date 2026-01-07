'use client';

import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Upload, Loader2, CheckCircle, Info, Sparkles } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import toast from 'react-hot-toast';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'image';

export default function QRCodeGenerator() {
    const [qrType, setQrType] = useState<QRType>('url');
    const [text, setText] = useState('');
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
    const [logo, setLogo] = useState<string>('');
    const [qrImage, setQrImage] = useState<string>(''); // For Image to QR
    const [localPreview, setLocalPreview] = useState<string>(''); // Instant preview
    const [isUploading, setIsUploading] = useState(false);
    const [includeMargin, setIncludeMargin] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Advanced QR data builders
    const [email, setEmail] = useState({ to: '', subject: '', body: '' });
    const [phone, setPhone] = useState('');
    const [sms, setSms] = useState({ number: '', message: '' });
    const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA' });

    const qrTypeOptions = [
        { value: 'url', label: 'URL / Website' },
        { value: 'text', label: 'Plain Text' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone Number' },
        { value: 'sms', label: 'SMS Message' },
        { value: 'wifi', label: 'WiFi Network' },
        { value: 'image', label: 'Image to QR (NEW)' },
    ];

    const wifiEncryptionOptions = [
        { value: 'WPA', label: 'WPA/WPA2' },
        { value: 'WEP', label: 'WEP' },
        { value: 'nopass', label: 'None' },
    ];

    const errorLevelOptions = [
        { value: 'L', label: 'Low (7%) - Smaller QR code' },
        { value: 'M', label: 'Medium (15%) - Balanced' },
        { value: 'Q', label: 'Quartile (25%) - Good for logos' },
        { value: 'H', label: 'High (30%) - Best for logos' },
    ];

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
            case 'image':
                return qrImage;
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

    const handleQRImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview locally first for speed
        const localUrl = URL.createObjectURL(file);
        setLocalPreview(localUrl);

        try {
            setIsUploading(true);
            const base64 = await new Promise((resolve) => {
                const r = new FileReader();
                r.onload = () => resolve(r.result);
                r.readAsDataURL(file);
            });

            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/qrcode/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 })
            });

            const data = await response.json();
            if (data.success) {
                setQrImage(data.imageUrl);
                toast.success('Image uploaded successfully! Generating QR...');
            } else {
                toast.error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image. Please check your connection.');
        } finally {
            setIsUploading(false);
        }
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
                    <header>
                        <h1 className="text-2xl font-bold text-gray-900 underline decoration-blue-500 decoration-4 underline-offset-8">
                            Professional QR Code Generator
                        </h1>
                        <p className="text-sm text-slate-500 mt-2">Generate free, secure QR codes for URLs, Text, Image, WiFi & more.</p>
                    </header>
                    <button onClick={loadExample} className="btn-secondary text-sm">
                        Load Example
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Settings */}
                    <div className="space-y-4">
                        {/* QR Type Selector */}
                        <div>
                            <CustomSelect
                                label="QR Code Type"
                                value={qrType}
                                onChange={(val) => setQrType(val as QRType)}
                                options={qrTypeOptions}
                            />
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
                                        placeholder="support@webutilspro.com"
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
                                    <CustomSelect
                                        label="Encryption"
                                        value={wifi.encryption}
                                        onChange={(val) => setWifi({ ...wifi, encryption: val })}
                                        options={wifiEncryptionOptions}
                                    />
                                </div>
                            </div>
                        ) : qrType === 'image' ? (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                                    <span>Upload Image for QR Code</span>
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-[10px] font-bold text-white rounded-full animate-pulse shadow-lg shadow-blue-500/50">
                                        <Sparkles className="w-2.5 h-2.5" /> NEW FEATURE
                                    </span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all bg-slate-50 relative group overflow-hidden shadow-inner active:scale-[0.98]">
                                    {/* Animated background glow */}
                                    <div className="absolute inset-0 bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleQRImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        disabled={isUploading}
                                    />
                                    {qrImage || localPreview ? (
                                        <div className="space-y-3 relative z-20 pointer-events-none fade-in">
                                            <div className="relative inline-block">
                                                <img
                                                    src={localPreview || qrImage}
                                                    alt="QR Target"
                                                    className="w-40 h-40 object-cover mx-auto rounded-xl shadow-2xl border-4 border-white"
                                                />
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <p className="text-sm text-green-600 font-bold">✓ Image Ready</p>
                                            <p className="text-[10px] text-slate-400 truncate px-4 bg-white/50 py-1 rounded-full">{qrImage || 'Processing...'}</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 relative z-20 pointer-events-none">
                                            <div className={`w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-sm ${!isUploading ? 'animate-bounce-subtle shadow-blue-200' : ''}`}>
                                                {isUploading ? (
                                                    <Loader2 className="w-10 h-10 animate-spin" />
                                                ) : (
                                                    <Upload className="w-10 h-10" />
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-900 text-lg">{isUploading ? 'Uploading Image...' : 'Drop your image here'}</p>
                                                <p className="text-xs text-slate-500">PNG, JPG or WEBP (Unlimited hosting)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 italic">
                                    The QR code will link directly to this image. The image is hosted securely on our servers.
                                </p>
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
                            <CustomSelect
                                id="errorLevel"
                                label="Error Correction"
                                value={errorLevel}
                                onChange={(val) => setErrorLevel(val as 'L' | 'M' | 'Q' | 'H')}
                                options={errorLevelOptions}
                            />
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

            <style jsx>{`
                canvas {
                    image-rendering: pixelated;
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2s infinite ease-in-out;
                }
                .fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
