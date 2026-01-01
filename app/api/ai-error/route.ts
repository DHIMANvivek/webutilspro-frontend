import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://api.webutilspro.com';

export async function POST(request: NextRequest) {
    try {
        const { errorMessage, language } = await request.json();

        if (!errorMessage || errorMessage.trim().length === 0) {
            return NextResponse.json(
                { error: 'Error message is required' },
                { status: 400 }
            );
        }

        // Proxy request to backend server
        const backendResponse = await fetch(`${BACKEND_URL}/api/ai/explain-error`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: `// ${language || 'JavaScript'} code with error`,
                error: errorMessage
            }),
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(
                {
                    error: data.error || 'Failed to explain error',
                    message: data.message || 'Backend server error'
                },
                { status: backendResponse.status }
            );
        }

        // Transform backend response to match frontend expectations
        return NextResponse.json({
            success: true,
            data: data.data || {
                explanation: data.data?.explanation || 'Error explanation from AI',
                possibleCauses: ['AI-generated analysis'],
                solution: {
                    steps: ['Check the error details provided'],
                    codeExample: undefined
                },
                prevention: ['Follow best practices']
            },
            remaining: 10, // You can track this in the backend
            isPlaceholder: false,
        });

    } catch (error) {
        console.error('AI Error Explainer proxy error:', error);

        // Fallback to placeholder if backend is unavailable
        return NextResponse.json({
            success: true,
            data: {
                explanation: `Backend server is currently unavailable. This is a placeholder response.`,
                possibleCauses: [
                    'Backend server not running (check port 4000)',
                    'Hugging Face API key not configured',
                    'Network connection issue'
                ],
                solution: {
                    steps: [
                        'Ensure backend server is running: cd webutilspro-backend && npm run dev',
                        'Check BACKEND_URL environment variable',
                        'Verify Hugging Face API key is set in backend .env file'
                    ]
                },
                prevention: [
                    'Keep backend server running',
                    'Use valid Hugging Face API key'
                ]
            },
            remaining: 10,
            isPlaceholder: true,
            message: 'Backend server unavailable - showing fallback response'
        });
    }
}
