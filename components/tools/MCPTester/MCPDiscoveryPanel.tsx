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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900">Discovered Capabilities</h3>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-2.5 bg-slate-50 text-slate-500 hover:text-indigo-600 disabled:opacity-50 transition-all rounded-lg border border-slate-200 hover:border-indigo-100"
                        title="Refresh Capabilities"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                )}
            </div>

            {/* Tools Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Wrench className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h4 className="font-bold text-slate-800">
                            Executable Tools
                        </h4>
                    </div>
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
                        {tools.length}
                    </span>
                </div>
                {isLoading && tools.length === 0 ? (
                    <div className="flex items-center gap-3 text-sm text-slate-500 py-6 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                        <span>Discovering available tools...</span>
                    </div>
                ) : tools.length === 0 ? (
                    <p className="text-sm text-slate-500 italic py-4">No tools discovered yet</p>
                ) : (
                    <div className="space-y-3">
                        {tools.map((tool) => (
                            <div key={tool.name} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm transition-all hover:border-indigo-100">
                                <div
                                    onClick={() => toggleExpand(tool.name)}
                                    className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="p-1 bg-slate-50 rounded">
                                            {expandedTools.has(tool.name) ? (
                                                <ChevronDown className="w-4 h-4 text-slate-500" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-slate-500" />
                                            )}
                                        </div>
                                        <code className="text-sm font-bold font-mono text-indigo-600">{tool.name}</code>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(tool.name, tool.name);
                                        }}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                    >
                                        {copiedItem === tool.name ? (
                                            <Check className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {expandedTools.has(tool.name) && (
                                    <div className="px-4 pb-4 pt-1 bg-slate-50 border-t border-slate-100 animate-slide-up">
                                        {tool.description && (
                                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{tool.description}</p>
                                        )}
                                        {tool.inputSchema && (
                                            <div className="relative group">
                                                <div className="absolute top-2 right-2 text-xs font-mono text-slate-400 uppercase tracking-wider">Schema</div>
                                                <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto shadow-inner border border-slate-800">
                                                    {JSON.stringify(tool.inputSchema, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Resources Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-slate-800">
                            Available Resources
                        </h4>
                    </div>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                        {resources.length}
                    </span>
                </div>
                {isLoading && resources.length === 0 ? (
                    <div className="flex items-center gap-3 text-sm text-slate-500 py-6 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        <span>Discovering resources...</span>
                    </div>
                ) : resources.length === 0 ? (
                    <p className="text-sm text-slate-500 italic py-4">No resources discovered</p>
                ) : (
                    <div className="space-y-3">
                        {resources.map((resource, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-blue-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        <code className="text-sm font-bold font-mono text-blue-600 break-all">{resource.uri}</code>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(resource.uri, `resource-${idx}`)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    >
                                        {copiedItem === `resource-${idx}` ? (
                                            <Check className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {resource.description && (
                                    <p className="text-sm text-slate-600 leading-relaxed pl-3.5">{resource.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Prompts Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h4 className="font-bold text-slate-800">
                            Defined Prompts
                        </h4>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                        {prompts.length}
                    </span>
                </div>
                {isLoading && prompts.length === 0 ? (
                    <div className="flex items-center gap-3 text-sm text-slate-500 py-6 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        <span>Discovering prompts...</span>
                    </div>
                ) : prompts.length === 0 ? (
                    <p className="text-sm text-slate-500 italic py-4">No prompts discovered</p>
                ) : (
                    <div className="space-y-3">
                        {prompts.map((prompt) => (
                            <div key={prompt.name} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-emerald-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <code className="text-sm font-bold font-mono text-emerald-600">{prompt.name}</code>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(prompt.name, prompt.name)}
                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                    >
                                        {copiedItem === prompt.name ? (
                                            <Check className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {prompt.description && (
                                    <p className="text-sm text-slate-600 leading-relaxed pl-3.5">{prompt.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
