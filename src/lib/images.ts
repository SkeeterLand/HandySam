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

    const allExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

    // Collect all image files, grouped by base name. Prefer .webp when both exist
    // (e.g. office-01.jpg + office-01.webp → only return the .webp).
    const byBase = new Map<string, string>();
    const files = fs.readdirSync(dirPath).filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return allExtensions.has(ext);
    });

    // Sort so .webp comes before .jpg for the same base name (webp wins ties)
    files.sort((a, b) => {
        const aBase = a.replace(/\.[^/.]+$/, '');
        const bBase = b.replace(/\.[^/.]+$/, '');
        if (aBase !== bBase) return aBase.localeCompare(bBase);
        const aIsWebp = a.endsWith('.webp') ? 0 : 1;
        const bIsWebp = b.endsWith('.webp') ? 0 : 1;
        return aIsWebp - bIsWebp;
    });

    for (const file of files) {
        const base = file.replace(/\.[^/.]+$/, '');
        if (!byBase.has(base)) {
            byBase.set(base, file);
        }
    }

    return [...byBase.values()].map((file) =>
        `/${folder}/${file}`.replace(/\\/g, '/')
    );
}
