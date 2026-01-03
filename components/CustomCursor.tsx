'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const [isClicking, setIsClicking] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Only disable cursor on actual mobile/tablet devices, not laptops with trackpads
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
        const isTouchDevice = isMobileDevice || hasCoarsePointer;

        setIsTouch(isTouchDevice);

        if (isTouchDevice) return; // Don't set up cursor on touch devices

        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over push notification widget
            const target = e.target as HTMLElement;
            const isOverWidget = target.closest('#push-notification-prompt');

            if (isOverWidget) {
                setIsHidden(true);
                return;
            }

            setIsHidden(false);

            // Check if element under cursor is clickable
            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.onclick ||
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.closest('a') ||
                target.closest('button');

            setIsPointer(!!isClickable);
        };

        const onMouseDown = () => setIsClicking(true);
        const onMouseUp = () => setIsClicking(false);
        const onMouseLeave = () => setIsHidden(true);
        const onMouseEnter = () => setIsHidden(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
        };
    }, []);

    if (!isMounted || isTouch) return null;

    return (
        <div style={{ '--cursor-x': `${position.x}px`, '--cursor-y': `${position.y}px` } as React.CSSProperties}>
            {/* The Outer Ring */}
            <div
                className={`custom-cursor-ring ${isPointer ? 'pointer' : ''} ${isClicking ? 'clicking' : ''} ${isHidden ? 'hidden' : ''}`}
            />
            {/* The Inner Dot */}
            <div
                className={`custom-cursor-dot ${isPointer ? 'pointer' : ''} ${isHidden ? 'hidden' : ''}`}
            />
        </div>
    );
}
