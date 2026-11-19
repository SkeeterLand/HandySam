import fs from 'fs';
import path from 'path';

/**
 * Dynamically list all images in a public folder (e.g. public/images/bathroom).
 * Prefers optimized WebP versions when available, falling back to the original.
 * Returns root-relative paths like /images/bathroom/PXL_20240803_215220060.webp
 * sorted alphabetically so the order is stable across builds.
 */
export function listProjectImages(folder: string): string[] {
    const publicDir = path.join(process.cwd(), 'public');
    const dirPath = path.join(publicDir, folder);

    if (!fs.existsSync(dirPath)) {
        return [];
    }

    // Scan for source images only (not .webp — we always prefer .webp when available).
    const sourceExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.avif']);

    return fs
        .readdirSync(dirPath)
        .filter((file) => {
            const ext = path.extname(file).toLowerCase();
            return sourceExtensions.has(ext);
        })
        .sort()
        .map((file) => {
            // Prefer WebP version when available for faster load times
            const base = file.replace(/\.(jpg|jpeg|png|gif|avif)$/i, '');
            const webpFile = `${base}.webp`;
            const webpPath = path.join(dirPath, webpFile);
            if (fs.existsSync(webpPath)) {
                return `/${folder}/${webpFile}`.replace(/\\/g, '/');
            }
            return `/${folder}/${file}`.replace(/\\/g, '/');
        });
}
