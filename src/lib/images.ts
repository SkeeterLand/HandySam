import imageManifest from './image-manifest.json';
import { getImagesCollection } from '@/lib/mongodb';

const IK_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;
const IK_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

function imageUrl(folder: string, fileName: string): string {
    const base = IK_URL_ENDPOINT?.replace(/\/$/, '') || '';
    return base ? `${base}/${folder}/${fileName}` : `/images/${folder}/${fileName}`;
}

/**
 * List all images for a project folder.
 *
 * Tries (in order):
 *  1. ImageKit List API — lists all files actually in the ImageKit folder
 *  2. MongoDB 'images' collection — images uploaded via the admin panel
 *  3. Build-time manifest — local images not yet migrated
 *
 * Returns full ImageKit URLs like
 * https://ik.imagekit.io/rdojme0pvr/bathroom/bathroom-01.webp
 * or root-relative fallback paths like /images/bathroom/bathroom-01.webp.
 */
export async function listProjectImages(folder: string): Promise<string[]> {
    if (!folder) return [];

    // Normalize: strip 'images/' prefix so 'images/bathroom' and 'bathroom' match
    const normalizedFolder = folder.replace(/^images\//, '');
    const base = IK_URL_ENDPOINT?.replace(/\/$/, '') || '';

    // 1. ImageKit List API — lists all files actually in the ImageKit folder
    if (base && IK_PRIVATE_KEY) {
        try {
            const auth = 'Basic ' + Buffer.from(IK_PRIVATE_KEY + ':').toString('base64');
            const resp = await fetch(
                `https://api.imagekit.io/v1/files?path=/${normalizedFolder}&limit=100`,
                { headers: { Authorization: auth } }
            );
            if (resp.ok) {
                const data = await resp.json();
                const files = (data.list || []).filter((f: any) => f.fileType === 'image');
                if (files.length > 0) {
                    return files.map((f: any) => f.url);
                }
            } else {
                const errText = await resp.text();
                console.error(
                    `ImageKit list failed for folder ${normalizedFolder}: ${resp.status} ${errText}`
                );
            }
        } catch (err) {
            console.error('ImageKit list error:', err);
        }
    }

    // 2. MongoDB 'images' collection — images uploaded via the admin panel
    const collection = await getImagesCollection();
    if (collection) {
        const docs = await collection
            .find({ folder: normalizedFolder })
            .sort({ uploadedAt: -1 })
            .toArray();
        if (docs.length > 0) {
            return docs.map((d) => d.url).filter(Boolean);
        }
    }

    // 3. Build-time manifest fallback (local images not yet migrated)
    const images = (imageManifest as Record<string, string[]>)[normalizedFolder] || [];
    return images.map((file) => imageUrl(normalizedFolder, file));
}
