'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import type { HomepageProject } from '@/lib/mongodb';
import { Button } from '@/components/ui/Button';

interface GalleryProps {
    projects: HomepageProject[];
}

export default function Gallery({ projects }: GalleryProps) {
    const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
    const [headerVisible, setHeaderVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setHeaderVisible(true), 100);
        return () => clearTimeout(t);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleIds((prev) => {
                            const next = new Set(prev);
                            next.add(entry.target.id);
                            return next;
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0% 0% -8% 0%' }
        );

        document.querySelectorAll('[data-proj]').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section id="projects" className="scroll-m-[100px] py-[100px]_0 relative overflow-hidden bg-fg/5">
            <div className="relative z-10 max-w-[1100px] mx-auto px-[24px]">
                <div className="text-left mb-[56px]">
                    <h2
                        className={cn(
                            'text-[44px] font-black tracking-[-1px] mb-[20px] text-fg',
                            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[14px]',
                            'transition-all duration-600 ease-out'
                        )}
                    >
                        Gallery
                    </h2>
                    <p
                        className={cn(
                            'text-muted leading-1.75 m-0 opacity-90 text-[17px] max-w-[1000px]',
                            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]',
                            'transition-all duration-700 ease-out'
                        )}
                    >
                        Recent Handy Sam work around the Franklin area — done right the first time. As a fellow Meade of Avalon resident, I love helping neighbors tackle everything from quick repairs to weekend to-do lists. Take a look at some recent local projects below, and feel free to reach out anytime you need an extra set of hands around the house.

                    </p>
                </div>

                <div
                    className={cn(
                        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mb-[64px]',
                        headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[18px]',
                        'transition-all duration-700 ease-out'
                    )}
                >
                    {projects.map((item) => {
                        const id = `proj-${item.slug}`;
                        const isVisible = visibleIds.has(id);

                        return (
                            <Link
                                key={item.slug}
                                href={`/projects/${item.slug}`}
                                className={cn(
                                    'flex flex-col no-underline text-inherit transition-transform duration-350 block'
                                )}
                                aria-label={`${item.subject} — ${item.description}`}
                            >
                                <div
                                    id={id}
                                    data-proj
                                    className={cn(
                                        'bg-card border border-border rounded-[16px] relative overflow-hidden group',
                                        'transition-[transform,box-shadow,border-color] duration-350 ease-out',
                                        'hover:-translate-y-[4px] hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)] hover:border-accent/40',
                                        !isVisible
                                            ? 'opacity-0 translate-y-[16px] animate-[fadeUp_0.6s_ease-out_forwards]'
                                            : 'opacity-100 translate-y-0'
                                    )}
                                    style={{
                                        animationDelay: `${projects.indexOf(item) * 0.1}s`,
                                    }}
                                >
                                    <div className="aspect-[4/3] overflow-hidden bg-bg-secondary">
                                        <Image
                                            src={item.src}
                                            alt={item.alt}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="transition-transform duration-350 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="absolute inset-0 flex flex-col justify-end p-[20px] text-white bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.45)_50%,rgba(0,0,0,0.05)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-350 z-2">
                                        <h3 className="text-[20px] font-bold mb-[6px]">{item.subject}</h3>
                                        <p
                                            className="text-[13px] leading-1.4 mb-[10px] opacity-90"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical', 
                                                overflow: 'hidden',
                                                minHeight: '50px',
                                                maxHeight: '50px',
                                            }}
                                        >
                                            {item.subDescription}
                                        </p>
                                        <span className="text-[12px] font-bold tracking-[0.5px] uppercase text-accent">
                                            View project &rarr;
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-[14px] flex flex-col gap-[8px]">
                                    <div className="flex flex-wrap gap-[6px]">
                                        {item.services.map((s) => (
                                            <span
                                                key={s}
                                                className="text-[11px] font-semibold tracking-[0.5px] uppercase text-accent border border-accent/30 px-[9px] py-[3px] rounded-[4px]"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-[13px] text-muted">
                                        {item.location} &middot; {item.year}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
