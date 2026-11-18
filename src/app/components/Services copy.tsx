'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { services } from '@/lib/data';
import { Button } from '@/components/ui/Button';

const HammerIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Head */}
        <path d="M6 4h8" />
        <path d="M6 4v6" />
        <path d="M14 4v6" />
        <path d="M6 10h8" />
        {/* Handle */}
        <path d="M10 10v12" />
        {/* Claw */}
        <path d="M14 4l2-2" />
    </svg>
);

const PaintRollerIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Handle */}
        <path d="M12 4v10" />
        {/* Frame arms */}
        <path d="M12 14L8 18" />
        <path d="M12 14L16 18" />
        {/* Roller body */}
        <path d="M6 18h12" />
        <path d="M6 18v2" />
        <path d="M18 18v2" />
        <path d="M6 20Q12 21 18 20" />
        {/* Paint drips */}
        <path d="M8 20v2" />
        <path d="M12 20v3" />
        <path d="M16 20v2" />
    </svg>
);

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
    carpentry: HammerIcon,
    painting: PaintRollerIcon,
};

const ServiceIcon = ({ value, className }: { value: string; className?: string }) => {
    const Comp = ICON_MAP[value] || HammerIcon;
    return <Comp className={className} />;
};

export default function Services() {
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

        document.querySelectorAll('[data-srv]').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section id="services" className="py-[100px]_0 relative overflow-hidden bg-fg/5">
            <div className="relative z-10 max-w-[1100px] mx-auto px-[24px]">
                <div className="text-left mb-[56px]">
                    <span
                        className={cn(
                            'inline-block text-[12px] font-bold tracking-[0.18em] uppercase text-accent mb-[16px] block',
                            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]',
                            'transition-all duration-500 ease-out'
                        )}
                    >
                    </span>
                    <h2
                        className={cn(
                            'text-[44px] font-black tracking-[-1px] mb-[20px] text-fg',
                            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[14px]',
                            'transition-all duration-600 ease-out'
                        )}
                    >
                        Services
                    </h2>
                    <>
                        <p className="text-left text-muted leading-1.75 m-0 opacity-90 text-[17px] max-w-[1000px] mb-[20px]">
                            Reliable handyman work for homes and small businesses — done right the first time.
                        </p>
                        <p className="text-left text-muted leading-1.75 m-0 opacity-90 text-[17px] max-w-[1000px] mb-[20px]">
                            I'm Sam, and it's just me — no crew, no call center. You get one person who shows up when he says he will, quotes a straight price before starting, and cleans up after himself.
                        </p>
                        <p className="text-left text-muted leading-1.75 m-0 opacity-90 text-[17px] max-w-[1000px]">
                            If it's broken, squeaky, loose, or half-finished, I'm your guy.
                        </p>
                    </>
                </div>

                <div
                    className={cn(
                        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mb-[64px]',
                        headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[18px]',
                        'transition-all duration-700 ease-out'
                    )}
                >
                    {services.map((s) => {
                        const id = `srv-${s.value}`;
                        const isVisible = visibleIds.has(id);

                        return (
                            <div
                                key={s.title}
                                id={id}
                                data-srv
                                className={cn(
                                    'bg-card border border-border rounded-[16px] p-[22px] relative flex flex-col gap-[16px] group overflow-hidden min-h-[260px]',
                                    'transition-[transform,box-shadow,border-color] duration-350 ease-out',
                                    'hover:-translate-y-[4px] hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)] hover:border-accent/40',
                                    !isVisible
                                        ? 'opacity-0 translate-y-[16px] animate-[fadeUp_0.6s_ease-out_forwards]'
                                        : 'opacity-100 translate-y-0'
                                )}
                                style={{
                                    animationDelay: `${services.indexOf(s) * 0.1}s`,
                                }}
                            >
                                {/* Row 1: Icon + Title side by side */}
                                <div className="flex items-center gap-[12px]">
                                    <div
                                        className={cn(
                                            'flex items-center justify-center w-[52px] h-[52px] rounded-[16px] bg-accent/10 border border-transparent text-accent transition-[transform,background-color,border-color] duration-300 group-hover:border-accent group-hover:bg-accent/10 group-hover:scale-105 animate-[icon-pulse_3s_ease-in-out_infinite]',
                                            'will-change-transform flex-shrink-0'
                                        )}
                                    >
                                        <ServiceIcon value={s.value} />
                                    </div>
                                    <h3 className="text-[19px] font-black tracking-[-0.4px] text-fg group-hover:text-accent transition-colors duration-250">
                                        {s.title}
                                    </h3>
                                </div>

                                {/* Row 2: Description */}
                                <p className="text-[14px] text-muted opacity-85 leading-1.7 group-hover:text-fg/95 transition-colors duration-250">
                                    {s.description}
                                </p>

                                {/* Row 3: Weekend pill */}
                                {s.features.length > 0 && (
                                    <div className="flex gap-[8px]">
                                        {s.features.map((f) => (
                                            <span
                                                key={f}
                                                className="text-[10px] font-bold tracking-[0.5px] uppercase text-accent border border-accent bg-accent/5 px-[8px] py-[3px] rounded-[5px] group-hover:border-accent/60 group-hover:bg-accent/10 transition-colors duration-200"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Row 4: Buttons side by side */}
                                <div className="mt-auto flex flex-col gap-[10px] sm:flex-row">
                                    <Button asChild variant="accent" size="sm" className="w-full sm:w-auto text-[12px] font-bold tracking-[0.6px] uppercase hover:text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.4)] transition-all duration-200">
                                        <a href={s.learnMoreLink}>Learn More</a>
                                    </Button>
                                    <Button asChild variant="accent" size="sm" className="w-full sm:w-auto text-[12px] font-bold tracking-[0.6px] uppercase hover:text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.4)] transition-all duration-200">
                                        <a href="#contact" onClick={(e) => {
                                            e.preventDefault();
                                            const select = document.getElementById('service') as HTMLSelectElement;
                                            if (!select) return;
                                            select.value = s.value;
                                        }}>Book Now</a>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
