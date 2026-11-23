import { notFound } from 'next/navigation';
import { isAdmin } from '@/lib/admin';

export default async function AdminNewProjectPage() {
    const authorized = await isAdmin();
    if (!authorized) {
        notFound();
    }

    return (
        <div className="space-y-[32px]">
            <h1 className="text-[32px] font-black tracking-[-1px] text-fg">
                Add Project
            </h1>
            <p className="text-muted">
                Project edit form not yet implemented. Use MongoDB directly to
                add a project document to the <code className="font-mono text-sm">
                    project
                </code>
                collection.
            </p>
        </div>
    );
}
