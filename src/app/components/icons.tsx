import type { FC } from 'react';

type IconProps = { className?: string };

export const HammerIcon: FC<IconProps> = ({ className }) => (
    <svg
        className={className}
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Handle */}
        <path d="M11.5 12.5L4.2 19.8a2.1 2.1 0 0 0 3 3l7.3-7.3" />

        {/* Unified Hammer Head: Claw, Eye, Pinched Neck & Striking Face */}
        <path d="M14.5 11L10.5 7C9.8 5.2 8.2 4 6.2 3.5C8.5 2 11.8 2.2 14 4.4L17 7.4L18.2 6.2L21.5 9.5L18.5 12.5L17.3 11.3L16 12.6L14.5 11Z" />
    </svg>
);

export const ElectricalIcon: FC<IconProps> = ({ className }) => (
    <svg
        className={className}
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

export const GeneralRepairsIcon: FC<IconProps> = ({ className }) => (
    <svg
        className={className}
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Screwdriver (top-left to bottom-right) */}
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
        <path d="M13 19l6-6" />
        <path d="M16 16l4 4" />
        <path d="M19 21l2-2" />

        {/* Wrench (bottom-left to top-right) */}
        <path d="M14.5 6.5a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a5 5 0 0 1-6.6 6.6l-6.9 6.9a2.12 2.12 0 0 1-3-3l6.9-6.9a5 5 0 0 1 6.6-6.6l-3.1 3.1z" />
    </svg>
);

export const PlumbingIcon: FC<IconProps> = ({ className }) => (
    <svg
        className={className}
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Wall Flange & Pipe Elbow */}
        <path d="M3 4v8" />
        <path d="M3 6h9a4 4 0 0 1 4 4v2" />
        <path d="M3 10h9v2" />
        {/* Pipe Collar */}
        <path d="M13 12h6" />
        {/* Water Droplet */}
        <path d="M16 15.5c0 0-2.5 2.7-2.5 4.2a2.5 2.5 0 0 0 5 0c0-1.5-2.5-4.2-2.5-4.2z" />
    </svg>
);

export const PaintRollerIcon: FC<IconProps> = ({ className }) => (
    <svg
        className={className}
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Roller Cylinder */}
        <rect x="3" y="3" width="14" height="5" rx="1.5" />
        {/* Wire Frame */}
        <path d="M17 5.5h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-7a2 2 0 0 0-2 2V15" />
        {/* Grip Handle */}
        <rect x="8.5" y="15" width="3" height="6" rx="1.5" />
    </svg>
);

export const HaulingIcon: FC<IconProps> = ({ className }) => (
    <svg
        className={className}
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Cargo Boxes in Bed */}
        <path d="M4 11V7h5v4" />
        <path d="M9 11V8h3v3" />
        {/* Truck Body & Cab */}
        <path d="M2 11h13V6h3.5L22 10.5V16h-2" />
        <path d="M2 11v5h2" />
        <path d="M9 16h6" />
        {/* Wheels */}
        <circle cx="6.5" cy="16.5" r="2.5" />
        <circle cx="17.5" cy="16.5" r="2.5" />
    </svg>
);

export const ChevronLeft: FC<IconProps> = ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

export const ChevronRight: FC<IconProps> = ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

export const CheckIcon: FC<IconProps> = ({ className }) => (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
    </svg>
);
