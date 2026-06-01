import React from 'react';
import { Metadata } from 'next';
import TranscriptGenerator from '@/components/tools/TranscriptGenerator';
import ToolLayout from '@/components/ToolLayout';

export const metadata: Metadata = {
    title: 'Real-Time Transcript Generator | WebUtilsPro',
    description: 'Free browser-based speech-to-text tool. Transcribe audio from your microphone in real-time with zero server data transfer. Secure and private.',
    keywords: 'speech to text, transcript generator, real time transcription, web speech api, privacy first speech tool',
};

export default function TranscriptGeneratorPage() {
    return (
        <ToolLayout
            title="Real-Time Speech Scribe"
            description="A privacy-first transcription tool that runs entirely in your browser. No audio is ever uploaded to the cloud."
            relatedTools={[
                { name: 'Text Tools', href: '/tools/text-tools' },
                { name: 'Markdown to HTML', href: '/tools/markdown-to-html' },
                { name: 'AI Error Explainer', href: '/tools/ai-error-explainer' }
            ]}
        >
            <TranscriptGenerator />
        </ToolLayout>
    );
}
