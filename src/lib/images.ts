import imageManifest from './image-manifest.json';

/**
 * List all images for a project folder using the pre-built manifest.
 * The manifest is generated at build time (scripts/generate-image-manifest.mjs)
 * so it works on Cloudflare Pages where the filesystem isn't accessible at
 * request time. Returns WebP paths when available.
 *
 * Returns root-relative paths like /images/bathroom/bathroom-01.webp
 * sorted alphabetically so the order is stable across builds.
 */
export function listProjectImages(folder: string): string[] {
    return (imageManifest as Record<string, string[]>)[folder] || [];
}
