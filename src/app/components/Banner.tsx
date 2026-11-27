'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { NAV_ITEMS } from '@/lib/nav';
import { NavigationIcon } from '@/components/ui/NavigationIcon';

const Banner: React.FC = () => {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = NAV_ITEMS.map((item) => ({ ...item, href: `#${item.id}` }));

    useEffect(() => {
        // Scroll spy: highlight the nav item for the last section we've
        // scrolled past (offset 25% into the viewport).
        const updateActiveSection = () => {
            const scrollY = window.scrollY;
            const offset = window.innerHeight * 0.25;
            let newActiveId = 'home';

            navItems.forEach((item) => {
                const section = document.getElementById(item.id);
                if (!section) return;
                const sectionTop = section.getBoundingClientRect().top + scrollY;
                if (scrollY + offset >= sectionTop) {
                    newActiveId = item.id;
                }
            });

            setActiveSection(newActiveId);
        };

        // Banner collapse animation — throttled with RAF.
        let ticking = false;
        let lastY = window.scrollY;
        let lastT = performance.now();

        const COLLAPSE_AT = 120;
        const EXPAND_AT = 90;

        const onScroll = () => {
            updateActiveSection();

            if (ticking) return;
            ticking = true;

            window.requestAnimationFrame(() => {
                const y = window.scrollY;
                const t = performance.now();
                const dt = Math.max(t - lastT, 1);
                const velocity = (y - lastY) / dt;

                setScrolled((prev) => {
                    const down = velocity > 0.3;
                    const up = velocity < -0.3;

                    if (!prev && (y > COLLAPSE_AT || (down && y > 60))) return true;
                    if (prev && (y < EXPAND_AT || (up && y < 140))) return false;
                    return prev;
                });

                lastY = y;
                lastT = t;
                ticking = false;
            });
        };

        updateActiveSection();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isActive = (id: string) => activeSection === id || (pathname === '/' && id === 'home' && activeSection === 'home');

    const bannerBeforeClasses = cn(
        'before:content-[""] before:absolute before:inset-0 before:pointer-events-none',
        scrolled ? 'before:opacity-0' : 'before:opacity-100',
        'before:transition-opacity duration-220',
        'before:bg-[radial-gradient(circle_at_20%_15%_,rgba(245,158,11,0.16)_,transparent_30%)]',
        'before:bg-[radial-gradient(circle_at_80%_18%_,rgba(245,158,11,0.08)_,transparent_24%)]',
        'before:bg-[linear-gradient(180deg,rgba(245,158,11,0.04)_,transparent_40%)]'
    );

    return (
        <>
            <section
                id="home"
                className={cn(
                    'relative text-center overflow-hidden',
                    'bg-[linear-gradient(180deg,rgba(10,10,15,0.98),rgba(18,18,26,0.97))]',
                    'border-b border-white/8',
                    'transition-all duration-340',
                    scrolled && 'opacity-0 pointer-events-none border-b-transparent'
                )}
                style={{
                    gridTemplateRows: scrolled ? '0fr' : '1fr',
                    transition: 'grid-template-rows 0.34s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease, border-color 0.22s ease',
                }}
                aria-hidden={scrolled}
            >
                <div className={bannerBeforeClasses} />

                <div
                    className={cn(
                        'relative min-h-0 overflow-hidden flex flex-col items-center justify-center',
                        'px-5',
                        'transition-all duration-340',
                        scrolled ? 'py-0' : 'py-12'
                    )}
                    style={{
                        padding: scrolled ? 0 : '3rem 1.25rem',
                        transition: 'padding 0.34s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    <p className="m-0 mb-[0.5rem] text-accent text-[0.7rem] font-bold tracking-[0.12em] uppercase">
                        Local home repair &amp; remodeling
                    </p>
                    <h1 className="m-0 text-[clamp(2.2rem,3.6vw,4rem)] leading-[0.95] tracking-[-0.08em] font-black text-fg drop-shadow-[0_8px_25px_rgba(0,0,0,0.28)]">
                        Handy Sam
                    </h1>
                    <p className="m-[0.75rem]_auto_0 max-w-[560px] text-[clamp(0.92rem,1.4vw,1.1rem)] text-[rgba(232,232,240,0.82)] leading-1.6">
                        Quality repairs, upgrades, and honest work for the way you live.
                    </p>
                    <Button asChild variant="accent" size="sm" className="flex-1 sm:flex-none sm:min-w-[140px] text-center text-[12px] font-bold tracking-[0.6px] uppercase mt-[0.75rem] rounded-full hover:text-white!important shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.4)] transition-all duration-200">
                       <a href="#contact">Get a free quote</a>
                    </Button>
                </div>
            </section>

            <nav
                className={cn(
                    'sticky top-0 z-50 flex justify-center items-center w-full h-[5.4rem] px-5',
                    'bg-[#0a0a0f]/97 border-b border-white/8',
                    'transition-all duration-280',
                    scrolled &&
                        'bg-[#0a0a0f] backdrop-blur-md border-b-accent/40 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                )}
                aria-label="Primary"
            >
                {/* Mobile: hamburger + phone on the left, logo on the right */}
                <div className="flex items-center justify-between w-full px-5">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-expanded={mobileMenuOpen}
                        aria-label="Open menu"
                        className="md:hidden flex items-center justify-center w-[2.4rem] h-[2.4rem] rounded-full bg-white/2 border border-white/10 text-white hover:bg-white/5 transition-colors"
                    >
                        <svg
                            className="w-[1.1rem] h-[1.1rem] text-current"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            {mobileMenuOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                            ) : (
                                <>
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>

                    <a
                        href="tel:9016748876"
                        className="hidden md:flex items-center gap-[0.55rem] py-[0.45rem] px-[0.8rem] border border-white/9 rounded-full bg-white/2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-accent font-bold tracking-[0.06em] uppercase text-[0.7rem] no-underline"
                    >
                        <span className="flex items-center justify-center w-[0.95rem] h-[0.95rem] text-current"><NavigationIcon type="phone" /></span>
                        901-674-8876
                    </a>

                    <div className={cn(
                        'absolute top-1/2 -translate-y-1/2',
                        'text-[1.02rem] font-black text-fg tracking-[-0.04em]',
                        'pointer-events-none opacity-0 invisible',
                        'transition-all duration-200',
                        scrolled && 'opacity-100 visible delay-[80ms]',
                        'md:left-[1.25rem]',
                        mobileMenuOpen && 'hidden'
                    )}>
                        Handy Sam
                    </div>

                    {/* Mobile logo on right when menu closed */}
                    <div className={cn(
                        'md:hidden',
                        'text-[1.02rem] font-black text-fg tracking-[-0.04em]',
                        mobileMenuOpen ? 'hidden' : 'visible',
                        'transition-opacity duration-200'
                    )}>
                        Handy Sam
                    </div>
                </div>

                {/* Desktop horizontal nav links */}
                <ul className="hidden md:flex justify-center gap-[0.7rem] gap-[0.8rem] list-none m-0 p-0">
                    {navItems.map((item) => {
                        const active = isActive(item.id);
                        return (
                            <li key={item.id}>
                                <a
                                    href={item.href}
                                    className={cn(
                                        'relative inline-flex items-center gap-[0.45rem] py-[0.55rem] px-[0.9rem] border border-white/9 rounded-full bg-white/1.5 text-white/76 no-underline text-[0.72rem] font-semibold tracking-[0.09em] uppercase',
                                        'transition-all duration-200 ease-out',
                                        active
                                            ? 'border-accent/50 bg-gradient-to-b from-accent/8 to-accent/2.5 text-accent -translate-y-[1px] shadow-[0_10px_24px_rgba(245,158,11,0.08)]'
                                            : '',
                                        'hover:border-accent/50 hover:bg-gradient-to-b hover:from-accent/8 hover:to-accent/2.5 hover:text-accent hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(245,158,11,0.08)]'
                                    )}
                                >
                                    <span className="flex items-center justify-center w-[0.95rem] h-[0.95rem] text-current"><NavigationIcon type={item.icon} /></span>
                                    {item.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                {/* Mobile slide-out drawer */}
                {mobileMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                            aria-hidden="true"
                        />
                        <aside
                            className="fixed inset-y-0 right-0 z-[60] w-[280px] max-w-full bg-[#0a0a0f] border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] flex flex-col"
                            aria-label="Mobile navigation"
                        >
                            <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                    className="flex items-center justify-center w-[2.4rem] h-[2.4rem] rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/5 transition-colors"
                                >
                                    <svg
                                        className="w-[1.1rem] h-[1.1rem] text-current"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            <nav className="flex-1 overflow-y-auto p-[20px] space-y-[10px]">
                                {navItems.map((item) => {
                                    const active = isActive(item.id);
                                    return (
                                        <a
                                            key={item.id}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                'flex items-center gap-[10px] py-[12px] px-[14px] rounded-[12px] border border-transparent bg-white/5 text-white no-underline text-[0.9rem] font-semibold tracking-[0.05em] uppercase transition-colors',
                                                active
                                                    ? 'bg-accent/20 border-accent/50 text-accent'
                                                    : 'hover:bg-white/10 hover:border-white/20'
                                            )}
                                        >
                                            <span className="flex items-center justify-center w-[1.1rem] h-[1.1rem] text-current"><NavigationIcon type={item.icon} /></span>
                                            {item.label}
                                        </a>
                                    );
                                })}
                                <a
                                    href="tel:9016748876"
                                    className="mt-[6px] flex items-center gap-[10px] py-[12px] px-[14px] rounded-[12px] border border-white/10 bg-white/5 text-accent no-underline text-[0.9rem] font-semibold tracking-[0.05em] uppercase transition-colors hover:bg-white/10 hover:border-white/20"
                                >
                                    <span className="flex items-center justify-center w-[1.1rem] h-[1.1rem] text-current"><NavigationIcon type="phone" /></span>
                                    Call: 901-674-8876
                                </a>
                            </nav>
                        </aside>
                    </>
                )}
            </nav>
        </>
    );
};

export default Banner;
