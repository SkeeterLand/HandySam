import type { MongoClient } from 'mongodb';
import { unstable_cache } from 'next/cache';

/**
 * MongoDB Atlas data layer for HandySam.
 *
 * Environment variables (set in Cloudflare Pages dashboard → Settings →
 * Environment variables → Production, encrypted):
 *   MONGODB_URI   — Atlas connection string (e.g. mongodb+srv://...)
 *   MONGODB_DB    — database name (e.g. HandySam)
 *
 * These are read from process.env at runtime and never committed to git
 * (.env* is gitignored locally; Cloudflare injects them at deploy time).
 *
 * Install the driver: npm install mongodb
 *
 * Example usage (server-side only — do not import from client components):
 *
 *   import { getServicesCollection, serviceUpsert } from '@/lib/service-mongo';
 *
 *   const services: ServiceContent[] = []; // your service data here
 *   const collection = await getServicesCollection();
 *   for (const content of services) {
 *     await collection.updateOne(
 *       serviceUpsert(content.value, content).filter,
 *       serviceUpsert(content.value, content).update,
 *       serviceUpsert(content.value, content).options
 *     );
 *   }
 */

export interface ServiceContent {
    value: string;
    title: string;
    tagline: string;
    heroTitle: string;
    heroHighlight: string;
    heroDescription: string;
    heroFooter: string;
    benefitsTitle: string;
    benefits: Array<{
        icon: string;
        title: string;
        description: string;
    }>;
    scopeTitle: string;
    scopeItems: Array<{ label: string; items: string }>;
    scopeFooter: string;
    askTitle: string;
    askSubtitle: string;
    askDescription: string;
    processTitle: string;
    processSteps: Array<{ title: string; description: string }>;
    faqTitle: string;
    faqs: Array<{ question: string; answer: string }>;
    ctaTitle: string;
    ctaDescription: string;
}

let clientPromise: Promise<MongoClient> | null = null;

export function getMongoClient() {
    const { MongoClient } = require('mongodb');
    const uri = process.env.MONGODB_URI;
    if (!uri) return null; // missing during build; runtime has the encrypted var
    if (!clientPromise) {
        clientPromise = MongoClient.connect(uri);
    }
    return clientPromise!;
}

export async function getCollection(name: string) {
    const client = await getMongoClient();
    if (!client) return null;
    return client.db(process.env.MONGODB_DB || 'HandySam').collection(name);
}

export async function getServicesCollection() {
    return getCollection('services');
}

/**
 * Find all services in the collection.
 * Wrapped with Next.js unstable_cache so only one DB call is made per
 * revalidate period. Returns an array of ServiceDoc (or empty array if none).
 */
export const findAllServices = unstable_cache(
    async () => {
        const collection = await getServicesCollection();
        if (!collection) return [];
        return collection.find({}).sort({ value: 1 }).toArray();
    },
    ['all-services'],
    { revalidate: 60 } // seconds before re-fetching from MongoDB
);

/**
 * Find a single service by its value field (e.g. 'carpentry', 'plumbing').
 * Returns the ServiceDoc or null if not found (or DB unavailable).
 */
export async function findServiceByValue(value: string) {
    const collection = await getServicesCollection();
    if (!collection) return null;
    return collection.findOne({ value });
}

/**
 * Get service content by value. Used by dynamic service pages.
 * Returns undefined if not found (or DB unavailable).
 */
export async function getServiceContent(value: string): Promise<ServiceContent | undefined> {
    const fromDb = await findServiceByValue(value);
    return fromDb ? (fromDb as unknown as ServiceContent) : undefined;
}

/**
 * Get all service values. Used by generateStaticParams for service pages.
 * Returns an empty array if MongoDB is unavailable (e.g. during build).
 */
export async function getAllServiceValues(): Promise<string[]> {
    const fromDb = await findAllServices();
    return fromDb.map((s) => s.value);
}

/**
 * Find services whose value field is in the given list.
 * Useful for loading several service pages at once.
 */
export async function findServicesByValues(values: string[]) {
    const collection = await getServicesCollection();
    if (!collection) return [];
    return collection.find({ value: { $in: values } }).sort({ value: 1 }).toArray();
}

/* ---------------- homepage helpers (map MongoDB docs to UI shapes) ---------------- */

export interface HomepageService {
    title: string;
    description: string;
    icon: string;
    learnMoreLink: string;
    value: string;
    features: string[];
}

/**
 * Fetch all services from MongoDB and map them to the shape used by the
 * homepage Services carousel. Returns an empty array if MongoDB is
 * unavailable (e.g. during build).
 * Strips MongoDB _id so plain objects are passed to Client Components.
 */
export async function getHomepageServices(): Promise<HomepageService[]> {
    const docs = await findAllServices();
    return docs.map((doc) => {
        const { _id, ...rest } = doc;
        return {
            ...rest,
            title: rest.title,
            description: rest.description,
            icon: rest.benefits[0]?.icon || '🔧',
            learnMoreLink: `/services/${rest.value}`,
            value: rest.value,
            features: rest.benefits.map((b: { title: string }) => b.title),
        };
    });
}

/**
 * Fetch all service titles from MongoDB, sorted alphabetically.
 * Used by the Contact form dropdown. Returns an empty array if MongoDB
 * is unavailable.
 */
export async function getAvailableServiceTitles(): Promise<string[]> {
    const docs = await findAllServices();
    return docs.map((doc) => doc.title).sort((a: string, b: string) => a.localeCompare(b));
}

/* ---------------- project helpers (MongoDB 'project' collection) ---------------- */

export interface HomepageProject {
    slug: string;
    src: string;
    alt: string;
    subject: string;
    description: string;
    services: string[];
    location: string;
    year: string;
    imageFolder: string;
}

/**
 * Fetch all projects from the MongoDB 'project' collection.
 * Returns an empty array if MongoDB is unavailable (e.g. during build).
 * Strips MongoDB _id so plain objects are passed to Client Components.
 */
export async function getHomepageProjects(): Promise<HomepageProject[]> {
    const collection = await getCollection('project');
    if (!collection) return [];
    const docs = await collection.find({}).sort({ subject: 1 }).toArray();
    return docs.map((doc) => {
        const { _id, ...rest } = doc;
        return rest as unknown as HomepageProject;
    });
}

/**
 * Fetch a single project by slug from the MongoDB 'project' collection.
 * Returns null if not found (or DB unavailable).
 * Strips MongoDB _id so plain objects are passed to Client Components.
 */
export async function getProjectBySlug(slug: string): Promise<HomepageProject | null> {
    const collection = await getCollection('project');
    if (!collection) return null;
    const doc = await collection.findOne({ slug });
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return rest as unknown as HomepageProject;
}

export interface ServiceDoc extends ServiceContent {
    _id?: string;
    updatedAt?: Date;
    createdAt?: Date;
}

/**
 * Build a $set update document from a ServiceContent object.
 * Use this with updateOne({ value: content.value }, { $set: ... }, { upsert: true }).
 */
export function serviceSetUpdate(content: ServiceContent) {
    const now = new Date();
    return {
        $set: {
            value: content.value,
            title: content.title,
            tagline: content.tagline,
            heroTitle: content.heroTitle,
            heroHighlight: content.heroHighlight,
            heroDescription: content.heroDescription,
            heroFooter: content.heroFooter,
            benefitsTitle: content.benefitsTitle,
            benefits: content.benefits,
            scopeTitle: content.scopeTitle,
            scopeItems: content.scopeItems,
            scopeFooter: content.scopeFooter,
            askTitle: content.askTitle,
            askSubtitle: content.askSubtitle,
            askDescription: content.askDescription,
            processTitle: content.processTitle,
            processSteps: content.processSteps,
            faqTitle: content.faqTitle,
            faqs: content.faqs,
            ctaTitle: content.ctaTitle,
            ctaDescription: content.ctaDescription,
            updatedAt: now,
            createdAt: now,
        },
    };
}

/**
 * Build a full-replacement document for replaceOne.
 * Replaces the entire document matching the filter.
 */
export function serviceReplaceDoc(content: ServiceContent): ServiceDoc {
    const now = new Date();
    return {
        ...content,
        updatedAt: now,
        createdAt: now,
    };
}

/**
 * Filter to match a service by its value field.
 */
export function serviceFilter(value: string) {
    return { value };
}

/**
 * Complete upsert-ready update: filter + $set, for updateOne.
 */
export function serviceUpsert(value: string, content: ServiceContent) {
    return {
        filter: serviceFilter(value),
        update: serviceSetUpdate(content),
        options: { upsert: true },
    };
}
