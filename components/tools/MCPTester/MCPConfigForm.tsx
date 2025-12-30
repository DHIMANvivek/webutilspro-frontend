'use client';

import { useState } from 'react';
import { Plug2, Loader2, Plus, X } from 'lucide-react';

interface MCPConfig {
    command: string;
    args: string[];
    env: Record<string, string>;
}

interface MCPConfigFormProps {
    onConnect: (config: MCPConfig) => Promise<void>;
    onDisconnect: () => Promise<void>;
    isConnected: boolean;
    isConnecting: boolean;
}

export default function MCPConfigForm({ onConnect, onDisconnect, isConnected, isConnecting }: MCPConfigFormProps) {
    const [command, setCommand] = useState('npx');
    const [args, setArgs] = useState('-y @modelcontextprotocol/server-filesystem /tmp');
    const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>([]);

    const handleAddEnvVar = () => {
        setEnvVars([...envVars, { key: '', value: '' }]);
    };

    const handleRemoveEnvVar = (index: number) => {
        setEnvVars(envVars.filter((_, i) => i !== index));
    };

    const handleEnvVarChange = (index: number, field: 'key' | 'value', value: string) => {
        const newEnvVars = [...envVars];
        newEnvVars[index][field] = value;
        setEnvVars(newEnvVars);
    };

    const handleConnect = async () => {
        const config: MCPConfig = {
            command: command.trim(),
            args: args.trim().split(/\s+/).filter(a => a),
            env: envVars.reduce((acc, { key, value }) => {
                if (key.trim()) {
                    acc[key.trim()] = value;
                }
                return acc;
            }, {} as Record<string, string>)
        };

        await onConnect(config);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                        <Plug2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MCP Server Configuration</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Configure your MCP server connection</p>
                    </div>
                </div>
                {isConnected && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
                    </div>
                )}
            </div>

            {!isConnected ? (
                <div className="space-y-4">
                    {/* Command Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Command
                        </label>
                        <input
                            type="text"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder="npx"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {/* Arguments Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Arguments
                        </label>
                        <textarea
                            value={args}
                            onChange={(e) => setArgs(e.target.value)}
                            placeholder="-y @modelcontextprotocol/server-filesystem /tmp"
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
                        />
                    </div>

                    {/* Environment Variables */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Environment Variables (Optional)
                            </label>
                            <button
                                onClick={handleAddEnvVar}
                                className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                        {envVars.length > 0 && (
                            <div className="space-y-2">
                                {envVars.map((envVar, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={envVar.key}
                                            onChange={(e) => handleEnvVarChange(index, 'key', e.target.value)}
                                            placeholder="KEY"
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm font-mono"
                                        />
                                        <input
                                            type="text"
                                            value={envVar.value}
                                            onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                                            placeholder="value"
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
                                        />
                                        <button
                                            onClick={() => handleRemoveEnvVar(index)}
                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Connect Button */}
                    <button
                        onClick={handleConnect}
                        disabled={isConnecting || !command.trim()}
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <Plug2 className="w-5 h-5" />
                                Connect to MCP Server
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <p className="text-sm text-green-800 dark:text-green-300">
                            ✅ Successfully connected to MCP server!
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-400 mt-1 font-mono">
                            {command} {args}
                        </p>
                    </div>
                    <button
                        onClick={onDisconnect}
                        className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
}
