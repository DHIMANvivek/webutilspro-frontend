'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import MarkdownViewer from '../../MarkdownViewer';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    data?: any;
    intent?: string;
    timestamp: Date;
    pagination?: {
        total: number;
        currentCount: number;
        hasMore: boolean;
        page: number;
        searchQuery?: string;
        params?: any;
    };
}

interface ChatInterfaceProps {
    onClose?: () => void;
}

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
    // ... rest of the state ...
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hi! I can help you manage your WooCommerce store. Click a suggestion below or type your own request.',
            timestamp: new Date()
        }
    ]);

    // Helper to format data for display
    const formatDataForDisplay = (data: any) => {
        if (!data) return null;
        if (typeof data === 'string') return data;

        // Handle MCP content array
        if (data.content && Array.isArray(data.content)) {
            return data.content
                .filter((item: any) => item.type === 'text')
                .map((item: any) => item.text)
                .join('\n\n');
        }

        // Handle WooCommerce arrays (products/orders)
        if (Array.isArray(data)) {
            if (data.length === 0) return '_No results found._';

            // Just show a cleaner JSON or a simple list
            return '```json\n' + JSON.stringify(data.slice(0, 5), null, 2) + (data.length > 5 ? '\n... and more' : '') + '\n```';
        }

        return JSON.stringify(data, null, 2);
    };

    const [input, setInput] = useState('');
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

    const sendMessage = async (messageToSend?: string) => {
        const messageContent = messageToSend || input.trim();
        if (!messageContent || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageContent,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/woo/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.slice(-5) // Last 5 messages for context
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
                intent: result.intent,
                timestamp: new Date(),
                pagination: result.pagination // Add pagination info if available
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

    const suggestedPrompts = [
        { label: "get all the bags", icon: "👜" },
        { label: "Show products under $50", icon: "💰" },
        { label: "Create product Blue Hoodie for $60", icon: "➕" },
        { label: "Show recent orders", icon: "📦" }
    ];

    const handleSuggestedPrompt = (prompt: string) => {
        sendMessage(prompt);
    };

    const handleLoadMore = async (messageId: string, pagination: any) => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            const response = await fetch('/api/woo/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    message: pagination.searchQuery || 'show more products',
                    loadMore: true,
                    page: pagination.page + 1,
                    params: pagination.params,
                    history: messages.slice(-5)
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to load more');
            }

            // Update the existing message with combined data
            setMessages(prev => prev.map(msg => {
                if (msg.id === messageId) {
                    const existingData = Array.isArray(msg.data) ? msg.data : [];
                    const newData = Array.isArray(result.data) ? result.data : [];

                    return {
                        ...msg,
                        data: [...existingData, ...newData],
                        content: result.message,
                        pagination: result.pagination
                    };
                }
                return msg;
            }));
        } catch (error: any) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `❌ Error loading more: ${error.message}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">AI Assistant</h3>
                        <p className="text-xs text-white/80">Powered by Transformers.js</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id}>
                        <div
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}

                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                                    ? 'bg-blue-500 text-white'
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

                                {message.intent && (
                                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2 mb-1 text-green-600 dark:text-green-400 font-medium text-[10px]">
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Intent: {message.intent}</span>
                                        </div>

                                        {message.data && (
                                            <div className="mt-2 bg-white dark:bg-gray-950 rounded-md p-2 border border-gray-200 dark:border-gray-800">
                                                <MarkdownViewer content={formatDataForDisplay(message.data) || ''} />
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

                        {/* Load More Button */}
                        {message.role === 'assistant' && message.pagination && message.pagination.hasMore && (
                            <div className="flex gap-3 justify-start mt-2">
                                <div className="flex-shrink-0 w-8" /> {/* Spacer for alignment */}
                                <button
                                    onClick={() => handleLoadMore(message.id, message.pagination)}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <span>📦</span>
                                            <span>Load More Products ({message.pagination.total - message.pagination.currentCount} remaining)</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        </div>
                    </div>
                )}

            </div>

            {/* Suggested Prompts (show only when no user messages) */}
            {messages.length === 1 && (
                <div className="px-4 pb-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Try these:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {suggestedPrompts.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestedPrompt(prompt.label)}
                                className="px-4 py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-all border border-blue-500/20 hover:border-blue-500/40 flex items-center gap-2 justify-center sm:justify-start font-medium"
                            >
                                <span className="text-lg">{prompt.icon}</span>
                                <span className="text-left">{prompt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
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
