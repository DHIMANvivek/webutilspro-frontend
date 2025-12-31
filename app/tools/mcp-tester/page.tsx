'use client';

import { useState, useEffect } from 'react';
import MCPConfigForm from '@/components/tools/MCPTester/MCPConfigForm';
import MCPDiscoveryPanel from '@/components/tools/MCPTester/MCPDiscoveryPanel';
import MCPChatInterface from '@/components/tools/MCPTester/MCPChatInterface';
import MCPPresetServers from '@/components/tools/MCPTester/MCPPresetServers';
import { AlertCircle } from 'lucide-react';

interface MCPConfig {
    command: string;
    args: string[];
    env: Record<string, string>;
}

export default function MCPTesterPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        MCP Tool Tester
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Test any Model Context Protocol (MCP) server with dynamic configuration and AI-powered interactions
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-red-800 dark:text-red-300">Connection Error</h4>
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
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
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">Manual Configuration Examples</h3>
                        <div className="text-sm text-blue-800 dark:text-blue-400 space-y-2">
                            <p><strong>More MCP Server Configurations:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>
                                    <strong>DuckDuckGo Search:</strong> Command: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">npx</code>,
                                    Args: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">-y duckduckgo-mcp-server</code> (No env needed!)
                                </li>
                                <li>
                                    <strong>Filesystem Server:</strong> Command: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">npx</code>,
                                    Args: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">-y @modelcontextprotocol/server-filesystem /tmp</code>
                                </li>
                                <li>
                                    <strong>Memory Server:</strong> Command: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">npx</code>,
                                    Args: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">-y @modelcontextprotocol/server-memory</code>
                                </li>
                                <li>
                                    <strong>GitHub Server:</strong> Command: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">npx</code>,
                                    Args: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">-y @modelcontextprotocol/server-github</code>,
                                    Env: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">GITHUB_TOKEN=[your token]</code>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
