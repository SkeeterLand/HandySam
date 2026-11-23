'use client';

import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Fallback UI shown while the homepage Server Component fetches data from
 * MongoDB. Mirrors the real page structure (Banner → Services → Gallery →
 * About → Contact) so the skeleton looks like the page taking shape rather
 * than a generic block of boxes.
 */
export default function Loading() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            {/* ── Banner / hero skeleton ──────────────────────────────── */}
            <section className="py-[100px] bg-[linear-gradient(180deg,rgba(10,10,15,0.98),rgba(18,18,26,0.97))]">
                <div className="max-w-[760px] mx-auto px-[24px] text-center">
                    <Skeleton className="h-[24px] w-[160px] mb-[14px] mx-auto" />
                    <Skeleton className="h-[44px] w-full mb-[28px]" />
                    <Skeleton className="h-[20px] w-[60%] mx-auto mb-[18px]" />
                    <div className="flex gap-[12px] justify-center flex-wrap mb-[18px]">
                        <Skeleton className="h-[40px] w-[180px]" />
                        <Skeleton className="h-[40px] w-[180px]" />
                    </div>
                    <Skeleton className="h-[16px] w-[40%] mx-auto" />
                </div>
            </section>

            {/* ── Sticky nav skeleton ─────────────────────────────────── */}
            <nav className="sticky top-0 z-50 h-[5.4rem] bg-[#0a0a0f] border-b border-white/8">
                <div className="max-w-[1100px] mx-auto px-[24px] flex items-center justify-between h-full">
                    <Skeleton className="h-[10px] w-[200px] rounded-full" />
                    <div className="flex gap-[12px]">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-[32px] w-[120px] rounded-full" />
                        ))}
                    </div>
                    <Skeleton className="h-[24px] w-[140px] rounded-full" />
                </div>
            </nav>

            {/* ── Services skeleton ───────────────────────────────────── */}
            <section id="services" className="py-[100px] bg-fg/5">
                <div className="max-w-[1100px] mx-auto px-[24px]">
                    <div className="text-left mb-[40px]">
                        <Skeleton className="h-[44px] w-[120px] mb-[20px]" />
                        <Skeleton className="h-[20px] w-full mb-[12px]" />
                        <button className="mt-[12px] h-[32px] w-[200px] text-accent rounded-none" disabled aria-hidden />
                        <div className="mt-[16px] h-[120px] w-full opacity-30">
                            <Skeleton className="h-full w-full" />
                        </div>
                    </div>

                    <div className="relative mt-[16px]">
                        <div
                            className="flex overflow-x-auto py-[8px] gap-[24px]"
                            style={{ animation: 'none' }}
                        >
                            {[0, 1, 2, 3].map((i) => (
                                <Skeleton
                                    key={i}
                                    className="snap-start shrink-0 min-w-[260px] h-[260px] rounded-[16px] border"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-[24px] flex gap-[10px]">
                        <Skeleton className="h-[40px] w-[200px]" />
                        <Skeleton className="h-[40px] w-[200px]" />
                    </div>
                </div>
            </section>

            {/* ── Gallery skeleton ────────────────────────────────────── */}
            <section id="projects" className="py-[100px]_0 bg-fg/5">
                <div className="max-w-[1100px] mx-auto px-[24px]">
                    <div className="text-left mb-[56px]">
                        <Skeleton className="h-[44px] w-[100px] mb-[20px]" />
                        <Skeleton className="h-[20px] w-[70%] mb-[40px]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-[420px] w-full rounded-[16px] border" />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── About skeleton ──────────────────────────────────────── */}
            <section className="py-[100px] bg-fg/5">
                <div className="max-w-[1100px] mx-auto px-[24px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px]">
                        <div>
                            <Skeleton className="h-[44px] w-[200px] mb-[24px]" />
                            <Skeleton className="h-[20px] w-full mb-[16px]" />
                            <Skeleton className="h-[18px] w-[60%] mb-[16px]" />
                            <Skeleton className="h-[18px] w-[40%]" />
                        </div>
                        <div>
                            <Skeleton className="h-[400px] w-full rounded-[20px] border" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Contact skeleton ────────────────────────────────────── */}
            <section id="contact" className="py-[100px]_0 bg-fg/5">
                <div className="max-w-[1100px] mx-auto px-[24px]">
                    <div className="text-left mb-[50px]">
                        <Skeleton className="h-[44px] w-[320px] mb-[24px]" />
                        <Skeleton className="h-[20px] w-full mb-[24px]" />
                    </div>
                    <form className="flex flex-col gap-[20px] max-w-[1050px]" aria-hidden>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
                            <Skeleton className="h-[48px] w-full rounded-[8px] border" />
                            <Skeleton className="h-[48px] w-full rounded-[8px] border" />
                            <Skeleton className="h-[48px] w-full rounded-[8px] border" />
                        </div>
                        <div className="flex gap-[20px]">
                            <Skeleton className="h-[48px] w-[340px] rounded-[8px] border" />
                            <div className="flex-1">
                                <Skeleton className="h-[48px] w-full rounded-[8px] border" />
                            </div>
                        </div>
                        <Skeleton className="h-[120px] w-full rounded-[8px] border mb-[8px]" />
                        <Skeleton className="h-[40px] w-[160px] self-start rounded-[8px] border" />
                    </form>
                </div>
            </section>
        </main>
    );
}
