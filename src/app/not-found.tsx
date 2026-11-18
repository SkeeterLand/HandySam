'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <section className="py-100 text-center">
            <h1 className="text-[40px] font-black tracking-[-1px] mb-[16px] text-fg">
                Page not found
            </h1>
            <p className="text-muted mb-[24px] text-[17px]">
                Sorry, we couldn’t find the page you’re looking for.
            </p>
            <Button asChild variant="accent" size="md">
                <a href="/">Back to home</a>
            </Button>
        </section>
    );
}
