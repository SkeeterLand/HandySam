import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const MANIFEST_PATH = path.join(process.cwd(), 'src', 'lib', 'image-manifest.json');

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function isImage(file) {
    return imageExtensions.has(path.extname(file).toLowerCase());
}

function main() {
    const manifest = {};

    if (!fs.existsSync(IMAGES_DIR)) {
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
        console.log('Wrote ' + MANIFEST_PATH + ' with 0 folders (no public/images dir)');
        return;
    }

    const folders = fs.readdirSync(IMAGES_DIR).filter((f) => {
        const full = path.join(IMAGES_DIR, f);
        return fs.statSync(full).isDirectory() && !f.startsWith('.');
    });

    for (const folder of folders) {
        const folderPath = path.join(IMAGES_DIR, folder);
        const entries = fs.readdirSync(folderPath, { withFileTypes: true });

        // Handle subdirectories (e.g. ceiling/coffered, porch/screened)
        const subDirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.'));
        for (const sub of subDirs) {
            const subPath = path.join(folderPath, sub.name);
            const key = folder + '/' + sub.name;
            const files = fs.readdirSync(subPath).filter(isImage);
            manifest[key] = dedupeAndPreferWebp(files, subPath);
        }

        // Handle files directly in folder
        const topFiles = entries
            .filter((e) => e.isFile() && isImage(e.name))
            .map((e) => e.name);
        if (topFiles.length > 0) {
            manifest[folder] = dedupeAndPreferWebp(topFiles, folderPath);
        }
    }

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
    console.log('Wrote ' + MANIFEST_PATH + ' with ' + Object.keys(manifest).length + ' folders');
    for (const [key, images] of Object.entries(manifest)) {
        console.log('  ' + key + ': ' + images.length + ' images');
    }
}

/**
 * Given a list of filenames in a directory, return one entry per image,
 * preferring .webp when both .jpg and .webp exist for the same base name.
 */
function dedupeAndPreferWebp(files, dirPath) {
    const byBase = new Map();

    // Sort so .webp comes before .jpg for the same base name (webp wins ties)
    const sorted = [...files].sort((a, b) => {
        const aBase = a.replace(/\.[^/.]+$/, '');
        const bBase = b.replace(/\.[^/.]+$/, '');
        if (aBase !== bBase) return aBase.localeCompare(bBase);
        const aIsWebp = a.endsWith('.webp') ? 0 : 1;
        const bIsWebp = b.endsWith('.webp') ? 0 : 1;
        return aIsWebp - bIsWebp;
    });

    for (const file of sorted) {
        const base = file.replace(/\.[^/.]+$/, '');
        if (!byBase.has(base)) {
            byBase.set(base, file);
        }
    }

    return [...byBase.values()].map((file) => {
        // Prefer .webp when available
        const base = file.replace(/\.[^/.]+$/, '');
        const webpFile = base + '.webp';
        const webpPath = path.join(dirPath, webpFile);
        if (fs.existsSync(webpPath)) {
            return webpFile;
        }
        return file;
    });
}

main();
