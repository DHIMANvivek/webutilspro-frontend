'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
    ArrowRight,
    Box,
    CheckCircle2,
    Clipboard,
    Cloud,
    Code2,
    Copy,
    Database,
    LayoutGrid,
    Play,
    RadioTower,
    RefreshCw,
    ServerCog,
    ShieldCheck,
    TerminalSquare,
    Trash2,
    Webhook,
    Zap,
    type LucideIcon
} from 'lucide-react';

type LabService = {
    id: string;
    name: string;
    category: string;
    port?: string;
    description: string;
    icon: LucideIcon;
    actions: string[];
};

type LabSession = {
    sessionId: string;
    accountId: string;
    region: string;
    endpoint: string;
    expiresAt: string;
};

type FlociStatus = {
    connected: boolean;
    endpoint?: string;
    latencyMs?: number;
    error?: string;
};

const LAB_SERVICES: LabService[] = [
    {
        id: 's3',
        name: 'Amazon S3',
        category: 'Storage',
        port: 'Lab',
        description: 'Create buckets, upload fixtures, list objects, and store webhook payload snapshots.',
        icon: Box,
        actions: ['Create bucket', 'Upload payload', 'List objects', 'Generate SDK snippet']
    },
    {
        id: 'sqs',
        name: 'Amazon SQS',
        category: 'Messaging',
        port: 'Lab',
        description: 'Push captured webhook events into queues and verify worker input shape.',
        icon: RadioTower,
        actions: ['Create queue', 'Send message', 'Receive message', 'Purge queue']
    },
    {
        id: 'sns',
        name: 'Amazon SNS',
        category: 'Messaging',
        port: 'Lab',
        description: 'Fan out one test event to HTTP, queue, and function subscribers.',
        icon: Webhook,
        actions: ['Create topic', 'Subscribe target', 'Publish event', 'Inspect delivery']
    },
    {
        id: 'lambda',
        name: 'AWS Lambda',
        category: 'Compute',
        port: 'Lab',
        description: 'Run function templates with webhook, queue, API Gateway, and S3 events.',
        icon: Zap,
        actions: ['Create function', 'Invoke handler', 'View response', 'Read logs']
    },
    {
        id: 'dynamodb',
        name: 'DynamoDB',
        category: 'Database',
        port: 'Lab',
        description: 'Create tables and validate reads/writes before connecting production code.',
        icon: Database,
        actions: ['Create table', 'Put item', 'Get item', 'Scan table']
    },
    {
        id: 'apigateway',
        name: 'API Gateway',
        category: 'Networking',
        port: 'Lab',
        description: 'Build local HTTP entry points backed by Lambda templates and replayed events.',
        icon: ServerCog,
        actions: ['Create route', 'Attach Lambda', 'Send request', 'Inspect logs']
    }
];

const WORKFLOW_ROWS = [
    { label: 'Capture', value: 'Receive webhook payloads in WebUtilsPro-managed buckets', icon: Webhook },
    { label: 'Replay', value: 'Send the same event into SQS, SNS, Lambda, S3, or EventBridge', icon: Play },
    { label: 'Inspect', value: 'Compare requests, outputs, logs, and generated SDK commands', icon: Clipboard },
    { label: 'Ship', value: 'Move verified handlers and SDK snippets back into your application', icon: ShieldCheck }
];

const SAMPLE_COMMANDS = {
    s3: ['aws s3 mb s3://webhook-payloads', 'aws s3 cp event.json s3://webhook-payloads/latest.json', 'aws s3 ls s3://webhook-payloads'],
    sqs: ['aws sqs create-queue --queue-name webhook-events', 'aws sqs send-message --queue-url $QUEUE_URL --message-body file://event.json', 'aws sqs receive-message --queue-url $QUEUE_URL'],
    sns: ['aws sns create-topic --name webhook-events', 'aws sns subscribe --topic-arn $TOPIC_ARN --protocol sqs --notification-endpoint $QUEUE_ARN', 'aws sns publish --topic-arn $TOPIC_ARN --message file://event.json'],
    lambda: ['aws lambda create-function --function-name webhook-handler --runtime nodejs20.x', 'aws lambda invoke --function-name webhook-handler --payload file://event.json response.json', 'cat response.json'],
    dynamodb: ['aws dynamodb create-table --table-name webhook_events', 'aws dynamodb put-item --table-name webhook_events --item file://item.json', 'aws dynamodb scan --table-name webhook_events'],
    apigateway: ['aws apigatewayv2 create-api --name webhook-api --protocol-type HTTP', 'aws apigatewayv2 create-route --api-id $API_ID --route-key "POST /webhook"', 'curl -X POST $API_URL/webhook -d @event.json']
};

export default function CloudLabClient() {
    const [status, setStatus] = useState<FlociStatus>({ connected: false, endpoint: 'managed-runtime' });
    const [session, setSession] = useState<LabSession | null>(null);
    const [activeServiceId, setActiveServiceId] = useState(LAB_SERVICES[0].id);
    const [selectedAction, setSelectedAction] = useState(LAB_SERVICES[0].actions[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCommandRunning, setIsCommandRunning] = useState(false);
    const [terminalInput, setTerminalInput] = useState('');
    const [output, setOutput] = useState<string>('');
    const socketRef = useRef<Socket | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const activeService = LAB_SERVICES.find((service) => service.id === activeServiceId) || LAB_SERVICES[0];
    const ActiveServiceIcon = activeService.icon;

    const envBlock = useMemo(() => {
        const accountId = session?.accountId || '111111111111';
        const region = session?.region || 'us-east-1';
        return [
            `export WEBUTILSPRO_LAB_SESSION=${session?.sessionId || 'start-session'}`,
            `export AWS_DEFAULT_REGION=${region}`,
            `export AWS_ACCESS_KEY_ID=${accountId}`,
            'export AWS_SECRET_ACCESS_KEY=test'
        ].join('\n');
    }, [session]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadStatus() {
            setIsLoading(true);
            try {
                const response = await fetch(`${backendUrl}/api/floci/status`, { signal: controller.signal });
                if (response.ok) {
                    setStatus(await response.json());
                }
            } catch (error) {
                setStatus((current) => ({ ...current, connected: false }));
            } finally {
                setIsLoading(false);
            }
        }

        loadStatus();
        return () => controller.abort();
    }, [backendUrl]);

    useEffect(() => {
        if (!session?.sessionId) return;

        const socket = io(backendUrl, {
            transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('floci:join', { sessionId: session.sessionId });
        });

        socket.on('floci:terminal-output', (event: { command?: string | null; output?: string; clear?: boolean }) => {
            if (event.clear) {
                setOutput('');
                return;
            }

            appendOutput(formatTerminalEvent(event.command, event.output || ''));
            setIsCommandRunning(false);
        });

        socket.on('floci:terminal-error', (event: { command?: string; error?: string }) => {
            appendOutput(formatTerminalEvent(event.command, `Error: ${event.error || 'Command failed'}`));
            setIsCommandRunning(false);
        });

        socket.on('disconnect', () => {
            socketRef.current = null;
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [backendUrl, session?.sessionId]);

    function appendOutput(block: string) {
        setOutput((current) => current ? `${current}\n\n${block}` : block);
    }

    function formatTerminalEvent(command: string | null | undefined, body: string) {
        if (!command) return body;
        return [`$ ${command}`, body || '(no output)'].join('\n');
    }

    async function createSession(): Promise<LabSession | null> {
        setIsLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/floci/sessions`, { method: 'POST' });
            if (!response.ok) throw new Error('Session API unavailable');
            const data = await response.json();
            setSession(data);
            setOutput([
                'Created WebUtilsPro Cloud Lab session.',
                '',
                envBlockForSession(data),
                '',
                'Type "help" to see available commands.'
            ].join('\n'));
            return data;
        } catch (error) {
            const fallbackSession = {
                sessionId: 'managed_preview',
                accountId: '111111111111',
                region: 'us-east-1',
                endpoint: 'managed-preview',
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
            };
            setSession(fallbackSession);
            setOutput(JSON.stringify({
                created: 'preview',
                note: 'Backend session API is not reachable, using preview session values.',
                ...fallbackSession
            }, null, 2));
            return fallbackSession;
        } finally {
            setIsLoading(false);
        }
    }

    function chooseService(service: LabService) {
        setActiveServiceId(service.id);
        setSelectedAction(service.actions[0]);
        setTerminalInput('');
        setOutput('');
    }

    function envBlockForSession(activeSession: LabSession) {
        return [
            `export WEBUTILSPRO_LAB_SESSION=${activeSession.sessionId}`,
            `export AWS_ENDPOINT_URL=${activeSession.endpoint}`,
            `export AWS_DEFAULT_REGION=${activeSession.region}`,
            `export AWS_ACCESS_KEY_ID=${activeSession.accountId}`,
            'export AWS_SECRET_ACCESS_KEY=test'
        ].join('\n');
    }

    function commandForAction(action = selectedAction, serviceId = activeService.id) {
        const bucketName = `webutilspro-${session?.accountId || '111111111111'}`;

        if (serviceId === 's3') {
            if (action === 'Create bucket') return `aws s3 mb s3://${bucketName}`;
            if (action === 'Upload payload') return `aws s3 cp "{\\"source\\":\\"webutilspro\\",\\"type\\":\\"lab-test\\"}" s3://${bucketName}/latest.json`;
            if (action === 'List objects') return `aws s3 ls s3://${bucketName}`;
            return 'help';
        }

        return null;
    }

    function selectAction(action: string) {
        setSelectedAction(action);
        const command = commandForAction(action);

        if (command) {
            setTerminalInput(command);
        }
    }

    function stageSelectedAction() {
        const command = commandForAction();

        if (!command) {
            const commands = SAMPLE_COMMANDS[activeService.id as keyof typeof SAMPLE_COMMANDS] || [];
            setTerminalInput(commands[0] || '');
            setOutput([
                `# ${activeService.name}: ${selectedAction}`,
                ...commands,
                '',
                'This service is command-preview only for now. Edit the staged command, then run it when the service executor is wired.'
            ].join('\n'));
            return;
        }

        setTerminalInput(command);
        appendOutput(`Staged command for ${activeService.name} / ${selectedAction}. Edit it in the terminal prompt, then press Run.`);
    }

    async function runLabCommand(command: string) {
        if (!session?.sessionId) {
            appendOutput('Start a managed session before running lab commands.');
            return;
        }

        setIsCommandRunning(true);

        if (socketRef.current?.connected) {
            socketRef.current.emit('floci:terminal-command', {
                sessionId: session.sessionId,
                command
            });
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/floci/terminal/command`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: session.sessionId, command })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Command failed');
            if (data.clear) {
                setOutput('');
            } else {
                appendOutput(formatTerminalEvent(command, data.output || ''));
            }
        } catch (error) {
            appendOutput(formatTerminalEvent(command, `Error: ${error instanceof Error ? error.message : 'Command failed'}`));
        } finally {
            setIsCommandRunning(false);
        }
    }

    async function submitTerminalCommand(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const command = terminalInput.trim();
        if (!command) return;

        setTerminalInput('');
        await runLabCommand(command);
    }

    function copyOutput() {
        navigator.clipboard.writeText(output || envBlock);
    }

    function clearOutput() {
        setOutput('');
    }

    return (
        <div className="min-h-screen bg-[#f7f7f1] text-neutral-950">
            <style jsx>{`
                .paper-grid {
                    background-image:
                        linear-gradient(to right, rgba(22, 22, 18, 0.055) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(22, 22, 18, 0.055) 1px, transparent 1px);
                    background-size: 18px 18px;
                }
            `}</style>

            <section className="paper-grid border-b border-neutral-900/10">
                <div className="container-custom py-10">
                    <Breadcrumbs
                        items={[
                            { name: 'Tools', href: '/#tools', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
                            { name: 'Cloud Lab', href: '/tools/cloud-lab' }
                        ]}
                    />

                    <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 border border-neutral-900/20 bg-[#fbff5d] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em]">
                                <Cloud className="h-3.5 w-3.5" />
                                WebUtilsPro Cloud Lab
                            </div>
                            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-normal md:text-6xl">
                                Test cloud functions with real event data.
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
                                Start an isolated WebUtilsPro lab session, pick a service, generate commands, and replay webhook payloads into the same shape your production code expects.
                            </p>
                        </div>

                        <div className="grid gap-px border border-neutral-900/15 bg-neutral-900/15 sm:grid-cols-3">
                            {[
                                { label: 'Runtime', value: 'WebUtilsPro managed' },
                                { label: 'Status', value: status.connected ? 'online' : 'starting soon' },
                                { label: 'Session', value: session ? 'active' : 'ready' }
                            ].map((row) => (
                                <div key={row.label} className="bg-[#fbfbf4] p-4">
                                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">{row.label}</div>
                                    <div className="mt-2 truncate text-xl font-semibold">{row.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-neutral-900/10 bg-[#fbfbf4] py-12">
                <div className="container-custom grid gap-8 lg:grid-cols-[280px_1fr]">
                    <aside className="border border-neutral-900/15 bg-neutral-900/15">
                        <div className="bg-[#fbfbf4] p-4 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">AWS services</div>
                        <div className="grid gap-px">
                            {LAB_SERVICES.map((service) => {
                                const Icon = service.icon;
                                const isActive = service.id === activeService.id;
                                return (
                                    <button
                                        key={service.id}
                                        onClick={() => chooseService(service)}
                                        className={`flex w-full items-center gap-3 bg-[#fbfbf4] p-4 text-left transition-colors ${isActive ? 'bg-[#fbff5d]' : 'hover:bg-white'}`}
                                    >
                                        <Icon className="h-4 w-4 text-neutral-900" />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold">{service.name}</span>
                                            <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">{service.category}</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-neutral-500">{service.port}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
                        <div className="space-y-8">
                            <div className="border border-neutral-900/15 bg-[#fbfbf4] p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">{activeService.category}</div>
                                        <h2 className="mt-2 text-3xl font-semibold">{activeService.name}</h2>
                                    </div>
                                    <ActiveServiceIcon className="h-7 w-7 text-neutral-900" />
                                </div>
                                <p className="mt-4 text-sm leading-6 text-neutral-600">{activeService.description}</p>

                                <div className="mt-6 grid grid-cols-2 gap-px bg-neutral-900/15">
                                    {activeService.actions.map((action) => (
                                        <button
                                            key={action}
                                            onClick={() => selectAction(action)}
                                            className={`min-h-14 bg-[#fbfbf4] px-3 py-2 text-left text-sm font-semibold transition-colors ${selectedAction === action ? 'bg-[#fbff5d]' : 'hover:bg-white'}`}
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                    <button
                                        onClick={createSession}
                                        className="inline-flex h-11 items-center justify-center gap-2 border border-neutral-950 bg-neutral-950 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white"
                                    >
                                        {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ServerCog className="h-4 w-4" />}
                                        Start managed session
                                    </button>
                                    <button
                                        onClick={stageSelectedAction}
                                        className="inline-flex h-11 items-center justify-center gap-2 border border-neutral-900 bg-[#fbff5d] px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-950"
                                    >
                                        <TerminalSquare className="h-4 w-4" />
                                        Paste command
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-px border border-neutral-900/15 bg-neutral-900/15 sm:grid-cols-2">
                                {WORKFLOW_ROWS.map((row) => {
                                    const Icon = row.icon;
                                    return (
                                        <div key={row.label} className="bg-[#fbfbf4] p-4">
                                            <Icon className="h-5 w-5 text-neutral-900" />
                                            <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">{row.label}</div>
                                            <div className="mt-2 text-sm leading-6 text-neutral-700">{row.value}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border border-neutral-900 bg-neutral-950 text-white">
                            <div className="flex items-center justify-between border-b border-white/15 px-4 py-3">
                                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-300">
                                    <TerminalSquare className="h-4 w-4 text-[#fbff5d]" />
                                    Lab output
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={clearOutput} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-300 hover:text-white">
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Clear
                                    </button>
                                    <button onClick={copyOutput} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-300 hover:text-white">
                                        <Copy className="h-3.5 w-3.5" />
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <pre className="min-h-[500px] overflow-x-auto whitespace-pre-wrap p-5 font-mono text-xs leading-6 text-neutral-300">
                                {output || [
                                    '# WebUtilsPro session',
                                    envBlock,
                                    '',
                                    '# Select a service and action to stage a command.',
                                    JSON.stringify({
                                        selectedService: activeService.id,
                                        selectedAction,
                                        session: session ? session.sessionId : 'not started'
                                    }, null, 2)
                                ].join('\n')}
                            </pre>
                            <form onSubmit={submitTerminalCommand} className="flex items-center gap-2 border-t border-white/15 p-3">
                                <span className="font-mono text-xs text-[#fbff5d]">$</span>
                                <input
                                    value={terminalInput}
                                    onChange={(event) => setTerminalInput(event.target.value)}
                                    placeholder="aws s3 mb s3://webutilspro-demo"
                                    className="h-10 min-w-0 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-neutral-600"
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                                <button
                                    type="submit"
                                    disabled={isCommandRunning}
                                    className="inline-flex h-10 items-center justify-center gap-2 border border-white/25 px-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isCommandRunning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                                    Run
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="paper-grid py-14">
                <div className="container-custom flex flex-col items-start justify-between gap-6 border border-neutral-900/15 bg-[#fbfbf4]/85 p-6 md:flex-row md:items-center">
                    <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">Webhook bridge</div>
                        <h2 className="mt-2 text-3xl font-semibold">Replay captured requests into the lab.</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                            The backend now includes a replay-plan endpoint for captured Webhook Inspector requests. The next step is wiring selected requests to WebUtilsPro-managed AWS-style actions.
                        </p>
                    </div>
                    <Link href="/tools/webhook-inspector" className="inline-flex h-11 items-center gap-2 border border-neutral-950 bg-neutral-950 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                        Open webhooks
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
