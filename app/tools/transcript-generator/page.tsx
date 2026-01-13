import React from 'react';
import { Metadata } from 'next';
import TranscriptGenerator from '@/components/tools/TranscriptGenerator';
import Breadcrumbs from '@/components/Breadcrumbs';
import { LayoutGrid } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Real-Time Transcript Generator | WebUtilsPro',
    description: 'Free browser-based speech-to-text tool. Transcribe audio from your microphone in real-time with zero server data transfer. Secure and private.',
    keywords: 'speech to text, transcript generator, real time transcription, web speech api, privacy first speech tool',
};

export default function TranscriptGeneratorPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] pb-20">
            {/* Header Section */}
            {/* Header Section */}
            <div className="bg-slate-50 border-b border-slate-200 pt-24 pb-12 mb-8">
                <div className="container-custom">
                    <div className="mb-8">
                        <Breadcrumbs
                            items={[
                                { name: 'Tools', href: '/#tools', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                                { name: 'Transcript Generator', href: '/tools/transcript-generator' },
                            ]}
                        />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Real-Time <span className="text-blue-600">Speech Scribe</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        A privacy-first transcription tool that runs entirely in your browser.
                        No audio is ever uploaded to the cloud. Perfect for dictating notes, ideas, or drafts securely.
                    </p>
                </div>
            </div>

            <div className="container-custom">
                <TranscriptGenerator />
            </div>
        </main>
    );
}
