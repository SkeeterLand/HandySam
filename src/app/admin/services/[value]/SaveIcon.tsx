'use client';

import { Button } from '@/components/ui/Button';

interface SaveIconProps {
    disabled: boolean;
}

export function SaveIcon({ disabled }: SaveIconProps) {
    return (
        <Button
            type="submit"
            disabled={disabled}
            variant="accent"
            className="h-[26px] w-[26px] p-0 rounded-[6px] flex items-center justify-center gap-0"
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
            </svg>
        </Button>
    );
}
