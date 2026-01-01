// Simple in-memory rate limiter
// For production, use Redis or a database

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}
// ok
const store: RateLimitStore = {};

// Clean up old entries every hour
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    });
}, 60 * 60 * 1000);

export interface RateLimitConfig {
    limit: number; // Number of requests allowed
    window: number; // Time window in milliseconds
}

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { limit: 10, window: 24 * 60 * 60 * 1000 } // 10 per day default
): { success: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;

    // Initialize or get existing entry
    if (!store[key] || store[key].resetTime < now) {
        store[key] = {
            count: 0,
            resetTime: now + config.window,
        };
    }

    const entry = store[key];

    // Check if limit exceeded
    if (entry.count >= config.limit) {
        return {
            success: false,
            remaining: 0,
            resetTime: entry.resetTime,
        };
    }

    // Increment counter
    entry.count++;

    return {
        success: true,
        remaining: config.limit - entry.count,
        resetTime: entry.resetTime,
    };
}

export function getRateLimitInfo(identifier: string, config: RateLimitConfig) {
    const now = Date.now();
    const key = identifier;

    if (!store[key] || store[key].resetTime < now) {
        return {
            remaining: config.limit,
            resetTime: now + config.window,
        };
    }

    return {
        remaining: config.limit - store[key].count,
        resetTime: store[key].resetTime,
    };
}
