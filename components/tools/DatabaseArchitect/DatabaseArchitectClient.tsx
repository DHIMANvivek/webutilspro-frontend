'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
    Position,
    Connection,
    Edge,
    Node,
    Panel,
    BackgroundVariant,
    getBezierPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    Database,
    Plus,
    Trash2,
    Copy,
    Check,
    Zap,
    Layers,
    ChevronRight,
    Settings2,
    Table as TableIcon,
    Link as LinkIcon,
    Code2,
    FileCode,
    Download,
    Share2,
    Sparkles,
    X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { toPng } from 'html-to-image';

// --- Types ---
interface Column {
    id: string;
    name: string;
    type: string;
    isPK: boolean;
    isFK: boolean;
    isUnique: boolean;
    isNullable: boolean;
}

interface TableData extends Record<string, unknown> {
    name: string;
    columns: Column[];
    color?: string;
}

// --- Custom Table Node ---
const TableNode = ({ data, id }: { data: TableData; id: string }) => {
    return (
        <div className="min-w-[240px] overflow-hidden border-2 border-neutral-900/20 bg-[#fbfbf4]">
            {/* Table Header */}
            <div className="flex items-center justify-between border-b border-neutral-900/15 bg-neutral-950 px-4 py-3 pb-4 text-white">
                <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-[#fbff5d]" />
                    <span className="text-[13px] font-black uppercase tracking-normal text-white">
                        {data.name}
                    </span>
                </div>
            </div>

            {/* Columns List */}
            <div className="p-1 space-y-0.5">
                {data.columns.map((col) => (
                    <div key={col.id} className="group/col relative flex items-center justify-between px-4 py-2 transition-colors hover:bg-[#ffffd9]">
                        {/* Input Handle for Relationships */}
                        <Handle
                            type="target"
                            position={Position.Left}
                            id={col.id}
                            className="!-left-1.5 h-2.5 w-2.5 !border-[#fbfbf4] !bg-neutral-950"
                        />

                        <div className="flex items-center gap-3 overflow-hidden">
                            <span className={`truncate text-[11px] font-bold ${col.isPK ? 'text-neutral-950' : 'text-neutral-700'}`}>
                                {col.name}
                            </span>
                            <span className="border border-neutral-900/15 bg-[#fbff5d] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-neutral-700">
                                {col.type}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {col.isPK && <Zap className="w-3 h-3 text-amber-500" />}
                            {col.isFK && <LinkIcon className="h-3 w-3 text-neutral-950" />}
                        </div>

                        {/* Output Handle for Relationships */}
                        <Handle
                            type="source"
                            position={Position.Right}
                            id={col.id}
                            className="!-right-1.5 h-2.5 w-2.5 !border-[#fbfbf4] !bg-neutral-950"
                        />
                    </div>
                ))}
            </div>

            {/* Add Column Quick Action */}
            <div className="border-t border-neutral-900/15 bg-[#fbfbf4] p-3 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    {data.columns.length} Fields
                </span>
            </div>
        </div>
    );
};

// --- Custom Edge with Cardinality ---
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }: any) => {
    const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

    return (
        <>
            <path id={id} style={style} className="react-flow__edge-path stroke-[2.5px] stroke-neutral-950/40" d={edgePath} markerEnd={markerEnd} />
            <g transform={`translate(${sourceX + 20}, ${sourceY})`}>
                <rect x="-8" y="-8" width="16" height="16" fill="#fbff5d" className="stroke-neutral-950 stroke-1" />
                <text x="0" y="4" textAnchor="middle" className="fill-neutral-950 text-[10px] font-black">1</text>
            </g>
            <g transform={`translate(${targetX - 20}, ${targetY})`}>
                <rect x="-8" y="-8" width="16" height="16" fill="#fbff5d" className="stroke-neutral-950 stroke-1" />
                <text x="0" y="5" textAnchor="middle" className="fill-neutral-950 text-[12px] font-black">∞</text>
            </g>
        </>
    );
};

// --- Node Types Definition ---
const nodeTypes = {
    table: TableNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

// --- Initial Data ---
const initialNodes: Node<TableData>[] = [
    {
        id: 'user',
        type: 'table',
        position: { x: 100, y: 100 },
        data: {
            name: 'User',
            columns: [
                { id: 'u1', name: 'id', type: 'String', isPK: true, isFK: false, isUnique: true, isNullable: false },
                { id: 'u3', name: 'createdAt', type: 'DateTime', isPK: false, isFK: false, isUnique: false, isNullable: false },
            ],
        },
    },
    {
        id: 'post',
        type: 'table',
        position: { x: 500, y: 150 },
        data: {
            name: 'Post',
            columns: [
                { id: 'p1', name: 'id', type: 'String', isPK: true, isFK: false, isUnique: true, isNullable: false },
                { id: 'p3', name: 'authorId', type: 'String', isPK: false, isFK: true, isUnique: false, isNullable: false },
            ],
        },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'user', sourceHandle: 'u1', target: 'post', targetHandle: 'p3', type: 'custom' },
];

export default function DatabaseArchitectClient() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<TableData>>(initialNodes as Node<TableData>[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [exportMode, setExportMode] = useState<'prisma' | 'sql' | 'drizzle'>('prisma');
    const [copied, setCopied] = useState(false);
    const [showMagicImport, setShowMagicImport] = useState(false);
    const [importSql, setImportSql] = useState('');

    // --- Handlers ---
    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'custom', animated: true }, eds)),
        [setEdges],
    );

    const downloadImage = () => {
        const designer = document.querySelector('.react-flow__pane') as HTMLElement;
        if (designer) {
            toPng(designer, { backgroundColor: '#ffffff', width: 2400, height: 1600 })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `webutilspro-db-schema-${Date.now()}.png`;
                    link.href = dataUrl;
                    link.click();
                    toast.success('High-res schema exported!');
                })
                .catch(() => toast.error('Export failed. Try a smaller schema.'));
        }
    };

    const magicImport = () => {
        // Simple basic regex parser for CREATE TABLE
        const tables: any[] = [];
        const tableRegex = /CREATE TABLE (\w+) \(([\s\S]+?)\);/gi;
        let match;

        while ((match = tableRegex.exec(importSql)) !== null) {
            const tableName = match[1];
            const columnLines = match[2].split(',').map(l => l.trim());
            const columns = columnLines.map((line, i) => {
                const parts = line.split(/\s+/);
                const name = parts[0];
                const type = parts[1] || 'String';
                return {
                    id: `${tableName}_c${i}`,
                    name,
                    type: type.includes('INT') ? 'Int' : type.includes('VARCHAR') ? 'String' : 'DateTime',
                    isPK: line.toUpperCase().includes('PRIMARY KEY'),
                    isFK: line.toUpperCase().includes('FOREIGN KEY'),
                    isUnique: line.toUpperCase().includes('UNIQUE'),
                    isNullable: !line.toUpperCase().includes('NOT NULL'),
                };
            });
            tables.push({ name: tableName, columns });
        }

        if (tables.length > 0) {
            const newNodes: Node<TableData>[] = tables.map((t, idx) => ({
                id: t.name.toLowerCase(),
                type: 'table',
                position: { x: (idx % 3) * 350 + 100, y: Math.floor(idx / 3) * 350 + 100 },
                data: { name: t.name, columns: t.columns },
            }));
            setNodes(newNodes);
            setEdges([]);
            setShowMagicImport(false);
            setImportSql('');
            toast.success(`Imported ${tables.length} tables!`);
        } else {
            toast.error('Could not parse SQL. Ensure standard CREATE TABLE... format.');
        }
    };

    const addTable = () => {
        const id = `table_${Date.now()}`;
        const newNode: Node<TableData> = {
            id,
            type: 'table',
            position: { x: nodes.length * 50 + 100, y: nodes.length * 50 + 100 },
            data: {
                name: `NewTable_${nodes.length + 1}`,
                columns: [
                    { id: `${id}_c1`, name: 'id', type: 'String', isPK: true, isFK: false, isUnique: true, isNullable: false },
                ],
            },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        setSelectedTableId(node.id);
    };

    const selectedTable = useMemo(() => {
        if (!selectedTableId) return null;
        return nodes.find((n) => n.id === selectedTableId) as Node<TableData> | undefined;
    }, [selectedTableId, nodes]);

    const updateTableName = (newName: string) => {
        if (!selectedTableId) return;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedTableId) {
                    return { ...node, data: { ...node.data, name: newName } };
                }
                return node;
            })
        );
    };

    const addColumn = () => {
        if (!selectedTableId) return;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedTableId) {
                    const data = node.data;
                    const newCol: Column = {
                        id: `c_${Date.now()}`,
                        name: `new_column_${data.columns.length + 1}`,
                        type: 'String',
                        isPK: false,
                        isFK: false,
                        isUnique: false,
                        isNullable: true,
                    };
                    return { ...node, data: { ...data, columns: [...data.columns, newCol] } };
                }
                return node;
            })
        );
    };

    const removeColumn = (colId: string) => {
        if (!selectedTableId) return;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedTableId) {
                    const data = node.data;
                    return { ...node, data: { ...data, columns: data.columns.filter((c) => c.id !== colId) } };
                }
                return node;
            })
        );
    };

    const deleteTable = () => {
        if (!selectedTableId) return;
        setNodes((nds) => nds.filter((n) => n.id !== selectedTableId));
        setEdges((eds) => eds.filter((e) => e.source !== selectedTableId && e.target !== selectedTableId));
        setSelectedTableId(null);
    };

    const copyCode = () => {
        const code = generateCode();
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success(`${exportMode.toUpperCase()} code copied!`);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- Code Generation ---
    const generateCode = () => {
        if (exportMode === 'prisma') {
            return nodes.map((node) => {
                const data = node.data;
                let model = `model ${data.name} {\n`;
                data.columns.forEach((col) => {
                    let line = `  ${col.name.padEnd(12)} ${col.type}${col.isNullable ? '?' : ''}`;
                    if (col.isPK) line += ' @id @default(cuid())';
                    if (col.isUnique && !col.isPK) line += ' @unique';
                    model += line + '\n';
                });

                // Add relations logic based on edges
                const relationships = edges.filter(e => e.source === node.id || e.target === node.id);
                relationships.forEach(edge => {
                    if (edge.source === node.id) {
                        const targetNode = nodes.find(n => n.id === edge.target) as Node<TableData> | undefined;
                        if (targetNode) {
                            model += `  ${targetNode.data.name.toLowerCase()} ${targetNode.data.name} @relation(fields: [${data.columns.find(c => c.id === edge.sourceHandle)?.name}], references: [${targetNode.data.columns.find(c => c.id === edge.targetHandle)?.name}])\n`;
                        }
                    }
                });

                return model + '}\n';
            }).join('\n');
        }

        if (exportMode === 'sql') {
            return nodes.map((node) => {
                const data = node.data;
                let sql = `CREATE TABLE ${data.name} (\n`;
                const colLines = data.columns.map((col) => {
                    let line = `  ${col.name} ${col.type.toUpperCase()}`;
                    if (col.isPK) line += ' PRIMARY KEY';
                    if (col.isUnique) line += ' UNIQUE';
                    if (!col.isNullable) line += ' NOT NULL';
                    return line;
                });

                // Add foreign keys from edges
                const fks = edges.filter(e => e.target === node.id);
                fks.forEach(edge => {
                    const sourceNode = nodes.find(n => n.id === edge.source) as Node<TableData> | undefined;
                    const sourceCol = sourceNode?.data?.columns.find(c => c.id === edge.sourceHandle);
                    const targetCol = data.columns.find(c => c.id === edge.targetHandle);
                    if (sourceNode && sourceCol && targetCol) {
                        colLines.push(`  FOREIGN KEY (${targetCol.name}) REFERENCES ${sourceNode.data.name}(${sourceCol.name})`);
                    }
                });

                return sql + colLines.join(',\n') + '\n);';
            }).join('\n\n');
        }

        return '// Drizzle export coming soon...';
    };

    return (
        <div className="relative flex h-[calc(100vh-120px)] min-h-[700px] w-full flex-col overflow-hidden border-y border-neutral-900/15 bg-[#fbfbf4]">

            {/* Magic Import Overlay */}
            {showMagicImport && (
                <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-neutral-950/70 p-20 backdrop-blur-xl">
                    <div className="w-full max-w-4xl space-y-8 border border-neutral-900/15 bg-[#fbfbf4] p-12">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-black uppercase tracking-normal text-neutral-950">Magic SQL Import</h3>
                            <button onClick={() => setShowMagicImport(false)} className="border border-neutral-900/15 bg-[#fbfbf4] p-3 text-neutral-500 hover:border-neutral-950 hover:text-neutral-950">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="font-medium text-neutral-600">Paste your SQL <code className="font-bold uppercase text-neutral-950">CREATE TABLE</code> statements below to instantly generate a visual ERD.</p>
                        <textarea
                            value={importSql}
                            onChange={(e) => setImportSql(e.target.value)}
                            placeholder={`CREATE TABLE Users (\n  id INT PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL\n);`}
                            className="h-80 w-full border border-neutral-900/20 bg-[#fffefa] p-8 font-mono text-sm text-neutral-950 outline-none focus:border-neutral-950"
                        />
                        <button onClick={magicImport} className="w-full border border-neutral-950 bg-neutral-950 py-6 font-black uppercase tracking-widest text-white transition-colors hover:bg-neutral-800">
                            Process Schema
                        </button>
                    </div>
                </div>
            )}

            {/* Studio Header */}
            <div className="flex items-center justify-between border-b border-neutral-900/15 bg-[#fbfbf4] p-6">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border border-neutral-950 bg-neutral-950">
                            <Layers className="h-5 w-5 text-[#fbff5d]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-normal text-neutral-950">Architect Mode</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">v1.2 Studio Engine</span>
                        </div>
                    </div>

                    <div className="ml-2 h-8 w-px bg-neutral-900/15"></div>

                    <div className="flex border border-neutral-900/15 bg-[#fbfbf4] p-1">
                        {(['prisma', 'sql', 'drizzle'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setExportMode(mode)}
                                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${exportMode === mode ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-950'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowMagicImport(true)}
                        className="flex items-center gap-2 border border-neutral-950 bg-neutral-950 px-5 py-2.5 text-[9px] font-black uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Magic Import
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={addTable}
                        className="group flex items-center gap-2 border border-neutral-900/15 bg-[#fbfbf4] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-950 transition-colors hover:border-neutral-950"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        Add Table
                    </button>
                    <button
                        onClick={copyCode}
                        className="flex items-center gap-2 border border-neutral-950 bg-neutral-950 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Export Schema'}
                    </button>
                </div>
            </div>

            {/* Main Studio Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* The Designer Canvas */}
                <div className="relative flex-1 bg-[#fffefa]">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        onNodeClick={onNodeClick}
                        fitView
                        colorMode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                    >
                        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                        <Controls />
                        <MiniMap
                            className="!rounded-none border border-neutral-900/15 !bg-[#fbfbf4]"
                            nodeColor={(n) => n.type === 'table' ? '#fbff5d' : '#d4d4c8'}
                        />
                        <Panel position="bottom-right" className="flex items-center gap-3 border border-neutral-900/15 bg-[#fbfbf4]/90 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-neutral-500 backdrop-blur-md">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                Engine Ready
                            </div>
                            <span>{nodes.length} Models Active</span>
                        </Panel>
                    </ReactFlow>
                </div>

                {/* Property Panel Sidebar */}
                <div className="flex w-96 flex-col overflow-y-auto border-l border-neutral-900/15 bg-[#fbfbf4] custom-scrollbar">
                    {selectedTable ? (
                        <>
                            {/* Header Actions */}
                            <div className="space-y-8 border-b border-neutral-900/15 p-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-neutral-500">
                                        <Settings2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest font-mono">Properties</span>
                                    </div>
                                    <button onClick={deleteTable} className="p-2 text-rose-600 transition-colors hover:bg-rose-50">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-neutral-500">Table Name</label>
                                    <input
                                        type="text"
                                        value={selectedTable.data.name}
                                        onChange={(e) => updateTableName(e.target.value)}
                                        className="w-full border border-neutral-900/20 bg-[#fffefa] px-5 py-3 text-sm font-bold text-neutral-950 outline-none transition-colors focus:border-neutral-950"
                                    />
                                </div>
                            </div>

                            {/* Columns Editor */}
                            <div className="flex-1 p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="ml-1 text-[10px] font-black uppercase tracking-widest text-neutral-500">Fields ({selectedTable.data.columns.length})</h4>
                                    <button
                                        onClick={addColumn}
                                        className="bg-neutral-950 p-1.5 text-white transition-colors hover:bg-neutral-800"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {(selectedTable.data as TableData).columns.map((col, idx) => (
                                        <div key={idx} className="group/field relative space-y-4 border border-neutral-900/15 bg-[#fffefa] p-5">
                                            <div className="flex items-center justify-between">
                                                <input
                                                    value={col.name}
                                                    onChange={(e) => {
                                                        const updatedCols = [...(selectedTable.data as TableData).columns];
                                                        updatedCols[idx].name = e.target.value;
                                                        setNodes(nds => nds.map(n => n.id === selectedTableId ? { ...n, data: { ...n.data as any, columns: updatedCols } } : n));
                                                    }}
                                                    className="w-32 border-0 bg-transparent p-0 text-sm font-black text-neutral-950 focus:ring-0"
                                                />
                                                <button onClick={() => removeColumn(col.id)} className="text-neutral-300 opacity-0 transition-colors hover:text-rose-500 group-hover/field:opacity-100">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <select
                                                    value={col.type}
                                                    onChange={(e) => {
                                                        const updatedCols = [...(selectedTable.data as TableData).columns];
                                                        updatedCols[idx].type = e.target.value;
                                                        setNodes(nds => nds.map(n => n.id === selectedTableId ? { ...n, data: { ...n.data as any, columns: updatedCols } } : n));
                                                    }}
                                                    className="border border-neutral-900/15 bg-[#fbfbf4] px-2 py-1 text-[10px] font-bold text-neutral-600 focus:ring-0"
                                                >
                                                    {['String', 'Int', 'BigInt', 'Float', 'Boolean', 'DateTime', 'Json'].map(t => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>

                                                <button
                                                    onClick={() => {
                                                        const updatedCols = [...(selectedTable.data as TableData).columns];
                                                        updatedCols[idx].isPK = !updatedCols[idx].isPK;
                                                        const nodesToUpdate = (nds: Node<TableData>[]) => nds.map((n) => n.id === selectedTableId ? { ...n, data: { ...n.data, columns: updatedCols } } : n);
                                                        setNodes(nodesToUpdate);
                                                    }}
                                                    className={`border px-2 py-1 text-[9px] font-black uppercase tracking-wider transition-all ${col.isPK ? 'border-neutral-950 bg-[#fbff5d] text-neutral-950' : 'border-neutral-900/15 bg-[#fbfbf4] text-neutral-500'}`}
                                                >
                                                    PK
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center p-12 text-center text-neutral-500">
                            <div className="mb-8 flex h-20 w-20 items-center justify-center border border-neutral-900/15 bg-[#fbff5d]">
                                <TableIcon className="h-10 w-10 opacity-40" />
                            </div>
                            <h5 className="text-xs font-black uppercase tracking-[0.2em] mb-4">No Table Selected</h5>
                            <p className="text-[10px] font-medium leading-relaxed opacity-60 uppercase tracking-widest max-w-[200px]">
                                Click a model on the canvas to configure properties.
                            </p>
                        </div>
                    )}

                    {/* Code Preview Mode */}
                    <div className="border-t border-neutral-900/15 bg-[#fbfbf4] p-8">
                        <div className="mb-4 flex items-center gap-3 text-neutral-500">
                            <FileCode className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Live Schema Preview</span>
                        </div>
                        <div className="max-h-64 overflow-auto border border-neutral-900/15 bg-[#fffefa] p-6 font-mono text-[10px] leading-relaxed text-neutral-950 custom-scrollbar">
                            <pre><code>{generateCode()}</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Status Bar */}
            <div className="flex items-center justify-between border-t border-neutral-900/15 bg-[#fbfbf4] p-4 px-8">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Canvas V3 Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Auto-Relational Logic Enabled</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={downloadImage}
                        className="flex items-center gap-2 border border-neutral-900/15 bg-[#fbfbf4] px-6 py-2 text-[9px] font-black text-neutral-500 transition-colors hover:border-neutral-950"
                    >
                        <Download className="h-3.5 w-3.5 text-neutral-950" />
                        Download High-Res Diagram
                    </button>
                    <div className="flex items-center gap-2 border border-neutral-900/15 bg-[#fbfbf4] px-6 py-2 text-[9px] font-black text-neutral-500">
                        <Share2 className="w-3 h-3" />
                        Viral Share Link
                    </div>
                </div>
            </div>
        </div>
    );
}
