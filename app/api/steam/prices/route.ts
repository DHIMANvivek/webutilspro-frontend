import { NextResponse } from 'next/server';

// approximate exchange rates (real app would fetch this daily from an API like OpenExchangeRates)
const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1,
    'EUR': 1.09,
    'GBP': 1.27,
    'CNY': 0.14,
    'INR': 0.012,
    'BRL': 0.20,
    'TRY': 0.033,
    'ARS': 0.0012,
    'JPY': 0.0069,
    'RUB': 0.011,
    'CHF': 1.15,
    'CAD': 0.74,
    'AUD': 0.66,
    'NZD': 0.61,
    'PLN': 0.25,
    'KRW': 0.00075,
    'HKD': 0.13,
    'TWD': 0.031,
    'SGD': 0.75,
    'IDR': 0.000064,
    'MYR': 0.21,
    'PHP': 0.018,
    'THB': 0.028,
    'VND': 0.000041,
    'ZAR': 0.053,
    'MXN': 0.059,
    'CLP': 0.0011,
    'COP': 0.00026,
    'PEN': 0.27,
    'SAR': 0.27,
    'AED': 0.27,
    'ILS': 0.27,
    'KZT': 0.0022,
    'UAH': 0.026,
    'NOK': 0.095,
};

const REGIONS = [
    // North America & Europe (Tier 1)
    { code: 'US', currency: 'USD', name: 'USA', flag: '🇺🇸' },
    { code: 'GB', currency: 'GBP', name: 'UK', flag: '🇬🇧' },
    { code: 'DE', currency: 'EUR', name: 'Eurozone', flag: '🇪🇺' },
    { code: 'CH', currency: 'CHF', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'CA', currency: 'CAD', name: 'Canada', flag: '🇨🇦' },
    { code: 'NO', currency: 'NOK', name: 'Norway', flag: '🇳🇴' },

    // Asia (Tier 2/3)
    { code: 'CN', currency: 'CNY', name: 'China', flag: '🇨🇳' },
    { code: 'IN', currency: 'INR', name: 'India', flag: '🇮🇳' },
    { code: 'JP', currency: 'JPY', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', currency: 'KRW', name: 'South Korea', flag: '🇰🇷' },
    { code: 'HK', currency: 'HKD', name: 'Hong Kong', flag: '🇭🇰' },
    { code: 'TW', currency: 'TWD', name: 'Taiwan', flag: '🇹🇼' },
    { code: 'SG', currency: 'SGD', name: 'Singapore', flag: '🇸🇬' },
    { code: 'ID', currency: 'IDR', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'MY', currency: 'MYR', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'PH', currency: 'PHP', name: 'Philippines', flag: '🇵🇭' },
    { code: 'TH', currency: 'THB', name: 'Thailand', flag: '🇹🇭' },
    { code: 'VN', currency: 'VND', name: 'Vietnam', flag: '🇻🇳' },

    // LATAM & Others (Often Cheapest)
    { code: 'BR', currency: 'BRL', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', currency: 'MXN', name: 'Mexico', flag: '🇲🇽' },
    { code: 'CL', currency: 'CLP', name: 'Chile', flag: '🇨🇱' },
    { code: 'CO', currency: 'COP', name: 'Colombia', flag: '🇨🇴' },
    { code: 'PE', currency: 'PEN', name: 'Peru', flag: '🇵🇪' },
    { code: 'TR', currency: 'TRY', name: 'Turkey', flag: '🇹🇷' }, // Formerly cheapest
    { code: 'AR', currency: 'USD', name: 'Argentina (LATAM-USD)', flag: '🇦🇷' }, // Now USD
    { code: 'RU', currency: 'RUB', name: 'Russia', flag: '🇷🇺' },
    { code: 'KZ', currency: 'KZT', name: 'Kazakhstan', flag: '🇰🇿' },
    { code: 'UA', currency: 'UAH', name: 'Ukraine', flag: '🇺🇦' },
    { code: 'ZA', currency: 'ZAR', name: 'South Africa', flag: '🇿🇦' },
    { code: 'PL', currency: 'PLN', name: 'Poland', flag: '🇵🇱' },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'App ID required' }, { status: 400 });
    }

    try {
        // Parallel requests to get prices for each region
        const promises = REGIONS.map(async (region) => {
            try {
                // Fetch details for specific region (cc = country code)
                const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${id}&cc=${region.code}&filters=price_overview`);
                const data = await res.json();

                if (data[id] && data[id].success && data[id].data.price_overview) {
                    const priceData = data[id].data.price_overview;
                    const final = priceData.final / 100; // Steam sends prices in cents
                    const currency = priceData.currency;

                    // Convert to USD
                    // Note: Steam API returns currency string (e.g., "EUR"), we map to our rates
                    const rate = EXCHANGE_RATES[currency] || 1;
                    const usdPrice = final * rate;

                    return {
                        ...region,
                        localPrice: final,
                        localCurrency: currency,
                        usdPrice: Number(usdPrice.toFixed(2)),
                        discount: priceData.discount_percent
                    };
                }
                return null;
            } catch (e) {
                return null;
            }
        });

        const results = (await Promise.all(promises)).filter(r => r !== null);

        // Sort by USD Price (Cheapest first)
        results.sort((a, b) => a!.usdPrice - b!.usdPrice);

        return NextResponse.json(results);

    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
    }
}
