'use client';

import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Bug, CheckCircle2, Clipboard, Copy, Download, Eraser, FileCode2, FolderOpen, Play, Plus, RotateCcw, Search, Settings2, Square, Terminal, Trash2 } from 'lucide-react';

type LogType = 'log' | 'info' | 'warn' | 'error' | 'result' | 'system';

interface ConsoleEntry {
    id: number;
    type: LogType;
    message: string;
    timestamp: string;
}

interface RunStats {
    status: 'idle' | 'success' | 'error' | 'timeout' | 'paused';
    duration: number;
    mode: 'run' | 'debug' | 'syntax';
}

type DebugSnapshot = Record<string, string>;
type ActivePanel = 'explorer' | 'search' | 'debug' | 'settings';

const EXAMPLE_CODE = `const users = [
  { name: 'Vivek', score: 92 },
  { name: 'Asha', score: 84 },
  { name: 'Rohan', score: 76 }
];

const topDevelopers = users
  .filter((user) => user.score >= 80)
  .map((user) => ({
    ...user,
    badge: user.score > 90 ? 'Gold' : 'Silver'
  }));

console.table(topDevelopers);
console.log('Total selected:', topDevelopers.length);

return topDevelopers;`;

const DEBUG_HELPER = `
const __webutilsDebug = {
  step: 0,
  __snapshot(entries, watchEntries) {
    const variables = entries.reduce((scope, entry) => {
      const name = entry[0];
      const readValue = entry[1];
      try {
        scope[name] = formatValue(readValue());
      } catch (error) {
        scope[name] = error && error.message ? error.message : String(error);
      }
      return scope;
    }, {});
    const watches = watchEntries.reduce((scope, entry) => {
      const name = entry[0];
      const readValue = entry[1];
      try {
        scope[name] = formatValue(readValue());
      } catch (error) {
        scope[name] = error && error.message ? error.message : String(error);
      }
      return scope;
    }, {});
    return { variables, watches };
  },
  __breakpoint(line, preview, snapshot) {
    console.info('[paused] line ' + line + (preview ? ': ' + preview : ''));
    self.postMessage({ type: 'paused', line, preview, snapshot });
    return new Promise((resolve) => {
      self.__webutilsContinue = resolve;
    });
  },
  trace(label, value) {
    this.step += 1;
    console.info('[debug step ' + this.step + '] ' + label, value);
    return value;
  },
  checkpoint(label) {
    this.step += 1;
    console.info('[checkpoint ' + this.step + '] ' + label);
  }
};
`;

function formatValue(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'undefined') return 'undefined';
    if (typeof value === 'function') return value.toString();
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
}

function instrumentBreakpoints(code: string, breakpoints: number[], watchExpressions: string[]) {
    if (breakpoints.length === 0) return code;

    const activeBreakpoints = new Set(breakpoints);
    const lines = code.split('\n');
    const declarationsByLine = getTopLevelDeclarations(lines);

    return lines
        .map((line, index) => {
            const lineNumber = index + 1;
            if (!activeBreakpoints.has(lineNumber)) return line;

            const scopeNames = declarationsByLine
                .filter((declaration) => declaration.line < lineNumber)
                .map((declaration) => declaration.name);
            const snapshotEntries = scopeNames.length > 0
                ? `[${scopeNames.map((name) => `[${JSON.stringify(name)}, () => ${name}]`).join(', ')}]`
                : '[]';
            const watchEntries = getWatchEntries(watchExpressions);

            return `await __webutilsDebug.__breakpoint(${lineNumber}, ${JSON.stringify(line.trim())}, __webutilsDebug.__snapshot(${snapshotEntries}, ${watchEntries}));\n${line}`;
        })
        .join('\n');
}

function getWatchEntries(watchExpressions: string[]) {
    const safeExpression = /^[A-Za-z_$][\w$]*(?:\s*(?:\.|\[\s*(?:\d+|['"][^'"]+['"])\s*\])\s*[A-Za-z_$]?[\w$]*)*$/;
    const entries = watchExpressions
        .map((expression) => expression.trim())
        .filter(Boolean)
        .filter((expression, index, expressions) => expressions.indexOf(expression) === index)
        .filter((expression) => safeExpression.test(expression));

    return entries.length > 0
        ? `[${entries.map((expression) => `[${JSON.stringify(expression)}, () => (${expression})]`).join(', ')}]`
        : '[]';
}

function getTopLevelDeclarations(lines: string[]) {
    const declarations: Array<{ name: string; line: number }> = [];
    const seen = new Set<string>();
    const declarationPattern = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)|\bfunction\s+([A-Za-z_$][\w$]*)/g;

    lines.forEach((line, index) => {
        let match: RegExpExecArray | null;
        while ((match = declarationPattern.exec(line)) !== null) {
            const name = match[1] || match[2];
            if (!seen.has(name)) {
                seen.add(name);
                declarations.push({ name, line: index + 1 });
            }
        }
    });

    return declarations;
}

function createWorkerSource(code: string, debugMode: boolean, breakpoints: number[], watchExpressions: string[]) {
    const executableCode = debugMode ? `${DEBUG_HELPER}\n${instrumentBreakpoints(code, breakpoints, watchExpressions)}` : code;
    const functionBody = JSON.stringify(`"use strict";\n${executableCode}\n//# sourceURL=webutilspro-user-code.js`);

    return `
const formatValue = (value) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'function') return value.toString();
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const send = (payload) => self.postMessage(payload);
const createLogger = (type) => (...args) => {
  send({
    type: 'console',
    level: type,
    message: args.map(formatValue).join(' ')
  });
};

const sandboxConsole = {
  log: createLogger('log'),
  info: createLogger('info'),
  warn: createLogger('warn'),
  error: createLogger('error'),
  table: (value) => send({
    type: 'console',
    level: 'log',
    message: Array.isArray(value) || typeof value === 'object' ? formatValue(value) : String(value)
  })
};

let hasRun = false;

self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'continue') {
    if (self.__webutilsContinue) {
      const resume = self.__webutilsContinue;
      self.__webutilsContinue = null;
      resume();
    }
    return;
  }

  if (hasRun) return;
  hasRun = true;

  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  try {
    const userFunction = new AsyncFunction('console', ${functionBody});
    const result = await userFunction(sandboxConsole);
    send({ type: 'result', message: formatValue(result) });
    send({ type: 'done' });
  } catch (error) {
    send({
      type: 'error',
      message: error && error.stack ? error.stack : String(error)
    });
  }
});
`;
}

export default function JavaScriptCompiler() {
    const [code, setCode] = useState(EXAMPLE_CODE);
    const [output, setOutput] = useState<ConsoleEntry[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [pausedLine, setPausedLine] = useState<number | null>(null);
    const [debugSnapshot, setDebugSnapshot] = useState<DebugSnapshot>({});
    const [watchSnapshot, setWatchSnapshot] = useState<DebugSnapshot>({});
    const [watchExpressions, setWatchExpressions] = useState<string[]>(['users', 'topDevelopers']);
    const [newWatchExpression, setNewWatchExpression] = useState('');
    const [activePanel, setActivePanel] = useState<ActivePanel>('debug');
    const [searchQuery, setSearchQuery] = useState('');
    const [timeoutMs, setTimeoutMs] = useState(3000);
    const [stats, setStats] = useState<RunStats>({ status: 'idle', duration: 0, mode: 'run' });
    const [breakpoints, setBreakpoints] = useState<number[]>([]);
    const idRef = useRef(0);
    const workerRef = useRef<Worker | null>(null);
    const gutterRef = useRef<HTMLDivElement | null>(null);

    const codeMetrics = useMemo(() => {
        const lines = code.split('\n').length;
        const chars = code.length;
        const consoleCalls = (code.match(/console\./g) || []).length;
        return { lines, chars, consoleCalls };
    }, [code]);

    const lineNumbers = useMemo(
        () => Array.from({ length: codeMetrics.lines }, (_, index) => index + 1),
        [codeMetrics.lines]
    );

    const statusLabel = {
        idle: 'Ready',
        success: 'Completed',
        error: 'Error',
        timeout: 'Timeout',
        paused: 'Paused',
    }[stats.status];

    const statusClass = {
        idle: 'bg-slate-500',
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        timeout: 'bg-amber-500',
        paused: 'bg-[#f14c4c]',
    }[stats.status];

    const activeBreakpoints = useMemo(
        () => breakpoints.filter((line) => line <= codeMetrics.lines).sort((a, b) => a - b),
        [breakpoints, codeMetrics.lines]
    );

    const codeLines = useMemo(() => code.split('\n'), [code]);
    const snapshotNames = useMemo(() => new Set([...Object.keys(debugSnapshot), ...Object.keys(watchSnapshot)]), [debugSnapshot, watchSnapshot]);
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return codeLines
            .map((line, index) => ({ line, lineNumber: index + 1 }))
            .filter((result) => result.line.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    }, [codeLines, searchQuery]);

    const renderInspectableLine = (line: string, lineNumber: number) => {
        const parts = line.split(/(\b[A-Za-z_$][\w$]*\b)/g);

        return parts.map((part, index) => {
            if (!snapshotNames.has(part)) {
                return <span key={`${lineNumber}-${index}`}>{part}</span>;
            }

            return (
                <span key={`${lineNumber}-${index}`} className="group relative inline-block cursor-help rounded px-0.5 text-[#9cdcfe] ring-1 ring-[#3794ff]/40">
                    {part}
                    <span className="pointer-events-none absolute left-0 top-6 z-20 hidden min-w-[220px] max-w-[360px] rounded border border-[#454545] bg-[#252526] p-3 text-left text-xs leading-5 text-[#d4d4d4] shadow-2xl shadow-black/40 group-hover:block">
                        <span className="mb-1 block font-sans text-[11px] font-bold uppercase text-[#9cdcfe]">{part}</span>
                        <span className="block max-h-56 overflow-auto whitespace-pre-wrap font-mono">{debugSnapshot[part] ?? watchSnapshot[part]}</span>
                    </span>
                </span>
            );
        });
    };

    const addWatchExpression = () => {
        const expression = newWatchExpression.trim();
        if (!expression) return;

        setWatchExpressions((current) => current.includes(expression) ? current : [...current, expression]);
        setNewWatchExpression('');
        setActivePanel('debug');
    };

    const removeWatchExpression = (expression: string) => {
        setWatchExpressions((current) => current.filter((item) => item !== expression));
        setWatchSnapshot((current) => {
            const next = { ...current };
            delete next[expression];
            return next;
        });
    };

    const resetExample = () => {
        setCode(EXAMPLE_CODE);
        setBreakpoints([]);
        setDebugSnapshot({});
        setWatchSnapshot({});
        setActivePanel('explorer');
    };

    const addOutput = (type: LogType, message: string) => {
        idRef.current += 1;
        setOutput((entries) => [
            ...entries,
            {
                id: idRef.current,
                type,
                message,
                timestamp: new Date().toLocaleTimeString(),
            },
        ]);
    };

    const stopWorker = () => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
        setIsRunning(false);
        setPausedLine(null);
        setDebugSnapshot({});
        setWatchSnapshot({});
    };

    const checkSyntax = () => {
        const startedAt = performance.now();
        setOutput([]);

        try {
            const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
            new AsyncFunction('"use strict";\n' + code);
            const duration = Math.round(performance.now() - startedAt);
            setStats({ status: 'success', duration, mode: 'syntax' });
            addOutput('system', `Syntax check passed in ${duration}ms.`);
            toast.success('JavaScript syntax looks good');
        } catch (error) {
            const duration = Math.round(performance.now() - startedAt);
            setStats({ status: 'error', duration, mode: 'syntax' });
            addOutput('error', error instanceof Error ? error.message : String(error));
        }
    };

    const toggleBreakpoint = (line: number) => {
        setBreakpoints((current) =>
            current.includes(line)
                ? current.filter((breakpoint) => breakpoint !== line)
                : [...current, line].sort((a, b) => a - b)
        );
    };

    const clearBreakpoints = () => {
        setBreakpoints([]);
    };

    const continueDebugRun = () => {
        if (!workerRef.current || pausedLine === null) return;

        addOutput('system', `Continuing from line ${pausedLine}.`);
        setPausedLine(null);
        setDebugSnapshot({});
        setWatchSnapshot({});
        setIsRunning(true);
        workerRef.current.postMessage({ type: 'continue' });
    };

    const runCode = (debugMode = false) => {
        if (!code.trim()) {
            toast.error('Please enter JavaScript code first');
            return;
        }

        stopWorker();
        setOutput([]);
        setIsRunning(true);
        setPausedLine(null);
        setDebugSnapshot({});
        setWatchSnapshot({});
        if (debugMode) setActivePanel('debug');
        const startedAt = performance.now();
        addOutput(
            'system',
            debugMode
                ? `Debug run started${activeBreakpoints.length ? ` with ${activeBreakpoints.length} breakpoint${activeBreakpoints.length === 1 ? '' : 's'}.` : '. Use __webutilsDebug.trace(label, value) to inspect values.'}`
                : 'JavaScript execution started.'
        );

        const workerSource = createWorkerSource(code, debugMode, debugMode ? activeBreakpoints : [], debugMode ? watchExpressions : []);
        const blob = new Blob([workerSource], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);
        workerRef.current = worker;
        let finished = false;
        let timeout: number | undefined;

        const clearRunTimeout = () => {
            if (timeout) {
                window.clearTimeout(timeout);
                timeout = undefined;
            }
        };

        const finishWorker = (status: RunStats['status'], mode: RunStats['mode'], message?: string) => {
            if (finished) return;
            finished = true;
            clearRunTimeout();
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
            workerRef.current = null;
            setIsRunning(false);
            setPausedLine(null);
            setDebugSnapshot({});
            setWatchSnapshot({});
            const duration = Math.round(performance.now() - startedAt);
            setStats({ status, duration, mode });
            if (message) {
                addOutput(status === 'success' ? 'system' : 'error', message);
            }
        };

        const armRunTimeout = () => {
            clearRunTimeout();
            timeout = window.setTimeout(() => {
                const duration = Math.round(performance.now() - startedAt);
                finishWorker('timeout', debugMode ? 'debug' : 'run', `Execution stopped after ${duration}ms. Check for long-running loops or heavy calculations.`);
            }, timeoutMs);
        };

        armRunTimeout();

        worker.onerror = (event) => {
            finishWorker('error', debugMode ? 'debug' : 'run', event.message || 'Worker failed before execution could start.');
        };

        worker.onmessageerror = () => {
            finishWorker('error', debugMode ? 'debug' : 'run', 'Worker returned a message that could not be read.');
        };

        worker.onmessage = (event) => {
            const payload = event.data;

            if (payload.type === 'console') {
                addOutput(payload.level, payload.message);
                return;
            }

            if (payload.type === 'result') {
                addOutput('result', `Returned: ${payload.message}`);
                return;
            }

            if (payload.type === 'paused') {
                clearRunTimeout();
                setIsRunning(false);
                setPausedLine(payload.line);
                setDebugSnapshot(payload.snapshot?.variables || payload.scope || {});
                setWatchSnapshot(payload.snapshot?.watches || {});
                setActivePanel('debug');
                const duration = Math.round(performance.now() - startedAt);
                setStats({ status: 'paused', duration, mode: 'debug' });
                return;
            }

            const duration = Math.round(performance.now() - startedAt);

            if (payload.type === 'error') {
                finishWorker('error', debugMode ? 'debug' : 'run', payload.message);
            } else {
                finishWorker('success', debugMode ? 'debug' : 'run', `Finished in ${duration}ms.`);
            }
        };

        worker.postMessage({ run: true });
    };

    const copyOutput = async () => {
        const text = output.map((entry) => `[${entry.type}] ${entry.message}`).join('\n');
        await navigator.clipboard.writeText(text);
        toast.success('Output copied');
    };

    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'webutilspro-script.js';
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const loadDebugExample = () => {
        setCode(`const cart = [
  { item: 'Keyboard', price: 79 },
  { item: 'Mouse', price: 35 },
  { item: 'Monitor', price: 220 }
];

__webutilsDebug.checkpoint('cart loaded');

const total = __webutilsDebug.trace(
  'cart total',
  cart.reduce((sum, product) => sum + product.price, 0)
);

if (total > 250) {
  console.log('Discount eligible');
}

return { total, itemCount: cart.length };`);
        setBreakpoints([8, 11]);
        setWatchExpressions(['cart', 'total', 'cart.length']);
        setActivePanel('debug');
    };

    return (
        <div className="space-y-5">
            <section className="overflow-hidden rounded-lg border border-[#2b2f36] bg-[#1e1e1e] shadow-2xl shadow-slate-950/20">
                <div className="flex h-10 items-center justify-between border-b border-[#2b2f36] bg-[#181818] px-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                        <span className="ml-3 hidden text-slate-400 sm:inline">WebUtilsPro</span>
                        <span className="hidden text-slate-600 sm:inline">/</span>
                        <span>script.js</span>
                    </div>
                    <div className="hidden items-center gap-4 text-[11px] uppercase text-slate-500 sm:flex">
                        <span>JavaScript Compiler</span>
                        <span>Browser Sandbox</span>
                    </div>
                </div>

                <div className="flex flex-col min-[1180px]:flex-row">
                    <aside className="hidden w-12 shrink-0 flex-col items-center border-r border-[#2b2f36] bg-[#181818] py-3 text-slate-500 min-[1180px]:flex">
                        {[
                            { id: 'explorer' as ActivePanel, label: 'Explorer', icon: FolderOpen },
                            { id: 'search' as ActivePanel, label: 'Search', icon: Search },
                            { id: 'debug' as ActivePanel, label: 'Run and Debug', icon: Bug },
                            { id: 'settings' as ActivePanel, label: 'Settings', icon: Settings2 },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActivePanel(item.id)}
                                    title={item.label}
                                    aria-label={item.label}
                                    className={`flex h-12 w-full items-center justify-center border-l-2 transition ${activePanel === item.id ? 'border-[#3794ff] text-slate-100' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </button>
                            );
                        })}
                    </aside>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-col border-b border-[#2b2f36] bg-[#252526] lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-center">
                                <div className="flex h-11 min-w-0 items-center gap-2 border-r border-t-2 border-r-[#2b2f36] border-t-[#3794ff] bg-[#1e1e1e] px-4 text-sm text-slate-100">
                                    <FileCode2 className="h-4 w-4 text-[#f7df1e]" />
                                    <span className="truncate">script.js</span>
                                </div>
                                <div className="hidden px-4 text-xs text-slate-500 md:block">
                                    Run JavaScript with console capture, syntax checks, and debug traces.
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 p-2">
                                <button
                                    onClick={() => runCode(false)}
                                    disabled={isRunning || pausedLine !== null}
                                    className="inline-flex h-8 items-center gap-2 rounded bg-[#0e639c] px-3 text-xs font-semibold text-white transition hover:bg-[#1177bb] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Play className="h-3.5 w-3.5" />
                                    Run
                                </button>
                                <button
                                    onClick={() => runCode(true)}
                                    disabled={isRunning || pausedLine !== null}
                                    className="inline-flex h-8 items-center gap-2 rounded border border-[#3c3c3c] bg-[#2d2d2d] px-3 text-xs font-semibold text-slate-100 transition hover:bg-[#3a3d41] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Bug className="h-3.5 w-3.5" />
                                    Debug
                                </button>
                                <button
                                    onClick={checkSyntax}
                                    disabled={isRunning || pausedLine !== null}
                                    className="inline-flex h-8 items-center gap-2 rounded border border-[#3c3c3c] bg-[#2d2d2d] px-3 text-xs font-semibold text-slate-100 transition hover:bg-[#3a3d41] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Syntax
                                </button>
                                {pausedLine !== null && (
                                    <button
                                        onClick={continueDebugRun}
                                        className="inline-flex h-8 items-center gap-2 rounded bg-[#16825d] px-3 text-xs font-semibold text-white transition hover:bg-[#1f9d72]"
                                    >
                                        <Play className="h-3.5 w-3.5" />
                                        Continue
                                    </button>
                                )}
                                {(isRunning || pausedLine !== null) && (
                                    <button
                                        onClick={stopWorker}
                                        className="inline-flex h-8 items-center gap-2 rounded bg-[#a1260d] px-3 text-xs font-semibold text-white transition hover:bg-[#c42b1c]"
                                    >
                                        <Square className="h-3 w-3 fill-current" />
                                        Stop
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="relative grid grid-cols-1 bg-[#1e1e1e] min-[1180px]:grid-cols-[minmax(0,1fr)_390px]">
                            <div className="min-w-0 border-b border-[#2b2f36] min-[1180px]:border-b-0 min-[1180px]:border-r">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2b2f36] bg-[#1e1e1e] px-4 py-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Terminal className="h-4 w-4 text-[#3794ff]" />
                                        <span className="font-semibold text-slate-200">JavaScript Input</span>
                                        <span className="hidden sm:inline">UTF-8</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <button onClick={resetExample} className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs font-semibold text-slate-300 hover:bg-[#2a2d2e]">
                                            <RotateCcw className="h-3.5 w-3.5" />
                                            Example
                                        </button>
                                        <button onClick={loadDebugExample} className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs font-semibold text-slate-300 hover:bg-[#2a2d2e]">
                                            <Bug className="h-3.5 w-3.5" />
                                            Debug Example
                                        </button>
                                        {activeBreakpoints.length > 0 && (
                                            <button onClick={clearBreakpoints} className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs font-semibold text-slate-300 hover:bg-[#2a2d2e]">
                                                Clear Breakpoints
                                            </button>
                                        )}
                                        <button onClick={downloadCode} className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs font-semibold text-slate-300 hover:bg-[#2a2d2e]">
                                            <Download className="h-3.5 w-3.5" />
                                            Download
                                        </button>
                                    </div>
                                </div>

                                <div className="grid min-h-[560px] grid-cols-[56px_minmax(0,1fr)] bg-[#1e1e1e] font-mono text-sm leading-6">
                                    <div
                                        ref={gutterRef}
                                        className="select-none overflow-hidden border-r border-[#2b2f36] bg-[#1b1b1b] px-2 py-4 text-right text-[#858585]"
                                    >
                                        {lineNumbers.map((line) => (
                                            <button
                                                key={line}
                                                type="button"
                                                onClick={() => toggleBreakpoint(line)}
                                                aria-label={`${activeBreakpoints.includes(line) ? 'Remove' : 'Add'} breakpoint on line ${line}`}
                                                className={`group relative flex h-6 w-full items-center justify-end rounded pr-1 tabular-nums hover:bg-[#2a2d2e] hover:text-slate-200 ${pausedLine === line ? 'bg-[#3a1f1f] text-slate-100' : 'text-[#858585]'}`}
                                            >
                                                <span className={`absolute left-1 h-3 w-3 rounded-full border ${activeBreakpoints.includes(line) ? 'border-[#f14c4c] bg-[#f14c4c]' : 'border-transparent bg-transparent group-hover:border-[#f14c4c]/60'}`} />
                                                {line}
                                            </button>
                                        ))}
                                    </div>
                                    {pausedLine === null ? (
                                        <textarea
                                            id="javascript-code"
                                            value={code}
                                            onChange={(event) => setCode(event.target.value)}
                                            onScroll={(event) => {
                                                if (gutterRef.current) {
                                                    gutterRef.current.scrollTop = event.currentTarget.scrollTop;
                                                }
                                            }}
                                            spellCheck={false}
                                            aria-label="JavaScript Input"
                                            className="min-h-[560px] w-full resize-y border-0 bg-[#1e1e1e] px-4 py-4 font-mono text-sm leading-6 text-[#d4d4d4] caret-[#aeafad] outline-none selection:bg-[#264f78] placeholder:text-slate-600"
                                        />
                                    ) : (
                                        <div
                                            className="min-h-[560px] overflow-auto bg-[#1e1e1e] py-4 font-mono text-sm leading-6 text-[#d4d4d4] selection:bg-[#264f78]"
                                            onScroll={(event) => {
                                                if (gutterRef.current) {
                                                    gutterRef.current.scrollTop = event.currentTarget.scrollTop;
                                                }
                                            }}
                                        >
                                            {codeLines.map((line, index) => {
                                                const lineNumber = index + 1;
                                                return (
                                                    <pre key={lineNumber} className={`min-h-6 whitespace-pre px-4 ${pausedLine === lineNumber ? 'bg-[#3a1f1f]' : ''}`}>
                                                        {renderInspectableLine(line || ' ', lineNumber)}
                                                    </pre>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <aside className="bg-[#252526]">
                                {activePanel === 'explorer' && (
                                    <div className="border-b border-[#2b2f36] px-4 py-3">
                                        <h3 className="text-xs font-bold uppercase text-slate-300">Explorer</h3>
                                        <div className="mt-3 space-y-1 text-xs text-slate-400">
                                            <button type="button" onClick={() => setActivePanel('explorer')} className="flex w-full items-center gap-2 rounded bg-[#37373d] px-2 py-1.5 text-left text-slate-100">
                                                <FileCode2 className="h-3.5 w-3.5 text-[#f7df1e]" />
                                                script.js
                                            </button>
                                            <div className="grid grid-cols-3 gap-2 pt-2">
                                                <div>
                                                    <p className="text-lg font-bold text-slate-100">{codeMetrics.lines}</p>
                                                    <p className="uppercase text-slate-500">Lines</p>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-slate-100">{codeMetrics.chars}</p>
                                                    <p className="uppercase text-slate-500">Chars</p>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-slate-100">{activeBreakpoints.length}</p>
                                                    <p className="uppercase text-slate-500">Breaks</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activePanel === 'search' && (
                                    <div className="border-b border-[#2b2f36] px-4 py-3">
                                        <h3 className="mb-3 text-xs font-bold uppercase text-slate-300">Search</h3>
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-slate-500" />
                                            <input
                                                value={searchQuery}
                                                onChange={(event) => setSearchQuery(event.target.value)}
                                                placeholder="Search script.js"
                                                className="h-9 w-full rounded border border-[#3c3c3c] bg-[#1e1e1e] pl-8 pr-2 text-xs text-slate-100 outline-none focus:border-[#3794ff]"
                                            />
                                        </div>
                                        <div className="mt-3 max-h-56 space-y-1 overflow-auto text-xs">
                                            {searchQuery.trim() && searchResults.length === 0 && (
                                                <p className="text-slate-500">No results found.</p>
                                            )}
                                            {searchResults.map((result) => (
                                                <button
                                                    key={`${result.lineNumber}-${result.line}`}
                                                    type="button"
                                                    onClick={() => toggleBreakpoint(result.lineNumber)}
                                                    className="block w-full rounded px-2 py-1.5 text-left text-slate-300 hover:bg-[#37373d]"
                                                >
                                                    <span className="mr-2 text-slate-500">Ln {result.lineNumber}</span>
                                                    <span className="font-mono">{result.line.trim() || '(blank)'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activePanel === 'debug' && (
                                    <>
                                        <div className="border-b border-[#2b2f36] px-4 py-3">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <h3 className="text-xs font-bold uppercase text-slate-300">Run And Debug</h3>
                                                <span className={`h-2 w-2 rounded-full ${statusClass}`} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                                                <div className="rounded border border-[#3c3c3c] bg-[#1e1e1e] p-2">
                                                    <p className="text-slate-500">Status</p>
                                                    <p className="font-semibold text-slate-100">{statusLabel}</p>
                                                    {pausedLine !== null && (
                                                        <p className="text-[#f14c4c]">Line {pausedLine}</p>
                                                    )}
                                                </div>
                                                <div className="rounded border border-[#3c3c3c] bg-[#1e1e1e] p-2">
                                                    <p className="text-slate-500">Runtime</p>
                                                    <p className="font-semibold text-slate-100">{stats.duration}ms</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-b border-[#2b2f36] px-4 py-3">
                                            <div className="mb-3 flex items-center justify-between">
                                                <h3 className="text-xs font-bold uppercase text-slate-300">Watch</h3>
                                                <span className="text-[10px] text-slate-500">{watchExpressions.length}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    value={newWatchExpression}
                                                    onChange={(event) => setNewWatchExpression(event.target.value)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter') addWatchExpression();
                                                    }}
                                                    placeholder="users[0].name"
                                                    className="h-8 min-w-0 flex-1 rounded border border-[#3c3c3c] bg-[#1e1e1e] px-2 text-xs text-slate-100 outline-none focus:border-[#3794ff]"
                                                />
                                                <button type="button" onClick={addWatchExpression} className="flex h-8 w-8 items-center justify-center rounded bg-[#0e639c] text-white hover:bg-[#1177bb]" title="Add watch">
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="mt-3 max-h-44 space-y-2 overflow-auto text-xs">
                                                {watchExpressions.length === 0 ? (
                                                    <p className="text-slate-500">Add an expression to inspect while paused.</p>
                                                ) : (
                                                    watchExpressions.map((expression) => (
                                                        <div key={expression} className="rounded border border-[#3c3c3c] bg-[#1e1e1e] p-2">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className="font-semibold text-[#9cdcfe]">{expression}</p>
                                                                <button type="button" onClick={() => removeWatchExpression(expression)} className="text-slate-500 hover:text-red-300" title="Remove watch">
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                            <pre className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap break-words font-mono text-[#d4d4d4]">
                                                                {pausedLine === null ? 'Not available until paused' : watchSnapshot[expression] ?? 'Unavailable'}
                                                            </pre>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-b border-[#2b2f36] px-4 py-3">
                                            <h3 className="mb-3 text-xs font-bold uppercase text-slate-300">Variables</h3>
                                            {pausedLine === null ? (
                                                <p className="text-xs leading-5 text-slate-500">Start Debug and pause on a breakpoint to inspect variables.</p>
                                            ) : Object.keys(debugSnapshot).length === 0 ? (
                                                <p className="text-xs leading-5 text-slate-500">No variables are available before this line yet.</p>
                                            ) : (
                                                <div className="max-h-48 space-y-2 overflow-auto text-xs">
                                                    {Object.entries(debugSnapshot).map(([name, value]) => (
                                                        <div key={name} className="rounded border border-[#3c3c3c] bg-[#1e1e1e] p-2">
                                                            <p className="font-semibold text-[#9cdcfe]">{name}</p>
                                                            <pre className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap break-words font-mono text-[#d4d4d4]">{value}</pre>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-b border-[#2b2f36] px-4 py-3">
                                            <div className="mb-3 flex items-center justify-between">
                                                <h3 className="text-xs font-bold uppercase text-slate-300">Breakpoints</h3>
                                                {activeBreakpoints.length > 0 && (
                                                    <button type="button" onClick={clearBreakpoints} className="text-[10px] font-semibold text-slate-400 hover:text-white">Clear</button>
                                                )}
                                            </div>
                                            <div className="space-y-1 text-xs">
                                                {activeBreakpoints.length === 0 ? (
                                                    <p className="text-slate-500">Click a gutter line number to add a breakpoint.</p>
                                                ) : (
                                                    activeBreakpoints.map((line) => (
                                                        <button key={line} type="button" onClick={() => toggleBreakpoint(line)} className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-slate-300 hover:bg-[#37373d]">
                                                            <span>script.js:{line}</span>
                                                            <span className="h-2.5 w-2.5 rounded-full bg-[#f14c4c]" />
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activePanel === 'settings' && (
                                    <div className="border-b border-[#2b2f36] px-4 py-3">
                                        <h3 className="mb-3 text-xs font-bold uppercase text-slate-300">Settings</h3>
                                        <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">
                                            Timeout: {timeoutMs}ms
                                        </label>
                                        <input
                                            type="range"
                                            min={1000}
                                            max={10000}
                                            step={500}
                                            value={timeoutMs}
                                            onChange={(event) => setTimeoutMs(Number(event.target.value))}
                                            className="w-full accent-[#3794ff]"
                                        />
                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <button type="button" onClick={downloadCode} className="inline-flex h-8 items-center justify-center gap-1 rounded border border-[#3c3c3c] bg-[#1e1e1e] text-xs font-semibold text-slate-300 hover:bg-[#37373d]">
                                                <Download className="h-3.5 w-3.5" />
                                                Download
                                            </button>
                                            <button type="button" onClick={() => setOutput([])} className="inline-flex h-8 items-center justify-center gap-1 rounded border border-[#3c3c3c] bg-[#1e1e1e] text-xs font-semibold text-slate-300 hover:bg-[#37373d]">
                                                <Eraser className="h-3.5 w-3.5" />
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex min-h-[360px] flex-col">
                                    <div className="flex items-center justify-between border-b border-[#2b2f36] px-4 py-3">
                                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
                                            <Clipboard className="h-4 w-4 text-[#3794ff]" />
                                            Terminal
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <button onClick={copyOutput} disabled={output.length === 0} className="inline-flex h-7 items-center gap-1 rounded px-2 text-xs font-semibold text-slate-300 hover:bg-[#2a2d2e] disabled:text-slate-600">
                                                <Copy className="h-3.5 w-3.5" />
                                                Copy
                                            </button>
                                            <button onClick={() => setOutput([])} className="inline-flex h-7 items-center gap-1 rounded px-2 text-xs font-semibold text-slate-300 hover:bg-[#2a2d2e]">
                                                <Eraser className="h-3.5 w-3.5" />
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                    <div className="max-h-[430px] flex-1 overflow-auto bg-[#1e1e1e] p-3 font-mono text-xs leading-5">
                                        {output.length === 0 ? (
                                            <p className="text-slate-500">Run your JavaScript to see console output, return values, and errors.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {output.map((entry) => (
                                                    <div key={entry.id} className="border-l-2 border-[#3c3c3c] bg-[#252526] px-3 py-2">
                                                        <div className="mb-1 flex items-center justify-between gap-3">
                                                            <span className={`text-[10px] font-bold uppercase ${entry.type === 'error' ? 'text-red-300' : entry.type === 'warn' ? 'text-amber-300' : entry.type === 'result' ? 'text-emerald-300' : 'text-[#9cdcfe]'}`}>
                                                                {entry.type}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500">{entry.timestamp}</span>
                                                        </div>
                                                        <pre className="whitespace-pre-wrap break-words text-[#d4d4d4]">{entry.message}</pre>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#2b2f36] bg-[#007acc] px-3 py-1.5 text-xs text-white">
                    <div className="flex flex-wrap items-center gap-4">
                        <span>JavaScript</span>
                        <span>Ln {codeMetrics.lines}, Col 1</span>
                        <span>{stats.mode.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <span>{statusLabel}</span>
                        <span>{timeoutMs}ms timeout</span>
                    </div>
                </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="mb-2 text-lg font-black text-slate-900">Debugger Tips</h3>
                <ul className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-3">
                    <li>Use <strong>Check Syntax</strong> before running copied code from Stack Overflow or AI tools.</li>
                    <li>Use <strong>Debug Run</strong> with <code>__webutilsDebug.trace()</code> to inspect intermediate values.</li>
                    <li>Keep DOM and network code out of the sandbox; this compiler is optimized for JavaScript logic.</li>
                </ul>
            </section>
        </div>
    );
}
