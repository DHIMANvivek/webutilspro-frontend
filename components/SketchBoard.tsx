'use client';

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Loader2, Trash2, Eraser, Pen, Download, Share2, Copy, Image as ImageIcon, Type } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

interface Point {
    x: number;
    y: number;
}

interface DrawData {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    color: string;
    width: number;
    roomId: string;
    isEraser: boolean;
}

interface ImageData {
    image: string;
    x: number;
    y: number;
    width: number;
    height: number;
    roomId: string;
}

interface TextData {
    id?: string;
    text: string;
    x: number;
    y: number;
    color: string;
    font: string;
    roomId: string; // Ensure roomId is included
}

interface ActiveText {
    x: number;
    y: number;
    text: string;
}

interface PeerTyping {
    text: string;
    x: number;
    y: number;
    color: string;
}

const COLORS = [
    '#ffffff', // White
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#000000', // Eraser/Black
];

export default function SketchBoard() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [color, setColor] = useState('#ffffff');
    const [width, setWidth] = useState(2);
    const [tool, setTool] = useState<'pen' | 'eraser' | 'text'>('pen');
    const [isDrawing, setIsDrawing] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [activeText, setActiveText] = useState<ActiveText | null>(null);
    const [peerTyping, setPeerTyping] = useState<Record<string, PeerTyping>>({});
    const lastPoint = useRef<Point | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const [roomId, setRoomId] = useState<string>('');

    useEffect(() => {
        const room = searchParams.get('room');
        if (room) {
            setRoomId(room);
        } else {
            const newId = uuidv4();
            router.replace(`?room=${newId}`);
            setRoomId(newId);
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (!roomId) return;

        // Initialize socket connection
        const isProduction = process.env.NODE_ENV === 'production';
        const socketUrl = process.env.NEXT_PUBLIC_API_URL || (isProduction ? undefined : 'http://localhost:4000');

        const newSocket = io(socketUrl || undefined, {
            autoConnect: true,
            reconnection: true,
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            newSocket.emit('join-room', roomId);
            toast.success('Connected! Changes are live & visible to everyone in this room.', {
                duration: 5000,
                icon: '🟢'
            });
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            toast.error('Disconnected from server');
        });

        newSocket.on('drawing', (data: DrawData) => {
            drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.width, false, data.isEraser);
        });

        newSocket.on('draw-image', (data: ImageData) => {
            const img = new Image();
            img.onload = () => {
                const ctx = canvasRef.current?.getContext('2d');
                ctx?.drawImage(img, data.x, data.y, data.width, data.height);
            };
            img.src = data.image;
        });

        newSocket.on('draw-text', (data: TextData) => {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                ctx.font = data.font;
                ctx.fillStyle = data.color;
                ctx.fillText(data.text, data.x, data.y);
            }
            // Clear their typing indicator
            if (data.id) {
                setPeerTyping(prev => {
                    const next = { ...prev };
                    delete next[data.id!];
                    return next;
                });
            }
        });

        newSocket.on('typing', (data: TextData) => {
            if (data.id) {
                setPeerTyping(prev => ({
                    ...prev,
                    [data.id!]: {
                        text: data.text,
                        x: data.x,
                        y: data.y,
                        color: data.color
                    }
                }));
            }
        });

        newSocket.on('clear-canvas', () => {
            clearCanvas(false);
        });

        setSocket(newSocket);

        // Handle window resize
        const handleResize = () => {
            if (canvasRef.current && containerRef.current) {
                // Save current canvas content
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = canvasRef.current.width;
                tempCanvas.height = canvasRef.current.height;
                tempCtx?.drawImage(canvasRef.current, 0, 0);

                // Resize
                canvasRef.current.width = containerRef.current.offsetWidth;
                canvasRef.current.height = 600;

                // Restore content
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.drawImage(tempCanvas, 0, 0);
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            newSocket.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, [roomId]);

    const drawLine = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        drawColor: string,
        lineWidth: number,
        emit: boolean,
        eraser: boolean = false
    ) => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return;

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);

        if (eraser) {
            context.globalCompositeOperation = 'destination-out';
            context.strokeStyle = 'rgba(0,0,0,1)';
            context.lineWidth = 20; // Eraser is typically larger
        } else {
            context.globalCompositeOperation = 'source-over';
            context.strokeStyle = drawColor;
            context.lineWidth = lineWidth;
        }

        context.stroke();
        context.closePath();

        if (!emit || !socket) return;

        socket.emit('drawing', {
            x0, y0, x1, y1,
            color: drawColor,
            width: lineWidth,
            roomId,
            isEraser: eraser
        });
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (tool === 'text') {
            handleTextTool(e);
            return;
        }
        setIsDrawing(true);
        const point = getCoordinates(e);
        lastPoint.current = point;
    };

    const handleTextTool = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const point = getCoordinates(e);
        setActiveText({ x: point.x, y: point.y, text: '' });
    };

    const finalizeText = () => {
        if (!activeText || !activeText.text.trim()) {
            setActiveText(null);
            return;
        }

        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            const font = '20px sans-serif';
            ctx.font = font;
            ctx.fillStyle = color;
            ctx.fillText(activeText.text, activeText.x, activeText.y + 20);

            if (socket) {
                socket.emit('draw-text', {
                    id: socket.id,
                    text: activeText.text,
                    x: activeText.x,
                    y: activeText.y + 20,
                    color,
                    font,
                    roomId
                });
            }
        }
        setActiveText(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 5MB limit
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        if (canvasRef.current) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const ctx = canvasRef.current?.getContext('2d');
                    // Scale down if too big
                    let w = img.width;
                    let h = img.height;
                    const maxW = 400;
                    if (w > maxW) {
                        const ratio = maxW / w;
                        w = maxW;
                        h = h * ratio;
                    }

                    ctx?.drawImage(img, 100, 100, w, h);

                    if (socket) {
                        socket.emit('draw-image', {
                            image: event.target?.result as string,
                            x: 100,
                            y: 100,
                            width: w,
                            height: h,
                            roomId
                        });
                    }
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !lastPoint.current || tool === 'text') return;

        // Prevent scrolling on touch devices
        if (e.type.includes('touch')) {
            e.preventDefault();
        }

        const point = getCoordinates(e);
        drawLine(
            lastPoint.current.x,
            lastPoint.current.y,
            point.x,
            point.y,
            color,
            width,
            true,
            tool === 'eraser'
        );
        lastPoint.current = point;
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        lastPoint.current = null;
    };

    const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
        if (!canvasRef.current) return { x: 0, y: 0 };

        const rect = canvasRef.current.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clearCanvas = (emit: boolean = true) => {
        const context = canvasRef.current?.getContext('2d');
        if (!context || !canvasRef.current) return;

        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (emit && socket) {
            socket.emit('clear-canvas', roomId);
        }
    };

    const downloadCanvas = () => {
        if (!canvasRef.current) return;

        // Create a temporary canvas to add a background color (since transparent background downloads as black)
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCanvas.width = canvasRef.current.width;
        tempCanvas.height = canvasRef.current.height;

        // Fill with dark background
        tempCtx.fillStyle = '#1e1e1e';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw original canvas over it
        tempCtx.drawImage(canvasRef.current, 0, 0);

        const dataUrl = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `sketch-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="bg-gray-800 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4 border border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-900 p-1 rounded-md border border-gray-700">
                        <button
                            onClick={() => setTool('pen')}
                            className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            title="Pen"
                        >
                            <Pen size={20} />
                        </button>
                        <button
                            onClick={() => setTool('eraser')}
                            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            title="Eraser"
                        >
                            <Eraser size={20} />
                        </button>
                        <button
                            onClick={() => setTool('text')}
                            className={`p-2 rounded ${tool === 'text' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            title="Text Tool"
                        >
                            <Type size={20} />
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 rounded text-gray-400 hover:text-white"
                            title="Upload Image"
                        >
                            <ImageIcon size={20} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="h-8 w-px bg-gray-700 mx-2 hidden sm:block"></div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {COLORS.map((c) => (
                            <button
                                key={c}
                                onClick={() => {
                                    setColor(c);
                                    if (tool === 'eraser') setTool('pen');
                                }}
                                className={`w-6 h-6 rounded-full border-2 ${color === c && tool !== 'eraser' ? 'border-white scale-110' : 'border-transparent hover:scale-110'
                                    }`}
                                style={{ backgroundColor: c }}
                                title={c}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        title="Line Width"
                    />

                    <div className="h-8 w-px bg-gray-700 mx-2 hidden sm:block"></div>

                    <button
                        onClick={() => clearCanvas(true)}
                        className="p-2 text-red-400 hover:bg-gray-700 rounded transition-colors"
                        title="Clear Canvas"
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={downloadCanvas}
                        className="p-2 text-green-400 hover:bg-gray-700 rounded transition-colors"
                        title="Download"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success('Link copied! Share it to collaborate.');
                        }}
                        className="p-2 text-blue-400 hover:bg-gray-700 rounded transition-colors flex items-center gap-2"
                        title="Share Link"
                    >
                        <Share2 size={20} />
                        <span className="hidden sm:inline text-sm font-bold">Share</span>
                    </button>
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'}></div>
                </div>
            </div>

            {/* Canvas Container */}
            <div
                ref={containerRef}
                className="relative bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-xl"
                style={{ height: '600px', cursor: tool === 'text' ? 'text' : tool === 'eraser' ? 'crosshair' : 'default' }}
            >
                {tool !== 'eraser' && tool !== 'text' && (
                    <div
                        className="absolute pointer-events-none rounded-full border border-white opacity-50"
                        style={{ width: width, height: width, backgroundColor: color }}
                    />
                )}

                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="touch-none"
                />

                {!isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="flex flex-col items-center text-white">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p>Connecting to server...</p>
                        </div>
                    </div>
                )}

                {Object.entries(peerTyping).map(([id, data]) => (
                    <div
                        key={id}
                        style={{
                            position: 'absolute',
                            left: `${data.x}px`,
                            top: `${data.y}px`,
                            color: data.color,
                            font: '20px sans-serif',
                            background: 'rgba(255, 255, 255, 0.9)',
                            padding: '4px 8px',
                            border: `2px dashed ${data.color}`,
                            borderRadius: '4px',
                            whiteSpace: 'pre',
                            zIndex: 900,
                            pointerEvents: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {data.text || '...'}
                        <div className="text-[10px] text-gray-500 font-bold mt-1">typing...</div>
                    </div>
                ))}

                {activeText && (
                    <input
                        autoFocus
                        placeholder="Type & Press Enter..."
                        autoComplete="off"
                        value={activeText.text}
                        onChange={(e) => {
                            const newText = e.target.value;
                            setActiveText({ ...activeText, text: newText });
                            socket?.emit('typing', {
                                id: socket.id,
                                text: newText,
                                x: activeText.x,
                                y: activeText.y + 20, // Match the draw offset
                                color,
                                roomId
                            });
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') finalizeText();
                            if (e.key === 'Escape') setActiveText(null);
                        }}
                        style={{
                            position: 'absolute',
                            left: `${activeText.x}px`,
                            top: `${activeText.y}px`,
                            color: '#000000',
                            font: '20px sans-serif',
                            background: '#ffffff',
                            border: '2px solid #3b82f6',
                            borderRadius: '4px',
                            outline: 'none',
                            padding: '8px',
                            margin: 0,
                            minWidth: '200px',
                            zIndex: 1000,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                    />
                )}
            </div>

            <div className="text-sm text-gray-500 text-center">
                Drawings are not saved permanently. They are shared in real-time with anyone currently on this page.
            </div>
        </div >
    );
}
