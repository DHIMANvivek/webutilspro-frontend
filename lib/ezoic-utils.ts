/**
 * Ezoic Utility Functions
 * 
 * Helper functions for Ezoic integration including email/phone hashing
 * and identity management.
 */

/**
 * Normalize and hash an email address using SHA-256
 * Follows Ezoic's email normalization requirements
 * 
 * @param email - Raw email address
 * @returns SHA-256 hash of normalized email
 */
export async function hashEmail(email: string): Promise<string> {
    // Normalize email
    const normalized = normalizeEmail(email);

    // Hash using SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

/**
 * Normalize email address according to Ezoic requirements
 * - Trim whitespace
 * - Convert to lowercase
 * - Handle Gmail special cases (remove dots and plus addressing)
 * 
 * @param email - Raw email address
 * @returns Normalized email address
 */
export function normalizeEmail(email: string): string {
    // Trim and lowercase
    let normalized = email.trim().toLowerCase();

    // Gmail-specific normalization
    if (normalized.endsWith('@gmail.com')) {
        const [username, domain] = normalized.split('@');

        // Remove dots from username
        let cleanUsername = username.replace(/\./g, '');

        // Remove plus addressing (everything after +)
        const plusIndex = cleanUsername.indexOf('+');
        if (plusIndex !== -1) {
            cleanUsername = cleanUsername.substring(0, plusIndex);
        }

        normalized = `${cleanUsername}@${domain}`;
    }

    return normalized;
}

/**
 * Format phone number to E.164 standard
 * E.164 format: +[country code][area code][local number]
 * 
 * @param phone - Raw phone number
 * @param countryCode - Country code (default: 1 for US)
 * @returns E.164 formatted phone number
 */
export function formatPhoneE164(phone: string, countryCode: string = '1'): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // If it already starts with country code, return with +
    if (digits.startsWith(countryCode)) {
        return `+${digits}`;
    }

    // Add country code
    return `+${countryCode}${digits}`;
}

/**
 * Hash phone number using SHA-256
 * Phone should be in E.164 format
 * 
 * @param phone - E.164 formatted phone number
 * @returns SHA-256 hash of phone number
 */
export async function hashPhone(phone: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(phone);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

/**
 * Validate email format
 * 
 * @param email - Email address to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Control Ezoic anchor ads
 * 
 * @param enabled - Whether to show anchor ads
 */
export function setEzoicAnchorAd(enabled: boolean) {
    if (typeof window !== 'undefined' && window.ezstandalone) {
        window.ezstandalone.cmd = window.ezstandalone.cmd || [];
        window.ezstandalone.cmd.push(function () {
            window.ezstandalone.setEzoicAnchorAd(enabled);
        });
    }
}

/**
 * Check if anchor ad has been closed by user
 * 
 * @returns True if anchor ad was closed
 */
export function hasAnchorAdBeenClosed(): boolean {
    if (typeof window !== 'undefined' && window.ezstandalone) {
        return window.ezstandalone.hasAnchorAdBeenClosed();
    }
    return false;
}
