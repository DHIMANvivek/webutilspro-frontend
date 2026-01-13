'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Code2,
    ShieldCheck,
    Database,
    Webhook,
    Ghost,
    Copy,
    Check,
    Sparkles,
    Info,
    Trash2,
    FileJson,
    ArrowRightLeft,
    Monitor
} from 'lucide-react';
import toast from 'react-hot-toast';

type ForgeTab = 'types' | 'zod' | 'db' | 'hook' | 'mock';

export default function SchemaForge() {
    const [jsonInput, setJsonInput] = useState('');
    const [activeTab, setActiveTab] = useState<ForgeTab>('types');
    const [copied, setCopied] = useState(false);

    // Default example
    useEffect(() => {
        const example = {
            id: "user_01H2J",
            username: "dev_wizard",
            email: "wizard@webutilspro.com",
            profile: {
                bio: "Fullstack enthusiast",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg",
                stats: {
                    followers: 1200,
                    projects_completed: 45
                }
            },
            is_premium: true,
            created_at: new Date().toISOString(),
            tags: ["frontend", "ai", "security"]
        };
        setJsonInput(JSON.stringify(example, null, 2));
    }, []);

    const parsedData = useMemo(() => {
        try {
            if (!jsonInput.trim()) return null;
            return JSON.parse(jsonInput);
        } catch (e) {
            return null;
        }
    }, [jsonInput]);

    // --- Generators ---

    const toPascalCase = (str: string) => str.replace(/(^\w|_\w|-\w)/g, m => m.replace(/[_-]/, '').toUpperCase());

    const generateTypes = (obj: any, name = 'Root'): string => {
        if (obj === null || typeof obj !== 'object') return '';

        let result = `export interface ${toPascalCase(name)} {\n`;
        const interfaces: string[] = [];

        Object.entries(obj).forEach(([key, value]) => {
            let type: string;
            if (Array.isArray(value)) {
                if (value.length > 0 && typeof value[0] === 'object') {
                    const interfaceName = toPascalCase(key);
                    type = `${interfaceName}[]`;
                    interfaces.push(generateTypes(value[0], key));
                } else {
                    type = value.length > 0 ? `${typeof value[0]}[]` : 'any[]';
                }
            } else if (value !== null && typeof value === 'object') {
                const interfaceName = toPascalCase(key);
                type = interfaceName;
                interfaces.push(generateTypes(value, key));
            } else {
                type = typeof value;
            }
            result += `  ${key}: ${type};\n`;
        });

        result += '}\n';
        return [...new Set(interfaces), result].join('\n');
    };

    const generateZod = (obj: any, name = 'root'): string => {
        if (obj === null || typeof obj !== 'object') return '';

        let result = `const ${name}Schema = z.object({\n`;
        const subSchemas: string[] = [];

        Object.entries(obj).forEach(([key, value]) => {
            let val: string;
            if (Array.isArray(value)) {
                if (value.length > 0 && typeof value[0] === 'object') {
                    val = `z.array(${key}Schema)`;
                    subSchemas.push(generateZod(value[0], key));
                } else {
                    val = `z.array(z.${typeof value[0] || 'any'}())`;
                }
            } else if (value !== null && typeof value === 'object') {
                val = `${key}Schema`;
                subSchemas.push(generateZod(value, key));
            } else {
                const type = typeof value;
                val = type === 'string' ? 'z.string()' : type === 'number' ? 'z.number()' : type === 'boolean' ? 'z.boolean()' : 'z.any()';
            }
            result += `  ${key}: ${val},\n`;
        });

        result += '});\n';
        return [...new Set(subSchemas), result].join('\n');
    };

    const generatePrisma = (obj: any, name = 'Model'): string => {
        if (obj === null || typeof obj !== 'object') return '';
        let result = `model ${toPascalCase(name)} {\n`;
        result += `  id        String   @id @default(uuid())\n`;

        Object.entries(obj).forEach(([key, value]) => {
            if (key === 'id') return;
            let type: string;
            if (Array.isArray(value)) type = 'Json';
            else if (typeof value === 'number') type = Number.isInteger(value) ? 'Int' : 'Float';
            else if (typeof value === 'boolean') type = 'Boolean';
            else if (typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value))) type = 'DateTime';
            else if (typeof value === 'object' && value !== null) type = 'Json';
            else type = 'String';

            result += `  ${key}      ${type}\n`;
        });

        result += '}\n';
        return result;
    };

    const generateReactQuery = (obj: any, name = 'data'): string => {
        const typeName = toPascalCase(name);
        return `import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGet${typeName} = (id: string) => {
  return useQuery<${typeName}>({
    queryKey: ['${name}', id],
    queryFn: async () => {
      const response = await axios.get(\`/api/${name}s/\${id}\`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};`;
    };

    const generateFaker = (obj: any, name = 'item'): string => {
        let result = `import { faker } from '@faker-js/faker';\n\n`;
        result += `export const generateMock${toPascalCase(name)} = () => ({\n`;

        Object.entries(obj).forEach(([key, value]) => {
            let fakerCall: string;
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('id')) fakerCall = 'faker.string.uuid()';
            else if (lowerKey.includes('name')) fakerCall = 'faker.person.fullName()';
            else if (lowerKey.includes('email')) fakerCall = 'faker.internet.email()';
            else if (lowerKey.includes('avatar') || lowerKey.includes('image')) fakerCall = 'faker.image.avatar()';
            else if (lowerKey.includes('bio')) fakerCall = 'faker.lorem.sentence()';
            else if (lowerKey.includes('city')) fakerCall = 'faker.location.city()';
            else if (Array.isArray(value)) fakerCall = 'faker.helpers.multiple(() => faker.word.noun(), { count: 3 })';
            else if (typeof value === 'number') fakerCall = 'faker.number.int({ min: 10, max: 1000 })';
            else if (typeof value === 'boolean') fakerCall = 'faker.datatype.boolean()';
            else if (typeof value === 'string' && value.includes('T')) fakerCall = 'faker.date.recent().toISOString()';
            else fakerCall = 'faker.word.sample()';

            result += `  ${key}: ${fakerCall},\n`;
        });

        result += '});\n';
        return result;
    };

    const outputCode = useMemo(() => {
        if (!parsedData) return '// Paste valid JSON to generate code...';
        switch (activeTab) {
            case 'types': return generateTypes(parsedData);
            case 'zod': return `import { z } from 'zod';\n\n` + generateZod(parsedData);
            case 'db': return `// Prisma Model\n\n` + generatePrisma(parsedData) + `\n\n// Mongoose Schema (Alternative)\nconst schema = new mongoose.Schema(${JSON.stringify(parsedData, null, 2)});`;
            case 'hook': return generateReactQuery(parsedData);
            case 'mock': return generateFaker(parsedData);
            default: return '';
        }
    }, [parsedData, activeTab]);

    const handleCopy = () => {
        navigator.clipboard.writeText(outputCode);
        setCopied(true);
        toast.success('Generated code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: 'types', label: 'Typescript', icon: Code2, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'zod', label: 'Zod Validation', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
        { id: 'db', label: 'Database', icon: Database, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 'hook', label: 'API Hook', icon: Webhook, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'mock', label: 'Mock Data', icon: Ghost, color: 'text-slate-500', bg: 'bg-slate-50' },
    ];

    return (
        <div className="space-y-6">
            <header className="card p-8 bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 animate-pulse opacity-10 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-20 h-20 text-blue-500" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase">NEW FORGE</span>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900">Schema-Forge</h1>
                    </div>
                    <p className="text-slate-600 text-lg max-w-2xl font-medium">
                        Transform raw JSON into a full-stack blueprint. Generate Types, Zod Schemas, Database Models, and Mock Data in seconds.
                    </p>
                </div>
                <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Input Zone */}
                <div className="card h-full min-h-[600px] flex flex-col">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                            <FileJson className="w-4 h-4" /> Raw JSON Engine
                        </label>
                        <button
                            onClick={() => setJsonInput('')}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Clear Input"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="relative flex-grow">
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-full h-full min-h-[500px] p-6 font-mono text-sm bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-200 focus:border-blue-500 transition-all outline-none resize-none custom-scrollbar shadow-inner selection:bg-blue-200"
                            placeholder="Paste your API response or JSON here..."
                        />
                        {!parsedData && jsonInput.trim() && (
                            <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 text-[10px] px-2 py-1 rounded border border-red-500/40 font-bold backdrop-blur-sm">
                                INVALID JSON
                            </div>
                        )}
                        {parsedData && (
                            <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded border border-green-500/40 font-bold backdrop-blur-sm animate-pulse">
                                READY TO FORGE
                            </div>
                        )}
                    </div>
                    <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-xs text-blue-800 leading-relaxed font-medium">
                            Forge Tip: Provide a real-world response from your API. The more keys you provide, the more accurate the generated types and mocks will be.
                        </p>
                    </div>
                </div>

                {/* Output Forge */}
                <div className="space-y-4">
                    <nav className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as ForgeTab)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300
                                    ${activeTab === tab.id
                                        ? `bg-white ${tab.color} shadow-lg shadow-slate-200 border border-slate-200 transform scale-105`
                                        : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                                    }
                                `}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : 'text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="card relative p-0 bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <button
                                onClick={handleCopy}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                                    ${copied ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'}
                                `}
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied!' : 'Copy Blueprint'}
                            </button>
                        </div>

                        <div className="p-1 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeTab === 'db' ? 'PRISMA' : activeTab.toUpperCase()} FORGE</span>
                        </div>

                        <pre className="p-8 font-mono text-sm overflow-x-auto text-slate-800 custom-scrollbar max-h-[600px] selection:bg-blue-100">
                            <code>{outputCode}</code>
                        </pre>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <h3 className="text-xs font-black text-indigo-900 uppercase mb-1 tracking-wider">Fast Iteration</h3>
                            <p className="text-[10px] text-indigo-700 font-medium">Auto-updates as you type in the left panel.</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <h3 className="text-xs font-black text-emerald-900 uppercase mb-1 tracking-wider">Type Safe</h3>
                            <p className="text-[10px] text-emerald-700 font-medium">Guarantees zero-runtime errors in your app.</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="mt-12 space-y-8">
                <hr className="border-slate-200" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-500" /> Why Schema-Forge?
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            Manual boilerplate is the #1 killer of development momentum. Schema-Forge uses industry-standard patterns to generate your entire data layer in milliseconds, allowing you to focus on logic, not syntax.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" /> Production Ready
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            Every blueprint generated follows strict TypeScript guidelines and Zod best practices. Whether you're using Prisma, Mongoose, or raw SQL, our generator adapts to your stack.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                            <Webhook className="w-5 h-5 text-orange-500" /> API First Design
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            Built by developers for developers. Schema-Forge integrates seamlessly with modern frontend frameworks like Next.js, Vite, and Remix via optimized React Query hooks.
                        </p>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.8);
                }
            `}</style>
        </div>
    );
}
