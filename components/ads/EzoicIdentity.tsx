'use client';

import { useEffect } from 'react';

/**
 * Ezoic Identity Component
 * 
 * Initializes the Ezoic Identity system for improved ad targeting.
 * This component should be placed once in your app layout.
 * 
 * Revenue Boost: Sharing hashed user emails can increase ad revenue
 * by allowing advertisers to better target their audiences.
 */
export default function EzoicIdentity() {
    useEffect(() => {
        // Initialize Ezoic Identity
        if (typeof window !== 'undefined') {
            window.ezoicIdentity = window.ezoicIdentity || {};
            window.ezoicIdentity.queue = window.ezoicIdentity.queue || [];
        }
    }, []);

    return null; // This component doesn't render anything
}

/**
 * Set user identity with email
 * Call this when a user provides their email (e.g., newsletter signup)
 * 
 * @param email - User's email address (will be hashed automatically)
 */
export function setEzoicIdentity(email: string) {
    if (typeof window !== 'undefined' && window.ezoicIdentity) {
        window.ezoicIdentity.queue = window.ezoicIdentity.queue || [];
        window.ezoicIdentity.queue.push(function () {
            window.ezoicIdentity.setIdentity({ email });
        });
    }
}

/**
 * Set user identity with pre-hashed email
 * 
 * @param hashedEmail - Object containing hashed email values
 */
export function setEzoicIdentityHashed(hashedEmail: {
    md5?: string;
    sha256?: string;
    sha1?: string;
}) {
    if (typeof window !== 'undefined' && window.ezoicIdentity) {
        window.ezoicIdentity.queue = window.ezoicIdentity.queue || [];
        window.ezoicIdentity.queue.push(function () {
            window.ezoicIdentity.setIdentity(hashedEmail);
        });
    }
}

/**
 * Delete user identity
 * Call this when a user logs out or requests data deletion
 */
export function deleteEzoicIdentity() {
    if (typeof window !== 'undefined' && window.ezoicIdentity) {
        window.ezoicIdentity.queue = window.ezoicIdentity.queue || [];
        window.ezoicIdentity.queue.push(function () {
            window.ezoicIdentity.deleteIdentity();
        });
    }
}

// TypeScript declarations
declare global {
    interface Window {
        ezoicIdentity: {
            queue: Array<() => void>;
            setIdentity: (identity: { email?: string; md5?: string; sha256?: string; sha1?: string; userid?: string }) => void;
            setPhoneNumber: (phone: { phone?: string; sha256?: string; userid?: string }) => void;
            deleteIdentity: () => void;
        };
    }
}
