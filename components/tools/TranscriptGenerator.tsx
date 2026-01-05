'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, Download, Trash2, AlertCircle, Sparkles } from 'lucide-react';

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export default function TranscriptGenerator() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognition.onend = () => {
                    // Auto-restart if it was meant to be listening (handle random stops)
                    // But for now, we'll just set state to false to let user manually restart if needed,
                    // or improved logic: strictly follow isListening state?
                    // Simple approach: just stop.
                    setIsListening(false);
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    if (event.error === 'not-allowed') {
                        setError('Microphone access denied. Please allow microphone access.');
                    } else {
                        setError(`Error: ${event.error}`);
                    }
                    setIsListening(false);
                };

                recognition.onresult = (event: any) => {
                    let finalTrans = '';
                    let interimTrans = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTrans += event.results[i][0].transcript;
                        } else {
                            interimTrans += event.results[i][0].transcript;
                        }
                    }

                    if (finalTrans) {
                        setTranscript(prev => {
                            // Add a space if previous content exists and doesn't end with whitespace
                            const prefix = prev && !prev.endsWith(' ') ? ' ' : '';
                            return prev + prefix + finalTrans;
                        });
                    }
                    setInterimTranscript(interimTrans);
                };

                recognitionRef.current = recognition;
            } else {
                setIsSupported(false);
                setError('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.');
            }
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(transcript);
        // Could add a toast notification here
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([transcript], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "transcript.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    const handleClear = () => {
        setTranscript('');
        setInterimTranscript('');
    };

    if (!isSupported) {
        return (
            <div className="p-8 text-center text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-bold mb-2">Browser Not Supported</h3>
                <p>Your browser does not support the Web Speech API. Please try Google Chrome, Microsoft Edge, or Safari.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <button
                    onClick={toggleListening}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isListening
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                        }`}
                >
                    {isListening ? (
                        <>
                            <MicOff className="w-5 h-5" />
                            Stop Listening
                        </>
                    ) : (
                        <>
                            <Mic className="w-5 h-5" />
                            Start Listening
                        </>
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        title="Copy to Clipboard"
                    >
                        <Copy className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        title="Download as Text"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                    <button
                        onClick={handleClear}
                        className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                        title="Clear Transcript"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-200 dark:border-red-900/20 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Editor / live View */}
            <div className="relative min-h-[400px] p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                {/* Visual Indicator of "Live" status inside the paper */}
                {isListening && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        Live
                    </div>
                )}

                {transcript || interimTranscript ? (
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed whitespace-pre-wrap">
                            {transcript}
                            <span className="text-slate-400 dark:text-slate-500 italic">{interimTranscript}</span>
                        </p>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <p className="text-lg font-medium">Click "Start Listening" to begin transcribing...</p>
                        <p className="text-sm mt-2">All processing happens locally in your browser.</p>
                    </div>
                )}
            </div>

            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                <p>Privacy Note: No audio data is sent to our servers. Transcription uses your browser's native Web Speech API.</p>
            </div>
        </div>
    );
}
