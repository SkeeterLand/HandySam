import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/mongodb';
import { isAdmin } from '@/lib/admin';
import ProjectEditForm from '@/app/admin/projects/[slug]/form';
import type { HomepageProject } from '@/lib/mongodb';

export default async function ProjectEditPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const authorized = await isAdmin();
    if (!authorized) {
        notFound();
    }

    const fromDb = await getProjectBySlug(slug);
    if (!fromDb) {
        notFound();
    }

    // Strip MongoDB _id
    const { _id, ...project } = fromDb as unknown as HomepageProject & {
        _id: string;
    };

    return <ProjectEditForm project={project} />;
}
