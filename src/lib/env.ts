/**
 * Validate required environment variables at startup.
 *
 * Called from layout.tsx (or middleware) so the app fails fast with a clear
 * message instead of cryptic runtime errors when MONGODB_URI/MONGODB_DB are
 * missing. Values are injected by Cloudflare Pages (encrypted dashboard vars)
 * and read from process.env — never hardcoded, never committed to git.
 */
export function validateEnv() {
    const missing: string[] = [];

    if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
    if (!process.env.MONGODB_DB) missing.push('MONGODB_DB');

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(
                ', '
            )}. Set them in your hosting provider (Cloudflare Pages dashboard → Settings → Environment variables) and redeploy.`
        );
    }
}
