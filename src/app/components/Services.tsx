'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { HomepageService } from '@/lib/mongodb';
import {
    HammerIcon,
    PaintRollerIcon,
    ElectricalIcon,
    GeneralRepairsIcon,
    PlumbingIcon,
    HaulingIcon,
    ChevronLeft,
    ChevronRight,
    CheckIcon,
} from '@/app/components/icons';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
    carpentry: HammerIcon,
    painting: PaintRollerIcon,
    electrical: ElectricalIcon,
    'general-repairs': GeneralRepairsIcon,
    plumbing: PlumbingIcon,
    hauling: HaulingIcon,
};

const ServiceIcon = ({ value, className }: { value: string; className?: string }) => {
    const Comp = ICON_MAP[value] || HammerIcon;
    return <Comp className={className} />;
};

interface ServicesProps {
    services: HomepageService[];
}

/* ---------- Hook: prefers-reduced-motion ---------- */

function useReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);
    return reduced;
}

/* ---------- Card sizing ---------- */

const GAP = 24;
const MIN_CARD = 260; // narrowest a card can get before we drop a column

/**
 * Returns the pixel width each card should be so that
 * `floor((stripWidth + GAP) / (MIN_CARD + GAP))` full cards fit exactly,
 * with no partial card peeking on the right edge.
 */
function computeCardWidth(stripWidth: number): number {
    if (stripWidth <= 0) return MIN_CARD;
    const perView = Math.max(1, Math.floor((stripWidth + GAP) / (MIN_CARD + GAP)));
    return Math.floor((stripWidth - (perView - 1) * GAP) / perView);
}

/* ---------- Component ---------- */

export default function Services({ services }: ServicesProps) {
    const [headerVisible, setHeaderVisible] = useState(false);
    const [cardsVisible, setCardsVisible] = useState(false);
    const [showBio, setShowBio] = useState(true);

    const [selectedId, setSelectedId] = useState<string>(services[0]?.value ?? '');

    const stripRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [cardWidth, setCardWidth] = useState<number>(MIN_CARD);

    const reducedMotion = useReducedMotion();

    const selected = useMemo(
        () => services.find((s) => s.value === selectedId) ?? services[0],
        [selectedId]
    );

    /* Header entrance */
    useEffect(() => {
        const t = setTimeout(() => setHeaderVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    /* Measure strip and set card width so N full cards fit */
    useLayoutEffect(() => {
        const el = stripRef.current;
        if (!el) return;

        const measure = () => {
            // clientWidth includes padding; use offsetWidth - padding to get content box
            const style = window.getComputedStyle(el);
            const padL = parseFloat(style.paddingLeft) || 0;
            const padR = parseFloat(style.paddingRight) || 0;
            const contentWidth = el.clientWidth - padL - padR;
            setCardWidth(computeCardWidth(contentWidth));
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    /* Scroll state */
    const updateScrollState = useCallback(() => {
        const el = stripRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        const max = scrollWidth - clientWidth;
        setCanScrollLeft(scrollLeft > 4);
        setCanScrollRight(scrollLeft < max - 4);
    }, []);

    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener('scroll', updateScrollState, { passive: true });
        const ro = new ResizeObserver(updateScrollState);
        ro.observe(el);
        return () => {
            el.removeEventListener('scroll', updateScrollState);
            ro.disconnect();
        };
    }, [updateScrollState]);

    /* Arrow navigation — scroll by exactly one card */
    const scrollByCard = useCallback((dir: -1 | 1) => {
        const el = stripRef.current;
        if (!el) return;
        el.scrollBy({
            left: dir * (cardWidth + GAP),
            behavior: reducedMotion ? 'auto' : 'smooth',
        });
    }, [cardWidth, reducedMotion]);

    /* Drag-to-scroll (desktop mouse) */
    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;

        let isDown = false;
        let startX = 0;
        let startScroll = 0;
        let moved = false;

        const onPointerDown = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return;
            if (e.button !== 0) return;
            isDown = true;
            moved = false;
            startX = e.clientX;
            startScroll = el.scrollLeft;
        };
        const onPointerMove = (e: PointerEvent) => {
            if (!isDown) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 4) {
                if (!moved) {
                    el.setPointerCapture(e.pointerId);
                    el.style.scrollSnapType = 'none';
                }
                moved = true;
            }
            if (moved) el.scrollLeft = startScroll - dx;
        };
        const onPointerUp = (e: PointerEvent) => {
            if (!isDown) return;
            isDown = false;
            el.style.scrollSnapType = '';
            try { el.releasePointerCapture(e.pointerId); } catch { }
            if (moved) {
                const swallow = (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); };
                el.addEventListener('click', swallow, { capture: true, once: true });
                setTimeout(() => el.removeEventListener('click', swallow, true), 0);
            }
        };

        el.addEventListener('pointerdown', onPointerDown);
        el.addEventListener('pointermove', onPointerMove);
        el.addEventListener('pointerup', onPointerUp);
        el.addEventListener('pointercancel', onPointerUp);
        return () => {
            el.removeEventListener('pointerdown', onPointerDown);
            el.removeEventListener('pointermove', onPointerMove);
            el.removeEventListener('pointerup', onPointerUp);
            el.removeEventListener('pointercancel', onPointerUp);
        };
    }, []);

    /* Reveal cards when strip enters viewport */
    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setCardsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const onCardKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLElement>, index: number) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            e.preventDefault();
            const dir = e.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = Math.max(0, Math.min(services.length - 1, index + dir));
            const nextId = services[nextIndex]?.value;
            if (!nextId) return;
            setSelectedId(nextId);
            const el = document.getElementById(`srv-${nextId}`);
            el?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
            el?.focus({ preventScroll: true });
        },
        [reducedMotion]
    );

    const handleBookNow = useCallback(() => {
        const select = document.getElementById('service') as HTMLSelectElement | null;
        if (select) {
            select.value = selected?.value ?? '';
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }, [selected]);

    const animationClass = reducedMotion
        ? ''
        : 'transition-[transform,box-shadow,border-color] duration-350 ease-out';

    return (
        <section id="services" className="py-[100px] relative overflow-hidden bg-fg/5">
            <div className="relative z-10 max-w-[1100px] mx-auto px-[24px]">
                <div className="text-left mb-[40px]">
                    {/* <span
                        className={cn(
                            'inline-block text-[12px] font-bold tracking-[0.18em] uppercase text-accent mb-[16px]',
                            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]',
                            'transition-all duration-500 ease-out'
                        )}
                    >
                        What I Do
                    </span> */}
                    <h2
                        className={cn(
                            'text-[44px] font-black tracking-[-1px] mb-[20px] text-fg',
                            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[14px]',
                            'transition-all duration-600 ease-out'
                        )}
                    >
                        Services
                    </h2>
                    <p className="text-left text-muted leading-1.75 m-0 opacity-90 text-[17px] max-w-[1000px]">
                        Reliable handyman work for homes and small businesses — done right the first time.
                    </p>

                    <button
                        type="button"
                        onClick={() => setShowBio((v) => !v)}
                        aria-expanded={showBio}
                        aria-controls="services-bio"
                        className="mt-[12px] inline-flex items-center gap-[6px] text-[14px] font-bold text-accent hover:text-accent/80 transition-colors duration-200"
                    >
                        {showBio ? 'Show less' : 'More about how I work'}
                        <span className={cn('transition-transform duration-200', showBio ? 'rotate-180' : 'rotate-0')}>
                            ▾
                        </span>
                    </button>

                    <div
                        id="services-bio"
                        className={cn(
                            'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                            showBio ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        )}
                    >
                        <div className="overflow-hidden">
                            <p className="text-left text-muted leading-1.75 mt-[16px] m-0 opacity-90 text-[17px] max-w-[1000px]">
                                I&apos;m Sam, and it&apos;s just me — no crew, no call center. You get one person who shows up when he says he will, quotes a straight price before starting, and cleans up after himself.
                            </p>
                            <p className="text-left text-muted leading-1.75 mt-[12px] m-0 opacity-90 text-[17px] max-w-[1000px]">
                                If it&apos;s broken, squeaky, loose, or half-finished, I&apos;m your guy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Contained horizontal scroll ─────────────────────────── */}
                <div className="relative mt-[16px]">
                    <button
                        type="button"
                        onClick={() => scrollByCard(-1)}
                        aria-label="Scroll services left"
                        className={cn(
                            'hidden sm:flex absolute -left-[20px] top-1/2 -translate-y-1/2 z-20',
                            'w-[40px] h-[40px] rounded-full items-center justify-center',
                            'bg-card border border-border text-fg shadow-lg',
                            'hover:border-accent hover:text-accent hover:scale-105 transition-all duration-200',
                            canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        )}
                    >
                        <ChevronLeft />
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollByCard(1)}
                        aria-label="Scroll services right"
                        className={cn(
                            'hidden sm:flex absolute -right-[20px] top-1/2 -translate-y-1/2 z-20',
                            'w-[40px] h-[40px] rounded-full items-center justify-center',
                            'bg-card border border-border text-fg shadow-lg',
                            'hover:border-accent hover:text-accent hover:scale-105 transition-all duration-200',
                            canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        )}
                    >
                        <ChevronRight />
                    </button>

                    {/* ── Helper & Navigation Bar ─────────────────────────── */}
                    <div className="flex flex-wrap items-center justify-between gap-[12px] mb-[14px]">
                        <p className="text-[13px] text-muted m-0">
                            <span className="font-bold text-fg">Step 1:</span> Click a service below to select it
                        </p>

                        <div className="flex items-center gap-[10px]">
                            <span className="text-[12px] font-semibold text-muted tabular-nums">
                                {services.findIndex((s) => s.value === selectedId) + 1} of {services.length} services
                            </span>

                            <div className="flex items-center gap-[6px]">
                                <button
                                    type="button"
                                    onClick={() => scrollByCard(-1)}
                                    disabled={!canScrollLeft}
                                    aria-label="Previous services"
                                    className={cn(
                                        'flex items-center gap-[4px] px-[10px] py-[6px] rounded-[10px] border text-[12px] font-bold transition-colors',
                                        canScrollLeft
                                            ? 'bg-card border-border text-fg hover:border-accent hover:text-accent cursor-pointer'
                                            : 'bg-card/40 border-border/50 text-muted/40 cursor-not-allowed'
                                    )}
                                >
                                    <ChevronLeft className="w-[16px] h-[16px]" />
                                    <span className="hidden sm:inline">Prev</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => scrollByCard(1)}
                                    disabled={!canScrollRight}
                                    aria-label="More services"
                                    className={cn(
                                        'flex items-center gap-[4px] px-[10px] py-[6px] rounded-[10px] border text-[12px] font-bold transition-colors',
                                        canScrollRight
                                            ? 'bg-card border-accent/60 text-fg hover:bg-accent hover:text-white cursor-pointer'
                                            : 'bg-card/40 border-border/50 text-muted/40 cursor-not-allowed'
                                    )}
                                >
                                    <span className="hidden sm:inline">More</span>
                                    <ChevronRight className="w-[16px] h-[16px]" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        ref={stripRef}
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Services"
                        tabIndex={0}
                        className={cn(
                            'flex overflow-x-auto snap-x snap-mandatory',
                            'py-[8px] scroll-smooth cursor-grab active:cursor-grabbing',
                            '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-fg/5'
                        )}
                        style={{ gap: GAP }}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowRight') { e.preventDefault(); scrollByCard(1); }
                            if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByCard(-1); }
                            if (e.key === 'Home') {
                                e.preventDefault();
                                stripRef.current?.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
                            }
                            if (e.key === 'End') {
                                e.preventDefault();
                                const el = stripRef.current;
                                if (el) el.scrollTo({ left: el.scrollWidth, behavior: reducedMotion ? 'auto' : 'smooth' });
                            }
                        }}
                    >
                        {services.map((s, index) => {
                            const isSelected = s.value === selectedId;
                            return (
                                <div
                                    key={s.title}
                                    id={`srv-${s.value}`}
                                    data-srv
                                    role="radio"
                                    aria-checked={isSelected}
                                    aria-roledescription="slide"
                                    aria-label={`${index + 1} of ${services.length}: ${s.title}`}
                                    tabIndex={isSelected ? 0 : -1}
                                    onClick={() => setSelectedId(s.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setSelectedId(s.value);
                                            return;
                                        }
                                        onCardKeyDown(e, index);
                                    }}
                                    className={cn(
                                        'snap-start shrink-0',
                                        'bg-card border rounded-[16px] p-[22px] relative flex flex-col gap-[16px] group overflow-hidden min-h-[260px]',
                                        'cursor-pointer select-none',
                                        animationClass,
                                        isSelected
                                            ? 'border-accent shadow-[0_8px_24px_rgba(245,158,11,0.18)]'
                                            : 'border-border hover:-translate-y-[4px] hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)] hover:border-accent/40',
                                        cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[16px]',
                                        !reducedMotion && cardsVisible && 'animate-[fadeUp_0.6s_ease-out_forwards]',
                                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-fg/5'
                                    )}
                                    style={{
                                        width: cardWidth,
                                        animationDelay: reducedMotion ? undefined : `${index * 0.08}s`,
                                    }}
                                >
                                    <div
                                        aria-hidden
                                        className={cn(
                                            'absolute top-[14px] right-[14px] w-[24px] h-[24px] rounded-full flex items-center justify-center border transition-all duration-200',
                                            isSelected
                                                ? 'bg-accent border-accent text-white scale-100'
                                                : 'bg-transparent border-border/80 text-transparent group-hover:border-accent/60'
                                        )}
                                    >
                                        <CheckIcon />
                                    </div>

                                    <div className="flex items-center gap-[12px]">
                                        <div
                                            className={cn(
                                                'flex items-center justify-center w-[52px] h-[52px] rounded-[16px] border transition-[transform,background-color,border-color] duration-300 will-change-transform flex-shrink-0',
                                                isSelected
                                                    ? 'bg-accent text-white border-accent'
                                                    : 'bg-accent/10 text-accent border-transparent group-hover:border-accent'
                                            )}
                                        >
                                            <ServiceIcon value={s.value} />
                                        </div>
                                        <h3 className="text-[19px] font-black tracking-[-0.4px] text-fg group-hover:text-accent transition-colors duration-250">
                                            {s.title}
                                        </h3>
                                    </div>

                                    <p className="text-[14px] text-muted opacity-85 leading-1.7 group-hover:text-fg/95 transition-colors duration-250">
                                        {s.description}
                                    </p>

                                    {s.features.length > 0 && (
                                        <div className="flex flex-wrap gap-[8px]">
                                            {s.features.map((f) => (
                                                <span
                                                    key={f}
                                                    className={cn(
                                                        'text-[10px] font-bold tracking-[0.5px] uppercase border px-[8px] py-[3px] rounded-[5px] transition-colors duration-200',
                                                        isSelected
                                                            ? 'text-white border-accent bg-accent/90'
                                                            : 'text-accent border-accent bg-accent/5 group-hover:border-accent/60 group-hover:bg-accent/10'
                                                    )}
                                                >
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Edge fades */}
                    <div
                        aria-hidden
                        className={cn(
                            'pointer-events-none absolute inset-y-0 left-0 w-[48px] bg-gradient-to-r from-fg/5 to-transparent transition-opacity duration-300',
                            canScrollLeft ? 'opacity-100' : 'opacity-0'
                        )}
                    />
                    <div
                        aria-hidden
                        className={cn(
                            'pointer-events-none absolute inset-y-0 right-0 w-[48px] bg-gradient-to-l from-fg/5 to-transparent transition-opacity duration-300',
                            canScrollRight ? 'opacity-100' : 'opacity-0'
                        )}
                    />

                    {/* Clickable Service Pills */}
                    <div
                        className="mt-[14px] flex items-center justify-center gap-[8px]"
                        role="tablist"
                        aria-label="Choose a service"
                    >
                        {services.map((s, idx) => {
                            const active = s.value === selectedId;
                            return (
                                <button
                                    key={s.value}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    aria-label={`Select ${s.title}`}
                                    onClick={() => {
                                        setSelectedId(s.value);
                                        const el = stripRef.current;
                                        if (el) {
                                            el.scrollTo({
                                                left: idx * (cardWidth + GAP),
                                                behavior: reducedMotion ? 'auto' : 'smooth',
                                            });
                                        }
                                    }}
                                    className={cn(
                                        'h-[8px] rounded-full transition-all duration-200 cursor-pointer',
                                        active
                                            ? 'w-[28px] bg-accent'
                                            : 'w-[8px] bg-border hover:bg-accent/50'
                                    )}
                                />
                            );
                        })}
                    </div>

                    {/* ── Single shared action bar ─────────────────────── */}
                    <div
                        className={cn(
                            'mt-[24px] flex flex-col sm:flex-row sm:items-center gap-[12px] sm:gap-[16px]',
                            'bg-card border border-border rounded-[16px] p-[16px] sm:p-[18px]',
                            'transition-colors duration-300',
                            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[8px]'
                        )}
                        aria-live="polite"
                    >
                        <div className="flex-1 min-w-0">
                            {selected && (
                                <div className="w-[40px] h-[40px] rounded-[12px] bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
                                    <ServiceIcon value={selected.value} />
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted m-0">
                                    Step 2 · Selected Service
                                </p>
                                <p className="text-[17px] font-black text-fg m-0 mt-[2px] truncate">
                                    {selected?.title ?? '—'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-row gap-[10px] sm:flex-shrink-0">
                            {selected?.learnMoreLink && (
                                <Button asChild variant="accent" size="sm" className="flex-1 sm:flex-none sm:min-w-[140px] text-center text-[12px] font-bold tracking-[0.6px] uppercase hover:text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.4)] transition-all duration-200">
                                    <a href={selected.learnMoreLink}>Learn More</a>
                                </Button>
                            )}
                            <Button asChild variant="accent" size="sm" className="flex-1 sm:flex-none sm:min-w-[140px] text-center text-[12px] font-bold tracking-[0.6px] uppercase hover:text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.4)] transition-all duration-200">
                                <a
                                    href="#contact"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleBookNow();
                                        document.getElementById('contact')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
                                    }}
                                >
                                    Book Now
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}