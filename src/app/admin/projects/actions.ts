'use server';

import { projectDelete } from '@/lib/mongodb';
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
