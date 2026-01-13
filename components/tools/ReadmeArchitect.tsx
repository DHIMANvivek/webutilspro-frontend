'use client';

import { useState, useMemo } from 'react';
import {
    Layout,
    Type,
    Code2,
    BarChart3,
    Share2,
    Copy,
    Check,
    Download,
    Github,
    Palette,
    Wand2,
    Move,
    LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/Breadcrumbs';

type SectionType = 'header' | 'about' | 'skills' | 'stats' | 'socials';

export default function ReadmeArchitect() {
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('Full Stack Developer 🚀 building cool things with code.');
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['react', 'typescript', 'nextjs', 'nodejs']);
    const [showStats, setShowStats] = useState(true);
    const [copied, setCopied] = useState(false);

    // --- Generator Logic ---
    const generateMarkdown = useMemo(() => {
        const user = username || 'your-username';
        const displayName = name || 'Your Name';

        let md = ``;

        // Header
        md += `# Hi there 👋, I'm ${displayName}\n\n`;
        md += `### ${bio}\n\n`;

        // Socials / Header Badges (Simulated)
        if (showStats) {
            md += `![Github Views](https://komarev.com/ghpvc/?username=${user}&color=3b82f6&style=flat-square) `;
            md += `[![Twitter](https://img.shields.io/twitter/follow/${user}?style=social)](https://twitter.com/${user})\n\n`;
        }

        md += `---\n\n`;

        // About
        md += `## 🧐 About Me\n\n`;
        md += `- 🔭 I’m currently working on **Awesome Project**\n`;
        md += `- 🌱 I’m currently learning **Rust & Go**\n`;
        md += `- 👯 I’m looking to collaborate on **Open Source**\n`;
        md += `- 💬 Ask me about **React, Node.js, and Cloud Architecture**\n\n`;

        // Skills
        md += `## 🛠 Tech Stack\n\n`;
        md += `<p align="left">\n`;
        selectedSkills.forEach(skill => {
            md += `  <img src="https://skillicons.dev/icons?i=${skill}" alt="${skill}" width="40" height="40"/>\n`;
        });
        md += `</p>\n\n`;

        // Stats
        if (showStats) {
            md += `## 📊 GitHub Stats\n\n`;
            md += `<div align="center">\n`;
            md += `  <img src="https://github-readme-stats.vercel.app/api?username=${user}&show_icons=true&theme=transparent&hide_border=true&title_color=3b82f6&text_color=64748b&icon_color=3b82f6" height="150" alt="stats graph" />\n`;
            md += `  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${user}&layout=compact&theme=transparent&hide_border=true&title_color=3b82f6&text_color=64748b" height="150" alt="languages graph" />\n`;
            md += `</div>\n\n`;

            md += `<div align="center">\n`;
            md += `  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${user}&theme=transparent&hide_border=true&stroke=3b82f6&ring=3b82f6&fire=ef4444&currStreakLabel=3b82f6" alt="streak graph" />\n`;
            md += `</div>\n`;
        }

        md += `\n---\n`;
        md += `Generated with [WebUtilsPro](https://webutilspro.com) 🚀`;

        return md;
    }, [username, name, bio, selectedSkills, showStats]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generateMarkdown);
        setCopied(true);
        toast.success('Markdown copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(prev => prev.filter(s => s !== skill));
        } else {
            setSelectedSkills(prev => [...prev, skill]);
        }
    };

    const allSkills = [
        'react', 'vue', 'angular', 'svelte', 'nextjs',
        'typescript', 'javascript', 'html', 'css', 'tailwind',
        'nodejs', 'express', 'nestjs', 'python', 'django',
        'go', 'rust', 'java', 'kotlin', 'swift',
        'docker', 'kubernetes', 'aws', 'gcp', 'firebase',
        'mysql', 'postgres', 'mongodb', 'redis', 'graphql',
        'git', 'linux', 'vim', 'vscode', 'figma'
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
                <div className="mb-8">
                    <Breadcrumbs
                        items={[
                            { name: 'Tools', href: '/#tools', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                            { name: 'Readme Architect', href: '/tools/readme-architect' },
                        ]}
                    />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase shadow-sm">
                        Viral Tools
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Readme<span className="text-blue-600">.md</span> Architect
                    </h1>
                </div>
                <p className="text-lg text-slate-600 max-w-2xl font-medium leading-relaxed">
                    Build a stunning GitHub profile in seconds. No markdown knowledge required.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Controls Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Layout className="w-5 h-5 text-blue-500" />
                                Profile Config
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">GitHub Username</label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="github_user"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
                                    <div className="relative">
                                        <Type className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">One-Line Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="What do you do?"
                                        rows={3}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-purple-500" />
                                Tech Stack
                            </h3>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                {allSkills.map(skill => (
                                    <button
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className={`
                                            px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5
                                            ${selectedSkills.includes(skill)
                                                ? 'bg-blue-50 border-blue-200 text-blue-600'
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }
                                        `}
                                    >
                                        <img src={`https://skillicons.dev/icons?i=${skill}`} alt={skill} className="w-4 h-4" />
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-green-500" />
                                Add-ons
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Github className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">GitHub Stats</span>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${showStats ? 'bg-blue-500' : 'bg-slate-200'}`} onClick={() => setShowStats(!showStats)}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${showStats ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-8 flex flex-col h-full">
                        <div className="bg-white rounded-t-3xl border-x border-t border-slate-200 p-4 flex items-center justify-between bg-slate-50/50">
                            <div className="flex bg-slate-200/50 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Raw Markdown
                                </button>
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Preview
                                </button>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-900/10"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </button>
                        </div>

                        <div className="flex-grow bg-white border-x border-b border-slate-200 rounded-b-3xl shadow-xl shadow-slate-200/20 overflow-hidden min-h-[600px]">
                            {activeTab === 'edit' ? (
                                <textarea
                                    value={generateMarkdown}
                                    readOnly
                                    className="w-full h-full p-8 font-mono text-sm text-slate-600 bg-slate-50/30 resize-none focus:outline-none"
                                />
                            ) : (
                                <div className="p-8 prose prose-slate max-w-none">
                                    {/* Simulated HTML Preview - In a real app we'd use react-markdown, here we simulate key visual elements */}
                                    <div className="space-y-6">
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Hi there 👋, I'm {name || 'Your Name'}</h1>
                                            <h3 className="text-xl text-slate-600 font-medium">{bio}</h3>
                                        </div>

                                        {showStats && (
                                            <div className="flex gap-2">
                                                <div className="h-6 bg-blue-500 rounded px-2 w-24 animate-pulse opacity-50"></div>
                                                <div className="h-6 bg-blue-400 rounded px-2 w-24 animate-pulse opacity-50"></div>
                                            </div>
                                        )}

                                        <hr className="border-slate-100" />

                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-4">🧐 About Me</h2>
                                            <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                                <li>🔭 I’m currently working on <strong>Awesome Project</strong></li>
                                                <li>🌱 I’m currently learning <strong>Rust & Go</strong></li>
                                                <li>...</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-4">🛠 Tech Stack</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSkills.map(s => (
                                                    <img key={s} src={`https://skillicons.dev/icons?i=${s}`} alt={s} className="w-10 h-10" />
                                                ))}
                                            </div>
                                        </div>

                                        {showStats && (
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 mb-4">📊 GitHub Stats</h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="h-32 bg-slate-100 rounded-xl w-full flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-200">STATS GRAPH PLACEHOLDER</div>
                                                    <div className="h-32 bg-slate-100 rounded-xl w-full flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-200">LANGS GRAPH PLACEHOLDER</div>
                                                </div>
                                                <div className="h-24 bg-slate-100 rounded-xl w-full mt-4 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-200">STREAK GRAPH PLACEHOLDER</div>
                                            </div>
                                        )}

                                        <div className="pt-8 text-center text-slate-400 text-sm">
                                            (Note: The Preview mode here is a simulation. The Raw Markdown tab contains the actual working code for GitHub.)
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
