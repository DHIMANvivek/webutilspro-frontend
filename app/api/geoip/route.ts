import { NextResponse } from 'next/server';
import dns from 'dns/promises';

// Helper to resolve domain to IP
async function resolveDomain(domain: string): Promise<string | null> {
    try {
        const result = await dns.lookup(domain);
        return result.address;
    } catch (e) {
        return null;
    }
}

// Helper to get geolocation for an IP
async function getGeoData(ip: string) {
    // Using ip-api.com (Free tier: 45 requests/min, throttling required in prod)
    // Production usage should replace with MaxMind or a paid provider
    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,isp,query`);
        return await res.json();
    } catch (e) {
        return null;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    try {
        // 1. Resolve Target Domain
        let targetIp = domain;
        if (!/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
            const resolved = await resolveDomain(domain);
            if (!resolved) {
                return NextResponse.json({ error: 'Could not resolve domain' }, { status: 404 });
            }
            targetIp = resolved;
        }

        // 2. Get Target Location
        const targetGeo = await getGeoData(targetIp);
        if (!targetGeo || targetGeo.status !== 'success') {
            return NextResponse.json({ error: 'Could not locate target server' }, { status: 404 });
        }

        // 3. Get User (Source) Location
        // In Next.js, we can read 'x-forwarded-for' or fallback to a default (e.g., user's public IP fetch)
        // For this demo, we can let the Client fetch its own IP, or guess based on request headers.
        // Simplified: We'll fetch the client's public IP using the API itself if no header.

        // Actually, let's just return the Target info. The Client can loop up "My IP" separately 
        // or we can do it here. Doing it here saves a call.

        let clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || '';
        // If localhost or empty, the API might see the server's IP or loopback. 
        // Special Case: If clientIp is missing, we'll return a flag to tell client "use your local browser geolocation"

        let sourceGeo = null;
        if (clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1') {
            sourceGeo = await getGeoData(clientIp);
        }

        return NextResponse.json({
            target: {
                ip: targetGeo.query,
                hostname: domain,
                city: targetGeo.city,
                region: targetGeo.regionName,
                country: targetGeo.country,
                isp: targetGeo.isp,
                lat: targetGeo.lat,
                lng: targetGeo.lon,
            },
            source: sourceGeo && sourceGeo.status === 'success' ? {
                lat: sourceGeo.lat,
                lng: sourceGeo.lon,
                city: sourceGeo.city,
                country: sourceGeo.country
            } : null // Client will fallback to Browser Geolocation
        });

    } catch (e: any) {
        console.error('GeoIP Error:', e);
        return NextResponse.json({ error: 'Trace failed' }, { status: 500 });
    }
}
