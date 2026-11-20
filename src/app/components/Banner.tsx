'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type IconName = 'home' | 'services' | 'projects' | 'about' | 'contact' | 'phone';

const NavigationIcon: React.FC<{ type: IconName }> = ({ type }) => {
    const commonProps = {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        'aria-hidden': true,
    };

    switch (type) {
        case 'home':
            return (
               <svg {...commonProps}>
  {/* Roof with overhangs */}
  <path d="M3 10.5L12 3.5l9 7" />
  {/* Chimney */}
  <path d="M16.5 7V4.5h2v4" />
  {/* House walls */}
  <path d="M5.5 9.5V19.5h13V9.5" />
  {/* Front door */}
  <path d="M10 19.5v-5.5h4v5.5" />
</svg>
            );
        case 'services':
            return (
                <svg {...commonProps}>
                    <path d="M8 4.5h8l3 3v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
                    <path d="M8 4.5v4h8v-4" />
                    <path d="M9 12h6" />
                    <path d="M9 16h6" />
                </svg>
            );
        case 'projects':
            return (
                <svg {...commonProps}>
                    <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
                    <path d="M7.5 5v14" />
                    <path d="M3.5 10.5h17" />
                    <path d="M3.5 14.5h17" />
                </svg>
            );
        case 'about':
            return (
              <svg {...commonProps}>
  <rect x="3" y="4" width="18" height="16" rx="2.5" />
  <circle cx="9" cy="10" r="2" />
  <path d="M6 15.5c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5" />
  <path d="M14.5 9.5h3.5" />
  <path d="M14.5 13h3.5" />
</svg>
            );
        case 'contact':
            return (
                <svg {...commonProps}>
                    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
                    <path d="m5.5 8 6.5 5 6.5-5" />
                </svg>
            );
        case 'phone':
            return (
                <svg {...commonProps}>
                    <path d="M6.5 4.5h2.2l1 4-1.5 1.5a12.7 12.7 0 0 0 7.3 7.3l1.5-1.5 4 1v2.2a2 2 0 0 1-2 2h-1.2C12.5 20.5 3.5 11.5 3.5 7.7V6.5a2 2 0 0 1 2-2Z" />
                </svg>
            );
        default:
            return null;
    }
};

const Banner: React.FC = () => {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const navItems = [
        { id: 'home', label: 'Home', href: '#home', icon: 'home' as const },
        { id: 'services', label: 'Services', href: '#services', icon: 'services' as const },
        { id: 'projects', label: 'Gallery', href: '#projects', icon: 'projects' as const },
        { id: 'about', label: 'About', href: '#about', icon: 'about' as const },
        { id: 'contact', label: 'Contact', href: '#contact', icon: 'contact' as const },
    ];

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
                    <Button asChild variant="accent" size="sm" className="flex-1 sm:flex-none sm:min-w-[140px] text-center text-[12px] font-bold tracking-[0.6px] uppercase hover:text-white!important shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.4)] transition-all duration-200">
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
                <div className={cn('absolute left-[1.25rem] flex items-center gap-[0.55rem] py-[0.45rem] px-[0.8rem] border border-white/9 rounded-full bg-white/2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-accent font-bold tracking-[0.06em] uppercase text-[0.7rem]')}>
                    <span className="flex items-center justify-center w-[0.95rem] h-[0.95rem] text-current"><NavigationIcon type="phone" /></span>
                    <a href="tel:9016748876" className="text-accent no-underline tracking-[0.06em] uppercase text-[0.7rem]">901-674-8876</a>
                </div>

                <ul className="flex flex-wrap justify-center gap-[0.7rem] gap-[0.8rem] list-none m-0 p-0">
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

                <div className={cn(
                    'absolute right-[1.25rem] top-1/2 -translate-y-1/2',
                    'text-[1.02rem] font-black text-fg tracking-[-0.04em]',
                    'pointer-events-none opacity-0 invisible',
                    'transition-all duration-200',
                    scrolled && 'opacity-100 visible delay-[80ms]'
                )}>
                    Handy Sam
                </div>
            </nav>
        </>
    );
};

export default Banner;
