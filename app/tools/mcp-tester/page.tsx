'use client';

import { useState, useEffect } from 'react';
import MCPConfigForm from '@/components/tools/MCPTester/MCPConfigForm';
import MCPDiscoveryPanel from '@/components/tools/MCPTester/MCPDiscoveryPanel';
import MCPChatInterface from '@/components/tools/MCPTester/MCPChatInterface';
import MCPPresetServers from '@/components/tools/MCPTester/MCPPresetServers';
import { AlertCircle, BookOpen } from 'lucide-react';

interface MCPConfig {
    command: string;
    args: string[];
    env: Record<string, string>;
}

export default function MCPTesterPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [activeConfig, setActiveConfig] = useState<MCPConfig | null>(null);
    const [tools, setTools] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [prompts, setPrompts] = useState<any[]>([]);
    const [isLoadingCapabilities, setIsLoadingCapabilities] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check connection status on mount
    useEffect(() => {
        checkConnectionStatus();
    }, []);

    const checkConnectionStatus = async () => {
        try {
            const response = await fetch('/api/mcp/status', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.connected) {
                    setIsConnected(true);
                    await loadCapabilities();
                } else {
                    setIsConnected(false);
                }
            } else {
                setIsConnected(false);
            }
        } catch (error) {
            console.error('Error checking connection status:', error);
            setIsConnected(false);
        }
    };

    const handleConnect = async (config: MCPConfig) => {
        setIsConnecting(true);
        setError(null);

        try {
            const response = await fetch('/api/mcp/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(config)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to connect');
            }

            setIsConnected(true);
            setActiveConfig(config);
            // Wait a moment for the server to fully initialize its tools
            await new Promise(resolve => setTimeout(resolve, 1000));
            const loadedTools = await loadCapabilities();

            // If no tools found, try one more time after a short delay
            if (loadedTools.length === 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                await loadCapabilities();
            }
        } catch (error: any) {
            setError(error.message);
            console.error('Connection error:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            await fetch('/api/mcp/disconnect', {
                method: 'POST',
                credentials: 'include'
            });
            setIsConnected(false);
            setActiveConfig(null);
            setTools([]);
            setResources([]);
            setPrompts([]);
            setError(null);
        } catch (error) {
            console.error('Disconnect error:', error);
        }
    };

    const loadCapabilities = async () => {
        setIsLoadingCapabilities(true);
        try {
            const response = await fetch('/api/mcp/capabilities', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setTools(data.tools || []);
                    setResources(data.resources || []);
                    setPrompts(data.prompts || []);
                    return data.tools || [];
                }
            }
            return [];
        } catch (error) {
            console.error('Error loading capabilities:', error);
            setTools([]);
            setResources([]);
            setPrompts([]);
            return [];
        } finally {
            setIsLoadingCapabilities(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-10 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        MCP Tool Tester
                    </h1>
                    <p className="text-lg text-slate-600">
                        Test any Model Context Protocol (MCP) server with dynamic configuration and AI-powered interactions.
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4 shadow-sm animate-shake">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-900">Connection Error</h4>
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Preset Servers - Show when not connected */}
                {!isConnected && (
                    <div className="mb-6">
                        <MCPPresetServers
                            onConnect={handleConnect}
                            isConnecting={isConnecting}
                        />
                    </div>
                )}

                {/* Manual Configuration Form */}
                <div className="mb-6">
                    <MCPConfigForm
                        onConnect={handleConnect}
                        onDisconnect={handleDisconnect}
                        isConnected={isConnected}
                        isConnecting={isConnecting}
                        activeConfig={activeConfig}
                    />
                </div>

                {/* Discovery and Chat - Only show when connected */}
                {isConnected && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Discovery Panel */}
                        <div>
                            <MCPDiscoveryPanel
                                tools={tools}
                                resources={resources}
                                prompts={prompts}
                                isLoading={isLoadingCapabilities}
                                onRefresh={loadCapabilities}
                            />
                        </div>

                        {/* Chat Interface */}
                        <div>
                            <MCPChatInterface />
                        </div>
                    </div>
                )}

                {/* Help Section */}
                {!isConnected && (
                    <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                            <BookOpen className="w-32 h-32 text-slate-900" />
                        </div>

                        <div className="relative flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <BookOpen className="w-5 h-5 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Manual Configuration Examples</h3>
                        </div>

                        <div className="relative text-sm text-slate-600 space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-slate-100"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                                    More MCP Server Configurations
                                </span>
                                <div className="h-px flex-1 bg-slate-100"></div>
                            </div>

                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    {
                                        name: 'DuckDuckGo Search',
                                        cmd: 'npx',
                                        args: '-y duckduckgo-mcp-server',
                                        note: '(No env needed!)'
                                    },
                                    {
                                        name: 'Filesystem Server',
                                        cmd: 'npx',
                                        args: '-y @modelcontextprotocol/server-filesystem /tmp'
                                    },
                                    {
                                        name: 'Memory Server',
                                        cmd: 'npx',
                                        args: '-y @modelcontextprotocol/server-memory'
                                    },
                                    {
                                        name: 'GitHub Server',
                                        cmd: 'npx',
                                        args: '-y @modelcontextprotocol/server-github',
                                        env: 'GITHUB_TOKEN=[your token]'
                                    }
                                ].map((item, idx) => (
                                    <li key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group/item shadow-sm hover:shadow-md">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-slate-900 group-hover/item:text-indigo-600 transition-colors">
                                                {item.name}
                                            </span>
                                            {item.note && (
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                                    {item.note}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 w-12 shrink-0">CMD:</span>
                                                <code className="text-[11px] bg-white border border-slate-200 px-2 py-1 rounded-md font-mono text-slate-700 w-full">
                                                    {item.cmd}
                                                </code>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 w-12 shrink-0 mt-1">ARGS:</span>
                                                <code className="text-[11px] bg-white border border-slate-200 px-2 py-1 rounded-md font-mono text-slate-700 w-full break-all">
                                                    {item.args}
                                                </code>
                                            </div>
                                            {item.env && (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 w-12 shrink-0 mt-1">ENV:</span>
                                                    <code className="text-[11px] bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md font-mono text-indigo-700 w-full break-all">
                                                        {item.env}
                                                    </code>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
