import { notFound } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import ServiceEditForm from '@/app/admin/services/[value]/form';

export default async function AdminNewServicePage() {
    const authorized = await isAdmin();
    if (!authorized) {
        notFound();
    }

    return <ServiceEditForm service={null} isNew />;
}
