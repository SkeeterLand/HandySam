'use server';

import {
    getCollection,
    projectDelete,
} from '@/lib/mongodb';
import { isAdmin } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

export async function removeProject(formData: FormData): Promise<void> {
    const authorized = await isAdmin();
    if (!authorized) {
        return;
    }

    const slug = formData.get('slug') as string;
    await projectDelete(slug);
    revalidatePath('/');
    revalidatePath('/admin/projects');
}

export async function saveProject(
    _prevState: { ok: boolean; error: string | null } | null,
    formData: FormData
): Promise<{ ok: boolean; error: string | null }> {
    const authorized = await isAdmin();
    if (!authorized) {
        return { ok: false, error: 'Unauthorized' };
    }

    try {
        const raw = Object.fromEntries(formData.entries());

        const services = String(raw.services ?? '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const doc = {
            slug: String(raw.slug ?? ''),
            src: String(raw.src ?? ''),
            alt: String(raw.alt ?? ''),
            subject: String(raw.subject ?? ''),
            description: String(raw.description ?? ''),
            services,
            location: String(raw.location ?? ''),
            year: String(raw.year ?? ''),
            imageFolder: String(raw.imageFolder ?? ''),
            updatedAt: new Date(),
        };

        const collection = await getCollection('project');
        if (!collection) {
            return { ok: false, error: 'Database unavailable' };
        }

        await collection.updateOne(
            { slug: doc.slug },
            { $set: doc },
            { upsert: true },
        );

        revalidatePath('/');
        revalidatePath(`/projects/${doc.slug}`);
        revalidatePath('/admin/projects');

        return { ok: true, error: null };
    } catch (err) {
        console.error('Failed to save project:', err);
        return { ok: false, error: 'Failed to save project' };
    }
}
