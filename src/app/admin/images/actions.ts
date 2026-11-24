'use server';

import sharp from 'sharp';
import { isAdmin } from '@/lib/admin';
import { getImagesCollection } from '@/lib/mongodb';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_WIDTH = 1600;
const QUALITY = 82;

const IK_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IK_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IK_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

function ikAuthHeader(): string {
    if (!IK_PRIVATE_KEY) throw new Error('IMAGEKIT_PRIVATE_KEY not set');
    return 'Basic ' + Buffer.from(IK_PRIVATE_KEY + ':').toString('base64');
}

function sanitizeFolder(name: string): string {
    return name
        .split('/')
        .map((part) =>
            part
                .toLowerCase()
                .replace(/[^a-z0-9._-]/g, '-')
                .replace(/-{2,}/g, '-')
                .replace(/^-|-$/g, '')
        )
        .join('/');
}

export async function uploadImage(
    _prevState: { ok: boolean; error: string | null } | null,
    formData: FormData
): Promise<{ ok: boolean; error: string | null }> {
    const authorized = await isAdmin();
    if (!authorized) {
        return { ok: false, error: 'Unauthorized' };
    }

    if (!IK_PUBLIC_KEY || !IK_PRIVATE_KEY || !IK_URL_ENDPOINT) {
        return { ok: false, error: 'ImageKit not configured on server' };
    }

    try {
        const file = formData.get('file') as File;
        const folder = String(formData.get('folder') ?? '').trim();

        if (!file) {
            return { ok: false, error: 'No file selected' };
        }
        if (!folder) {
            return { ok: false, error: 'No folder selected' };
        }

        // Validate file type
        if (!['image/webp', 'image/jpeg'].includes(file.type)) {
            return { ok: false, error: 'Only WebP or JPEG images are allowed' };
        }

        // Validate size
        const arrayBuffer = await file.arrayBuffer();
        if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
            return { ok: false, error: 'Image must be under 5 MB' };
        }

        // Sanitize folder path
        const safeFolder = sanitizeFolder(folder);
        if (
            safeFolder.includes('..') ||
            safeFolder.startsWith('/') ||
            safeFolder.startsWith('\\')
        ) {
            return { ok: false, error: 'Invalid folder name' };
        }

        // Convert to WebP with sharp (resize + quality match existing optimization)
        const webpBuffer = await sharp(arrayBuffer)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: QUALITY, effort: 4 })
            .toBuffer();

        const originalName = (file.name ?? '').toLowerCase().replace(/\s+/g, '-');
        const originalBase = originalName.replace(/\.[^/.]+$/, ''); // strip extension
        let fileName = originalName.endsWith('.webp')
            ? originalName
            : `${originalBase}.webp`;

        const collection = await getImagesCollection();
        let existingFiles: Array<{ fileName: string }> = [];
        if (collection) {
            const docs = await collection
                .find({ folder: safeFolder }, { projection: { fileName: 1 } })
                .toArray();
            existingFiles = docs.map((d) => ({ fileName: d.fileName }));
        }

        const existingNames = new Set(existingFiles.map((d) => d.fileName));
        if (existingNames.has(fileName)) {
            const regex = new RegExp(`^${originalBase}-(\\d+)\\.webp$`);
            let max = 0;
            for (const existing of existingFiles) {
                const match = existing.fileName.match(regex);
                if (match) {
                    const n = parseInt(match[1], 10);
                    if (n > max) max = n;
                }
            }
            fileName = `${originalBase}-${max + 1}.webp`;
        }

        // Upload to ImageKit
        const form = new FormData();
        const webpFile = new File([webpBuffer], fileName, {
            type: 'image/webp',
        });
        form.append('file', webpFile);
        form.append('fileName', fileName);
        form.append('folder', `/${safeFolder}`);
        form.append('useUniqueFileName', 'false');

        const uploadResp = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
            method: 'POST',
            headers: { Authorization: ikAuthHeader() },
            body: form,
        });

        if (!uploadResp.ok) {
            const errText = await uploadResp.text();
            console.error('ImageKit upload failed:', errText);
            return { ok: false, error: `ImageKit upload failed: ${uploadResp.status}` };
        }

        await uploadResp.json();
        const imageUrl = IK_URL_ENDPOINT.replace(/\/$/, '') + '/' + safeFolder + '/' + fileName;

        // Store image metadata in MongoDB
        if (!collection) {
            return { ok: false, error: 'Database unavailable' };
        }
        await collection.insertOne({
            folder: safeFolder,
            fileName,
            baseName: originalBase,
            url: imageUrl,
            uploadedAt: new Date(),
            size: webpBuffer.byteLength,
        });

        return { ok: true, error: null };
    } catch (err) {
        console.error('Failed to upload image:', err);
        return { ok: false, error: `Upload failed: ${err instanceof Error ? err.message : 'unknown error'}` };
    }
}

export async function listImageFolders(): Promise<string[]> {
    const collection = await getImagesCollection();
    if (!collection) return [];

    const folders = await collection
        .distinct('folder')
        .catch(() => [] as string[]);
    return folders.sort();
}

export type ImageSort = 'name' | 'date-asc' | 'date-desc';

export async function listImagesInFolder(
    folder: string,
    sortBy: ImageSort = 'name',
): Promise<string[]> {
    const collection = await getImagesCollection();
    if (!collection) return [];

    // If a custom sort order has been saved for this folder, respect it.
    const hasCustomSort = await collection
        .findOne({ folder, sortOrder: { $exists: true } });

    let sort: Record<string, 1 | -1> = {};
    if (hasCustomSort) {
        sort = { sortOrder: 1, fileName: 1 };
    } else if (sortBy === 'name') {
        sort = { fileName: 1 };
    } else if (sortBy === 'date-asc') {
        sort = { uploadedAt: 1 };
    } else {
        sort = { uploadedAt: -1 };
    }

    const docs = await collection
        .find({ folder })
        .sort(sort)
        .toArray();

    return docs.map((d) => d.fileName);
}

/**
 * Persist a custom drag-and-drop sort order for all images in a folder.
 * orderedFileNames is the fileNames in the desired display order.
 */
export async function saveSortOrder(
    folder: string,
    orderedFileNames: string[]
): Promise<{ ok: boolean; error: string | null }> {
    const authorized = await isAdmin();
    if (!authorized) {
        return { ok: false, error: 'Unauthorized' };
    }

    const collection = await getImagesCollection();
    if (!collection) {
        return { ok: false, error: 'Database unavailable' };
    }

    const bulkOps = orderedFileNames.map((fileName, index) => ({
        updateOne: {
            filter: { folder, fileName },
            update: { $set: { sortOrder: index } },
        },
    }));

    if (bulkOps.length > 0) {
        await collection.bulkWrite(bulkOps);
    }

    return { ok: true, error: null };
}
