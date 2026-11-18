import fs from 'fs';
import path from 'path';

/**
 * Dynamically list all images in a public folder (e.g. public/images/bathroom).
 * Returns root-relative paths like /images/bathroom/PXL_20240803_215220060.jpg
 * sorted alphabetically so the order is stable across builds.
 */
export function listProjectImages(folder: string): string[] {
    const publicDir = path.join(process.cwd(), 'public');
    const dirPath = path.join(publicDir, folder);

    if (!fs.existsSync(dirPath)) {
        return [];
    }

    const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

    return fs
        .readdirSync(dirPath)
        .filter((file) => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.has(ext);
        })
        .sort()
        .map((file) => `/${folder}/${file}`.replace(/\\/g, '/'));
}
