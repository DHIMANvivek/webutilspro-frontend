'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowDown, Zap } from 'lucide-react';

export default function FloatingJumpButton() {
    const [hasJumped, setHasJumped] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const pathname = usePathname();
    const isJumpingRef = useRef(false);

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            const isHomepage = pathname === '/';
            const scrollPos = window.scrollY;
            const isNearTop = scrollPos < 100;

            // Once user scrolls significantly, reset the jumping flag
            if (scrollPos > 150) {
                isJumpingRef.current = false;
            }

            // Reset jump state when scrolled back to top, 
            // but NOT if we just started a jump scroll
            if (isNearTop && !isJumpingRef.current) {
                setHasJumped(false);
            }

            // On tool pages, hide if scrolled down. On homepage, always stay.
            if (!isHomepage) {
                setIsVisible(isNearTop);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    if (!isMounted) return null;

    const isToolPage = pathname?.startsWith('/tools/');
    const isHomepage = pathname === '/';

    if (!isToolPage && !isHomepage) return null;

    const scrollToTarget = () => {
        const targetId = isHomepage ? 'tools' : 'tool-functional-area';
        const element = document.getElementById(targetId);

        isJumpingRef.current = true;
        setHasJumped(true);

        if (element) {
            const offset = 20; // Land deeper into the tool area
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Extract tool name from path for dynamic label
    const toolName = isToolPage
        ? pathname.split('/')[2]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : 'Tools';

    const shouldShow = isVisible && !hasJumped;

    return (
        <div
            className={`fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-700 ${shouldShow ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
                }`}
        >
            <button
                onClick={scrollToTarget}
                className="group relative flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 bg-slate-900/90 hover:bg-blue-600 border border-white/10 hover:border-blue-400 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:scale-110 active:scale-95"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex items-center gap-2 md:gap-3">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 group-hover:text-white transition-colors whitespace-nowrap">
                        {isHomepage ? 'Explore All Tools' : `Use ${toolName}`}
                    </span>
                    <div className="p-1 bg-white/5 group-hover:bg-white/20 rounded-full transition-colors animate-bounce">
                        <ArrowDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                </div>

                {/* Zap Icon for premium feel */}
                <Zap className="absolute -top-2 -right-2 w-5 h-5 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500" />
            </button>
        </div>
    );
}
