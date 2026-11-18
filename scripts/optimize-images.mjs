import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const MAX_WIDTH = 1600;
const QUALITY = 82;

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function isImage(file) {
    return imageExtensions.has(path.extname(file).toLowerCase());
}

async function optimizeFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const base = filePath.replace(ext, '');
    const webpPath = `${base}.webp`;

    // Skip if webp already exists and is newer than source
    if (fs.existsSync(webpPath)) {
        const srcMtime = fs.statSync(filePath).mtimeMs;
        const webpMtime = fs.statSync(webpPath).mtimeMs;
        if (webpMtime >= srcMtime) {
            return { skipped: true, path: webpPath };
        }
    }

    const metadata = await sharp(filePath).metadata();
    if (!metadata.width) return { skipped: true, reason: 'no width' };

    // Don't upscale small images
    let resizeWidth = metadata.width;
    if (resizeWidth > MAX_WIDTH) {
        resizeWidth = MAX_WIDTH;
    }

    await sharp(filePath)
        .resize({ width: resizeWidth, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(webpPath);

    return { optimized: true, path: webpPath, width: resizeWidth };
}

async function main() {
    const folders = fs.readdirSync(IMAGES_DIR).filter(f => {
        const full = path.join(IMAGES_DIR, f);
        return fs.statSync(full).isDirectory() && !f.startsWith('.');
    });

    let totalOptimized = 0;
    let totalSkipped = 0;
    let totalBytesSaved = 0;

    for (const folder of folders) {
        const folderPath = path.join(IMAGES_DIR, folder);
        const files = fs.readdirSync(folderPath).filter(isImage);

        // Recursively handle subdirectories
        const allEntries = fs.readdirSync(folderPath, { withFileTypes: true });
        const subDirs = allEntries.filter(e => e.isDirectory() && !e.name.startsWith('.'));
        for (const sub of subDirs) {
            const subPath = path.join(folderPath, sub.name);
            const subFiles = fs.readdirSync(subPath).filter(isImage);
            console.log(`\n📁 ${folder}/${sub.name}/ (${subFiles.length} images)`);
            for (const file of subFiles) {
                const result = await optimizeFile(path.join(subPath, file));
                if (result.skipped) { totalSkipped++; continue; }
                const origSize = fs.statSync(path.join(subPath, file)).size;
                const newSize = fs.statSync(result.path).size;
                totalBytesSaved += origSize - newSize;
                totalOptimized++;
                console.log(`  ✅ ${file} → ${path.basename(result.path)} (${(origSize/1e6).toFixed(1)}MB → ${(newSize/1e6).toFixed(1)}MB)`);
            }
        }

        console.log(`\n📁 ${folder}/ (${files.length} images)`);
        for (const file of files) {
            const result = await optimizeFile(path.join(folderPath, file));
            if (result.skipped) { totalSkipped++; continue; }
            const origSize = fs.statSync(path.join(folderPath, file)).size;
            const newSize = fs.statSync(result.path).size;
            totalBytesSaved += origSize - newSize;
            totalOptimized++;
            console.log(`  ✅ ${file} → ${path.basename(result.path)} (${(origSize/1e6).toFixed(1)}MB → ${(newSize/1e6).toFixed(1)}MB)`);
        }
    }

    console.log(`\n========================================`);
    console.log(`Optimized: ${totalOptimized} images`);
    console.log(`Skipped:   ${totalSkipped} images`);
    console.log(`Space saved: ${(totalBytesSaved / 1e6).toFixed(2)} MB`);
    console.log(`========================================`);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
