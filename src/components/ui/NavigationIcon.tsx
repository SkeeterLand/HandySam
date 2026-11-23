'use client';

import React from 'react';

type NavIconName = 'home' | 'services' | 'projects' | 'about' | 'contact' | 'phone';

const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
} as const;

export function NavigationIcon({ type }: { type: NavIconName }) {
    switch (type) {
        case 'home':
            return (
                <svg {...commonProps}>
                    <path d="M3 10.5L12 3.5l9 7" />
                    <path d="M16.5 7V4.5h2v4" />
                    <path d="M5.5 9.5V19.5h13V9.5" />
                    <path d="M10 19.5v-5.5h4v5.5" />
                </svg>
            );
        case 'services':
            return (
                <svg {...commonProps}>
                    <path d="M8 4.5h8l3 3v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
                    <path d="M8 4.5v4h8v-4" />
                    <path d="M9 12h6" />
                    <path d="M9 16h6" />
                </svg>
            );
        case 'projects':
            return (
                <svg {...commonProps}>
                    <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
                    <path d="M7.5 5v14" />
                    <path d="M3.5 10.5h17" />
                    <path d="M3.5 14.5h17" />
                </svg>
            );
        case 'about':
            return (
                <svg {...commonProps}>
                    <rect x="3" y="4" width="18" height="16" rx="2.5" />
                    <circle cx="9" cy="10" r="2" />
                    <path d="M6 15.5c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5" />
                    <path d="M14.5 9.5h3.5" />
                    <path d="M14.5 13h3.5" />
                </svg>
            );
        case 'contact':
            return (
                <svg {...commonProps}>
                    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
                    <path d="m5.5 8 6.5 5 6.5-5" />
                </svg>
            );
        case 'phone':
            return (
                <svg {...commonProps}>
                    <path d="M6.5 4.5h2.2l1 4-1.5 1.5a12.7 12.7 0 0 0 7.3 7.3l1.5-1.5 4 1v2.2a2 2 0 0 1-2 2h-1.2C12.5 20.5 3.5 11.5 3.5 7.7V6.5a2 2 0 0 1 2-2Z" />
                </svg>
            );
        default:
            return null;
    }
}
