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
    activeConfig?: MCPConfig | null;
}

export default function MCPConfigForm({ onConnect, onDisconnect, isConnected, isConnecting, activeConfig }: MCPConfigFormProps) {
    const [command, setCommand] = useState('npx');
    const [args, setArgs] = useState('');
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-8 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-inner">
                        <Plug2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">MCP Server Configuration</h3>
                        <p className="text-sm text-slate-500">Establish a secure connection to your MCP server</p>
                    </div>
                </div>
                {isConnected && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-emerald-600">Connected</span>
                    </div>
                )}
            </div>

            {!isConnected ? (
                <div className="space-y-6">
                    {/* Command Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Base Command
                        </label>
                        <input
                            type="text"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder="e.g., npx"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-slate-900"
                        />
                    </div>

                    {/* Arguments Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Server Arguments
                        </label>
                        <textarea
                            value={args}
                            onChange={(e) => setArgs(e.target.value)}
                            placeholder="-y @modelcontextprotocol/server-memory"
                            rows={2}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm transition-all text-slate-900"
                        />
                    </div>

                    {/* Environment Variables */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-slate-700">
                                Environment Variables
                            </label>
                            <button
                                onClick={handleAddEnvVar}
                                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Variable
                            </button>
                        </div>
                        {envVars.length > 0 && (
                            <div className="space-y-3">
                                {envVars.map((envVar, index) => (
                                    <div key={index} className="flex gap-2 animate-fade-in">
                                        <input
                                            type="text"
                                            value={envVar.key}
                                            onChange={(e) => handleEnvVarChange(index, 'key', e.target.value)}
                                            placeholder="KEY"
                                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono text-slate-900"
                                        />
                                        <input
                                            type="text"
                                            value={envVar.value}
                                            onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                                            placeholder="value"
                                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900"
                                        />
                                        <button
                                            onClick={() => handleRemoveEnvVar(index)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
                        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-200 disabled:to-slate-300 text-white font-bold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-[0.98]"
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Initializing Session...
                            </>
                        ) : (
                            <>
                                <Plug2 className="w-5 h-5" />
                                Establish Connection
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                            <span className="text-xl">✨</span>
                            <span>Secure Connection Active</span>
                        </div>
                        <div className="text-xs text-emerald-700/80 font-mono p-3 bg-white/60 rounded-lg border border-emerald-200/50">
                            {activeConfig ? (
                                <>
                                    <span className="text-indigo-600 font-bold">{activeConfig.command}</span>{' '}
                                    {activeConfig.args.join(' ')}
                                </>
                            ) : (
                                <>{command} {args}</>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onDisconnect}
                        className="w-full px-6 py-4 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-bold rounded-xl transition-all shadow-sm active:scale-[0.98]"
                    >
                        Terminate Connection
                    </button>
                </div>
            )}
        </div>
    );
}
