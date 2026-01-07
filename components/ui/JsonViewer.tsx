'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface JsonViewerProps {
    data: any;
    label?: string;
    depth?: number;
    initiallyExpanded?: boolean;
}

export default function JsonViewer({ data, label, depth = 0, initiallyExpanded = true }: JsonViewerProps) {
    const [isExpanded, setIsExpanded] = useState(depth < 2 || initiallyExpanded);

    const isObject = data !== null && typeof data === 'object';
    const isArray = Array.isArray(data);

    // Values that don't need a tree
    if (!isObject) {
        return (
            <div className="flex items-start gap-2 py-0.5 ml-6">
                {label && <span className="text-purple-600 font-medium">{label}:</span>}
                <span className={`
                    ${typeof data === 'string' ? 'text-green-600' : ''}
                    ${typeof data === 'number' ? 'text-blue-600' : ''}
                    ${typeof data === 'boolean' ? 'text-orange-600' : ''}
                    ${data === null ? 'text-gray-400 italic' : ''}
                `}>
                    {typeof data === 'string' ? `"${data}"` : String(data)}
                </span>
            </div>
        );
    }

    const toggle = () => setIsExpanded(!isExpanded);

    const childCount = isArray ? data.length : Object.keys(data).length;

    return (
        <div className="font-mono text-sm">
            <div
                className="flex items-center gap-1 cursor-pointer hover:bg-slate-100/50 rounded px-1 -ml-1 py-0.5 transition-colors group"
                onClick={toggle}
            >
                <div className="w-4 h-4 flex items-center justify-center text-slate-400 group-hover:text-primary-500">
                    {childCount > 0 ? (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) : null}
                </div>

                {label && <span className="text-purple-600 font-medium">{label}:</span>}

                <span className="text-slate-500">
                    {isArray ? '[' : '{'}
                    {!isExpanded && (
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] mx-1">
                            {childCount} {childCount === 1 ? 'item' : 'items'}
                        </span>
                    )}
                    {!isExpanded && (isArray ? ']' : '}')}
                </span>

                {isExpanded && depth === 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                            toast.success('JSON copied!');
                        }}
                        className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-white rounded transition-all text-slate-400 hover:text-primary-600"
                        title="Copy JSON"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {isExpanded && childCount > 0 && (
                <div className="ml-4 border-l border-slate-200 pl-2">
                    {isArray ? (
                        data.map((item, index) => (
                            <JsonViewer key={index} data={item} label={String(index)} depth={depth + 1} />
                        ))
                    ) : (
                        Object.entries(data).map(([key, value]) => (
                            <JsonViewer key={key} data={value} label={key} depth={depth + 1} />
                        ))
                    )}
                </div>
            )}

            {isExpanded && (
                <div className="text-slate-500 ml-6">
                    {isArray ? ']' : '}'}
                </div>
            )}
        </div>
    );
}
