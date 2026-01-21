import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://webutilspro-backend.vercel.app';

export async function POST(request: NextRequest) {
    try {
        const { prompt, useCase } = await request.json();

        if (!prompt || prompt.trim().length === 0) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Proxy request to backend server
        const backendResponse = await fetch(`${BACKEND_URL}/api/ai/optimize-prompt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `${prompt} (Use case: ${useCase || 'general'})`
            }),
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(
                {
                    error: data.error || 'Failed to optimize prompt',
                    message: data.message || 'Backend server error'
                },
                { status: backendResponse.status }
            );
        }

        // Transform backend response to match frontend expectations
        return NextResponse.json({
            success: true,
            data: data.data || {
                optimizedPrompt: data.data?.optimizedPrompt || prompt,
                improvements: data.data?.improvements || [],
                tips: ['AI-optimized prompt']
            },
            remaining: 10,
            isPlaceholder: false,
        });

    } catch (error) {
        console.error('Prompt Optimizer proxy error:', error);

        // Fallback to placeholder if backend is unavailable
        return NextResponse.json({
            success: true,
            data: {
                optimizedPrompt: `${prompt}\n\n[Backend server unavailable - this is a placeholder]`,
                improvements: [
                    {
                        category: 'Server Status',
                        explanation: 'Backend server is not running. Start it with: cd webutilspro-backend && npm run dev'
                    }
                ],
                tips: [
                    'Ensure backend server is running on port 4000',
                    'Check Hugging Face API key in backend .env file',
                    'Verify BACKEND_URL environment variable'
                ]
            },
            remaining: 10,
            isPlaceholder: true,
            message: 'Backend server unavailable - showing fallback response'
        });
    }
}
