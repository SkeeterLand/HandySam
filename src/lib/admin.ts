/**
 * Administration authorization helper.
 *
 * In production, Cloudflare Access protects /admin/* at the edge. When a
 * request is authenticated, Cloudflare injects the Cf-Access headers below.
 * We check for them as defense in depth so the admin UI never renders for
 * unauthenticated visitors even if the edge rule is misconfigured.
 *
 * In development (no Cloudflare), we bypass the check so you can work
 * locally without setting up Access.
 */
export async function isAdmin(): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    // Cloudflare Access injects this header on authenticated requests.
    // We read it via the headers() API in Server Components / Server Actions.
    const { headers } = await import('next/headers');
    const headerStore = await headers();
    const email = headerStore.get('cf-access-authenticated-user-email');

    return email !== null && email.length > 0;
}

export function adminRequire(authorized: boolean) {
    if (!authorized) {
        throw new Error('Unauthorized: admin access required');
    }
}
