// Type definitions for Google Analytics and Google Tag Manager

interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
}

// Declare gtag as a global function
declare function gtag(...args: any[]): void;

// Declare dataLayer as a global variable
declare const dataLayer: any[];
