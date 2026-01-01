'use client';

import { useState, useEffect } from 'react';
import { Zap, Sparkles, Check } from 'lucide-react';

interface ServerPreset {
    id: string;
    name: string;
    description: string;
    command: string;
    args: string[];
    env: Record<string, string>;
    requiresAuth: boolean;
    category: string;
    tags: string[];
    icon: string;
    features: string[];
    note?: string;
}

interface MCPPresetServersProps {
    onConnect: (config: { command: string; args: string[]; env: Record<string, string> }) => void;
    isConnecting: boolean;
}

export default function MCPPresetServers({ onConnect, isConnecting }: MCPPresetServersProps) {
    const [presets, setPresets] = useState<ServerPreset[]>([]);
    const [loading, setLoading] = useState(true);
    const [connectingPresetId, setConnectingPresetId] = useState<string | null>(null);

    useEffect(() => {
        loadPresets();
    }, []);

    // Reset connecting state when parent isConnecting becomes false
    useEffect(() => {
        if (!isConnecting) {
            setConnectingPresetId(null);
        }
    }, [isConnecting]);

    const loadPresets = async () => {
        try {
            const response = await fetch('https://api.webutilspro.com/api/mcp/presets', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setPresets(data.presets);
            }
        } catch (error) {
            console.error('Error loading presets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickConnect = (preset: ServerPreset) => {
        setConnectingPresetId(preset.id);
        onConnect({
            command: preset.command,
            args: preset.args,
            env: preset.env
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (presets.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500 rounded-lg shadow-sm">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">
                        Quick Start Servers
                    </h2>
                    <p className="text-sm text-slate-500">
                        Connect instantly to curated MCP servers with zero configuration.
                    </p>
                </div>
                <div className="hidden sm:block ml-auto">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200/50">
                        Ready to Use
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {presets.map((preset) => (
                    <div
                        key={preset.id}
                        className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-300 transition-all hover:shadow-lg group relative overflow-hidden"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="text-3xl p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                {preset.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                    {preset.name}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed min-h-[32px]">
                                    {preset.description}
                                </p>
                            </div>
                        </div>

                        {/* Features */}
                        {preset.features && preset.features.length > 0 && (
                            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-5 pl-1">
                                {preset.features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600"
                                    >
                                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                            {preset.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] font-bold uppercase tracking-tight bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => handleQuickConnect(preset)}
                            disabled={isConnecting && connectingPresetId === preset.id}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3 px-4 rounded-lg transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 group-hover:shadow-md active:scale-[0.98]"
                        >
                            <Sparkles className="w-4 h-4" />
                            {isConnecting && connectingPresetId === preset.id ? 'Connecting...' : 'Quick Connect'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
