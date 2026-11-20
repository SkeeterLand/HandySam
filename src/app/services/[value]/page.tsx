import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getServiceContent, getAllServiceValues } from '@/lib/services-data';

export async function generateStaticParams() {
    return getAllServiceValues().map((value) => ({ value }));
}

export default async function ServicePage({
    params,
}: {
    params: Promise<{ value: string }>;
}) {
    const { value } = await params;
    const service = getServiceContent(value);

    if (!service) {
        notFound();
    }

    return (
        <section id={service.value} className="py-[80px] relative max-w-1100 mx-auto px-[24px]">
            {/* ---------- HERO ---------- */}
            <div className="text-center max-w-[760px] mx-auto mb-[72px]">
                <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-accent mb-[14px] block">
                    {service.tagline}
                </p>
                <h1 className="text-[clamp(34px,5vw,52px)] font-black tracking-[-1.5px] leading-1.1 mb-[20px] text-fg">
                    {service.heroTitle}{' '}
                    <span className="bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] bg-clip-text text-transparent">
                        {service.heroHighlight}
                    </span>
                </h1>
                <p className="text-[18px] text-muted leading-1.7 mb-[28px]">
                    {service.heroDescription}
                </p>
                <div className="flex gap-[12px] justify-center flex-wrap mb-[18px]">
                    <Button asChild variant="accent" size="sm" className="text-center text-[12px] font-bold tracking-[0.6px] uppercase hover:text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.4)] transition-all duration-200">
                        <a href="/contact">Get a Free Quote</a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                        <a href="tel:9016748876">Call Sam · 901-674-8876</a>
                    </Button>
                </div>
                <p className="text-[13px] text-muted tracking-[0.02em]">
                    {service.heroFooter}
                </p>
            </div>

            {/* ---------- BENEFITS ---------- */}
            <div className="mb-[80px]">
                <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
                    {service.benefitsTitle}
                </h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[20px]">
                    {service.benefits.map((benefit, i) => (
                        <div
                            key={i}
                            className="pt-[26px] px-[24px] pb-[24px] border border-white/8 rounded-[16px] bg-white/2 transition-[border-color,transform] duration-200 group"
                        >
                            <span className="text-[22px] inline-block mb-[10px]">
                                {benefit.icon}
                            </span>
                            <h3 className="text-[17px] font-bold mb-[8px] text-fg">
                                {benefit.title}
                            </h3>
                            <p className="text-[14px] leading-1.65 text-muted">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------- SCOPE ---------- */}
            <div className="mb-[80px] max-w-720 mx-auto text-center">
                <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
                    {service.scopeTitle}
                </h2>
                <ul className="list-none p-0 mx-0 my-[18px] text-[16px] leading-2 text-fg text-left">
                    {service.scopeItems.map((item, i) => (
                        <li
                            key={i}
                            className={`py-[6px] ${
                                i === service.scopeItems.length - 1
                                    ? 'border-b-0'
                                    : 'border-b border-white/6'
                            } text-fg text-left`}
                        >
                            <strong>{item.label}</strong> {item.items}
                        </li>
                    ))}
                </ul>
                {/* Replace last item border with border-b-0 via CSS is handled below in JSX structure */}
                <p className="text-[14px] text-muted italic">
                    {service.scopeFooter}
                </p>
            </div>

            {/* ---------- ASK ME ---------- */}
            <div className="max-w-720 mx-auto mb-[80px] pt-[40px] px-[32px] pb-[40px] text-center border border-accent/22 rounded-[20px] bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.09),transparent_60%)] bg-[rgba(255,255,255,0.015)]">
                <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-accent mb-[12px] block">
                    {service.askTitle}
                </p>
                <h2 className="text-[clamp(24px,3.2vw,32px)] font-black tracking-[-0.6px] mb-[16px] text-fg">
                    {service.askSubtitle}
                </h2>
                <p className="text-[16px] leading-1.75 text-muted mb-[24px]">
                    {service.askDescription}
                </p>
                <div className="flex gap-[14px] justify-center flex-wrap items-center">
                    <Button asChild variant="accent" size="sm" className="text-center text-[12px] font-bold tracking-[0.6px] uppercase hover:text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.4)] transition-all duration-200">
                        <a href="/contact">Ask about your project →</a>
                    </Button>
                    <a
                        href="tel:9016748876"
                        className="text-[14px] font-bold text-muted no-underline hover:text-accent transition-color duration-200"
                    >
                        Or call · 901-674-8876
                    </a>
                </div>
            </div>

            {/* ---------- PROCESS ---------- */}
            <div className="mb-[80px]">
                <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
                    {service.processTitle}
                </h2>
                <ol className="list-none p-0 mx-auto max-w-[640px] flex flex-col gap-[18px]">
                    {service.processSteps.map((step, i) => (
                        <li key={i} className="flex gap-[18px] items-flex-start p-[20px] border border-white/8 rounded-[14px] bg-white/1">
                            <span
                                className="shrink-0 w-[34px] h-[34px] rounded-full inline-flex items-center justify-center bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] text-accent-text-bg font-black text-[15px]"
                            >
                                {i + 1}
                            </span>
                            <div>
                                <h3 className="text-[16px] font-bold mb-[4px] text-fg">
                                    {step.title}
                                </h3>
                                <p className="text-[14px] leading-1.6 text-muted">
                                    {step.description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>

            {/* ---------- FAQ ---------- */}
            <div className="mb-[80px] max-w-720 mx-auto">
                <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
                    {service.faqTitle}
                </h2>
                {service.faqs.map((faq, i) => (
                    <details
                        key={i}
                        className="border border-white/8 rounded-[12px] pt-[16px] px-[20px] pb-[16px] mb-[10px] bg-white/1"
                    >
                        <summary className="cursor-pointer font-bold text-[15px] text-fg list-none">
                            {faq.question}
                        </summary>
                        <p className="mt-[12px] text-[14px] leading-1.7 text-muted">
                            {faq.answer}
                        </p>
                    </details>
                ))}
            </div>

            {/* ---------- FINAL CTA ---------- */}
            <div className="text-center pt-[56px] px-[24px] pb-[40px] border border-accent/25 rounded-[20px] bg-[linear-gradient(180deg,rgba(245,158,11,0.06),rgba(245,158,11,0.02))] mb-[40px]">
                <h2 className="text-[clamp(26px,3.6vw,36px)] font-black tracking-[-0.8px] text-center mb-[36px] text-fg">
                    {service.ctaTitle}
                </h2>
                <p className="text-[16px] text-muted mb-[24px]">
                    {service.ctaDescription}
                </p>
                <div className="flex gap-[12px] justify-center flex-wrap mb-[18px]">
                    <Button asChild variant="accent" size="sm" className="text-center text-[12px] font-bold tracking-[0.6px] uppercase hover:text-white!important shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.4)] transition-all duration-200">
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
