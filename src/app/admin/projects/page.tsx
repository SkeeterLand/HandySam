import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getHomepageProjects } from '@/lib/mongodb';
import { removeProject } from './actions';

export default async function AdminProjectsList() {
    const projects = await getHomepageProjects();

    return (
        <div className="space-y-[32px]">
            <div className="flex items-center justify-between">
                <h1 className="text-[32px] font-black tracking-[-1px] text-fg">
                    Projects
                </h1>
                <Link href="/admin/projects/new">
                    <Button variant="accent" size="sm">Add Project</Button>
                </Link>
            </div>

            {projects.length === 0 && (
                <p className="text-muted">No projects found in MongoDB.</p>
            )}

            <table className="w-full border-collapse border border-[var(--border)] rounded-[12px] overflow-hidden">
                <thead>
                    <tr className="bg-[var(--bg-secondary)]">
                        <th className="text-left px-[16px] py-[14px] text-[13px] font-bold uppercase tracking-[0.5px] text-muted border-b border-[var(--border)]">
                            Subject
                        </th>
                        <th className="text-left px-[16px] py-[14px] text-[13px] font-bold uppercase tracking-[0.5px] text-muted border-b border-[var(--border)]">
                            Slug
                        </th>
                        <th className="text-left px-[16px] py-[14px] text-[13px] font-bold uppercase tracking-[0.5px] text-muted border-b border-[var(--border)]">
                            Location
                        </th>
                        <th className="text-left px-[16px] py-[14px] text-[13px] font-bold uppercase tracking-[0.5px] text-muted border-b border-[var(--border)]">
                            Year
                        </th>
                        <th className="text-left px-[16px] py-[14px] text-[13px] font-bold uppercase tracking-[0.5px] text-muted border-b border-[var(--border)]">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((p) => (
                        <tr key={p.slug} className="border-b border-[var(--border)] last:border-0">
                            <td className="px-[16px] py-[14px] text-fg">
                                {p.subject}
                            </td>
                            <td className="px-[16px] py-[14px] text-muted font-[monospace] text-[13px]">
                                {p.slug}
                            </td>
                            <td className="px-[16px] py-[14px] text-[14px] text-fg">
                                {p.location}
                            </td>
                            <td className="px-[16px] py-[14px] text-[14px] text-fg">
                                {p.year}
                            </td>
                            <td className="px-[16px] py-[14px]">
                                <div className="flex gap-[10px]">
                                    <Link
                                        href={`/admin/projects/${p.slug}`}
                                        className="text-accent hover:text-accent-hover no-underline text-[14px] font-semibold"
                                    >
                                        Edit
                                    </Link>
                                    <form
                                        action={removeProject}
                                        className="inline"
                                    >
                                        <input type="hidden" name="slug" defaultValue={p.slug} />
                                        <button
                                            type="submit"
                                            className="text-red-400 hover:text-red-300 no-underline text-[14px] font-semibold"
                                            onClick={(e) => {
                                                if (
                                                    !window.confirm(
                                                        `Delete "${p.subject}"?`
                                                    )
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
