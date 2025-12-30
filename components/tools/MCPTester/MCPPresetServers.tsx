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
            const response = await fetch('/api/mcp/presets', {
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
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    if (presets.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Quick Start Servers
                </h2>
                <span className="ml-auto text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                    No Setup Required
                </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Connect instantly to these preset servers - no API keys or configuration needed!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {presets.map((preset) => (
                    <div
                        key={preset.id}
                        className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-md group"
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <span className="text-2xl">{preset.icon}</span>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {preset.name}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    {preset.description}
                                </p>

                                {/* Features */}
                                {preset.features && preset.features.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {preset.features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400"
                                            >
                                                <Check className="w-3 h-3" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                            {preset.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => handleQuickConnect(preset)}
                            disabled={isConnecting && connectingPresetId === preset.id}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group-hover:shadow-lg"
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
