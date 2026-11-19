'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function CarpentryPage() {
  return (
    <section id="carpentry" className="py-[80px] relative max-w-1100 mx-auto px-[24px]">
      {/* ---------- HERO ---------- */}
      <div className="text-center max-w-[760px] mx-auto mb-[72px]">
        <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-accent mb-[14px] block">
          Trim · Rot Repair · Custom Woodwork · Franklin, TN
        </p>
        <h1 className="text-[clamp(34px,5vw,52px)] font-black tracking-[-1.5px] leading-1.1 mb-[20px] text-fg">
          Small Carpentry Jobs, <span className="bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] bg-clip-text text-transparent">Done Right</span>
        </h1>
        <p className="text-[18px] text-muted leading-1.7 mb-[28px]">
          Most contractors won’t take the small stuff — a rotten sill, a
          crooked door, a trim run that never got finished. That’s exactly
          what I do. Clean cuts, tight joints, and wood that lasts.
        </p>
        <div className="flex gap-[12px] justify-center flex-wrap mb-[18px]">
          <Button asChild variant="gradient" size="sm">
            <a href="/contact">Get a Free Quote</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="tel:9016748876">Call Sam · 901-674-8876</a>
          </Button>
        </div>
        <p className="text-[13px] text-muted tracking-[0.02em]">
          Local · Owner-operated · Free estimates · No job too small
        </p>
      </div>

      {/* ---------- BENEFITS ---------- */}
      <div className="mb-[80px]">
        <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
          Why homeowners call me for the small jobs
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[20px]">
          <div className="pt-[26px] px-[24px] pb-[24px] border border-white/8 rounded-[16px] bg-white/2 transition-[border-color,transform] duration-200 group">
            <span className="text-[22px] inline-block mb-[10px]">📐</span>
            <h3 className="text-[17px] font-bold mb-[8px] text-fg">Clean cuts, tight joints</h3>
            <p className="text-[14px] leading-1.65 text-muted">
              Trim that meets flush, miters that actually line up, and
              caulk lines you can’t see. The details are the whole job.
            </p>
          </div>
          <div className="pt-[26px] px-[24px] pb-[24px] border border-white/8 rounded-[16px] bg-white/2 transition-[border-color,transform] duration-200 group">
            <span className="text-[22px] inline-block mb-[10px]">🪵</span>
            <h3 className="text-[17px] font-bold mb-[8px] text-fg">Rot repaired, not covered up</h3>
            <p className="text-[14px] leading-1.65 text-muted">
              I cut out the bad wood, treat or replace what’s behind it,
              and rebuild it so water stays out — not just paint over it.
            </p>
          </div>
          <div className="pt-[26px] px-[24px] pb-[24px] border border-white/8 rounded-[16px] bg-white/2 transition-[border-color,transform] duration-200 group">
            <span className="text-[22px] inline-block mb-[10px]">🚪</span>
            <h3 className="text-[17px] font-bold mb-[8px] text-fg">Doors and windows that work</h3>
            <p className="text-[14px] leading-1.65 text-muted">
              Sticking doors, drafts, loose trim, failed seals — fixed
              properly so they close right and stop leaking air.
            </p>
          </div>
          <div className="pt-[26px] px-[24px] pb-[24px] border border-white/8 rounded-[16px] bg-white/2 transition-[border-color,transform] duration-200 group">
            <span className="text-[22px] inline-block mb-[10px]">🧰</span>
            <h3 className="text-[17px] font-bold mb-[8px] text-fg">No job too small</h3>
            <p className="text-[14px] leading-1.65 text-muted">
              One shelf, one door, one piece of trim — I show up for the
              jobs the big crews won’t bid on.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- SCOPE ---------- */}
      <div className="mb-[80px] max-w-720 mx-auto text-center">
        <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
          What I take on
        </h2>
        <ul className="list-none p-0 mx-0 my-[18px] text-[16px] leading-2 text-fg text-left">
          <li className="py-[6px] border-b border-white/6"><strong>Trim &amp; finish work:</strong> baseboards, crown, casing, window &amp; door trim</li>
          <li className="py-[6px] border-b border-white/6"><strong>Rot repair:</strong> sills, fascia, thresholds, exterior trim, deck boards</li>
          <li className="py-[6px] border-b border-white/6"><strong>Doors &amp; windows:</strong> hanging, adjusting, re-casing, weather sealing</li>
          <li className="py-[6px] border-b border-white/6"><strong>Custom wood projects:</strong> shelves, mantels, built-ins, small furniture repairs</li>
          <li className="py-[6px] border-b-0"><strong>Punch-list carpentry:</strong> the small fixes that never got finished</li>
        </ul>
        <p className="text-[14px] text-muted italic">
          Not sure if your project is in scope? Ask — I’ll tell you honestly
          and refer you to the right pro if it’s a bigger structural job.
        </p>
      </div>

      {/* ---------- ASK ME ---------- */}
      <div className="max-w-720 mx-auto mb-[80px] pt-[40px] px-[32px] pb-[40px] text-center border border-accent/22 rounded-[20px] bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.09),transparent_60%)] bg-[rgba(255,255,255,0.015)]">
        <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-accent mb-[12px] block">
          Don’t see your project?
        </p>
        <h2 className="text-[clamp(24px,3.2vw,32px)] font-black tracking-[-0.6px] mb-[16px] text-fg">
          If it’s made of wood, just ask.
        </h2>
        <p className="text-[16px] leading-1.75 text-muted mb-[24px]">
          The list above covers the most common jobs, but it’s not everything.
          I take on plenty of one-off wood projects — a weird shelf, a
          damaged cabinet door, a custom piece, a repair nobody else wants
          to touch. If you’re not sure whether it’s something I do,
          <strong className="text-fg font-bold"> ask anyway.</strong> Worst case, I point you to the
          right person.
        </p>
        <div className="flex gap-[14px] justify-center flex-wrap items-center">
          <Button asChild variant="gradient" size="sm">
            <a href="/contact">Ask about your project →</a>
          </Button>
          <a href="tel:9016748876" className="text-[14px] font-bold text-muted no-underline hover:text-accent transition-color duration-200">
            Or call · 901-674-8876
          </a>
        </div>
      </div>

      {/* ---------- PROCESS ---------- */}
      <div className="mb-[80px]">
        <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
          How it works
        </h2>
        <ol className="list-none p-0 mx-auto max-w-[640px] flex flex-col gap-[18px]">
          <li className="flex gap-[18px] items-flex-start p-[20px] border border-white/8 rounded-[14px] bg-white/1">
            <span className="shrink-0 w-[34px] h-[34px] rounded-full inline-flex items-center justify-center bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] text-accent-text-bg font-black text-[15px]">1</span>
            <div>
              <h3 className="text-[16px] font-bold mb-[4px] text-fg">Free walkthrough</h3>
              <p className="text-[14px] leading-1.6 text-muted">I come to you, look at the job, and talk through options.</p>
            </div>
          </li>
          <li className="flex gap-[18px] items-flex-start p-[20px] border border-white/8 rounded-[14px] bg-white/1">
            <span className="shrink-0 w-[34px] h-[34px] rounded-full inline-flex items-center justify-center bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] text-accent-text-bg font-black text-[15px]">2</span>
            <div>
              <h3 className="text-[16px] font-bold mb-[4px] text-fg">Clear written quote</h3>
              <p className="text-[14px] leading-1.6 text-muted">Flat price, line-item scope, no hidden fees. You decide.</p>
            </div>
          </li>
          <li className="flex gap-[18px] items-flex-start p-[20px] border border-white/8 rounded-[14px] bg-white/1">
            <span className="shrink-0 w-[34px] h-[34px] rounded-full inline-flex items-center justify-center bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] text-accent-text-bg font-black text-[15px]">3</span>
            <div>
              <h3 className="text-[16px] font-bold mb-[4px] text-fg">Repair &amp; build</h3>
              <p className="text-[14px] leading-1.6 text-muted">Bad wood cut out, surfaces prepped, new work fitted tight.</p>
            </div>
          </li>
          <li className="flex gap-[18px] items-flex-start p-[20px] border border-white/8 rounded-[14px] bg-white/1">
            <span className="shrink-0 w-[34px] h-[34px] rounded-full inline-flex items-center justify-center bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] text-accent-text-bg font-black text-[15px]">4</span>
            <div>
              <h3 className="text-[16px] font-bold mb-[4px] text-fg">Walkthrough &amp; cleanup</h3>
              <p className="text-[14px] leading-1.6 text-muted">We review the work together. I don’t leave until it’s right.</p>
            </div>
          </li>
        </ol>
      </div>

      {/* ---------- FAQ ---------- */}
      <div className="mb-[80px] max-w-720 mx-auto">
        <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
          Common questions
        </h2>
        <details className="border border-white/8 rounded-[12px] pt-[16px] px-[20px] pb-[16px] mb-[10px] bg-white/1">
          <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">Do you take on small jobs?</summary>
          <p className="mt-[12px] text-[14px] leading-1.7 text-muted">Yes — that’s most of what I do. One door, one trim run, one rotten sill. If it’s a real carpentry job, I’ll quote it.</p>
        </details>
        <details className="border border-white/8 rounded-[12px] pt-[16px] px-[20px] pb-[16px] mb-[10px] bg-white/1">
          <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">Can you match existing trim?</summary>
          <p className="mt-[12px] text-[14px] leading-1.7 text-muted">In most cases, yes. I’ll match profile, size, and material as closely as possible, and paint or stain to blend in.</p>
        </details>
        <details className="border border-white/8 rounded-[12px] pt-[16px] px-[20px] pb-[16px] mb-[10px] bg-white/1">
          <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">How do you handle rotten wood?</summary>
          <p className="mt-[12px] text-[14px] leading-1.7 text-muted">I cut out the damaged section, check what’s behind it, treat or replace as needed, then rebuild so water stays out. I don’t just cover it with filler and paint.</p>
        </details>
        <details className="border border-white/8 rounded-[12px] pt-[16px] px-[20px] pb-[16px] mb-[10px] bg-white/1">
          <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">Do you do structural work?</summary>
          <p className="mt-[12px] text-[14px] leading-1.7 text-muted">No — I stick to finish carpentry, trim, rot repair, and small wood projects. If a job needs structural or engineering work, I’ll refer you to a licensed pro.</p>
        </details>
        <details className="border border-white/8 rounded-[12px] pt-[16px] px-[20px] pb-[16px] mb-[10px] bg-white/1">
          <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">Do you supply the materials?</summary>
          <p className="mt-[12px] text-[14px] leading-1.7 text-muted">I can source trim, lumber, and hardware at cost, or work with materials you’ve already bought. We’ll decide at the quote.</p>
        </details>
      </div>

      {/* ---------- FINAL CTA ---------- */}
      <div className="text-center pt-[56px] px-[24px] pb-[40px] border border-accent/25 rounded-[20px] bg-[linear-gradient(180deg,rgba(245,158,11,0.06),rgba(245,158,11,0.02))] mb-[40px]">
        <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
          Got a small job that’s been sitting on the list?
        </h2>
        <p className="text-[16px] text-muted mb-[24px]">
          Free estimate, no pressure, no sales pitch. Just an honest quote.
        </p>
        <div className="flex gap-[12px] justify-center flex-wrap mb-[18px]">
          <Button asChild variant="gradient" size="sm">
            <a href="/contact">Get a Free Quote</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="tel:9016748876">Call Sam · 901-674-8876</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
