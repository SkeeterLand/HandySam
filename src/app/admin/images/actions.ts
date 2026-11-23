'use server';

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';
import { isAdmin } from '@/lib/admin';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_WIDTH = 1600;
const QUALITY = 82;

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
function nextIncrementedNumber(folder: string, dirPath: string): number {
    if (!fs.existsSync(dirPath)) {
        return 1;
    }

    const files = fs.readdirSync(dirPath);
    const regex = new RegExp(`^${folder}-(\\d+)\\.webp$`);
    let max = 0;

    for (const file of files) {
        const match = file.match(regex);
        if (match) {
            const n = parseInt(match[1], 10);
            if (n > max) max = n;
        }
    }

    return max + 1;
}

export async function uploadImage(formData: FormData): Promise<void> {
    const authorized = await isAdmin();
    if (!authorized) {
        return;
    }

    try {
        const file = formData.get('file') as File;
        const folder = String(formData.get('folder') ?? '').trim();

        if (!file || !folder) {
            return;
        }

        // Validate file type
        if (!['image/webp', 'image/jpeg'].includes(file.type)) {
            return;
        }

        // Validate size
        const arrayBuffer = await file.arrayBuffer();
        if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
            return;
        }

        // Sanitize folder path
        const safeFolder = sanitizeFolder(folder);
        if (
            safeFolder.includes('..') ||
            safeFolder.startsWith('/') ||
            safeFolder.startsWith('\\')
        ) {
            return;
        }

        // Convert to WebP with sharp (resize + quality match existing optimization)
        const webpBuffer = await sharp(arrayBuffer)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: QUALITY, effort: 4 })
            .toBuffer();

        // Determine next incremented filename: bathroom-14.webp
        // For subfolders like ceiling/coffered, use coffered-14.webp
        const baseName = safeFolder.split('/').pop()!;
        const publicDir = path.join(process.cwd(), 'public');
        const targetDir = path.join(publicDir, 'images', safeFolder);
        fs.mkdirSync(targetDir, { recursive: true });

        const nextNum = nextIncrementedNumber(baseName, targetDir);
        const fileName = `${baseName}-${nextNum}.webp`;
        const targetPath = path.join(targetDir, fileName);

        fs.writeFileSync(targetPath, webpBuffer);

        // Regenerate the image manifest so new images are picked up
        const manifestScript = path.join(
            process.cwd(),
            'scripts',
            'generate-image-manifest.mjs'
        );
        execSync(`node "${manifestScript}"`, { stdio: 'inherit' });
    } catch (err) {
        console.error('Failed to upload image:', err);
    }
}

export async function listImageFolders(): Promise<string[]> {
    const publicDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(publicDir)) {
        return [];
    }
    return fs
        .readdirSync(publicDir)
        .filter((f) => !f.startsWith('.'))
        .filter((f) => fs.statSync(path.join(publicDir, f)).isDirectory());
}

export async function listImagesInFolder(folder: string): Promise<string[]> {
    const targetDir = path.join(process.cwd(), 'public', 'images', folder);
    if (!fs.existsSync(targetDir)) {
        return [];
    }
    return fs
        .readdirSync(targetDir)
        .filter((f) => {
            const ext = path.extname(f).toLowerCase();
            return ['.jpg', '.jpeg', '.webp', '.png', '.gif', '.avif'].includes(
                ext
            );
        })
        .sort();
}
