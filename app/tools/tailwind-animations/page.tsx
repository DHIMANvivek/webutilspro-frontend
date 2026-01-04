import { generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';
import TailwindAnimationsClient from '@/components/tools/TailwindAnimations/TailwindAnimationsClient';
import Breadcrumbs from '@/components/Breadcrumbs';
import { LayoutGrid, Sparkles } from 'lucide-react';

export const metadata = genMeta({
    title: 'Tailwind CSS Animation Playground | Copy-Paste Premium FX',
    description: 'Explore a gallery of high-end Tailwind CSS animations. Customize glowing borders, glassmorphism effects, and 3D interactions. Copy-paste code instantly for your React/Next.js projects.',
    keywords: [
        'tailwind animation generator',
        'tailwind css effects',
        'nextjs animations',
        'tailwind glassmorphism',
        'copy paste tailwind components',
        'premium tailwind ui'
    ],
    canonical: '/tools/tailwind-animations'
});

const jsonLd = generateToolSchema({
    name: 'Tailwind Animation Playground',
    description: 'A visual laboratory for modern Tailwind CSS animations. Design and export premium UI interactions.',
    url: 'https://webutilspro.com/tools/tailwind-animations'
});

export default function TailwindAnimationsPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-[#020617]">
            <div className="container mx-auto px-4 py-16">
                <Breadcrumbs
                    items={[
                        { name: 'Tools', href: '/#tools', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                        { name: 'Tailwind Animations', href: '/tools/tailwind-animations' },
                    ]}
                />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 group cursor-default">
                        <Sparkles className="w-4 h-4 text-indigo-500 group-hover:rotate-12 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Premium UI Designer</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
                        Tailwind CSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Animation Playground</span>
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        The web's most visual laboratory for premium Tailwind interactions. Design, customize, and <code className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-sm">copy-paste</code> high-end effects in seconds.
                    </p>
                </div>

                <TailwindAnimationsClient />
            </div>
        </div>
    );
}
