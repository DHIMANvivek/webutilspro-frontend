'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Wrench, FileText, MessageSquare, Copy, Check, RefreshCw, Loader2 } from 'lucide-react';

interface Tool {
    name: string;
    description?: string;
    inputSchema?: any;
}

interface Resource {
    uri: string;
    name?: string;
    description?: string;
    mimeType?: string;
}

interface Prompt {
    name: string;
    description?: string;
    arguments?: any[];
}

interface MCPDiscoveryPanelProps {
    tools: Tool[];
    resources: Resource[];
    prompts: Prompt[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

export default function MCPDiscoveryPanel({ tools, resources, prompts, isLoading, onRefresh }: MCPDiscoveryPanelProps) {
    const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());
    const [copiedItem, setCopiedItem] = useState<string | null>(null);

    const toggleExpand = (name: string) => {
        const newExpanded = new Set(expandedTools);
        if (newExpanded.has(name)) {
            newExpanded.delete(name);
        } else {
            newExpanded.add(name);
        }
        setExpandedTools(newExpanded);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(id);
        setTimeout(() => setCopiedItem(null), 2000);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discovered Capabilities</h3>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 disabled:opacity-50 transition-colors"
                        title="Refresh Capabilities"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                )}
            </div>

            {/* Tools Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        Tools ({tools.length})
                    </h4>
                </div>
                {isLoading && tools.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Discovering tools...</span>
                    </div>
                ) : tools.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No tools available</p>
                ) : (
                    <div className="space-y-2">
                        {tools.map((tool) => (
                            <div key={tool.name} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <div
                                    onClick={() => toggleExpand(tool.name)}
                                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        {expandedTools.has(tool.name) ? (
                                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        )}
                                        <code className="text-sm font-mono text-purple-600 dark:text-purple-400">{tool.name}</code>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(tool.name, tool.name);
                                        }}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                    >
                                        {copiedItem === tool.name ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                {expandedTools.has(tool.name) && (
                                    <div className="px-3 pb-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                                        {tool.description && (
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 mt-2">{tool.description}</p>
                                        )}
                                        {tool.inputSchema && (
                                            <pre className="text-xs bg-gray-900 dark:bg-gray-950 text-gray-100 p-2 rounded overflow-x-auto">
                                                {JSON.stringify(tool.inputSchema, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Resources Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        Resources ({resources.length})
                    </h4>
                </div>
                {isLoading && resources.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Discovering resources...</span>
                    </div>
                ) : resources.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No resources available</p>
                ) : (
                    <div className="space-y-2">
                        {resources.map((resource, idx) => (
                            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <code className="text-sm font-mono text-blue-600 dark:text-blue-400">{resource.uri}</code>
                                    <button
                                        onClick={() => copyToClipboard(resource.uri, `resource-${idx}`)}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                    >
                                        {copiedItem === `resource-${idx}` ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                {resource.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{resource.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Prompts Section */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        Prompts ({prompts.length})
                    </h4>
                </div>
                {isLoading && prompts.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Discovering prompts...</span>
                    </div>
                ) : prompts.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No prompts available</p>
                ) : (
                    <div className="space-y-2">
                        {prompts.map((prompt) => (
                            <div key={prompt.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <code className="text-sm font-mono text-green-600 dark:text-green-400">{prompt.name}</code>
                                    <button
                                        onClick={() => copyToClipboard(prompt.name, prompt.name)}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                    >
                                        {copiedItem === prompt.name ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                {prompt.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{prompt.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
