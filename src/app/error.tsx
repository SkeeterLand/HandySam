'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <section className="py-100 text-center">
            <h1 className="text-[40px] font-black tracking-[-1px] mb-[16px] text-fg">
                Something went wrong
            </h1>
            <p className="text-muted mb-[24px] text-[17px]">
                We encountered an unexpected error. Please try refreshing the page.
            </p>
            <Button variant="accent" size="md" onClick={() => reset()}>
                Try again
            </Button>
        </section>
    );
}
