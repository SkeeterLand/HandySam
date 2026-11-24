import { MongoClient } from 'mongodb';

const URI = process.env.MONGODB_URI;
const DB = process.env.MONGODB_DB || 'HandySam';
const IK_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT?.replace(/\/$/, '');
const DRY_RUN = process.env.DRY_RUN !== 'false'; // default: dry run

if (!URI || !DB || !IK_ENDPOINT) {
    console.error('Missing required env vars: MONGODB_URI, MONGODB_DB, IMAGEKIT_URL_ENDPOINT');
    process.exit(1);
}

/**
 * Recursively replace /images/... paths with ImageKit URLs.
 * Returns [newDoc, changes] where changes is a list of { field, old, new }.
 */
function replaceImagePaths(obj, prefix = '', changes = []) {
    if (typeof obj === 'string') {
        if (obj.startsWith('/images/')) {
            const newPath = obj.replace(/^\/images\//, IK_ENDPOINT + '/');
            if (newPath !== obj) {
                changes.push({ field: prefix || '(root)', old: obj, new: newPath });
            }
            return newPath;
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item, i) => replaceImagePaths(item, `${prefix}[${i}]`, changes));
    }

    if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, val] of Object.entries(obj)) {
            result[key] = replaceImagePaths(val, prefix ? `${prefix}.${key}` : key, changes);
        }
        return result;
    }

    return obj;
}

async function main() {
    const client = new MongoClient(URI);
    await client.connect();
    const db = client.db(DB);

    console.log(`=== ${DRY_RUN ? 'DRY RUN' : 'LIVE RUN'} ===`);
    console.log(`ImageKit endpoint: ${IK_ENDPOINT}\n`);

    // --- Services ---
    const services = await db.collection('services').find({}).toArray();
    let serviceChanges = 0;
    for (const svc of services) {
        const changes = [];
        const newDoc = replaceImagePaths(svc, '', changes);
        if (changes.length > 0) {
            serviceChanges++;
            console.log(`Service: ${svc.value || svc._id}`);
            for (const c of changes) {
                console.log(`  ${c.field}:`);
                console.log(`    OLD: ${c.old}`);
                console.log(`    NEW: ${c.new}`);
            }
            if (!DRY_RUN) {
                const { _id, ...updateDoc } = newDoc;
                await db.collection('services').replaceOne({ _id }, updateDoc);
            }
        }
    }

    // --- Projects ---
    const projects = await db.collection('project').find({}).toArray();
    let projectChanges = 0;
    for (const proj of projects) {
        const changes = [];
        const newDoc = replaceImagePaths(proj, '', changes);
        if (changes.length > 0) {
            projectChanges++;
            console.log(`Project: ${proj.slug || proj._id}`);
            for (const c of changes) {
                console.log(`  ${c.field}:`);
                console.log(`    OLD: ${c.old}`);
                console.log(`    NEW: ${c.new}`);
            }
            if (!DRY_RUN) {
                const { _id, ...updateDoc } = newDoc;
                await db.collection('project').replaceOne({ _id }, updateDoc);
            }
        }
    }

    console.log(`\n=== Done ===`);
    console.log(`Services with image path changes: ${serviceChanges}`);
    console.log(`Projects with image path changes: ${projectChanges}`);
    if (DRY_RUN) {
        console.log('\nThis was a DRY RUN — nothing was changed. Set DRY_RUN=false to apply.');
    }

    await client.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
