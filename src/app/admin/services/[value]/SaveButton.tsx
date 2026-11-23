'use client';

import { Button } from '@/components/ui/Button';

interface SaveButtonProps {
    isPending: boolean;
    label?: string;
}

export function SaveButton({ isPending, label = 'Save' }: SaveButtonProps) {
    return (
        <div className="flex gap-[12px] pt-[16px]">
            <Button
                type="submit"
                disabled={isPending}
                variant="accent"
            >
                {isPending ? 'Saving...' : label}
            </Button>
        </div>
    );
}
