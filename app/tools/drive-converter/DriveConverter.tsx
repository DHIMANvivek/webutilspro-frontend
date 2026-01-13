'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Image, Loader2, CheckCircle, AlertCircle, RefreshCw, FileSpreadsheet, Presentation, Link as LinkIcon, ExternalLink, History, Zap, Shield, Globe, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import confetti from 'canvas-confetti';

declare const google: any;

interface ConvertedFile {
    id: string;
    name: string;
    link: string;
    type: string;
    timestamp: Date;
    originalName: string;
}

export default function DriveConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(null);
    const [history, setHistory] = useState<ConvertedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const triggerConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    };

    const handleConnectDrive = () => {
        const client = google.accounts.oauth2.initTokenClient({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            scope: 'https://www.googleapis.com/auth/drive.file',
            callback: (response: any) => {
                if (response.access_token) {
                    setAccessToken(response.access_token);
                    toast.success('Secure Link Established');
                }
            },
        });
        client.requestAccessToken();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
            setConvertedFile(null);
            setStatus('');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError('');
            setConvertedFile(null);
            setStatus('');
        }
    };

    const getTargetType = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
        return `${ext} File`;
    };

    const handleConvert = async () => {
        if (!file || !accessToken) return;
        setLoading(true);
        setStatus('Starting upload...');
        setError('');

        try {
            await new Promise(r => setTimeout(r, 800)); // Simulate init
            setStatus(`Uploading ${file.name}...`);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('accessToken', accessToken);

            const res = await fetch('/api/drive/convert', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Upload failed');

            const newResult: ConvertedFile = {
                id: data.id,
                name: data.name,
                link: data.link,
                type: getTargetType(file.name),
                timestamp: new Date(),
                originalName: file.name
            };

            setConvertedFile(newResult);
            setHistory(prev => [newResult, ...prev]);
            triggerConfetti();
            toast.success('Upload Complete');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during upload');
            toast.error('Upload Failed');
        } finally {
            setLoading(false);
            setStatus('');
        }
    };

    const copyLink = (link: string) => {
        navigator.clipboard.writeText(link);
        toast.success('Link copied to clipboard!');
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 selection:text-blue-900 overflow-hidden relative"
        >
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container-custom max-w-7xl mx-auto px-4 py-12 relative z-10">
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                        <Globe className="w-3 h-3" />
                        Drive Uploader
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                        Upload to Drive. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Get Link.</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        Easily upload any file from your computer to Google Drive and get a shareable link instantly.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Interface */}
                    <div className="lg:col-span-8 space-y-6">
                        <motion.div variants={itemVariants} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-slate-200/50">
                                <form
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-slate-100'}`}
                                >
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />

                                    <AnimatePresence mode="wait">
                                        {file ? (
                                            <motion.div
                                                key="file-selected"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="text-center z-0"
                                            >
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                                                    <FileText className="w-10 h-10 text-white" />
                                                </div>
                                                <p className="text-xl font-bold text-slate-900 mb-1">{file.name}</p>
                                                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                                                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <span className="text-blue-600 font-bold">Target: {getTargetType(file.name)}</span>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="upload-prompt"
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -10, opacity: 0 }}
                                                className="text-center z-0"
                                            >
                                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                                <p className="text-lg font-bold text-slate-700">Drop your file here</p>
                                                <p className="text-sm text-slate-500 px-4">Supports PDF, DOCX, XLSX, CSV, PPTX</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>

                                <div className="mt-8 flex flex-col gap-4">
                                    {!accessToken ? (
                                        <button
                                            onClick={handleConnectDrive}
                                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] shadow-lg shadow-slate-900/20"
                                        >
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Drive" className="w-6 h-6" />
                                            Connect Google Drive
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleConvert}
                                            disabled={!file || loading}
                                            className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:grayscale overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    {status}
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-5 h-5 fill-current" />
                                                    Upload File
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Result Card */}
                        <AnimatePresence>
                            {convertedFile && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: "spring", bounce: 0.4 }}
                                    className="bg-white border border-blue-200 rounded-3xl p-8 shadow-xl shadow-blue-500/10 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <CheckCircle className="w-32 h-32 text-blue-500" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-700 text-xs font-bold uppercase mb-6">
                                            <CheckCircle className="w-3 h-3" />
                                            Operation Successful
                                        </div>

                                        <div className="flex items-start gap-6 mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                                                {['XLS', 'CSV', 'SHEET'].some(t => convertedFile.type.toUpperCase().includes(t)) ? (
                                                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                                                ) : ['PPT', 'SLIDE'].some(t => convertedFile.type.toUpperCase().includes(t)) ? (
                                                    <Presentation className="w-8 h-8 text-orange-500" />
                                                ) : (
                                                    <FileText className="w-8 h-8 text-blue-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900 mb-1">{convertedFile.name}</h3>
                                                <p className="text-slate-500 text-sm">Stored securely in your Google Drive root directory.</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            <a
                                                href={convertedFile.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Open Result
                                            </a>
                                            <button
                                                onClick={() => copyLink(convertedFile.link)}
                                                className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200"
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                                Copy Link
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar / Logs */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 h-full min-h-[500px] shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <History className="w-5 h-5 text-purple-500" />
                                Session Log
                            </h3>

                            <div className="space-y-4">
                                <AnimatePresence initial={false}>
                                    {history.length > 0 ? (
                                        history.map((log) => (
                                            <motion.div
                                                key={log.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-mono text-slate-400">{log.timestamp.toLocaleTimeString()}</span>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${['XLS', 'CSV'].some(t => log.type.includes(t)) ? 'bg-green-100 text-green-700' :
                                                        ['PPT', 'SLIDE'].some(t => log.type.includes(t)) ? 'bg-orange-100 text-orange-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {log.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-900 truncate mb-3">{log.name}</p>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <a href={log.link} target="_blank" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold">
                                                        Open <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                    <button onClick={() => copyLink(log.link)} className="text-xs text-slate-500 hover:text-slate-700 font-medium">
                                                        Copy Link
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                <History className="w-6 h-6 opacity-50" />
                                            </div>
                                            <p className="text-sm">No recent activity</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
