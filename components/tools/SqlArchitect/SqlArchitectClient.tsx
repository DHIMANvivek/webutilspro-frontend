'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { COMPLEX_PLAN } from './DemoData';
import { Play, ZoomIn, ZoomOut, AlertTriangle, CloudRain, Database, Activity, Clock, Layers, ArrowRight, CheckCircle2, Copy } from 'lucide-react';

// --- Types ---
interface PlanNode {
    "Node Type": string;
    "Total Cost": number;
    "Startup Cost": number;
    "Plan Rows": number;
    "Actual Rows"?: number;
    "Actual Total Time"?: number;
    "Actual Loops"?: number;
    "Relation Name"?: string;
    "Index Name"?: string;
    "Filter"?: string;
    "Index Cond"?: string;
    "Sort Key"?: string[];
    "Plans"?: PlanNode[];
    [key: string]: any;
}

interface AnalyzedNode extends PlanNode {
    id: string;
    costPercent: number; // 0-100 Relative to root total cost
    timePercent?: number; // 0-100 Relative to root actual time
    isBottleneck: boolean;
    children: AnalyzedNode[];
}

// --- Helpers ---
const parsePlan = (jsonString: string): PlanNode | null => {
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) && parsed[0]?.Plan ? parsed[0].Plan : parsed.Plan ? parsed.Plan : null;
    } catch (e) {
        return null;
    }
};

const analyzeTree = (node: PlanNode, totalTime: number, totalCost: number, depth = 0): AnalyzedNode => {
    const actualTime = node["Actual Total Time"] || 0;
    const cost = node["Total Cost"] || 0;

    // Simple heuristic: A node is a bottleneck if it consumes > 30% of total time exclusive of children
    // (This is a simplified view for visualization)

    const analyzed: AnalyzedNode = {
        ...node,
        id: Math.random().toString(36).substr(2, 9),
        costPercent: (cost / totalCost) * 100,
        timePercent: totalTime > 0 ? (actualTime / totalTime) * 100 : 0,
        isBottleneck: false, // Calculated after children
        children: []
    };

    if (node.Plans) {
        analyzed.children = node.Plans.map(child => analyzeTree(child, totalTime, totalCost, depth + 1));
    }

    // Heuristic: If this node is a Leaf (scan) and high cost/time, OR if it adds significant overhead
    const maxChildTime = Math.max(0, ...analyzed.children.map(c => c["Actual Total Time"] || 0));
    const exclusiveTime = (analyzed["Actual Total Time"] || 0) - maxChildTime;

    if (totalTime > 0 && (exclusiveTime / totalTime) > 0.2) {
        analyzed.isBottleneck = true;
    }

    return analyzed;
};

// --- Sub-Components ---

const NodeCard = ({ node, maxCost, onClick }: { node: AnalyzedNode, maxCost: number, onClick: (n: AnalyzedNode) => void }) => {
    const isHighImpact = node.costPercent > 30 || node.isBottleneck;
    const isScan = node["Node Type"].includes("Scan");

    // Dynamic Styles based on "Heat"
    let borderColor = "border-slate-200";
    let bgColor = "bg-white";
    let glow = "";

    if (node.isBottleneck) {
        borderColor = "border-red-500";
        bgColor = "bg-red-50";
        glow = "shadow-[0_0_15px_rgba(239,68,68,0.4)]";
    } else if (node.costPercent > 50) {
        borderColor = "border-orange-400";
        bgColor = "bg-orange-50";
    }

    const icon = isScan ? <Database size={16} /> : <Activity size={16} />;

    return (
        <div
            onClick={() => onClick(node)}
            className={`
                relative flex flex-col p-4 rounded-xl border-2 ${borderColor} ${bgColor} ${glow} 
                min-w-[280px] max-w-[320px] cursor-pointer transition-all hover:scale-105 hover:z-10
            `}
        >
            {node.isBottleneck && (
                <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-md">
                    BOTTLENECK
                </div>
            )}

            <div className="flex items-center gap-3 mb-3 border-b border-black/5 pb-2">
                <div className={`p-2 rounded-lg ${isHighImpact ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 text-sm">{node["Node Type"]}</h4>
                    {node["Relation Name"] && (
                        <p className="text-xs font-mono text-slate-500">{node["Relation Name"]}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/5 rounded p-2">
                    <span className="block text-slate-400 font-bold uppercase text-[9px]">Rows</span>
                    <span className="font-mono font-semibold text-slate-700">
                        {node["Actual Rows"]?.toLocaleString() || node["Plan Rows"]?.toLocaleString()}
                    </span>
                </div>
                <div className={`${node.isBottleneck ? "bg-red-100" : "bg-black/5"} rounded p-2`}>
                    <span className="block text-slate-400 font-bold uppercase text-[9px]">Time</span>
                    <span className={`font-mono font-semibold ${node.isBottleneck ? "text-red-700" : "text-slate-700"}`}>
                        {node["Actual Total Time"]?.toFixed(2)}ms
                    </span>
                </div>
            </div>

            {/* Connection Node (Visual only) */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-300 rounded-full border-2 border-white z-20"></div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-300 rounded-full border-2 border-white z-20"></div>
        </div>
    );
};

const TreeRenderer = ({ node, maxCost, onSelect }: { node: AnalyzedNode, maxCost: number, onSelect: (n: AnalyzedNode) => void }) => {
    return (
        <div className="flex flex-col items-center">
            <NodeCard node={node} maxCost={maxCost} onClick={onSelect} />

            {node.children.length > 0 && (
                <div className="relative flex justify-center pt-8">
                    {/* Connecting Lines */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-300"></div>

                    {/* Horizontal Bar for multiple children */}
                    {node.children.length > 1 && (
                        <div className="absolute top-8 left-[calc(140px)] right-[calc(140px)] h-0.5 bg-slate-300"
                            style={{
                                width: `calc(100% - 280px)`, // Rough adjustment based on card width
                                left: '50%',
                                transform: 'translateX(-50%)'
                            }}
                        ></div>
                    )}

                    <div className="flex gap-8 items-start">
                        {node.children.map((child, i) => (
                            <div key={child.id} className="relative flex flex-col items-center">
                                {/* Vertical line to child */}
                                {/* This is a simplified CSS tree approach. Complex layouts might need SVG or D3 */}
                                <TreeRenderer node={child} maxCost={maxCost} onSelect={onSelect} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function SqlArchitectClient() {
    const [input, setInput] = useState(COMPLEX_PLAN);
    const [plan, setPlan] = useState<AnalyzedNode | null>(null);
    const [selectedNode, setSelectedNode] = useState<AnalyzedNode | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        handleAnalyze();
    }, []);

    const handleAnalyze = () => {
        const rawNode = parsePlan(input);
        if (!rawNode) {
            setError("Invalid JSON format. Please pass EXPLAIN (ANALYZE, FORMAT JSON) output.");
            setPlan(null);
            return;
        }

        setError(null);
        // Calculate totals for relative percentages
        const totalTime = rawNode["Actual Total Time"] || 0;
        const totalCost = rawNode["Total Cost"] || 0;

        const analyzed = analyzeTree(rawNode, totalTime, totalCost);
        setPlan(analyzed);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[800px]">
            {/* Sidebar: Controls & Input */}
            <div className="w-full lg:w-96 flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                        <Layers size={20} className="text-indigo-600" />
                        Input Plan
                    </h3>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4"
                        placeholder='Paste your EXPLAIN (ANALYZE, FORMAT JSON) output here...'
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleAnalyze}
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                        >
                            <Play size={16} /> Visualize
                        </button>
                        <button
                            onClick={() => setInput('')}
                            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
                        >
                            Clear
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-start gap-2">
                            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Selected Node Details */}
                <div className={`
                    bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex-1 transition-all duration-300
                    ${selectedNode ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}
                `}>
                    <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-emerald-600" />
                        Node Analysis
                    </h3>
                    {selectedNode ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Operation</h4>
                                <p className="text-slate-900 font-bold text-lg">{selectedNode["Node Type"]}</p>
                                {selectedNode["Relation Name"] && (
                                    <p className="text-slate-500 font-mono text-sm">{selectedNode["Relation Name"]}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="text-xs text-slate-500 mb-1">Actual Rows</div>
                                    <div className="font-mono font-bold text-slate-800">{selectedNode["Actual Rows"]?.toLocaleString()}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="text-xs text-slate-500 mb-1">Loops</div>
                                    <div className="font-mono font-bold text-slate-800">{selectedNode["Actual Loops"]}</div>
                                </div>
                            </div>

                            {(selectedNode["Filter"] || selectedNode["Index Cond"]) && (
                                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                    <div className="text-xs text-amber-700 font-bold mb-1 flex items-center gap-1">
                                        <AlertTriangle size={10} /> Filter / Condition
                                    </div>
                                    <code className="text-xs text-amber-900 break-all">
                                        {selectedNode["Filter"] || selectedNode["Index Cond"]}
                                    </code>
                                </div>
                            )}

                            {selectedNode.isBottleneck && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                    <h5 className="text-red-800 font-bold text-sm mb-1">Performance Bottleneck</h5>
                                    <p className="text-xs text-red-600 leading-relaxed">
                                        This node consumes a significant portion of execution time.
                                        {selectedNode["Node Type"] === 'Seq Scan' ? ' Consider adding an index on the filtered columns.' : ' Check if this operation can be optimized.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                            <CloudRain size={48} className="mb-4 opacity-50" />
                            <p className="text-sm">Select a node in the diagram to view deep analytics.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Visualization Canvas */}
            <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner overflow-hidden relative">
                <style jsx>{`
                    .architect-grid {
                        background-color: #f8fafc;
                        background-image: 
                            linear-gradient(#e2e8f0 1px, transparent 1px),
                            linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
                        background-size: 40px 40px;
                    }
                `}</style>

                <div className="absolute inset-0 architect-grid overflow-auto cursor-grab active:cursor-grabbing p-20 min-w-full min-h-full flex justify-center items-start">
                    {plan && (
                        <div className="transform origin-top transition-transform duration-200">
                            <TreeRenderer node={plan} maxCost={plan["Total Cost"]} onSelect={setSelectedNode} />
                        </div>
                    )}
                    {!plan && !error && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                            <div className="text-center">
                                <Layers size={64} className="mx-auto mb-4 text-slate-400" />
                                <p className="text-2xl font-black text-slate-300">Ready to Visualize</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                    <button className="p-3 bg-white rounded-full shadow-lg border border-slate-100 text-slate-600 hover:text-indigo-600 hover:scale-110 transition-all">
                        <ZoomIn size={20} />
                    </button>
                    <button className="p-3 bg-white rounded-full shadow-lg border border-slate-100 text-slate-600 hover:text-indigo-600 hover:scale-110 transition-all">
                        <ZoomOut size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
