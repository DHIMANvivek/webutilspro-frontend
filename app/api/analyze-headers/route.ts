import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        let targetUrl = url;
        if (!targetUrl.startsWith('http')) {
            targetUrl = `https://${targetUrl}`;
        }

        const response = await fetch(targetUrl, {
            method: 'HEAD',
            redirect: 'follow',
            headers: {
                'User-Agent': 'WebUtilsPro-Header-Analyzer/1.0'
            }
        });

        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });

        return NextResponse.json({
            url: response.url,
            status: response.status,
            headers
        });

    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to fetch headers',
            details: error.message
        }, { status: 500 });
    }
}
