'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type NavIconName = 'home' | 'services' | 'projects' | 'about' | 'contact' | 'phone';

const NavigationIcon: React.FC<{ type: NavIconName }> = ({ type }) => {
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
                    <path d="M3 10.5L12 3.5l9 7" />
                    <path d="M16.5 7V4.5h2v4" />
                    <path d="M5.5 9.5V19.5h13V9.5" />
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

const navItems = [
    { id: 'home', label: 'Home', href: '/', icon: 'home' as const },
    { id: 'services', label: 'Services', href: '/', icon: 'services' as const },
    { id: 'projects', label: 'Gallery', href: '/', icon: 'projects' as const },
    { id: 'about', label: 'About', href: '/', icon: 'about' as const },
    { id: 'contact', label: 'Contact', href: '/contact', icon: 'contact' as const },
];

export default function ServiceNav() {
    const pathname = usePathname();
    const isOnServicePage = pathname.startsWith('/services/');

    const isActive = (id: string) => {
        if (id === 'services' && isOnServicePage) return true;
        return pathname === '/' && id === 'home';
    };

    return (
        <nav
            className={cn(
                'sticky top-0 z-50 flex justify-center items-center w-full h-[5.4rem] px-5',
                'bg-[#0a0a0f]/97 border-b border-white/8',
                'backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
            )}
            aria-label="Primary"
        >
            <div className="absolute left-[1.25rem] flex items-center gap-[0.55rem] py-[0.45rem] px-[0.8rem] border border-white/9 rounded-full bg-white/2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-accent font-bold tracking-[0.06em] uppercase text-[0.7rem]">
                <span className="flex items-center justify-center w-[0.95rem] h-[0.95rem] text-current">
                    <NavigationIcon type="phone" />
                </span>
                <a href="tel:9016748876" className="text-accent no-underline tracking-[0.06em] uppercase text-[0.7rem]">
                    901-674-8876
                </a>
            </div>

            <ul className="flex flex-wrap justify-center gap-[0.7rem] gap-[0.8rem] list-none m-0 p-0">
                {navItems.map((item) => {
                    const active = isActive(item.id);
                    return (
                        <li key={item.id}>
                            <Link
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
                                <span className="flex items-center justify-center w-[0.95rem] h-[0.95rem] text-current">
                                    <NavigationIcon type={item.icon} />
                                </span>
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
