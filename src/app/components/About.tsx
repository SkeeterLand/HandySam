'use client';

import { cn } from '@/lib/utils';

const About: React.FC = () => {
    return (
        <section id="about" className="scroll-m-[100px] py-[100px]_0 relative overflow-hidden bg-fg/5">
            <div className="relative z-10 max-w-[1100px] mx-auto px-[24px]">
                <h2 className="text-44 font-black tracking-[-1px] text-left mb-[50px] bg-[linear-gradient(135deg,var(--fg),var(--muted))] bg-clip-text text-transparent">
                    About Sam
                </h2>
                <p className="text-muted mb-20 leading-1.8 text-16 text-left">
                    Handy Sam — Meade of Avalon's one-man fix-it crew
                </p>

                <p className="text-muted mb-20 leading-1.8 text-16">
                    I'm Sam. When you hire me, you get me — not a crew, not a call center, not a
                    different guy every visit. I show up when I say I will, I tell you what a job
                    will cost before I start, and I clean up after myself.
                </p>

                {/* NEW: origin/credibility paragraph */}
                <p className="text-muted mb-20 leading-1.8 text-16">
                    I've spent many years fixing, patching, mounting, and tightening the things that
                    make a house feel like it's falling apart a little at a time. I started Handy
                    Sam because I got tired of watching people get quoted three different prices
                    and wait a week for a guy who never shows. I do it differently: one person, one
                    price, one visit.
                </p>

                <p className="text-muted mb-20 leading-1.8 text-16">
                    I handle the stuff that's been on your to-do list for months:
                </p>

                {/* NEW: scannable service list instead of a run-on sentence */}
                <ul className="list-none p-0 m-0 space-y-[10px] mb-20">
                    {[
                        'Drywall patches and small hole repairs',
                        'Door adjustments, sticking doors, and hardware swaps',
                        'Light fixtures, fans, and outlet/switch replacements',
                        'Furniture assembly and TV mounting',
                        'Caulking, weatherstripping, and draft sealing',
                        'Minor exterior repairs and touch-ups',
                        'Punch-list work — the odd jobs nobody else will come out for',
                    ].map((service) => (
                        <li
                            key={service}
                            className={cn(
                                'flex items-start gap-[10px] text-fg leading-1.8 text-16',
                                'before:content-["•"] before:text-accent before:flex-shrink-0 before:text-[18px] before:mt-[0.05em]',
                                'hover:bg-accent/5 hover:rounded-[6px] transition-colors duration-200'
                            )}
                        >
                            {service}
                        </li>
                    ))}
                </ul>

                {/* NEW: the "why me" trust block */}
                <p className="text-muted mb-20 leading-1.8 text-16">
                    A few things you can count on: free estimates before any work starts, honest
                    pricing with no surprise add-ons, and a call or text back the same day. If a
                    job turns out to be bigger than it looked, I'll tell you before I touch
                    anything — not after.
                </p>

                <p className="text-muted mb-20 leading-1.8 text-16">
                    No job too small. If it's broken, squeaky, loose, or half-finished, call me.
                </p>

                {/* NEW: closing warmth + clear CTA */}
                <p className="text-muted mb-20 leading-1.8 text-16 ">
                    Serving Meade of Avalon and the surrounding area. Ready to knock out that
                    list? Call or text Sam — free estimates, same-day response.
                </p>

                {/* <p className="text-muted mb-20 leading-1.8 text-16 text-center">
                    901-674-8876 · sam@handysam.com · Free estimates
                </p> */}
            </div>
        </section>
    );
};

export default About;
