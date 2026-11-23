'use server';

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { isAdmin } from '@/lib/admin';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = new Set(['image/webp', 'image/jpeg']);

function sanitizeFilename(name: string): string {
    // Keep only safe characters; lowercase; replace spaces with dashes
    return name
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '');
}

export async function uploadImage(formData: FormData): Promise<void> {
    const authorized = await isAdmin();
    if (!authorized) {
        return;
    }

    try {
        const file = formData.get('file') as File;
        const folder = String(formData.get('folder') ?? '').trim();

        if (!file) {
            return;
        }
        if (!folder) {
            return;
        }

        // Validate file type
        if (!ALLOWED_TYPES.has(file.type)) {
            return;
        }

        // Validate size
        const arrayBuffer = await file.arrayBuffer();
        if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
            return;
        }

        // Sanitize folder path (prevent directory traversal)
        const safeFolder = folder.split('/').map((part) => sanitizeFilename(part)).join('/');
        if (safeFolder.includes('..') || safeFolder.startsWith('/') || safeFolder.startsWith('\\')) {
            return;
        }

        // Sanitize filename
        const originalName = file.name.replace(/\.[^/.]+$/, ''); // strip extension
        const baseName = sanitizeFilename(originalName) || 'image';
        const ext = file.type === 'image/webp' ? '.webp' : '.jpg';
        const fileName = `${baseName}${ext}`;

        // Determine target directory
        const publicDir = path.join(process.cwd(), 'public');
        const targetDir = path.join(publicDir, 'images', safeFolder);
        fs.mkdirSync(targetDir, { recursive: true });

        // Write file
        const targetPath = path.join(targetDir, fileName);
        fs.writeFileSync(targetPath, Buffer.from(arrayBuffer));

        // Regenerate the image manifest so new images are picked up
        const manifestScript = path.join(process.cwd(), 'scripts', 'generate-image-manifest.mjs');
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
            return ['.jpg', '.jpeg', '.webp', '.png', '.gif', '.avif'].includes(ext);
        })
        .sort();
}
