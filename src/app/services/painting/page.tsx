'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function PaintingPage() {
  return (
    <section id="painting" className="py-[80px] relative max-w-1100 mx-auto px-[24px]">
      {/* ---------- HERO ---------- */}
      <div className="text-center max-w-[760px] mx-auto mb-[72px]">
        <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-accent mb-[14px] block">
          Interior &amp; Exterior Painting · Franklin, TN
        </p>
        <h1 className="text-[clamp(34px,5vw,52px)] font-black tracking-[-1.5px] leading-1.1 mb-[20px] text-fg">
          A Clean, Professional Paint Job — <span className="bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] bg-clip-text text-transparent">Without the Headache</span>
        </h1>
        <p className="text-[18px] text-muted leading-1.7 mb-[28px]">
          Most paint jobs fail in the prep. I take the time to do it right —
          patched, sanded, taped, and primed — so the finish looks sharp for
          years, not months.
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
          Local · Owner-operated · Free estimates · Weekend availability
        </p>
      </div>

      {/* ---------- BENEFITS ---------- */}
      <div className="mb-[80px]">
        <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
          What you get when you hire me
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[20px]">
          <div className="p-[26px]_p-[24px] border border-white/8 rounded-[16px] bg-white/2 transition-[border-color,transform] duration-200 group">
            <span className="text-[22px] inline-block mb-[10px]">🛠️</span>
            <h3 className="text-[17px] font-bold mb-[8px] text-fg">Real prep work</h3>
            <p className="text-[14px] leading-1.65 text-muted">
              Patched drywall, sanded edges, caulked trim, and primed surfaces.
              The boring stuff most painters skip is the reason mine lasts.
            </p>
          </div>
          <div className="p-[26px]_p-[24px] border border-white/8 rounded-[16px] bg-white/2 transition-[border-color,transform] duration-200 group">
            <span className="text-[22px] inline-block mb-[10px]">🎨</span>
            <h3 className="text-[17px] font-bold mb-[8px] text-fg">Paint that’s right for the room</h3>
            <p className="text-[14px] leading-1.65 text-muted">
              I’ll help you pick the right sheen and product for kitchens,
              baths, trim, and exteriors — no guesswork, no wasted money.
            </p>
          </div>
          <div className="p-[26px]_p-[24px] border border-white/8 rounded-[16px] bg-white/2 transition-[border-color,transform] duration-200 group">
            <span className="text-[22px] inline-block mb-[10px]">🧹</span>
            <h3 className="text-[17px] font-bold mb-[8px] text-fg">Cleaner than I found it</h3>
            <p className="text-[14px] leading-1.65 text-muted">
              Furniture covered, floors protected, daily cleanup. You come home
              to a finished room, not a construction site.
            </p>
          </div>
          <div className="p-[26px]_p-[24px] border border-white/8 rounded-[16px] bg-white/2 transition-[border-color,transform] duration-200 group">
            <span className="text-[22px] inline-block mb-[10px]">⏱️</span>
            <h3 className="text-[17px] font-bold mb-[8px] text-fg">Honest timelines</h3>
            <p className="text-[14px] leading-1.65 text-muted">
              Most rooms done in 1–2 days. No vanishing acts, no surprise
              delays, no “I’ll be back next week” that never happens.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- SCOPE ---------- */}
      <div className="mb-[80px] max-w-720 mx-auto text-center">
        <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
          What I paint
        </h2>
        <ul className="list-none p-0 m-[0]_0_[18px] text-[16px] leading-2 text-fg text-left">
          <li className="py-[6px] border-b border-white/6"><strong>Interior:</strong> walls, ceilings, trim, doors, baseboards, cabinets</li>
          <li className="py-[6px] border-b border-white/6"><strong>Exterior:</strong> siding, trim, doors, shutters, small decks &amp; porches</li>
          <li className="py-[6px] border-b-0"><strong>Finishing:</strong> touch-ups, accent walls, color matching</li>
        </ul>
        <p className="text-[14px] text-muted italic">
          Not sure if your project is in scope? Ask — I’ll tell you honestly
          and refer you to a licensed pro if it’s not.
        </p>
      </div>

      {/* ---------- ASK ME ---------- */}
      <div className="max-w-720 mx-auto mb-[80px] p-[40px]_p-[32px] text-center border border-accent/22 rounded-[20px] bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.09),transparent_60%)] bg-[rgba(255,255,255,0.015)]">
        <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-accent mb-[12px] block">
          Don’t see your project?
        </p>
        <h2 className="text-[clamp(24px,3.2vw,32px)] font-black tracking-[-0.6px] mb-[16px] text-fg">
          If it needs paint, just ask.
        </h2>
        <p className="text-[16px] leading-1.75 text-muted mb-[24px]">
          The list above covers the most common jobs, but it’s not everything.
          I take on plenty of one-off painting projects — a single cabinet,
          a garage door, a rental touch-up, a color you can’t quite match,
          a surface nobody else wants to deal with. If you’re not sure
          whether it’s something I do, <strong className="text-fg font-bold">ask anyway.</strong> Worst
          case, I point you to the right person.
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
        <ol className="list-none p-0 m-[0]_auto max-w-[640px] flex flex-col gap-[18px]">
          <li className="flex gap-[18px] items-flex-start p-[20px] border border-white/8 rounded-[14px] bg-white/1">
            <span className="shrink-0 w-[34px] h-[34px] rounded-full inline-flex items-center justify-center bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] text-accent-text-bg font-black text-[15px]">1</span>
            <div>
              <h3 className="text-[16px] font-bold mb-[4px] text-fg">Free walkthrough</h3>
              <p className="text-[14px] leading-1.6 text-muted">I come to you, take measurements, and talk through your goals.</p>
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
              <h3 className="text-[16px] font-bold mb-[4px] text-fg">Prep &amp; paint</h3>
              <p className="text-[14px] leading-1.6 text-muted">Furniture covered, surfaces prepped, paint applied right.</p>
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
        <details className="border border-white/8 rounded-[12px] p-[16px]_p-[20px] mb-[10px] bg-white/1">
          <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">Do I need to move furniture?</summary>
          <p className="mt-[12px] text-[14px] leading-1.7 text-muted">No — I’ll move and cover what I can. Anything fragile or heavy, we’ll agree on a plan before I start.</p>
        </details>
        <details className="border border-white/8 rounded-[12px] p-[16px]_p-[20px] mb-[10px] bg-white/1">
          <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">Do you provide the paint?</summary>
          <p className="mt-[12px] text-[14px] leading-1.7 text-muted">I can supply paint at cost, or you can choose your own. I’ll recommend the right product for your room and budget.</p>
        </details>
        <details className="border border-white/8 rounded-[12px] p-[16px]_p-[20px] mb-[10px] bg-white/1">
          <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">How long does a room take?</summary>
          <p className="mt-[12px] text-[14px] leading-1.7 text-muted">Most standard rooms are 1–2 days, depending on prep and drying time. I’ll give you a realistic estimate up front.</p>
        </details>
        <details className="border border-white/8 rounded-[12px] p-[16px]_p-[20px] mb-[10px] bg-white/1">
          <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">Are you licensed and insured?</summary>
          <p className="mt-[12px] text-[14px] leading-1.7 text-muted">I’m a local owner-operator and carry liability coverage. For anything requiring an electrical or plumbing license, I refer you to a licensed pro — I won’t fake it.</p>
        </details>
        <details className="border border-white/8 rounded-[12px] p-[16px]_p-[20px] mb-[10px] bg-white/1">
          <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">Do you supply the materials?</summary>
          <p className="mt-[12px] text-[14px] leading-1.7 text-muted">I can source trim, lumber, and hardware at cost, or work with materials you’ve already bought. We’ll decide at the quote.</p>
        </details>
      </div>

      {/* ---------- FINAL CTA ---------- */}
      <div className="text-center p-[56px]_p-[24px] border border-accent/25 rounded-[20px] bg-[linear-gradient(180deg,rgba(245,158,11,0.06),rgba(245,158,11,0.02))] mb-[40px]">
        <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
          Ready for a room that looks like it should?
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
