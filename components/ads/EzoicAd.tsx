'use client';

import { useEffect } from 'react';

interface EzoicAdProps {
    placementId: number;
    className?: string;
}

/**
 * Ezoic Ad Component
 * 
 * Displays an Ezoic ad placement on the page.
 * 
 * @param placementId - The Ezoic placement ID from your dashboard
 * @param className - Optional CSS classes for the container
 * 
 * @example
 * <EzoicAd placementId={101} className="my-4" />
 */
export default function EzoicAd({ placementId, className = '' }: EzoicAdProps) {
    useEffect(() => {
        // Ensure Ezoic is loaded
        if (typeof window !== 'undefined' && window.ezstandalone) {
            window.ezstandalone.cmd = window.ezstandalone.cmd || [];
            window.ezstandalone.cmd.push(function () {
                window.ezstandalone.showAds(placementId);
            });
        }
    }, [placementId]);

    return (
        <div className={`ezoic-ad-container ${className}`}>
            <div id={`ezoic-pub-ad-placeholder-${placementId}`}></div>
        </div>
    );
}

// TypeScript declaration for Ezoic global
declare global {
    interface Window {
        ezstandalone: {
            cmd: Array<() => void>;
            showAds: (...placementIds: number[]) => void;
            setEzoicAnchorAd: (enabled: boolean) => void;
            hasAnchorAdBeenClosed: () => boolean;
        };
    }
}
