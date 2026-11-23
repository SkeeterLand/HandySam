'use server';

import { serviceDelete, serviceUpsert, findServiceByValue } from '@/lib/mongodb';
import { isAdmin } from '@/lib/admin';
import { revalidatePath } from 'next/cache';
import type { ServiceContent } from '@/lib/mongodb';

export async function saveService(
    _prevState: { ok: boolean; error: string | null } | null,
    formData: FormData
): Promise<{ ok: boolean; error: string | null }> {
    const authorized = await isAdmin();
    if (!authorized) {
        return { ok: false, error: 'Unauthorized' };
    }

    try {
        const raw = Object.fromEntries(formData.entries());
        const value = String(raw.value ?? '');

        const content: ServiceContent = {
            value,
            title: String(raw.title ?? ''),
            tagline: String(raw.tagline ?? ''),
            heroTitle: String(raw.heroTitle ?? ''),
            heroHighlight: String(raw.heroHighlight ?? ''),
            heroDescription: String(raw.heroDescription ?? ''),
            heroFooter: String(raw.heroFooter ?? ''),
            benefitsTitle: String(raw.benefitsTitle ?? ''),
            benefits: parseBenefits(raw),
            scopeTitle: String(raw.scopeTitle ?? ''),
            scopeItems: parseScopeItems(raw),
            scopeFooter: String(raw.scopeFooter ?? ''),
            askTitle: String(raw.askTitle ?? ''),
            askSubtitle: String(raw.askSubtitle ?? ''),
            askDescription: String(raw.askDescription ?? ''),
            processTitle: String(raw.processTitle ?? ''),
            processSteps: parseProcessSteps(raw),
            faqTitle: String(raw.faqTitle ?? ''),
            faqs: parseFaqs(raw),
            ctaTitle: String(raw.ctaTitle ?? ''),
            ctaDescription: String(raw.ctaDescription ?? ''),
        };

        await serviceUpsert(value, content);

        revalidatePath('/');
        revalidatePath(`/services/${value}`);
        revalidatePath('/admin/services');

        return { ok: true, error: null };
    } catch (err) {
        console.error('Failed to save service:', err);
        return { ok: false, error: 'Failed to save service' };
    }
}

export async function removeService(formData: FormData): Promise<void> {
    const authorized = await isAdmin();
    if (!authorized) {
        return;
    }

    const value = formData.get('value') as string;
    await serviceDelete(value);
    revalidatePath('/');
    revalidatePath('/admin/services');
}

function parseBenefits(raw: Record<string, unknown>) {
    // Benefits are submitted as separate fields: benefits-0-icon, benefits-0-title, etc.
    const benefits: Array<{ icon: string; title: string; description: string }> = [];
    let i = 0;
    while (raw[`benefits-${i}-icon`] !== undefined) {
        benefits.push({
            icon: String(raw[`benefits-${i}-icon`] ?? ''),
            title: String(raw[`benefits-${i}-title`] ?? ''),
            description: String(raw[`benefits-${i}-description`] ?? ''),
        });
        i++;
    }
    return benefits;
}

function parseScopeItems(raw: Record<string, unknown>) {
    const scopeItems: Array<{ label: string; items: string }> = [];
    let i = 0;
    while (raw[`scopeItems-${i}-label`] !== undefined) {
        scopeItems.push({
            label: String(raw[`scopeItems-${i}-label`] ?? ''),
            items: String(raw[`scopeItems-${i}-items`] ?? ''),
        });
        i++;
    }
    return scopeItems;
}

function parseProcessSteps(raw: Record<string, unknown>) {
    const processSteps: Array<{ title: string; description: string }> = [];
    let i = 0;
    while (raw[`processSteps-${i}-title`] !== undefined) {
        processSteps.push({
            title: String(raw[`processSteps-${i}-title`] ?? ''),
            description: String(raw[`processSteps-${i}-description`] ?? ''),
        });
        i++;
    }
    return processSteps;
}

function parseFaqs(raw: Record<string, unknown>) {
    const faqs: Array<{ question: string; answer: string }> = [];
    let i = 0;
    while (raw[`faqs-${i}-question`] !== undefined) {
        faqs.push({
            question: String(raw[`faqs-${i}-question`] ?? ''),
            answer: String(raw[`faqs-${i}-answer`] ?? ''),
        });
        i++;
    }
    return faqs;
}

export async function getServiceForEdit(value: string) {
    const authorized = await isAdmin();
    if (!authorized) {
        return null;
    }
    return findServiceByValue(value);
}
