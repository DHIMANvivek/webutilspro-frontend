import { NextResponse } from 'next/server';

// Travel Buddy API Configuration (RapidAPI)
const API_HOST = 'travel-buddy-ai-visa-requirements-api.p.rapidapi.com';
const API_BASE = 'https://travel-buddy-ai-visa-requirements-api.p.rapidapi.com';

// Fallback: Official Pattern Data (JSON version preferred if available, but staying with CSV as we have the URL)
// We use the ilyankou/passport-index-dataset which is open source and updated.
const CSV_DATA_URL = 'https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-matrix.csv';

let cachedData: any = null;
let lastFetch = 0;

// ISO 3166-1 alpha-2 Code Mapping (Partial for top countries, extended as needed)
const CODE_TO_NAME: Record<string, string> = {
    'AF': 'Afghanistan', 'AL': 'Albania', 'DZ': 'Algeria', 'AD': 'Andorra', 'AO': 'Angola',
    'AG': 'Antigua and Barbuda', 'AR': 'Argentina', 'AM': 'Armenia', 'AU': 'Australia', 'AT': 'Austria',
    'AZ': 'Azerbaijan', 'BS': 'Bahamas', 'BH': 'Bahrain', 'BD': 'Bangladesh', 'BB': 'Barbados',
    'BY': 'Belarus', 'BE': 'Belgium', 'BZ': 'Belize', 'BJ': 'Benin', 'BT': 'Bhutan',
    'BO': 'Bolivia', 'BA': 'Bosnia and Herzegovina', 'BW': 'Botswana', 'BR': 'Brazil', 'BN': 'Brunei',
    'BG': 'Bulgaria', 'BF': 'Burkina Faso', 'BI': 'Burundi', 'KH': 'Cambodia', 'CM': 'Cameroon',
    'CA': 'Canada', 'CV': 'Cape Verde', 'CF': 'Central African Republic', 'TD': 'Chad', 'CL': 'Chile',
    'CN': 'China', 'CO': 'Colombia', 'KM': 'Comoros', 'CG': 'Congo', 'CD': 'DR Congo',
    'CR': 'Costa Rica', 'CI': 'Ivory Coast', 'HR': 'Croatia', 'CU': 'Cuba', 'CY': 'Cyprus',
    'CZ': 'Czech Republic', 'DK': 'Denmark', 'DJ': 'Djibouti', 'DM': 'Dominica', 'DO': 'Dominican Republic',
    'EC': 'Ecuador', 'EG': 'Egypt', 'SV': 'El Salvador', 'GQ': 'Equatorial Guinea', 'ER': 'Eritrea',
    'EE': 'Estonia', 'SZ': 'Eswatini', 'ET': 'Ethiopia', 'FJ': 'Fiji', 'FI': 'Finland',
    'FR': 'France', 'GA': 'Gabon', 'GM': 'Gambia', 'GE': 'Georgia', 'DE': 'Germany',
    'GH': 'Ghana', 'GR': 'Greece', 'GD': 'Grenada', 'GT': 'Guatemala', 'GN': 'Guinea',
    'GW': 'Guinea-Bissau', 'GY': 'Guyana', 'HT': 'Haiti', 'HN': 'Honduras', 'HK': 'Hong Kong',
    'HU': 'Hungary', 'IS': 'Iceland', 'IN': 'India', 'ID': 'Indonesia', 'IR': 'Iran',
    'IQ': 'Iraq', 'IE': 'Ireland', 'IL': 'Israel', 'IT': 'Italy', 'JM': 'Jamaica',
    'JP': 'Japan', 'JO': 'Jordan', 'KZ': 'Kazakhstan', 'KE': 'Kenya', 'KI': 'Kiribati',
    'XK': 'Kosovo', 'KW': 'Kuwait', 'KG': 'Kyrgyzstan', 'LA': 'Laos', 'LV': 'Latvia',
    'LB': 'Lebanon', 'LS': 'Lesotho', 'LR': 'Liberia', 'LY': 'Libya', 'LI': 'Liechtenstein',
    'LT': 'Lithuania', 'LU': 'Luxembourg', 'MO': 'Macao', 'MG': 'Madagascar', 'MW': 'Malawi',
    'MY': 'Malaysia', 'MV': 'Maldives', 'ML': 'Mali', 'MT': 'Malta', 'MH': 'Marshall Islands',
    'MR': 'Mauritania', 'MU': 'Mauritius', 'MX': 'Mexico', 'FM': 'Micronesia', 'MD': 'Moldova',
    'MC': 'Monaco', 'MN': 'Mongolia', 'ME': 'Montenegro', 'MA': 'Morocco', 'MZ': 'Mozambique',
    'MM': 'Myanmar', 'NA': 'Namibia', 'NR': 'Nauru', 'NP': 'Nepal', 'NL': 'Netherlands',
    'NZ': 'New Zealand', 'NI': 'Nicaragua', 'NE': 'Niger', 'NG': 'Nigeria', 'KP': 'North Korea',
    'MK': 'North Macedonia', 'NO': 'Norway', 'OM': 'Oman', 'PK': 'Pakistan', 'PW': 'Palau',
    'PS': 'Palestine', 'PA': 'Panama', 'PG': 'Papua New Guinea', 'PY': 'Paraguay', 'PE': 'Peru',
    'PH': 'Philippines', 'PL': 'Poland', 'PT': 'Portugal', 'QA': 'Qatar', 'RO': 'Romania',
    'RU': 'Russia', 'RW': 'Rwanda', 'KN': 'Saint Kitts and Nevis', 'LC': 'Saint Lucia', 'WS': 'Samoa',
    'SM': 'San Marino', 'ST': 'Sao Tome and Principe', 'SA': 'Saudi Arabia', 'SN': 'Senegal', 'RS': 'Serbia',
    'SC': 'Seychelles', 'SL': 'Sierra Leone', 'SG': 'Singapore', 'SK': 'Slovakia', 'SI': 'Slovenia',
    'SB': 'Solomon Islands', 'SO': 'Somalia', 'ZA': 'South Africa', 'KR': 'South Korea', 'SS': 'South Sudan',
    'ES': 'Spain', 'LK': 'Sri Lanka', 'VC': 'Saint Vincent', 'SD': 'Sudan', 'SR': 'Suriname',
    'SE': 'Sweden', 'CH': 'Switzerland', 'SY': 'Syria', 'TW': 'Taiwan', 'TJ': 'Tajikistan',
    'TZ': 'Tanzania', 'TH': 'Thailand', 'TL': 'Timor-Leste', 'TG': 'Togo', 'TO': 'Tonga',
    'TT': 'Trinidad and Tobago', 'TN': 'Tunisia', 'TM': 'Turkmenistan', 'TV': 'Tuvalu', 'TR': 'Turkey',
    'UG': 'Uganda', 'UA': 'Ukraine', 'AE': 'United Arab Emirates', 'GB': 'United Kingdom', 'US': 'United States',
    'UY': 'Uruguay', 'UZ': 'Uzbekistan', 'VU': 'Vanuatu', 'VA': 'Vatican City', 'VE': 'Venezuela',
    'VN': 'Vietnam', 'YE': 'Yemen', 'ZM': 'Zambia', 'ZW': 'Zimbabwe'
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const codeParam = searchParams.get('code'); // e.g., 'US', 'IN'

    // 1. Fetch & Cache CSV Data (If needed for lists or fallback)
    if (!cachedData || Date.now() - lastFetch > 86400000) {
        try {
            console.log('Fetching global passport data...');
            const response = await fetch(CSV_DATA_URL);
            if (response.ok) {
                const text = await response.text();
                cachedData = parseCSV(text);
                lastFetch = Date.now();
                console.log(`Updated cache: ${Object.keys(cachedData).length} countries.`);
            }
        } catch (e) {
            console.error('Failed to update cache:', e);
        }
    }

    // 2. Return List of Available Passports
    if (!codeParam) {
        if (cachedData) {
            // The CSV data uses full country names as keys for origin passports
            const passports = Object.keys(cachedData).sort();
            return NextResponse.json({ passports });
        }
        // Fallback static list (just in case cache fails completely)
        const commonPassports = ['United States', 'India', 'United Kingdom', 'China', 'Japan', 'Germany'].sort();
        return NextResponse.json({ passports: commonPassports });
    }

    const apiKey = process.env.TRAVEL_BUDDY_API_KEY;
    let requirements: Record<string, string> = {};

    try {
        // 3. Try Travel Buddy API (Premium/Live Path)
        if (apiKey) {
            console.log(`Fetching live visa data for ${codeParam} from Travel Buddy...`);
            const response = await fetch(`${API_BASE}/v2/visa/map?passport=${codeParam}`, {
                headers: { 'x-rapidapi-host': API_HOST, 'x-rapidapi-key': apiKey }
            });
            if (response.ok) {
                const mapData = await response.json();
                if (mapData.green) mapData.green.forEach((c: string) => requirements[c] = 'visa-free');
                if (mapData.yellow) mapData.yellow.forEach((c: string) => requirements[c] = 'visa-on-arrival');
                if (mapData.red) mapData.red.forEach((c: string) => requirements[c] = 'visa-required');
                if (mapData.blue) mapData.blue.forEach((c: string) => requirements[c] = 'eta');

                // Enrich with Names
                const enriched: Record<string, { status: string, name: string }> = {};
                Object.entries(requirements).forEach(([code, status]) => {
                    enriched[code] = { status, name: CODE_TO_NAME[code] || code };
                });
                return NextResponse.json(enriched);
            } else {
                console.warn('Travel Buddy API Fetch Failed:', response.status, response.statusText);
                // Fallthrough to CSV fallback
            }
        }

        // 4. Fallback to Full CSV Data (Robust & Free)
        console.log(`Using fallback/CSV data for ${codeParam}`);

        // Normalize Code: Map 'US' -> 'United States', etc. for CSV lookup
        let targetName = codeParam;

        // Try finding direct name or mapped code
        let datasetName = Object.keys(cachedData || {}).find(k => k.toLowerCase() === targetName.toLowerCase());

        // If not found, try Mapping Code -> Name -> Name in Dataset (CSV usually uses full names like "United States")
        if (!datasetName) {
            // e.g. input "US" -> need "United States"
            const mappedName = CODE_TO_NAME[targetName.toUpperCase()];
            if (mappedName && cachedData[mappedName]) {
                datasetName = mappedName;
            }
        }

        if (datasetName && cachedData[datasetName]) {
            console.log(`Serving full cached data for: ${datasetName}`);
            const rawReqs = cachedData[datasetName];

            // Enrich with Names for Frontend
            const enriched: Record<string, { status: string, name: string }> = {};
            Object.entries(rawReqs).forEach(([destCode, status]) => {
                enriched[destCode] = {
                    status: status as string,
                    name: CODE_TO_NAME[destCode] || destCode
                };
            });
            return NextResponse.json(enriched);
        }

        return NextResponse.json({ error: 'Passport not found in database.' }, { status: 404 });

    } catch (e: any) {
        console.error('Passport Data Error:', e);
        return NextResponse.json({ error: 'Failed to fetch data', details: e.message }, { status: 500 });
    }
}

// --------------------------------------------------------------------------------
// Fixed CSV Parser (Handles "14", "90" as Visa Free)
// --------------------------------------------------------------------------------
function parseCSV(csv: string) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim()); // Headers are ISO 2 codes (e.g. AF, AL...)

    const result: Record<string, Record<string, string>> = {};

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length < 2) continue;

        const passportOriginCode = row[0].trim(); // Row Code (e.g. "AF", "AL")
        if (!passportOriginCode) continue;

        // Map the origin code to its full name for the primary key in `result`
        const passportOriginName = CODE_TO_NAME[passportOriginCode] || passportOriginCode;
        result[passportOriginName] = {};

        for (let j = 1; j < row.length; j++) {
            const destCode = headers[j]; // Destination Code (e.g. "IN", "BT")

            const value = row[j]?.trim();
            if (!value) continue;

            const valLower = value.toLowerCase();
            let status = 'visa-required';

            // --- FIXED LOGIC ---
            // 1. Numeric check: If specific days are given (e.g. "14", "90", "180", "360"), it is VISA FREE/PERMIT.
            //    We check if it parses to a number > 3 (codes 0,1,2,3 are status codes in the dataset).
            const numericVal = parseInt(value, 10);

            if (!isNaN(numericVal) && numericVal > 3) {
                status = `visa-free-${numericVal}`; // e.g. "visa-free-14"
            }
            // 2. Standard Status Codes form Dataset
            else if (valLower === '3' || valLower === 'visa free' || valLower.includes('visa-free')) {
                status = 'visa-free';
            } else if (valLower === '2' || valLower.includes('arrival')) {
                status = 'visa-on-arrival';
            } else if (valLower === 'eta' || valLower === 'e-visa') {
                status = 'eta';
            } else if (valLower === '0' || valLower === 'ban' || valLower === 'covid ban') {
                status = 'ban';
            }
            // 3. Fallback: Everything else (1, -1, 'visa required') is required
            // The default `status = 'visa-required'` handles this.

            result[passportOriginName][destCode] = status;
        }
    }
    return result;
}
