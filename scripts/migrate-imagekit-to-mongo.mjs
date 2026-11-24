import { MongoClient } from 'mongodb';

const URI = process.env.MONGODB_URI;
const DB = process.env.MONGODB_DB || 'HandySam';
const IK_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IK_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT?.replace(/\/$/, '');

const auth = 'Basic ' + Buffer.from(IK_PRIVATE_KEY + ':').toString('base64');

async function ikList(folder) {
    const resp = await fetch(
        `https://api.imagekit.io/v1/files?path=/${folder}&limit=1000`,
        { headers: { Authorization: auth } }
    );
    if (!resp.ok) {
        console.error(`ImageKit list ${folder} failed: ${resp.status}`);
        return [];
    }
    const data = await resp.json();
    return (Array.isArray(data) ? data : (data.list || [])).filter((f) => f.fileType === 'image');
}

async function main() {
    if (!URI || !DB || !IK_PRIVATE_KEY || !IK_ENDPOINT) {
        console.error('Missing required env vars');
        process.exit(1);
    }

    const client = new MongoClient(URI);
    await client.connect();
    const db = client.db(DB);
    const images = db.collection('images');

    // Folders to sync from ImageKit
    const folders = [
        'bathroom',
        'ceiling/coffered',
        'ceiling/tongueNgroove',
        'office',
        'other',
        'porch/screened',
        'stairs',
    ];

    let totalCreated = 0;
    let totalSkipped = 0;

    for (const folder of folders) {
        const remote = await ikList(folder);
        console.log(`\n=== ${folder}: ${remote.length} images in ImageKit ===`);

        for (const f of remote.sort((a, b) => a.name.localeCompare(b.name))) {
            const existing = await images.findOne({ folder, fileName: f.name });
            if (existing) {
                totalSkipped++;
                continue;
            }

            const fileName = f.name;
            const baseName = fileName.replace(/\.[^/.]+$/, '');
            const url = `${IK_ENDPOINT}/${folder}/${fileName}`;

            await images.insertOne({
                folder,
                fileName,
                baseName,
                url,
                uploadedAt: f.createdAt ? new Date(f.createdAt) : new Date(),
                size: f.size || 0,
            });
            totalCreated++;
            console.log(`  created ${folder}/${fileName}`);
        }
    }

    console.log(`\n=== Done: ${totalCreated} created, ${totalSkipped} already existed ===`);
    await client.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
