'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/nav';
import { NavigationIcon } from '@/components/ui/NavigationIcon';

export default function ServiceNav() {
    const pathname = usePathname();
    const isOnServicePage = pathname.startsWith('/services/');

    const isActive = (id: string) => {
        if (id === 'services' && isOnServicePage) return true;
        return false;
    };

    return (
        <nav
            className={cn(
                'sticky top-0 z-50 flex justify-center items-center w-full h-[5.4rem] px-5',
                'bg-[#0a0a0f] border-b border-white/8',
                'shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
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
                {NAV_ITEMS.map((item) => {
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
                                <span className="flex items-center justify-center w-[0.95rem] h-[0.95rem] text-current">
                                    <NavigationIcon type={item.icon} />
                                </span>
                                {item.label}
                            </a>
                        </li>
                    );
                })}
            </ul>

            <div className={cn(
                'absolute right-[1.25rem] top-1/2 -translate-y-1/2',
                'text-[1.02rem] font-black text-fg tracking-[-0.04em]',
                'pointer-events-none'
            )}>
                Handy Sam
            </div>
        </nav>
    );
}
