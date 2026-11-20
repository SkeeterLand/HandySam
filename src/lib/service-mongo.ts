import type { MongoClient } from 'mongodb';
import type { ServiceContent } from './services-data';

/**
 * MongoDB Atlas connection and update syntax for service data.
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
 *   import { servicesData } from '@/lib/services-data';
 *
 *   const collection = await getServicesCollection();
 *   for (const content of Object.values(servicesData)) {
 *     await collection.updateOne(
 *       serviceUpsert(content.value, content).filter,
 *       serviceUpsert(content.value, content).update,
 *       serviceUpsert(content.value, content).options
 *     );
 *   }
 */

let clientPromise: Promise<MongoClient> | null = null;

export function getMongoClient() {
    const { MongoClient } = require('mongodb');
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI environment variable is not set');
    if (!clientPromise) {
        clientPromise = MongoClient.connect(uri);
    }
    return clientPromise!;
}

export async function getServicesCollection() {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || 'HandySam');
    return db.collection('services');
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
