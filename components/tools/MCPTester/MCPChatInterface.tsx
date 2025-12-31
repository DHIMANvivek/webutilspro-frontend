'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Code2, CheckCircle2, ChevronRight } from 'lucide-react';
import MarkdownViewer from '../../MarkdownViewer';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    data?: any;
    toolName?: string;
    arguments?: any;
    timestamp: Date;
}

export default function MCPChatInterface() {
    // ... rest of the state ...
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hi! I can help you test MCP tools. You can ask me to execute tools, or type "list tools" to see what\'s available.',
            timestamp: new Date()
        }
    ]);

    // Helpers to extract text from MCP data
    const extractMcpText = (data: any) => {
        if (!data) return null;
        if (typeof data === 'string') return data;

        // Handle MCP content array
        if (data.content && Array.isArray(data.content)) {
            return data.content
                .filter((item: any) => item.type === 'text')
                .map((item: any) => item.text)
                .join('\n\n');
        }

        // Fallback to JSON if it's not a standard text-based result
        return JSON.stringify(data, null, 2);
    };

    const [input, setInput] = useState('');
    // ... rest of the component until return ...
    const [isLoading, setIsLoading] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/mcp/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.slice(-5)
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to send message');
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.message,
                data: result.data,
                toolName: result.toolName,
                arguments: result.arguments,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `❌ Error: ${error.message}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[650px] bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden transition-all hover:shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
                        <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white tracking-tight">MCP Test Console</h3>
                        <p className="text-[11px] text-white/70 font-medium">Execute tools via natural language</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {messages.map((message) => (
                    <div key={message.id} className="animate-fade-in">
                        <div
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}

                            <div
                                className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${message.role === 'user'
                                    ? 'bg-slate-900 text-white rounded-tr-none'
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                    }`}
                            >
                                <div className="text-sm leading-relaxed">
                                    {message.role === 'assistant' ? (
                                        <MarkdownViewer content={message.content} />
                                    ) : (
                                        <p className="whitespace-pre-wrap font-medium">{message.content}</p>
                                    )}
                                </div>

                                {/* Tool Execution Header */}
                                {message.toolName && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                                                Executed: {message.toolName}
                                            </span>
                                        </div>

                                        {/* Arguments (if any) */}
                                        {message.arguments && Object.keys(message.arguments).length > 0 && (
                                            <details className="mb-3 group">
                                                <summary className="text-[10px] font-bold text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors list-none flex items-center gap-1">
                                                    <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                                                    VIEW ARGUMENTS
                                                </summary>
                                                <pre className="text-[10px] mt-2 p-3 bg-slate-900 text-indigo-400 rounded-xl overflow-x-auto shadow-inner">
                                                    {JSON.stringify(message.arguments, null, 2)}
                                                </pre>
                                            </details>
                                        )}

                                        {/* Tool Result Data */}
                                        {message.data && (
                                            <div className="mt-2 bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-inner">
                                                <MarkdownViewer content={extractMcpText(message.data) || ''} className="prose-slate" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {message.role === 'user' && (
                                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center border border-slate-300">
                                    <User className="w-5 h-5 text-slate-600" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 justify-start animate-fade-in">
                        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white rounded-2xl px-5 py-3 border border-slate-100 shadow-sm rounded-tl-none">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-5 bg-white border-t border-slate-100">
                <div className="flex gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80 focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-inner">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type tools/instructions... e.g., 'list tools'"
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-sm font-medium disabled:opacity-50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-indigo-600 hover:bg-slate-900 disabled:bg-slate-200 text-white rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-indigo-600/20 active:scale-95"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
