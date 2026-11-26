'use client';

import { cn } from '@/lib/utils';
import { useActionState } from 'react';
import { sendContactForm } from '@/app/actions/contact';
import { Button } from '@/components/ui/Button';

interface ContactProps {
    availableServices: string[];
}

export default function Contact({ availableServices }: ContactProps) {
    const [state] = useActionState(sendContactForm, { ok: false });

    return (
        <section id="contact" className="scroll-m-[100px] py-[100px]_0 relative overflow-hidden bg-fg/5">
            <div className="relative z-10 max-w-[1100px] mx-auto px-[24px]">
                <h2 className="text-44 font-black tracking-[-1px] text-left mb-[50px] bg-[linear-gradient(135deg,var(--fg),var(--muted))] bg-clip-text text-transparent">

                    Get In Touch With Sam
                </h2>
                <p className="text-muted text-left mb-[24px] leading-1.6 text-[16px]">
                    Ready to book a service or have a question? Fill out the form below and Sam will get back to you right away.
                </p>
                <form id="contact-form" className="flex flex-col gap-[20px] max-w-[1100px]">
                    <div className="flex flex-col gap-[20px] max-w-[1050px]">
                        <div className="formRow">
                            <label htmlFor="name" className="block mb-[6px] text-[14px] text-fg font-medium">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                required
                                    className="w-full max-w-[380px] px-[14px] py-[16px] bg-card border border-border rounded-[8px] text-fg font-inherit text-[15px] focus:outline-none focus:border-accent transition-[border-color] duration-200"
                            />
                        </div>
                        <div className="formRow">
                            <label htmlFor="email" className="block mb-[6px] text-[14px] text-fg font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="john@email.com"
                                required
                                className="w-full max-w-[380px] px-[14px] py-[16px] bg-card border border-border rounded-[8px] text-fg font-inherit text-[15px] focus:outline-none focus:border-accent transition-[border-color] duration-200"
                            />

                        </div>
                        <div className="formRow">
                            <label htmlFor="phone" className="block mb-[6px] text-[14px] text-fg font-medium">
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="(555) 123-4567"
                                className="max-w-[560px] px-[14px] py-[16px] bg-card border border-border rounded-[8px] text-fg font-inherit text-[15px] focus:outline-none focus:border-accent transition-[border-color] duration-200"
                            />
                        </div>
                        <div className="formRow">
                            <label htmlFor="service" className="block mb-[6px] text-[14px] text-fg font-medium">
                                Service Needed
                            </label>
                        <div className="formRow">
   
    <div className="relative w-full max-w-[340px]">
        <select
            id="service"
            name="service"
            defaultValue=""
            className="w-full appearance-none pl-[14px] pr-[40px] py-[16px] bg-card border border-border rounded-[8px] text-fg font-inherit text-[15px] cursor-pointer hover:border-accent/60 focus:outline-none focus:border-accent transition-[border-color] duration-200"
        >
            <option value="" disabled>
                Select a service...
            </option>
            {availableServices.map((service) => (
                <option key={service} value={service.toLowerCase()}>
                    {service}
                </option>
            ))}
            <option value="other">Other</option>
        </select>

        {/* Custom Chevron Icon */}
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted"
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
    </div>
</div>

                        </div>
                    </div>
                    <div className="formRow">
                        <label htmlFor="message" className="block mb-[6px] text-[14px] text-fg font-medium">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Tell us about your project..."
                            required
                            className="w-full px-[14px] py-[16px] bg-card border border-border rounded-[8px] text-fg font-inherit text-[15px] focus:outline-none focus:border-accent transition-[border-color] duration-200 min-h-[120px] resize-vertical"
                        ></textarea>
                    </div>
                    <Button variant="accent" size="sm" type="submit" className="self-start mt-[8px] shadow-[0_4px_15px_rgba(245,158,11,0.3)]">
                        Send Message
                    </Button>
                    {state.ok && (
                        <div className="mt-[20px] text-[14px] text-accent">
                            Thanks! Your message has been sent successfully.
                        </div>
                    )}
                    {!state.ok && state.error && (
                        <div className="mt-[20px] text-[14px] text-red-500">
                            Error: {state.error}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}
