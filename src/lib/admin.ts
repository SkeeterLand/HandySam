/**
 * Administration authorization helper using password-based session auth.
 *
 * In production, /admin/* is protected by a session cookie set after a
 * successful password login via /api/login. The cookie is signed with
 * SESSION_SECRET so it cannot be forged, and isAdmin() verifies the
 * signature on every request so the admin UI never renders for
 * unauthenticated visitors.
 *
 * In development (no Cloudflare), we bypass the check so you can work
 * locally without logging in.
 */

import { compare } from 'bcryptjs';
import { createHmac } from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function signPayload(payload: string): string {
    return createHmac('sha256', SESSION_SECRET!).update(payload).digest('base64url');
}

function createSessionPayload(): string {
    const exp = Date.now() + SESSION_MAX_AGE_MS;
    return Buffer.from(JSON.stringify({ exp })).toString('base64url');
}

function verifySessionCookie(cookieValue: string | undefined): boolean {
    if (!cookieValue || !SESSION_SECRET) return false;

    const dotIndex = cookieValue.lastIndexOf('.');
    if (dotIndex === -1) return false;

    const payload = cookieValue.slice(0, dotIndex);
    const sig = cookieValue.slice(dotIndex + 1);
    const expectedSig = signPayload(payload);
    if (sig !== expectedSig) return false;

    try {
        const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
        return !!data.exp && data.exp > Date.now();
    } catch {
        return false;
    }
}

export async function isAdmin(): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return verifySessionCookie(session?.value);
}

export async function verifyPassword(password: string): Promise<boolean> {
    if (!ADMIN_PASSWORD_HASH) return false;
    return compare(password, ADMIN_PASSWORD_HASH);
}

export function adminRequire(authorized: boolean) {
    if (!authorized) {
        throw new Error('Unauthorized: admin access required');
    }
}

export { SESSION_MAX_AGE_MS, createSessionPayload, signPayload };
