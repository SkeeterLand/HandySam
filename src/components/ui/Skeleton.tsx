'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

/**
 * Shimmering skeleton placeholder. Use in place of real content while
 * async data (from MongoDB) is still loading. Tailwind alone can't express
 * the animated gradient shimmer, so this uses a small CSS class from globals.css.
 */
export function Skeleton({ className }: SkeletonProps) {
    return <div className={cn('skeleton', className)} />;
}
