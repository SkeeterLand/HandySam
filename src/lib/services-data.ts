export interface ServiceContent {
    value: string;
    title: string;
    tagline: string;
    heroTitle: string;
    heroHighlight: string;
    heroDescription: string;
    heroFooter: string;
    benefitsTitle: string;
    benefits: Array<{
        icon: string;
        title: string;
        description: string;
    }>;
    scopeTitle: string;
    scopeItems: Array<{ label: string; items: string }>;
    scopeFooter: string;
    askTitle: string;
    askSubtitle: string;
    askDescription: string;
    processTitle: string;
    processSteps: Array<{ title: string; description: string }>;
    faqTitle: string;
    faqs: Array<{ question: string; answer: string }>;
    ctaTitle: string;
    ctaDescription: string;
}

import { findAllServices, findServiceByValue } from './service-mongo';

export async function getServiceContent(value: string): Promise<ServiceContent | undefined> {
    const fromDb = await findServiceByValue(value);
    return fromDb ? (fromDb as unknown as ServiceContent) : undefined;
}

export async function getAllServiceValues(): Promise<string[]> {
    const fromDb = await findAllServices();
    return fromDb.map((s) => s.value);
}
