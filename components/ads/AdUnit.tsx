'use client';

import { useEffect, useRef } from 'react';

interface AdUnitProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
    responsive?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

export default function AdUnit({
    slot,
    format = 'auto',
    responsive = true,
    style,
    className = ""
}: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);
    const initialized = useRef(false);

    useEffect(() => {
        // Only run on client and if not already initialized
        if (typeof window !== 'undefined' && !initialized.current) {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                initialized.current = true;
            } catch (err) {
                console.error('AdSense error:', err);
            }
        }
    }, [slot]);

    // Constant publisher ID from config
    const publisherId = "ca-pub-5500315527317299";

    return (
        <div className={`ad-container my-8 flex justify-center overflow-hidden ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={style || { display: 'block', textAlign: 'center' }}
                data-ad-client={publisherId}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
}
