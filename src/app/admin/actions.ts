'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyPassword } from '@/lib/admin';
import { createSessionPayload, signPayload, SESSION_MAX_AGE_MS } from '@/lib/admin';

export async function adminLogin(
    _prevState: { ok: boolean; error: string } | null,
    formData: FormData
): Promise<{ ok: boolean; error: string }> {
    const password = String(formData.get('password') ?? '');
    const authorized = await verifyPassword(password);
    if (!authorized) {
        return { ok: false, error: 'Invalid password' };
    }

    const payload = createSessionPayload();
    const sig = signPayload(payload);
    const cookieStore = await cookies();
    cookieStore.set('admin_session', `${payload}.${sig}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
    });

    redirect('/admin');
    return { ok: true, error: '' };
}

export async function adminLogout() {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
    redirect('/admin/login');
    return;
}
