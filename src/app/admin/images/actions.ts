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

/**
 * Given a folder like 'bathroom', find the highest existing N in
 * bathroom-N.webp and return N+1. If none exist, returns 1.
 */
function nextIncrementedNumber(folder: string, files: Array<{ name: string }>): number {
    const baseName = folder.split('/').pop()!;
    const regex = new RegExp(`^${baseName}-(\\d+)\\.webp$`);
    let max = 0;
    for (const file of files) {
        const match = file.name.match(regex);
        if (match) {
            const n = parseInt(match[1], 10);
            if (n > max) max = n;
        }
    }
    return max + 1;
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

        // Determine next incremented filename: bathroom-14.webp
        // For subfolders like ceiling/coffered, use coffered-14.webp
        const baseName = safeFolder.split('/').pop()!;

        // List existing files in this ImageKit folder to find next increment number
        const listResp = await fetch(
            `https://upload.imagekit.io/api/v1/files?folderName=/${safeFolder}`,
            { headers: { Authorization: ikAuthHeader() } }
        );
        let existingFiles: Array<{ name: string }> = [];
        if (listResp.ok) {
            const listData = await listResp.json();
            existingFiles = (listData?.result ?? []).map(
                (f: { filePath?: string; name?: string }) => ({
                    name: f.name ?? f.filePath?.split('/').pop() ?? '',
                })
            );
        }

        const nextNum = nextIncrementedNumber(baseName, existingFiles);
        const fileName = `${baseName}-${nextNum}.webp`;

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
            return { ok: false, error: 'ImageKit upload failed' };
        }

        const uploadData = await uploadResp.json();
        const imageUrl = IK_URL_ENDPOINT.replace(/\/$/, '') + '/' + safeFolder + '/' + fileName;

        // Store image metadata in MongoDB
        const collection = await getImagesCollection();
        if (collection) {
            await collection.insertOne({
                folder: safeFolder,
                fileName,
                baseName,
                url: imageUrl,
                uploadedAt: new Date(),
                size: webpBuffer.byteLength,
            });
        }

        return { ok: true, error: null };
    } catch (err) {
        console.error('Failed to upload image:', err);
        return { ok: false, error: 'Failed to upload image' };
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

export async function listImagesInFolder(folder: string): Promise<string[]> {
    const collection = await getImagesCollection();
    if (!collection) return [];

    const docs = await collection
        .find({ folder })
        .sort({ uploadedAt: -1 })
        .toArray();

    return docs.map((d) => d.fileName);
}
