import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    try {
        // Robust Fallback: Scrape the main Steam Search page
        // "category1=998" ensures we get Games (not just DLCs or bundles if possible, though Steam search is fuzzy)

        // We MUST send a User-Agent to avoid getting 403 or 302
        const response = await fetch(`https://store.steampowered.com/search/?term=${encodeURIComponent(query)}&category1=998`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Steam Search failed');
        }

        const html = await response.text();
        const items: any[] = [];

        // Regex to find search rows
        // <a href=".../app/271590/..." ... data-ds-appid="271590" ...>
        // Use a loop to find multiple matches

        // 1. extract rows first to avoid cross-pollination
        const rowRegex = /<a href="[^"]*app\/(\d+)[^"]*"[^>]*class="search_result_row[^"]*"[^>]*>(.*?)<\/a>/gs;
        let match;

        while ((match = rowRegex.exec(html)) !== null) {
            if (items.length >= 10) break;

            const appId = match[1];
            const content = match[2];

            // Extract Title
            const titleMatch = /<span class="title">([^<]+)<\/span>/i.exec(content);
            const name = titleMatch ? titleMatch[1] : `App ${appId}`;

            // Extract Image
            // src="https://.../capsule_sm_120.jpg"
            const imgMatch = /src="([^"]+capsule_sm_120\.jpg[^"]*)"/i.exec(content);
            const image = imgMatch ? imgMatch[1] : `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_sm_120.jpg`;

            // Filter out "undefined" or weird results
            if (appId && name) {
                // Deduplicate
                if (!items.find(i => i.id === appId)) {
                    items.push({
                        id: appId,
                        name: name,
                        image: image,
                        price: 0
                    });
                }
            }
        }

        return NextResponse.json(items);

    } catch (e) {
        console.error('Steam Search Error:', e);
        return NextResponse.json([]);
    }
}
