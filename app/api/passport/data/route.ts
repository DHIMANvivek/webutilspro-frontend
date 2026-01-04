import { NextResponse } from 'next/server';

// We will use the JSON version from ilyankou/passport-index-dataset
// It's regularly updated and easier to parse than CSV
const DATA_URL = 'https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-matrix.csv';

// Interface for the processed data
interface VisaRequirement {
    destination: string;
    status: 'visa-free' | 'visa-on-arrival' | 'eta' | 'visa-required' | 'covid-ban';
    code: string; // ISO code of destination
}

let cachedData: any = null;
let lastFetch = 0;

const CODE_TO_NAME: Record<string, string> = {
    'US': 'United States',
    'USA': 'United States',
    'GB': 'United Kingdom',
    'UK': 'United Kingdom',
    'IN': 'India',
    'AE': 'United Arab Emirates',
    'AF': 'Afghanistan'
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const codeParam = searchParams.get('code'); // e.g., 'US', 'IN'

    try {
        // Cache for 24 hours
        if (!cachedData || Date.now() - lastFetch > 86400000) {
            console.log('Fetching fresh passport data...');
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error('Failed to fetch CSV data');
            const csvText = await response.text();
            cachedData = parseCSV(csvText);
            lastFetch = Date.now();
            console.log(`Parsed ${Object.keys(cachedData).length} passport datasets.`);
        }

        if (codeParam) {
            // Normalize: Try direct match, then uppercase, then Code mapping
            let targetName = codeParam;

            // 1. Try exact or uppercase match (if CSV has codes)
            if (cachedData[targetName]) {
                // found
            } else if (cachedData[targetName.toUpperCase()]) {
                targetName = targetName.toUpperCase();
            }
            // 2. Try mapping Code -> Name (e.g. US -> United States)
            else if (CODE_TO_NAME[targetName.toUpperCase()]) {
                targetName = CODE_TO_NAME[targetName.toUpperCase()];
            }
            // 3. Try to find case-insensitive match in keys
            else {
                const lowerTarget = targetName.toLowerCase();
                const match = Object.keys(cachedData).find(k => k.toLowerCase() === lowerTarget);
                if (match) targetName = match;
            }

            const requirements = cachedData[targetName];

            if (!requirements) {
                console.error(`Passport 404: '${codeParam}' (resolved to '${targetName}') not found in ${Object.keys(cachedData).slice(0, 5).join(', ')}...`);
                return NextResponse.json({ error: 'Invalid Passport Code', resolved: targetName }, { status: 404 });
            }
            return NextResponse.json(requirements);
        }

        // Return list of available passports for the dropdown
        const availablePassports = Object.keys(cachedData).sort();
        return NextResponse.json({ passports: availablePassports });

    } catch (e: any) {
        console.error('Passport Data Error:', e);
        return NextResponse.json({ error: 'Failed to fetch data', details: e.message }, { status: 500 });
    }
}

// Simple CSV Parser logic tailored for this specific dataset
// Matrix format: Passport (Rows) x Destination (Cols)
function parseCSV(csv: string) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim()); // Destination Codes are in headers

    // Structure: { "US": { "IN": "visa-required", "FR": "visa-free" ... } }
    const result: Record<string, Record<string, string>> = {};

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length < 2) continue;

        const passportOrigin = row[0].trim(); // First col is the Passport Country Code
        if (!passportOrigin) continue;

        result[passportOrigin] = {};

        // Iterate through columns (Destinations)
        for (let j = 1; j < row.length; j++) {
            const destCode = headers[j];
            const value = row[j]?.trim();

            // Map the dataset's codes to our clean statuses
            // Dataset codes:
            // 3 = Visa Free
            // 2 = Visa on Arrival
            // 1 = Visa Required
            // 0 = COVID Ban (mostly obsolete now but good to handle)
            // -1 = Unclear/Varied

            let status = 'visa-required'; // Default pessimistic
            if (value === '3') status = 'visa-free';
            else if (value === '2') status = 'visa-on-arrival';
            else if (value === '1') status = 'visa-required';
            else if (value === '0') status = 'ban';
            else if (value === 'et') status = 'eta'; // Some datasets denote ETA explicitly

            result[passportOrigin][destCode] = status;
        }
    }
    return result;
}
