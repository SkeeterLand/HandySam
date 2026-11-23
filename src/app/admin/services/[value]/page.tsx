import { notFound } from 'next/navigation';
import { findServiceByValue } from '@/lib/mongodb';
import { isAdmin } from '@/lib/admin';
import ServiceEditForm from '@/app/admin/services/[value]/form';
import type { ServiceContent } from '@/lib/mongodb';

export default async function ServiceEditPage({
    params,
}: {
    params: Promise<{ value: string }>;
}) {
    const { value } = await params;

    const authorized = await isAdmin();
    if (!authorized) {
        notFound();
    }

    const fromDb = await findServiceByValue(value);
    if (!fromDb) {
        notFound();
    }

    const { _id, ...service } = fromDb as unknown as ServiceContent & { _id: string };

    return <ServiceEditForm service={service} isNew={false} />;
}
