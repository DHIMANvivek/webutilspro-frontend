'use client';

import { useState } from 'react';
import ProductTour from './ProductTour';
import HelpButton from './HelpButton';

export default function TourManager() {
    const [isTourOpen, setIsTourOpen] = useState(false);

    return (
        <>
            <ProductTour
                isOpen={isTourOpen}
                onClose={() => setIsTourOpen(false)}
            />
            <HelpButton
                onClick={() => setIsTourOpen(true)}
            />
        </>
    );
}
