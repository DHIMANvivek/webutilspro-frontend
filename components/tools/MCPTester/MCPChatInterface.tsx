'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Code2, CheckCircle2 } from 'lucide-react';
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
        <div className="flex flex-col h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-blue-600">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                        <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">MCP Test Console</h3>
                        <p className="text-xs text-white/80">Execute tools via natural language</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id}>
                        <div
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}

                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                                    }`}
                            >
                                <div className="text-sm">
                                    {message.role === 'assistant' ? (
                                        <MarkdownViewer content={message.content} />
                                    ) : (
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    )}
                                </div>

                                {/* Tool Execution Header */}
                                {message.toolName && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400 font-medium text-xs">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Executed "{message.toolName}"</span>
                                        </div>

                                        {/* Arguments (if any) */}
                                        {message.arguments && Object.keys(message.arguments).length > 0 && (
                                            <details className="mb-2">
                                                <summary className="text-[10px] opacity-60 cursor-pointer hover:opacity-100 transition-opacity">
                                                    Show arguments
                                                </summary>
                                                <pre className="text-[10px] mt-1 p-2 bg-gray-200 dark:bg-gray-900 rounded-md overflow-x-auto opacity-70">
                                                    {JSON.stringify(message.arguments, null, 2)}
                                                </pre>
                                            </details>
                                        )}

                                        {/* Tool Result Data */}
                                        {message.data && (
                                            <div className="mt-2 bg-white dark:bg-gray-950 rounded-md p-3 border border-gray-200 dark:border-gray-800">
                                                <MarkdownViewer content={extractMcpText(message.data) || ''} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {message.role === 'user' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                        </div>
                    </div>
                )}

            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... (e.g., 'list tools' or 'read file /tmp/test.txt')"
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
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
